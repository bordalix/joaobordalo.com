import { Template } from 'meteor/templating';
import 'chessboardjs/www/css/chessboard.css';
import Chessboard from 'chessboardjs';
import './chess.html';

const { Chess } = require('chess.js');

// globals
let game = null;
let board = null;
let $board = null;
let $status = null;
let clock = {
  w: null,
  b: null,
  handler: null,
  seconds: null,
};

const utils = {
  updateStatus() {
    let status = '';
    let moveColor = 'White';
    if (game.turn() === 'b') moveColor = 'Black';
    if (game.in_checkmate()) { // checkmate?
      status = `Game over, ${moveColor} is in checkmate.`;
    } else if (game.in_draw()) { // draw?
      status = 'Game over, drawn position';
    } else { // game still on
      status = `${moveColor} to move`;
      if (game.in_check()) status += `, ${moveColor} is in check`;
    }
    $status.html(status);
  },
  // highlight last move
  highlightMove(move = null) {
    // remove all previous highlights
    const squareClass = 'square-55d63';
    $board.find(`.${squareClass}`).removeClass('highlight-white');
    $board.find(`.${squareClass}`).removeClass('highlight-black');
    // highlight squares from and to
    if (move && move.color && move.from && move.to) {
      const highClass = `highlight-${move.color === 'w' ? 'white' : 'black'}`;
      $board.find(`.square-${move.from}`).addClass(highClass);
      $board.find(`.square-${move.to}`).addClass(highClass);
    }
  },
  cleanMissingPieces() {
    document.querySelector('#topPieces').innerHTML = '';
    document.querySelector('#bottomPieces').innerHTML = '';
  },
  addMissingPieces(aux) {
    let divId;
    const divIds = {
      top: '#topPieces',
      bottom: '#bottomPieces'
    };
    utils.cleanMissingPieces();
    Object.keys(aux).forEach((piece) => {
      if (piece.match(/b/)) {
        divId = board.orientation() === 'black' ? divIds.top : divIds.bottom;
      } else {
        divId = board.orientation() === 'white' ? divIds.top : divIds.bottom;
      }
      for (let i = 0; i < aux[piece]; i += 1) {
        const img = document.createElement('img');
        img.src = `img/chesspieces/wikipedia/${piece}`;
        document.querySelector(divId).appendChild(img);
      }
    });
  },
  findMissingPieces(fen) {
    const aux = {};
    const position = fen.split(' ')[0];
    const allPieces = {
      p: { count: 8, img: 'bP.png' },
      r: { count: 2, img: 'bR.png' },
      n: { count: 2, img: 'bN.png' },
      b: { count: 2, img: 'bB.png' },
      q: { count: 1, img: 'bQ.png' },
      k: { count: 1, img: 'bP.png' },
      P: { count: 8, img: 'wP.png' },
      R: { count: 2, img: 'wR.png' },
      N: { count: 2, img: 'wN.png' },
      B: { count: 2, img: 'wB.png' },
      Q: { count: 1, img: 'wQ.png' },
      K: { count: 1, img: 'wK.png' },
    };
    Object.keys(allPieces).forEach((piece) => {
      const regexp = new RegExp(piece, 'g');
      const diff = allPieces[piece].count - (position.match(regexp) || []).length;
      if (diff > 0) aux[allPieces[piece].img] = diff;
    });
    utils.addMissingPieces(aux);
  },
  showClock(color = game.turn()) {
    let id;
    if (color === 'b') {
      id = board.orientation() === 'black' ? '#bottomClock' : '#topClock';
    } else {
      id = board.orientation() === 'white' ? '#bottomClock' : '#topClock';
    }
    const minutes = Math.floor(clock[color] / 60);
    const seconds = (clock[color] % 60).toString().padStart(2, '0');
    $(id).html(`${minutes}:${seconds}`);
  },
  startClock() {
    if (clock.handler) Meteor.clearInterval(clock.handler);
    clock.handler = Meteor.setInterval(function() {
      clock[game.turn()] -= 1;
      if (clock[game.turn()] >= 0) {
        utils.showClock();
      }
    }, 1000);
  }
};

const eventListeners = {
  // check if piece is allowed to move
  onDragStart (source, piece) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false;
    // only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false;
    }
    return true;
  },
  // check if move is legal
  onDrop (from, to) {
    // see if the move is legal
    const move = game.move({ from, to, promotion: 'q' });
    // illegal move
    if (move === null) return 'snapback';
    // add seconds to clock
    clock[move.color] += clock.seconds;
    utils.showClock(move.color);
    // call server with move
    Meteor.call('chessgame.move', {
      color: move.color,
      from,
      to,
      fen: game.fen(),
    });
    return true;
  },
  // update the board position after the piece snap
  // for castling, en passant, pawn promotion
  onSnapEnd () {
    board.position(game.fen());
  },
};

Template.chess.onCreated(function() {
  Meteor.subscribe('chessGame');
});

Template.chess.onRendered(function() {
  $board = $('#myBoard');
  $status = $('#status');
  // check for existing game
  let chessGame = ChessGame.findOne({ id: 1 });
  const position = chessGame && chessGame.fen;
  // initiate Chess.js
  game = new Chess(position);
  // render board
  const config = {
    draggable: true,
    showNotation: false,
    position,
    onDragStart: eventListeners.onDragStart,
    onDrop: eventListeners.onDrop,
    onSnapEnd: eventListeners.onSnapEnd,
  };
  board = Chessboard('myBoard', config);
  // update status
  utils.updateStatus();
  // reactivity
  Tracker.autorun(() => {
    chessGame = ChessGame.findOne({ id: 1 });
    if (chessGame) {
      if (chessGame.fen === 'start') {
        board.start();
        game.reset();
        utils.highlightMove();
        utils.cleanMissingPieces();
      } else {
        board.position(chessGame.fen);
        utils.findMissingPieces(chessGame.fen);
        game = new Chess(chessGame.fen);
        utils.highlightMove(chessGame);
      }
    }
    utils.updateStatus();
  });
});

Template.chess.events({
  'click #resetBoard': () => {
    if (clock.handler) {
      Meteor.clearInterval(clock.handler);
      $('#startClock').html('Start clock');
      clock.handler = null;
    }
    clock = {
      w: 0,
      b: 0,
      handler: null,
      seconds: null,
    };
    utils.showClock('b');
    utils.showClock('w');
    Meteor.call('chessgame.move', {
      color: null,
      from: null,
      to: null,
      fen: 'start',
    });
  },
  'click #flipBoard': () => {
    board.flip();
  },
  'click #startClock': () => {
    if (clock.handler) {
      Meteor.clearInterval(clock.handler);
      $('#startClock').html('Start clock');
      clock.handler = null;
    } else if (clock.b && clock.w) {
      utils.startClock();
      $('#startClock').html('Stop clock');
    } else {
      const minutes = parseInt($('#minutes').val(), 10);
      const seconds = parseInt($('#seconds').val(), 10);
      if (seconds) clock.seconds = seconds;
      if (minutes) {
        clock.b = minutes * 60;
        clock.w = minutes * 60;
        $('#topClock').html(`${minutes}:00`);
        $('#bottomClock').html(`${minutes}:00`);
        utils.startClock();
        $('#startClock').html('Stop clock');
      }
    }
  }
});

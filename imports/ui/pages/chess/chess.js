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

// update status message
function updateStatus () {
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
}

// check if piece is allowed to move
function onDragStart (source, piece) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false;
  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
  return true;
}

// check if move is legal
function onDrop (from, to) {
  // see if the move is legal
  const move = game.move({ from, to, promotion: 'q' });
  // illegal move
  if (move === null) return 'snapback';
  // call server with move
  Meteor.call('chessgame.move', {
    color: move.color,
    from,
    to,
    fen: game.fen(),
  });
  return true;
}

// highlight last move
function highlightMove(move = null) {
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
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen());
}

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
    onDragStart,
    onDrop,
    onSnapEnd
  };
  board = Chessboard('myBoard', config);
  // update status
  updateStatus();
  // reactivity
  Tracker.autorun(() => {
    chessGame = ChessGame.findOne({ id: 1 });
    if (chessGame) {
      if (chessGame.fen === 'start') {
        board.start();
        game.reset();
        highlightMove();
      } else {
        board.position(chessGame.fen);
        game = new Chess(chessGame.fen);
        highlightMove(chessGame);
      }
    }
    updateStatus();
  });
});

Template.chess.events({
  'click #resetBoard': () => {
    Meteor.call('chessgame.move', {
      color: null,
      from: null,
      to: null,
      fen: 'start',
    });
  },
  'click #flipBoard': () => {
    board.flip();
  }
});

Meteor.methods({
  'chessgame.move'({ color, from, to, fen }) {
    ChessGame.upsert({ id: 1 }, { id: 1, color, from, to, fen });
  }
});

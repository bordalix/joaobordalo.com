Posts = new Mongo.Collection('posts');

Posts.helpers({
  createdAgo() {
    var date = new Date(this.createdAt.replace(" ","T"));
    return moment(date).fromNow();
  }
});

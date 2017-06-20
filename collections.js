Posts = new Mongo.Collection('posts');

Posts.helpers({
  createdAgo() {
    const date = new Date(this.createdAt.replace(' ', 'T'));
    return moment(date).fromNow();
  }
});

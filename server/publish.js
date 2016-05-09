Meteor.publish('posts', function(limit) {
  return Posts.find({}, { sort: { id:-1 }, limit: limit });
});

Meteor.publish('thisPost', function(permalink) {
  return Posts.find({permalink: permalink});
});

Meteor.publish('allPosts', function(limit) {
  return Posts.find();
});

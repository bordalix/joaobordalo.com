Meteor.publish('posts', function(limit) {
  return Posts.find({}, { sort: { id: -1 }, limit: limit });
});

Meteor.startup(function () {  
  Posts._ensureIndex({id: 1});
});

Meteor.publish('thisPost', function(permalink) {
  return Posts.find({permalink: permalink});
});

Meteor.startup(function () {  
  Posts._ensureIndex({permalink: 1});
});

Meteor.publish('allPosts', function(limit) {
  return Posts.find();
});

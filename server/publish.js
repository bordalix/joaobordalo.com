Meteor.publish('posts', function (limit) {
  return Posts.find({}, { sort: { id: -1 }, limit: limit });
});

Meteor.startup(function () {  
  Posts._ensureIndex({id: 1});
});

Meteor.publish('thisPost', function (permalink) {
  return Posts.find({permalink: permalink});
});

Meteor.publish('previousPost', function (permalink) {
  let thisPostID = Posts.findOne({permalink: permalink}).id;
  return Posts.find(
    { id: { $lt: thisPostID }},
    {
      sort: { id: -1 }, 
      limit: 1
    }
  )
});

Meteor.publish('nextPost', function (permalink) {
  let thisPostID = Posts.findOne({permalink: permalink}).id;
  return Posts.find(
    { id: { $gt: thisPostID }},
    {
      sort: { id: 1 }, 
      limit: 1
    }
  )
});


Meteor.startup(function () {  
  Posts._ensureIndex({permalink: 1});
});

Meteor.publish('allPosts', function () {
  return Posts.find();
});

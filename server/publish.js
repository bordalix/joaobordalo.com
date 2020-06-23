Meteor.publish('posts', function (maxPosts) {
  check(maxPosts, Number);
  return Posts.find({ }, { sort: { id: -1 }, limit: maxPosts });
});

Meteor.startup(function () {
  Posts._ensureIndex({ id: 1 });
});

Meteor.publish('thisPost', function (link) {
  check(link, String);
  return Posts.find({ permalink: link });
});

Meteor.publish('prevPost', function (link) {
  check(link, String);
  const thisPostID = Posts.findOne({ permalink: link }).id;
  return Posts.find(
    { id: { $lt: thisPostID } },
    {
      sort: { id: -1 },
      limit: 1
    }
  );
});

Meteor.publish('nextPost', function (link) {
  check(link, String);
  const thisPostID = Posts.findOne({ permalink: link }).id;
  return Posts.find(
    { id: { $gt: thisPostID } },
    {
      sort: { id: 1 },
      limit: 1
    }
  );
});


Meteor.startup(function () {
  Posts._ensureIndex({ permalink: 1 });
});

Meteor.publish('allPosts', function () {
  return Posts.find();
});

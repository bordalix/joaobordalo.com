Template.post.onCreated(function () {
  const text = this.data.title;
  DocHead.removeDocHeadAddedTags();
  DocHead.setTitle(text);
  DocHead.addMeta({ name: 'description', content: text });
});

Template.post.onRendered(function () {
  lazyLoadImagesAndIframes();
  Meteor.Gists.render();
  makeYoutubeResponsive();
});

Template.post.helpers({
  previousPost() {
    return Posts.findOne({ id: { $lt: this.id } });
  },
  nextPost() {
    return Posts.findOne({ id: { $gt: this.id } });
  }
});

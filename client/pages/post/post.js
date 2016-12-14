Template.post.onCreated(function () {
  const text = this.data.title;
  DocHead.removeDocHeadAddedTags();
  DocHead.setTitle(text);
  DocHead.addMeta({name: "description", content: text});
});
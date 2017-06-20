Template.about.onCreated(function () {
  const text = 'About João Bordalo';
  DocHead.removeDocHeadAddedTags();
  DocHead.setTitle(text);
  DocHead.addMeta({ name: 'description', content: text });
});

Template.contact.onCreated(function () {
  const text = 'Contact João Bordalo';
  DocHead.removeDocHeadAddedTags();
  DocHead.setTitle(text);
  DocHead.addMeta({ name: 'description', content: text });
});

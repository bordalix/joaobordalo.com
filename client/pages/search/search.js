truncateText = function(text,length) {
  if (text && text.length > length)
    return text.substring(0, length)+'...';
  return (text);
}

Template.search.onCreated (function() {
  const text = 'Search João Bordalo blog posts';
  DocHead.removeDocHeadAddedTags();
  DocHead.setTitle(text);
  DocHead.addMeta({name: "description", content: text});
  Session.set('filterexpression', "");
});

Template.search.onRendered (function() {
  $("#searchinput").focus();
});

Template.search.events({
  'keyup #searchinput': function(event) {
    if (event.which === 13) event.currentTarget.blur();
    Session.set('filterexpression', event.currentTarget.value);
  }
});

Template.search.helpers({
  searchResults: function() {
    expression = Session.get('filterexpression');
    if (expression == ''  || expression.length < 3) {
      return [];
    } else {
      return Posts.find({
        $or : [
          { title:    { $regex: new RegExp(expression), $options: "i" } },
          { body:     { $regex: new RegExp(expression), $options: "i" } },
          { extended: { $regex: new RegExp(expression), $options: "i" } }
        ] }, { sort: { createdAt: -1 } } 
      );
    }
  }
})
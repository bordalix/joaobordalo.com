truncateText = function(text,length) {
  if (text && text.length > length)
    return text.substring(0, length)+'...';
  return (text);
}

Template.search.onCreated (
  function() {
    Session.set('filterexpression', "");
  }
);

Template.search.onRendered (
  function() {
    $("#searchinput").focus();
  }
)

Template.search.events({
  'keyup #searchinput': function(event) {
    var expression = event.currentTarget.value;
    Session.set('filterexpression', expression);
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
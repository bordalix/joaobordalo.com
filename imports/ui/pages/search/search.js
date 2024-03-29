import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import './search.html';
import '../post/postHeader';

truncateText = function(text, length) {
  if (text && text.length > length) {
    return `${text.substring(0, length)}...`;
  }
  return (text);
};

Template.search.onCreated(function() {
  document.title = 'Search João Bordalo blog posts';
  Session.set('filterexpression', '');
  Session.set('searchedsomething', false);
});

Template.search.onRendered(function() {
  $('#searchinput').focus();
});

Template.search.events({
  'keyup #searchinput'(event) {
    if (event.which === 13) event.currentTarget.blur();
    Session.set('filterexpression', event.currentTarget.value);
    if (!Session.get('searchedsomething')) {
      // analytics.track('Searched something');
      Session.set('searchedsomething', true);
    }
  }
});

Template.search.helpers({
  searchResults() {
    const expression = Session.get('filterexpression');
    if (expression === ''  || expression.length < 3) {
      return [];
    }
    return Posts.find({
      $or : [
        { title:    { $regex: new RegExp(expression), $options: 'i' } },
        { body:     { $regex: new RegExp(expression), $options: 'i' } },
        { extended: { $regex: new RegExp(expression), $options: 'i' } }
      ] }, { sort: { createdAt: -1 } }
    );
  }
});

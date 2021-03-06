import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import './home.html';
import '../post/postHeader';
import lazyLoadImagesAndIframes from '../../../lib/lazyLoading';
import makeYoutubeResponsive from '../../../lib/youtubeResponsive';

const ITEMS_INCREMENT = 5;

Template.home.onCreated(function() {
  Session.set('postsLimit', ITEMS_INCREMENT);
});

Template.home.onRendered(function() {
  this.autorun(() => {
    const sub = this.subscribe('posts', Session.get('postsLimit'));
    if (sub.ready()) {
      $('.noJavaScript').remove();
      $('.spinner-container').remove();
      Tracker.afterFlush(makeYoutubeResponsive);
      Tracker.afterFlush(lazyLoadImagesAndIframes);
    }
  });
  Meteor.setTimeout(function() { Meteor.Gists.render(); }, 1000);
});

Template.home.events({
  'click .showMore'(event) {
    const postID = event.currentTarget.id;
    const array  = Session.get('showMore') || [];
    const clone  = array.slice(0);
    clone.push(postID);
    Session.set('showMore', clone);
    Meteor.setTimeout(function() { Meteor.Gists.render(); }, 1000);
  }
});

Template.home.helpers({
  posts() {
    return Posts.find({}, { sort: { id: -1 } }).fetch().map(function (post) {
      if (!post.body.match('placeholder')) {
        post.body = post.body.replace('<iframe', '<div class="placeholder"><iframe');
        post.body = post.body.replace('</iframe>', '</iframe></div>');
      }
      return post;
    });
  },
  moreResults() {
    return !(Posts.find().count() < Session.get('postsLimit'));
  },
  showMore(postID) {
    const auxArray = Session.get('showMore') || [];
    if (auxArray.indexOf(postID.toString()) === -1) {
      return false;
    }
    return true;
  }
});

// http://www.meteorpedia.com/read/Infinite_Scrolling
function showMoreVisible() {
  const target = $('#showMoreResults');
  if (!target.length) return;
  const threshold = $(window).scrollTop() + ($(window).height() * 2);
  if (target.offset().top < threshold) {
    if (!target.data('visible')) {
      target.data('visible', true);
      Session.set('postsLimit', Session.get('postsLimit') + ITEMS_INCREMENT);
    }
  } else if (target.data('visible')) {
    target.data('visible', false);
  }
}

// run the above func every time the user scrolls
$(window).scroll(showMoreVisible);

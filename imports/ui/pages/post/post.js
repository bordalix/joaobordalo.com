import { Template } from 'meteor/templating';
import './post.html';
import './postHeader';
import { lazyLoadImagesAndIframes } from '../../../lib/lazyLoading';
import { makeYoutubeResponsive } from '../../../lib/youtubeResponsive';
import { stripHtml } from '../../../lib/stripHtml';

Template.post.onCreated(function() {
  const desc = stripHtml(this.data.body);
  const title = this.data.title;
  document.title = title;
  document.querySelector('meta[name="description"]').setAttribute('content', desc);
  document.querySelector('meta[name="twitter:title"]').setAttribute('content', title);
  document.querySelector('meta[name="twitter:description"]').setAttribute('content', desc);
});

Template.post.onRendered(function() {
  lazyLoadImagesAndIframes();
  Meteor.Gists.render();
  makeYoutubeResponsive();
});

Template.post.helpers({
  prevPost() {
    return Posts.findOne({ id: { $lt: this.id } });
  },
  nextPost() {
    return Posts.findOne({ id: { $gt: this.id } });
  }
});

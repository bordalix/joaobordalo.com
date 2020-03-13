import { Template } from 'meteor/templating';
import './layout.html';
import '../header/header';
import { makeYoutubeResponsive } from '../../../lib/youtubeResponsive';

Template.layout.onRendered(function() {
  makeYoutubeResponsive();
});

import { Template } from 'meteor/templating';
import './layout.html';
import '../header/header';
import addDarkThemeEvent from '../../../lib/dark_mode';
import unregisterServiceWorker from '../../../lib/unregister_service_worker';

Template.layout.onRendered(function() {
  addDarkThemeEvent();
  unregisterServiceWorker();
});

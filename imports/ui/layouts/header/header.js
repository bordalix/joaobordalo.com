import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import './header.html';

Template.header.helpers({
  onSearch: () => Router.current().route.getName() === 'search'
});

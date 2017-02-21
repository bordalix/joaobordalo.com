Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound'
});

// https://forums.meteor.com/t/how-to-redirect-non-www-to-www-in-meteor/1826/2
Router.route('/(.*)', function() {
  var fullUrl, host;
  host = this.request.headers.host;
  if (host.indexOf("iscore.pt") != -1) {
    this.response.writeHead(301, {
      Location: "http://joaobordalo.com/iscore"
    });
    return this.response.end();
  } else {
    fullUrl = "http://" + host + this.request.url;
    if (host.indexOf("www") === 0) {
      this.response.writeHead(301, {
        Location: fullUrl.replace("www.", "")
      });
      return this.response.end();
    }
  }
  this.next();
}, {where: "server"});

Router.route('/', {
  name: 'home',
  template: 'home'
});

Router.route('/about', {
  name: 'about',
  template: 'about'
});

Router.route('/contact', {
  name: 'contact',
  template: 'contact'
});

Router.route('/drucker', {
  name: 'drucker',
  template: 'drucker'
});

Router.route('/iscore', {
  name: 'iscore',
  template: 'iscore'
});

Router.route('/search', {
  name: 'search',
  template: 'search',
  waitOn: function() {
    return [
      Meteor.subscribe('allPosts')
    ];
  }
});

Router.route('/traffic', {
  name: 'traffic',
  template: 'traffic'
});

Router.route('/articles/:year/:month/:day/:permalink',{
  name: 'post',
  template: 'post',
  waitOn: function() {
    return [
      Meteor.subscribe('thisPost', this.params.permalink),
      Meteor.subscribe('nextPost', this.params.permalink),
      Meteor.subscribe('previousPost', this.params.permalink)
    ];
  },
  data: function() {
    return Posts.findOne({ permalink: this.params.permalink });
  }
});

//
// I wonder why Google is fetching this 2 URLs ('m' and 'mobile')

Router.route('m/articles/:year/:month/:day/:permalink', {
  name: 'post_m',
  template: 'post',
  waitOn: function() {
    return [
      Meteor.subscribe('thisPost', this.params.permalink)
    ];
  },
  data: function() {
    return Posts.findOne({ permalink: this.params.permalink });  
  }
});

Router.route('mobile/articles/:year/:month/:day/:permalink', {
  name: 'post_mobile',
  template: 'post',
  waitOn: function() {
    return [
      Meteor.subscribe('thisPost', this.params.permalink)
    ];
  },
  data: function() {
    return Posts.findOne({ permalink: this.params.permalink });  
  }
});

//
// Old URLs we have to maintain, redirected appropriately

Router.route('/articles/:year/:month', function () {
  this.response.writeHead(301, {
    'Location': 'http://joaobordalo.com/'
  });
  this.response.end();
}, {where: 'server'});

Router.route('/pages/tag/:tag', function () {
  this.response.writeHead(301, {
    'Location': 'http://joaobordalo.com/'
  });
  this.response.end();
}, {where: 'server'});

Router.route('/pages/:stuff', function () {
  var redirectUrl = 'http://joaobordalo.com/' + this.params.stuff;
  this.response.writeHead(301, {
    'Location': redirectUrl
  });
  this.response.end();
}, {where: 'server'});

//
// Google is trying to fetch this URLs, I wonder why

Router.route('/m', function () {
  this.response.writeHead(301, {
    'Location': 'http://joaobordalo.com/'
  });
  this.response.end();
}, {where: 'server'});

Router.route('/mobile', function () {
  this.response.writeHead(301, {
    'Location': 'http://joaobordalo.com/'
  });
  this.response.end();
}, {where: 'server'});
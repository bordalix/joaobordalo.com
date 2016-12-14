Router.configure({
  layoutTemplate: 'appLayout'
});

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
  nane: 'post',
  template: 'post',
  waitOn: function() {
    return [
      Meteor.subscribe('thisPost', this.params.permalink)
    ];
  },
  data: function() {
    return Posts.findOne({ permalink: this.params.permalink });  
  }
})

Router.route('/pages/:stuff', function () {
  var redirectUrl = 'http://joaobordalo.com/' + this.params.stuff;
  this.response.writeHead(301, {
    'Location': redirectUrl
  });
  this.response.end();
}, {where: 'server'});
/* eslint-disable import/newline-after-import */
/* eslint-disable import/no-duplicates */

import '/imports/ui/layouts/main/layout';
import '/imports/ui/layouts/notFound/notFound';
import '/imports/ui/components/loading/loading';

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

/* eslint-disable consistent-return */
// https://forums.meteor.com/t/how-to-redirect-non-www-to-www-in-meteor/1826/2
Router.route('/(.*)', function() {
  import { onPageLoad } from 'meteor/server-render';
  /* avoid more than one append to body */
  let append = true;
  /* redirect iscore */
  const host = this.request.headers.host;
  if (host.indexOf('iscore.pt') !== -1) {
    this.response.writeHead(301, {
      Location: 'https://joaobordalo.com/iscore'
    });
    return this.response.end();
  }
  /* removes www from url and redirect */
  const fullUrl = `https://${host}${this.request.url}`;
  if (host.indexOf('www') === 0) {
    this.response.writeHead(301, {
      Location: fullUrl.replace('www.', '')
    });
    return this.response.end();
  }
  /* fool lighthouse by keeping html not empty */
  onPageLoad((sink) => {
    const html = '<div class="noJavaScript" style="width:0;height:0;color:#fff">'
               + 'Please enable JavaScript in your browser to view this site.'
               + '</div>';
    if (append) sink.appendToBody(html);
    append = false;
  });
  this.next();
}, { where: 'server' });
/* eslint-enable consistent-return */

Router.route('/', function() {
  document.location.reload(true);
});

Router.route('/blog', {
  name: 'blog',
  template: 'home',
  waitOn() {
    import '/imports/ui/pages/home/home';
  }
});

Router.route('/search', {
  name: 'search',
  template: 'search',
  waitOn() {
    import '/imports/ui/pages/search/search';
    return [
      Meteor.subscribe('allPosts')
    ];
  }
});

Router.route('/articles/:year/:month/:day/:permalink', {
  name: 'post',
  template: 'post',
  waitOn() {
    import '/imports/ui/pages/post/post';
    return [
      Meteor.subscribe('thisPost', this.params.permalink),
      Meteor.subscribe('nextPost', this.params.permalink),
      Meteor.subscribe('prevPost', this.params.permalink)
    ];
  },
  data() {
    return Posts.findOne({ permalink: this.params.permalink });
  }
});

//
// I wonder why Google is fetching this 2 URLs ('m' and 'mobile')

Router.route('m/articles/:year/:month/:day/:permalink', {
  name: 'post_m',
  template: 'post',
  waitOn() {
    import '/imports/ui/pages/post/post';
    return [
      Meteor.subscribe('thisPost', this.params.permalink)
    ];
  },
  data() {
    return Posts.findOne({ permalink: this.params.permalink });
  }
});

Router.route('mobile/articles/:year/:month/:day/:permalink', {
  name: 'post_mobile',
  template: 'post',
  waitOn() {
    import '/imports/ui/pages/post/post';
    return [
      Meteor.subscribe('thisPost', this.params.permalink)
    ];
  },
  data() {
    return Posts.findOne({ permalink: this.params.permalink });
  }
});

//
// Old URLs we have to maintain, redirected appropriately

Router.route('/articles/:year/:month', function () {
  this.response.writeHead(301, {
    Location: 'https://joaobordalo.com/'
  });
  this.response.end();
}, { where: 'server' });

Router.route('/pages/tag/:tag', function () {
  this.response.writeHead(301, {
    Location: 'https://joaobordalo.com/'
  });
  this.response.end();
}, { where: 'server' });

Router.route('/pages/:stuff', function () {
  const redirectUrl = `https://joaobordalo.com/${this.params.stuff}`;
  this.response.writeHead(301, {
    Location: redirectUrl
  });
  this.response.end();
}, { where: 'server' });

//
// Google is trying to fetch this URLs, I wonder why

Router.route('/m', function () {
  this.response.writeHead(301, {
    Location: 'https://joaobordalo.com/'
  });
  this.response.end();
}, { where: 'server' });

Router.route('/mobile', function () {
  this.response.writeHead(301, {
    Location: 'https://joaobordalo.com/'
  });
  this.response.end();
}, { where: 'server' });

Router.route('/chess', {
  name: 'chess',
  template: 'chess',
  waitOn() {
    import '/imports/ui/pages/chess/chess';
    return [
      Meteor.subscribe('chessGame')
    ];
  },
});

RssFeed.publish( 'posts', function() {
  var feed = this;

  feed.setValue( 'title', feed.cdata( 'João Bordalo blog feed' ) );
  feed.setValue( 'description', feed.cdata( 'Latest posts by João Bordalo.' ) );
  feed.setValue( 'link', 'http://joaobordalo.com' );
  feed.setValue( 'lastBuildDate', new Date() );
  feed.setValue( 'pubDate', new Date() );
  feed.setValue( 'ttl', 1 );
  
  var posts = Posts.find({},{sort:{createdAt:-1}});
  posts.forEach( function(post) { 
    post.title = '<![CDATA[' + post.title + ']]>';
    post.body  = post.body.replace(/(\r\n|\n|\r)/gm,"");
    if (post.extended) {
      post.extended = post.extended.replace(/(\r\n|\n|\r)/gm,"");
      post.text     = '<![CDATA[' + post.body + post.extended + ']]>';
    } else {
      post.text     = '<![CDATA[' + post.body + ']]>';
    }
    post.date  = moment(post.createdAt, 'YYYY-MM-DD hh:mm:ss').format('ddd, DD MMM YYYY hh:mm:ss') + ' GMT';
    feed.addItem({
      title:       post.title,
      description: post.text,
      link:        post.url,
      pubDate:     post.date
    });
  });
});
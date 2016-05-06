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
    //post.body  = post.body.replace(/allowfullscreen/gi,"allowfullscreen=''");
    //post.body  = post.body.replace(/&/gi,"&amp;");       
    //post.title = post.title.replace(/&/gi,"&amp;");
    post.body = post.body.replace(/(\r\n|\n|\r)/gm,"");                
    post.date = moment(post.createdAt, 'YYYY-MM-DD hh:mm:ss').format('ddd, DD MMM YYYY hh:mm:ss');
    feed.addItem({
      title: post.title,
      description: post.body,
      link: post.url,
      pubDate: post.date
    });
  });
});
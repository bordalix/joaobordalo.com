var ITEMS_INCREMENT = 5;

Template.home.onCreated(function() {
  const text = 'The place João Bordalo calls home';
  DocHead.removeDocHeadAddedTags();
  DocHead.setTitle(text);
  DocHead.addMeta({name: "description", content: text});
  Session.set('postsLimit', ITEMS_INCREMENT);
});

Template.home.onRendered(function() {
  this.autorun(() => {
    var sub = this.subscribe('posts', Session.get('postsLimit'));
    if (sub.ready()) {
      Tracker.afterFlush( function () {
      //https://css-tricks.com/NetMag/FluidWidthVideo/Article-FluidWidthVideo.php
        var $allVideos = $("iframe"),
            $fluidEl = $("#container");
    	  $allVideos.each(function() {
    	    $(this)
    	      // jQuery .data does not work on object/embed elements
    	      .attr('data-aspectRatio', this.height / this.width)
    	      .removeAttr('height')
    	      .removeAttr('width');
    	  });
    	  $(window).resize(function() {
    	    var newWidth = $fluidEl.width();
    	    $allVideos.each(function() {
    	      var $el = $(this);
    	      $el
    	          .width(newWidth)
    	          .height(newWidth * $el.attr('data-aspectRatio'));
    	    });
    	  }).resize();
      });
    }
  });
})

Template.home.events({
  'click .showMore': function(event) {
    var postID = event.currentTarget.id;
    var array  = Session.get("showMore") || [];
    var clone  = array.slice(0);
    clone.push(postID);
    Session.set("showMore", clone);
  }
})

Template.home.helpers({
  posts: function() {
    return Posts.find(
      { },
      { sort: { createdAt: -1 }}
    ).fetch().map(function (post) {
      post.body = post.body.replace('<iframe','<div class="placeholder"><iframe');
      post.body = post.body.replace('</iframe>','</iframe></div>');
      return post;
    });
  },
  moreResults: function() {
    return !(Posts.find().count() < Session.get("itemsLimit"));
  },
  showMore: function(postID) {
    var auxArray = Session.get("showMore") || [];
    if (auxArray.indexOf(postID.toString()) == -1) {
      return false;
    } else {
      return true;
    }
  }
})

// http://www.meteorpedia.com/read/Infinite_Scrolling
function showMoreVisible() {
  var threshold, target = $("#showMoreResults");
  if (!target.length) return;
    
  threshold = $(window).scrollTop() + $(window).height() - target.height();
    
  if (target.offset().top < threshold) {
    if (!target.data("visible")) {
      target.data("visible", true);
      Session.set("postsLimit", Session.get("postsLimit") + ITEMS_INCREMENT);
    }
  } else {
    if (target.data("visible")) {
      target.data("visible", false);
    }
  }        
}
 
// run the above func every time the user scrolls
$(window).scroll(showMoreVisible);
// https://css-tricks.com/NetMag/FluidWidthVideo/Article-FluidWidthVideo.php
const makeYoutubeResponsive = function () {
  const $allVideos = $('iframe');
  const $fluidEl = $('#container');
  $allVideos.each(function() {
    $(this)
      // jQuery .data does not work on object/embed elements
      .attr('data-aspectRatio', this.height / this.width)
      .removeAttr('height')
      .removeAttr('width');
  });
  $(window).resize(function() {
    const newWidth = $fluidEl.width();
    $allVideos.each(function() {
      const $el = $(this);
      $el
        .width(newWidth)
        .height(newWidth * $el.attr('data-aspectRatio'));
    });
  }).resize();
};

// eslint-disable-next-line import/prefer-default-export
export { makeYoutubeResponsive };

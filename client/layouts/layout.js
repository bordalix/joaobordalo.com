// via https://osvaldas.info/auto-hide-sticky-header
function layoutScrollHandler() {
  /* eslint-disable no-use-before-define */
  const wScrollBefore  = Session.get('wScrollBefore');
  /* eslint-enable no-use-before-define */
  const elClassNarrow  = 'fixed_menu_dark';
  const elNarrowOffset = 50;
  const element        = $('.fixed_menu');
  const elHeight       = element.offsetHeight;
  const dHeight        = document.body.offsetHeight;
  const wHeight        = window.innerHeight;
  const wScrollCurrent = window.pageYOffset;
  const wScrollDiff    = wScrollBefore - wScrollCurrent;
  const elTop          = parseInt(element.css('top'), 10) + wScrollDiff;
  if (wScrollCurrent > elNarrowOffset) { // toggles "narrow" classname
    if (!element.hasClass(elClassNarrow)) {
      element.addClass(elClassNarrow);
    }
  } else {
    element.removeClass(elClassNarrow);
  }
  if (wScrollCurrent <= 0) { // scrolled to the very top; element sticks to the top
    element.css('top', '0px');
  } else if (wScrollDiff > 0) { // scrolled up; element slides in
    element.css('top', 0);
  } else if (wScrollDiff < 0) { // scrolled down
    if (wScrollCurrent + wHeight >= dHeight - elHeight) {
      // scrolled to the very bottom; element slides in
      element.css('top', `${((wScrollCurrent + wHeight) - dHeight) < 0 ? elTop : 0}px`);
    } else { // scrolled down; element slides out
      element.css('top', `${Math.abs(elTop) > elHeight ? -elHeight : elTop}px`);
    }
  }
  Session.set('wScrollBefore', wScrollCurrent);
}

Template.layout.onCreated(function() {
  Session.set('wScrollBefore', 0);
  $(window).on('scroll', layoutScrollHandler);
});

Template.layout.onRendered(function() {
  makeYoutubeResponsive();
});

Template.layout.onDestroyed(function() {
  $(window).off('scroll', layoutScrollHandler);
});

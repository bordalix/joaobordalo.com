// via https://osvaldas.info/auto-hide-sticky-header
var layoutScrollHandler = function(e) {
  if (typeof wScrollBefore === 'undefined') wScrollBefore  = 0;
  let element	       = document.querySelector('.header');
  let elHeight       = element.offsetHeight;
  let dHeight			   = document.body.offsetHeight;
  let wHeight			   = window.innerHeight;
  let wScrollCurrent = window.pageYOffset;
  let wScrollDiff    = wScrollBefore - wScrollCurrent;
  let elTop          = parseInt(window.getComputedStyle(element).getPropertyValue('top')) + wScrollDiff;
  if (wScrollCurrent <= 0) { // scrolled to the very top; element sticks to the top
    element.style.top = '0px';
  } else {
    if (wScrollDiff > 0) { // scrolled up; element slides in
      element.style.top = ( elTop > 0 ? 0 : elTop ) + 'px';
    } else {
      if (wScrollDiff < 0) { // scrolled down
        if (wScrollCurrent + wHeight >= dHeight - elHeight) { // scrolled to the very bottom; element slides in
          element.style.top = ( ( elTop = wScrollCurrent + wHeight - dHeight ) < 0 ? elTop : 0 ) + 'px';
        } else { // scrolled down; element slides out
          element.style.top = ( Math.abs( elTop ) > elHeight ? -elHeight : elTop ) + 'px';
        }
      }
    }
  }
  wScrollBefore = wScrollCurrent;
};

Template.layout.onCreated(function() {
  $(window).on('scroll', layoutScrollHandler);
});

Template.layout.onDestroyed(function() {
  $(window).off('scroll', layoutScrollHandler);
});

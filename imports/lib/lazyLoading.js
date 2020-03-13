const lazyLoadImagesAndIframes = function () {
  ['img[data-src]', 'iframe[data-src]'].forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.setAttribute('src', el.getAttribute('data-src'));
      el.onload = function() {  // eslint-disable-line no-param-reassign
        el.removeAttribute('data-src');
      };
    });
  });
};

// eslint-disable-next-line import/prefer-default-export
export { lazyLoadImagesAndIframes };

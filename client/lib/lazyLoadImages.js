lazyLoadImages = function () {
  document.querySelectorAll('img[data-src]').forEach(function (img) {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = function() {  // eslint-disable-line no-param-reassign
      img.removeAttribute('data-src');
    };
  });
};

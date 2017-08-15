lazyLoadImages = function () {
  console.log('xpto');
  document.querySelectorAll('img[data-src]').forEach(function (img) {
    console.log('img ', img);
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = function() {  // eslint-disable-line no-param-reassign
      img.removeAttribute('data-src');
    };
  });
};

const stripHtml = function (html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

// eslint-disable-next-line import/prefer-default-export
export { stripHtml };

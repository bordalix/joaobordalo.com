sitemaps.add('/sitemap.xml', function () {
  const pages = ['/about', '/contact', '/search', '/traffic'].map(function (page) {
    return {
      page: `http://joaobordalo.com${page}`,
      lastmod: new Date(),
    };
  });
  const posts = Posts.find(
    { },
    { sort: { id: -1 } }
  ).fetch().map(function (post) {
    return {
      page: post.url,
      lastmod: post.createdAt,
    };
  });
  return pages.concat(posts);
});

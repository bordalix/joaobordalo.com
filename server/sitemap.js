sitemaps.add('/sitemap.xml', function () {
  const out = [];
  ['/about','/contact','/search','/traffic'].forEach(function (page) {
    out.push({
      page: 'http://joaobordalo.com' + page,
      lastmod: new Date(),
    });
  })
  Posts.find(
    { },
    { sort: { createdAt: -1 }}
  ).fetch().forEach(function (post) {
    out.push({
      page: post.url,
      lastmod: post.createdAt,
    });
  });
  return out;
});
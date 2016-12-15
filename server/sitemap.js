sitemaps.add('/sitemap.xml', function () {
  let out = ['/about','/contact','/search','/traffic'].map(function (page) {
    return {
      page: 'http://joaobordalo.com' + page,
      lastmod: new Date(),
    };
  });
  Posts.find(
    { },
    { sort: { id: -1 }}
  ).fetch().map(function (post) {
    out.push({
      page: post.url,
      lastmod: post.createdAt,
    });
  });
  return out;
});
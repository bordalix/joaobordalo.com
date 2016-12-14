sitemaps.add('/sitemap.xml', function () {
  const out = [];
  Posts.find().fetch().forEach(function (page) {
    out.push({
      page: page.url,
      lastmod: page.createdAt,
    });
  });
  return out;
});
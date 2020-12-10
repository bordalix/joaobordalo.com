sitemaps.add('/sitemap.xml', function () {
  const pages = [
    {
      page: 'https://joaobordalo.com/portfolio',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly'
    },
    {
      page: 'https://joaobordalo.com/search',
      lastmod: new Date().toISOString(),
      changefreq: 'yearly'
    },
    {
      page: 'https://joaobordalo.com/traffic',
      lastmod: new Date().toISOString(),
      changefreq: 'always'
    }
  ];
  const projects = [
    'appcexplorer', 'appcoins', 'batalhadosbitaites', 'bitcoinstats', 'cowork',
    'dogoffleash', 'ethereum-roulette', 'guiasporttv', 'hatitude', 'iscore',
    'worldleague', 'wtst'
  ].map(function (project) {
    return {
      page: `https://joaobordalo.com/portfolio/${project}.html`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly'
    };
  });
  const posts = Posts.find(
    { },
    { sort: { id: -1 } }
  ).fetch().map(function (post) {
    return {
      page: post.url,
      lastmod: post.createdAt,
      changefreq: 'never'
    };
  });
  return pages.concat(posts).concat(projects);
});

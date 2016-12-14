# joaobordalo.com
[http://joaobordalo.com](http://joaobordalo.com) blog code in Meteor.

Developed in ~~two~~ three days, needed some code to host my dying blog (which was in RoR) and decided to try Meteor.

Some design patterns implemented:

- Live search
- Infinite scrolling
- Fluid iframes (for embeded videos)
- Image placeholders aka Lazy Loading

SEO best practices implemented:

- Dynamic title and meta description
- Server Side Rendering via prerender.io
- Dynamic sitemap generation
- Open Graph tags
- Analytics
- RSS

This don't offer a backoffice.

It expects a Mongo collection named 'posts', with the following schema:
```
{
	_id: ObjectId(),
	id: INTEGER,
	title: STRING, // E.g.: "The new friday song"
	createdAt: DATE, // E.g.: "2006-11-08 05:32:16"
	permalink: STRING, // E.g.: "the-new-friday-song"
	body: STRING, // E.g.: "<p>Hello world!</p><iframe>...</iframe>"   
	url: STRING // E.g.: "http://joaobordalo.com/articles/2006/11/08/the-new-friday-song"
}

```
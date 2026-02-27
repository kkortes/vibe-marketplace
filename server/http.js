import { Hono } from 'hono';
import { cors } from 'hono/cors';

export default (mongo, port) => {
  const app = new Hono();

  app.use('/*', cors());

  app.get('/:slug{.+\\.html}', async (c) => {
    const slug = c.req.param('slug').replace('.html', '');
    const component = await mongo.collection('components').findOne({ slug, published: true });
    if (!component) return c.notFound();
    return c.html(component.html);
  });

  Bun.serve({ fetch: app.fetch, port });
  console.info(`🌐 HTTP server on port ${port}`);
};

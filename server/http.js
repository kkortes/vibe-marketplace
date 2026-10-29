import { Hono } from 'hono';
import { cors } from 'hono/cors';

// The only thing served over HTTP is the component source itself, because that
// is what `<component src>` fetches. Everything the marketplace knows about a
// component travels over the websocket instead.
const PINNED = /^v(\d+)\.html$/;

export default (db, port) => {
  const app = new Hono();
  const latest = db.query('SELECT latest FROM components WHERE namespace = $namespace AND slug = $slug');
  const published = db.query(
    'SELECT version, html FROM revisions WHERE namespace = $namespace AND slug = $slug AND version = $version',
  );

  app.use('/*', cors());

  // The one client helper this origin's URL scheme needs: a `#vN` fragment is
  // cut from a request before it is sent, so the version it names is resolved
  // in the page that wrote it.
  app.get('/js/pin.js', (c) => {
    c.header('Content-Type', 'application/javascript; charset=UTF-8');
    c.header('Cache-Control', 'public, max-age=3600');

    return c.body(Bun.file(`${import.meta.dir}/../app/js/pin.js`).stream());
  });

  const revision = (c, namespace, slug, version) => {
    const component = latest.get({ namespace, slug });
    if (!component) return c.notFound();

    const found = published.get({ namespace, slug, version: version ?? component.latest });
    if (!found) return c.notFound();

    c.header('X-Component-Version', String(found.version));
    c.header('Cache-Control', version ? 'public, max-age=31536000, immutable' : 'public, max-age=60');

    return c.html(found.html);
  };

  app.get('/:namespace/:slug/:pin', (c) => {
    const [, version] = c.req.param('pin').match(PINNED) || [];
    if (!version) return c.notFound();

    return revision(c, c.req.param('namespace'), c.req.param('slug'), Number(version));
  });

  app.get('/:namespace/:file{.+\\.html}', (c) =>
    revision(c, c.req.param('namespace'), c.req.param('file').replace('.html', '')),
  );

  const server = Bun.serve({ fetch: app.fetch, port });
  console.info(`🌐 Component source on port ${server.port}`);

  return server;
};

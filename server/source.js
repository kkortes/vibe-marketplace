import { Hono } from 'hono';
import { cors } from 'hono/cors';

// Over HTTP the Worker serves the component source itself, because that is what
// `<component src>` fetches. Everything the marketplace knows about a component
// travels over the websocket instead.
const PINNED = /^v(\d+)\.html$/;

const app = new Hono();

app.use('/*', cors());

// The one client helper this origin's URL scheme needs: a `#vN` fragment is cut
// from a request before it is sent, so the version it names is resolved in the
// page that wrote it. It is a static asset, routed through here only so a
// consumer on another origin may import it.
app.get('/js/pin.js', async (c) => {
  const res = await c.env.ASSETS.fetch(c.req.raw);

  c.header('Content-Type', 'application/javascript; charset=UTF-8');
  c.header('Cache-Control', 'public, max-age=3600');

  return c.body(res.body, res.status);
});

const revision = async (c, namespace, slug, version) => {
  const component = await c.env.DB.prepare('SELECT latest FROM components WHERE namespace = ? AND slug = ?')
    .bind(namespace, slug)
    .first();
  if (!component) return c.notFound();

  const found = await c.env.DB.prepare(
    'SELECT version, html FROM revisions WHERE namespace = ? AND slug = ? AND version = ?',
  )
    .bind(namespace, slug, version ?? component.latest)
    .first();
  if (!found) return c.notFound();

  c.header('X-Component-Version', String(found.version));
  c.header('Cache-Control', version ? 'public, max-age=31536000, immutable' : 'public, max-age=60');

  return c.html(found.html);
};

app.get('/:namespace/:slug/edit', (c) => c.env.ASSETS.fetch(new URL('/edit', c.req.url)));

app.get('/:namespace/:slug/:pin', (c) => {
  const [, version] = c.req.param('pin').match(PINNED) || [];
  if (!version) return c.notFound();

  return revision(c, c.req.param('namespace'), c.req.param('slug'), Number(version));
});

// The same address without .html is the website's page for the component; with
// .html it is the component's raw source. The ending decides, nothing else.
// /cdn-cgi/ belongs to the Cloudflare runtime and is never a namespace.
app.get('/:namespace/:slug{[a-z0-9-]+}', (c) =>
  c.req.param('namespace') === 'cdn-cgi' ? c.notFound() : c.env.ASSETS.fetch(new URL('/component', c.req.url)),
);

app.get('/:namespace/:file{.+\\.html}', (c) =>
  revision(c, c.req.param('namespace'), c.req.param('file').replace('.html', '')),
);

export default app;

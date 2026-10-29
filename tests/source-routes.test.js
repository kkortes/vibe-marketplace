import { afterAll, beforeAll, describe, expect, test } from 'bun:test';

import startHttp from '../server/http.js';
import { open } from '../server/db.js';

const db = open(':memory:');

db.run("INSERT INTO namespaces (slug, title, createdAt) VALUES ('vibe', 'Vibe', '')");
db.run(
  "INSERT INTO components (namespace, slug, title, category, latest, defaults, createdAt, updatedAt) VALUES ('vibe', 'counter', 'Counter', 'Interactive', 3, '{}', '', '')",
);
db.run(
  "INSERT INTO revisions (namespace, slug, version, html, props, notes, authorName, createdAt) VALUES ('vibe', 'counter', 1, '<p>one</p>', '[]', '', 'Vibe', ''), ('vibe', 'counter', 3, '<p>three</p>', '[]', '', 'Vibe', '')",
);

let server;
let origin;

beforeAll(() => {
  server = startHttp(db, 0);
  origin = `http://localhost:${server.port}`;
});

afterAll(() => server.stop(true));

describe('component source', () => {
  test('a bare address serves the latest revision', async () => {
    const res = await fetch(`${origin}/vibe/counter.html`);

    expect(res.status).toBe(200);
    expect(res.headers.get('X-Component-Version')).toBe('3');
    expect(await res.text()).toBe('<p>three</p>');
  });

  test('the latest revision is not cached for long, because it moves', async () => {
    const res = await fetch(`${origin}/vibe/counter.html`);

    expect(res.headers.get('Cache-Control')).toBe('public, max-age=60');
  });

  test('a version path serves that frozen revision', async () => {
    const res = await fetch(`${origin}/vibe/counter/v1.html`);

    expect(res.status).toBe(200);
    expect(res.headers.get('X-Component-Version')).toBe('1');
    expect(await res.text()).toBe('<p>one</p>');
  });

  test('a frozen revision is cached forever, because it can never change', async () => {
    const res = await fetch(`${origin}/vibe/counter/v1.html`);

    expect(res.headers.get('Cache-Control')).toContain('immutable');
  });

  test('a version that was never published is not found', async () => {
    expect((await fetch(`${origin}/vibe/counter/v2.html`)).status).toBe(404);
  });

  test('a component that does not exist is not found', async () => {
    expect((await fetch(`${origin}/vibe/nope.html`)).status).toBe(404);
  });

  test('a third segment that names no version is not found', async () => {
    expect((await fetch(`${origin}/vibe/counter/latest.html`)).status).toBe(404);
  });

  test('the source is reachable cross-origin, which is the whole point', async () => {
    const res = await fetch(`${origin}/vibe/counter.html`);

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  test('the pin resolver is served from the same origin as the components', async () => {
    const res = await fetch(`${origin}/js/pin.js`);

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('javascript');
    expect(await res.text()).toContain('export const resolvePins');
  });
});

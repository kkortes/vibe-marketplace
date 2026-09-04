# CLAUDE.md

AI assistant guidance for working with this repository.

## Git

Never run `git add`, `git commit`, or `git push`. The user manages their own git workflow.

## What this is

A marketplace of Vibe components. A component is plain HTML at a URL; a consumer
points a `<component src>` at it and it renders. The site itself is built with
Vibe and Stylecheat and nothing else.

## Where components are stored

**In MongoDB. Nothing about a component is ever written to disk.**

Database `vibe-marketplace`, three collections:

| Collection   | Holds | Mutable |
|---|---|---|
| `namespaces` | `slug`, `title`, `official`, `ownerId` | yes |
| `components` | catalogue metadata per `namespace` + `slug`: `title`, `description`, `category`, `icon`, `latest`, `defaults`, `ownerId` | yes |
| `revisions`  | one document per published version | **never** |

**The source bytes of a component live in `revisions.html`** — a string field on
the revision document, holding the component's markup exactly as published.
There is no file on disk, no object store, no CDN bucket. `server/http.js` reads
that field and answers with it as `text/html`; that response *is* the component.

A revision document is `{ namespace, slug, version, html, props, notes,
authorId, authorName, createdAt }`. Revisions are insert-only. `server/indexes.js`
puts a unique index on `(namespace, slug, version)`, so a second write to a
version that exists is an error rather than an edit — that index is what makes
"frozen" a fact rather than a convention. Publishing `$inc`s `components.latest`
and inserts the new revision; it never updates an old one.

`components.defaults` is a derived copy of the latest revision's prop defaults,
kept so the catalogue can be listed in one call without fetching a revision per
card. The frozen truth about props is `revisions.props`.

The only files under `server/seed/` that look like components are inputs to the
seed script: `server/seed/remote/*.html` are byte-for-byte copies of the
webdev-game-stack remote components, read at seed time and written into
`revisions.html` like any other publish. They are not served from disk.

## Addresses and pinning

- `GET /<namespace>/<slug>.html` — the latest revision. Short cache; it moves.
- `GET /<namespace>/<slug>/vN.html` — revision N. Immutable cache; it cannot move.

The address a visitor copies is `…/<slug>.html#vN`. A URL fragment is cut from a
request before it is sent, so no server ever sees one — `js/pin.js` resolves it
in the page into the version path above. The marketplace serves that resolver at
`GET /js/pin.js` so a consumer needs one line to make the fragment form work.

## Authentication

**Google, and only Google, and it is stated rather than inherited.**

- `server/index.js` passes `{ providers: [], store: store(mongo) }` to aaw.
  `providers: []` turns off aaw's default (`["sqlite"]`, password login) and
  registers no social provider, so no HTTP `/auth/*` route is mounted.
- The only path to a session is this app's own `server/events/login/google.js`,
  which verifies a Google ID token and calls aaw's `authenticate`.
  `js/auth.js` holds the browser half and the client id.
- `server/store.js` is the session store. aaw registers its built-in
  `aaw/login`, `aaw/register` and `aaw/password/*` events whatever `providers`
  says, so the store answers for them by name with "no password login here"
  rather than failing on a missing method.
- There is no GitHub sign-in anywhere in this repository. A GitHub prompt on a
  `*.vercel.app` preview URL is Vercel's own deployment protection, not this app.

Authorization is aaw's folder convention: everything under `server/events/auth/`
requires a session, everything else is open. Reading and rendering a component
need no account; version history, publishing and namespace creation do.

## Layout

`app/` is the compiler's whole world — `"source": "./app"` in the `vibe-compiler`
config. Nothing outside it reaches the static output, which is what keeps server
source and seed data off the static host. Anything added to `app/` as a
top-level `.html` file becomes a page.

- `app/` — pages flat at its root (`index.html`, `component.html`, `edit.html`,
  `publish.html`), plus `components/` (the site's own Layout and Topbar), `js/`,
  `css/`, `fonts/` and `index.css`.
- `server/` — the websocket events, the component-source HTTP server, and the seed.
- `tests/` — runs under `bun test`.

Pages compile as an MPA. There is no `pages/` tree, so the compiler's SPA mode
(`--spa`) has nothing to compile and refuses with "SPA mode: needs a pages
directory". Switching to SPA means moving `app/*.html` into `app/pages/`, and
then dealing with three things MPA hides: `vibe()` seeds only missing keys once
booted, so per-page state with colliding names (`props`, `slug`, `title`) leaks
across navigations; `initWs`/`initAuth` in `js/boot.js` are once-per-app but
`boot()` runs per fragment mount; and the `$.on('afterUpdate')` registrations in
the page modules stack per navigation without teardown.

## Running it

```
cd server && bun seed.js   # needs MONGO_CONNECT in server/.env
cd server && bun dev       # websocket on 1337, component source on 8080
bun dev                    # compiler watch + static server on 3000
```

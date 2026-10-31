import gameStack from './seed/game-stack.js';
import written from './seed/vibe.js';
import webdev from './seed/webdev.js';
import { now } from './db.js';
import { defaults, validate } from './props.js';
import { autoTags } from '../app/js/tags.js';

// `bun run seed` seeds the local D1 that `wrangler dev` reads; `bun run seed
// --remote` seeds the deployed one; `bun run seed --preview` seeds
// viberary-preview, the D1 every pull request's preview binds.
const preview = process.argv.includes('--preview');
const database = preview ? 'viberary-preview' : 'viberary';
const target = preview || process.argv.includes('--remote') ? '--remote' : '--local';

// Seeded props go through the same validation a published revision does, so the
// catalogue can never hold a schema the publish event would have refused.
const checked = (components) =>
  components.map((component) => ({
    ...component,
    versions: component.versions.map((version) => ({ ...version, props: validate(version.props) })),
  }));

// Each seeded namespace is replaced whole: its components are written as listed
// here and nothing else is left under it.
const NAMESPACES = [
  { slug: 'vibe', title: 'Vibe', official: 1, components: checked([...written, ...(await gameStack())]) },
  { slug: 'webdev', title: 'Webdev', official: 0, components: checked(webdev) },
];

const literal = (value) => (value == null ? 'NULL' : `'${String(value).replaceAll("'", "''")}'`);

const row = (...cells) => cells.map(literal).join(', ');

const values = (...cells) => `(${row(...cells)})`;

// The seeded namespaces belong to the developer's Google account. Users get a
// fresh id at first sign-in, so the account is seeded by its Google id and the
// namespace points at whatever id that row holds — the login upsert keeps it.
const OWNER = { googleId: '113094163908909945020', email: 'me@korte.kim', name: 'Kim Korte' };

const owner = `(SELECT id FROM users WHERE googleId = ${literal(OWNER.googleId)})`;

const sql = [
  `INSERT INTO users (id, googleId, email, name, createdAt, updatedAt)
   VALUES ${values(crypto.randomUUID(), OWNER.googleId, OWNER.email, OWNER.name, now(), now())}
   ON CONFLICT (googleId) DO NOTHING;`,
  ...NAMESPACES.flatMap(({ slug: namespace, title: author, official, components }) => [
    `INSERT INTO namespaces (slug, title, official, ownerId, createdAt) VALUES (${row(namespace, author, official)}, ${owner}, ${literal(now())})
     ON CONFLICT (slug) DO UPDATE SET title = excluded.title, official = excluded.official, ownerId = excluded.ownerId;`,
    `DELETE FROM revisions WHERE namespace = ${literal(namespace)};`,
    `DELETE FROM components WHERE namespace = ${literal(namespace)};`,
    ...components.flatMap(({ slug, title, description, category, icon, versions }) => [
      `INSERT INTO components (namespace, slug, title, description, category, icon, latest, defaults, createdAt, updatedAt, ownerId)
       VALUES (${row(namespace, slug, title, description, category, icon, versions.length, JSON.stringify(defaults(versions.at(-1).props)), now(), now())}, ${owner});`,
      ...versions.map(
        ({ html, props, notes }, i) =>
          `INSERT INTO revisions (namespace, slug, version, html, props, notes, authorId, authorName, createdAt)
           VALUES ${values(namespace, slug, i + 1, html, JSON.stringify(props), notes, null, author, now())};`,
      ),
      ...autoTags(versions.at(-1)).map((tag) => `INSERT INTO tags (namespace, slug, tag) VALUES ${values(namespace, slug, tag)};`),
    ]),
  ]),
].join('\n');

const file = `${import.meta.dir}/../.wrangler/seed.sql`;

await Bun.write(file, sql);

const exitCode = await Bun.spawn(['wrangler', 'd1', 'execute', database, target, `--file=${file}`], {
  stdio: ['inherit', 'inherit', 'inherit'],
}).exited;

if (exitCode) process.exit(exitCode);

NAMESPACES.forEach(({ slug: namespace, components }) =>
  console.info(`Seeded ${namespace}: ${components.map(({ slug, versions }) => `${slug} through v${versions.length}`).join(', ') || 'no components'}`),
);

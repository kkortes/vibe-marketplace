import gameStack from './seed/game-stack.js';
import written from './seed/vibe.js';
import { now } from './db.js';
import { defaults, validate } from './props.js';

// `bun run seed` seeds the local D1 that `wrangler dev` reads; `bun run seed
// --remote` seeds the deployed one.
const target = process.argv.includes('--remote') ? '--remote' : '--local';

// Seeded props go through the same validation a published revision does, so the
// catalogue can never hold a schema the publish event would have refused.
const catalogue = [...written, ...(await gameStack())].map((component) => ({
  ...component,
  versions: component.versions.map((version) => ({ ...version, props: validate(version.props) })),
}));

const literal = (value) => (value == null ? 'NULL' : `'${String(value).replaceAll("'", "''")}'`);

const values = (...row) => `(${row.map(literal).join(', ')})`;

const sql = [
  `INSERT INTO namespaces (slug, title, official, ownerId, createdAt) VALUES ('vibe', 'Vibe', 1, NULL, ${literal(now())})
   ON CONFLICT (slug) DO UPDATE SET title = 'Vibe', official = 1, ownerId = NULL;`,
  "DELETE FROM revisions WHERE namespace = 'vibe';",
  "DELETE FROM components WHERE namespace = 'vibe';",
  ...catalogue.flatMap(({ slug, title, description, category, icon, versions }) => [
    `INSERT INTO components (namespace, slug, title, description, category, icon, latest, defaults, ownerId, createdAt, updatedAt)
     VALUES ${values('vibe', slug, title, description, category, icon, versions.length, JSON.stringify(defaults(versions.at(-1).props)), null, now(), now())};`,
    ...versions.map(
      ({ html, props, notes }, i) =>
        `INSERT INTO revisions (namespace, slug, version, html, props, notes, authorId, authorName, createdAt)
         VALUES ${values('vibe', slug, i + 1, html, JSON.stringify(props), notes, null, 'Vibe', now())};`,
    ),
  ]),
].join('\n');

const file = `${import.meta.dir}/../.wrangler/seed.sql`;

await Bun.write(file, sql);

const exitCode = await Bun.spawn(['wrangler', 'd1', 'execute', 'viberary', target, `--file=${file}`], {
  stdio: ['inherit', 'inherit', 'inherit'],
}).exited;

if (exitCode) process.exit(exitCode);

catalogue.forEach(({ slug, versions }) => console.info(`Seeded vibe/${slug} through v${versions.length}`));

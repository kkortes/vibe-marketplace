import gameStack from './seed/game-stack.js';
import written from './seed/vibe.js';
import { now, open } from './db.js';
import { defaults, validate } from './props.js';

const db = open();

// Seeded props go through the same validation a published revision does, so the
// catalogue can never hold a schema the publish event would have refused.
const catalogue = [...written, ...(await gameStack())].map((component) => ({
  ...component,
  versions: component.versions.map((version) => ({ ...version, props: validate(version.props) })),
}));

const namespace = db.query(
  `INSERT INTO namespaces (slug, title, official, ownerId, createdAt) VALUES ('vibe', 'Vibe', 1, NULL, $now)
   ON CONFLICT (slug) DO UPDATE SET title = 'Vibe', official = 1, ownerId = NULL`,
);
const component = db.query(
  `INSERT INTO components (namespace, slug, title, description, category, icon, latest, defaults, ownerId, createdAt, updatedAt)
   VALUES ('vibe', $slug, $title, $description, $category, $icon, $latest, $defaults, NULL, $now, $now)`,
);
const revision = db.query(
  `INSERT INTO revisions (namespace, slug, version, html, props, notes, authorId, authorName, createdAt)
   VALUES ('vibe', $slug, $version, $html, $props, $notes, NULL, 'Vibe', $now)`,
);

db.transaction(() => {
  namespace.run({ now: now() });
  db.run("DELETE FROM revisions WHERE namespace = 'vibe'");
  db.run("DELETE FROM components WHERE namespace = 'vibe'");

  catalogue.forEach(({ slug, title, description, category, icon, versions }) => {
    component.run({
      slug,
      title,
      description,
      category,
      icon,
      latest: versions.length,
      defaults: JSON.stringify(defaults(versions.at(-1).props)),
      now: now(),
    });

    versions.forEach(({ html, props, notes }, i) =>
      revision.run({ slug, version: i + 1, html, props: JSON.stringify(props), notes, now: now() }),
    );

    console.info(`Seeded vibe/${slug} through v${versions.length}`);
  });
})();

db.close();

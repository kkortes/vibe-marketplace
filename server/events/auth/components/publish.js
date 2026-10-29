import { now } from '../../../db.js';
import { defaults, validate } from '../../../props.js';
import { slug as slugPattern } from '../../../user.js';

const CATEGORIES = ['Interactive', 'Forms', 'Layout', 'Navigation', 'Feedback'];

// Publishing only ever inserts. A revision that exists is frozen — the way to
// change a component is to publish the next version of it.
export default async (
  { namespace, slug, title, description, category, icon, html, props = [], notes = '' },
  { db, identity },
) => {
  if (!slugPattern.test(String(slug))) throw Error('A slug is lowercase words joined by dashes');
  if (!String(title).trim()) throw Error('A component needs a title');
  if (!String(html).trim()) throw Error('A component needs markup');
  if (!CATEGORIES.includes(category)) throw Error(`Category must be one of ${CATEGORIES.join(', ')}`);

  const schema = validate(props);

  const owner = db.query('SELECT ownerId FROM namespaces WHERE slug = $namespace').get({ namespace });

  if (!owner) throw Error(`No namespace ${namespace}`);
  if (owner.ownerId !== identity.id) throw Error(`${namespace} is not yours to publish to`);

  const existing = db
    .query('SELECT ownerId FROM components WHERE namespace = $namespace AND slug = $slug')
    .get({ namespace, slug });

  if (existing && existing.ownerId !== identity.id)
    throw Error(`${namespace}/${slug} belongs to someone else`);

  // The bump and the insert land together or not at all, so `latest` never
  // names a revision that was not written.
  const version = db.transaction(() => {
    const { latest } = db
      .query(
        `INSERT INTO components (namespace, slug, title, description, category, icon, latest, defaults, ownerId, createdAt, updatedAt)
         VALUES ($namespace, $slug, $title, $description, $category, $icon, 1, $defaults, $ownerId, $now, $now)
         ON CONFLICT (namespace, slug) DO UPDATE SET latest = latest + 1, title = $title, description = $description,
           category = $category, icon = $icon, defaults = $defaults, updatedAt = $now
         RETURNING latest`,
      )
      .get({
        namespace,
        slug,
        title,
        description,
        category,
        icon,
        defaults: JSON.stringify(defaults(schema)),
        ownerId: identity.id,
        now: now(),
      });

    db.query(
      `INSERT INTO revisions (namespace, slug, version, html, props, notes, authorId, authorName, createdAt)
       VALUES ($namespace, $slug, $version, $html, $props, $notes, $authorId, $authorName, $createdAt)`,
    ).run({
      namespace,
      slug,
      version: latest,
      html,
      props: JSON.stringify(schema),
      notes,
      authorId: identity.id,
      authorName: identity.name,
      createdAt: now(),
    });

    return latest;
  })();

  return { namespace, slug, version };
};

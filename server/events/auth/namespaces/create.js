import { namespace as decode, now } from '../../../db.js';
import { slug as slugPattern } from '../../../user.js';

const RESERVED = ['vibe', 'stylecheat', 'codie', 'api', 'docs', 'admin', 'modules', 'js', 'css'];

export default async ({ slug, title }, { db, identity }) => {
  if (!slugPattern.test(String(slug))) throw Error('A namespace is lowercase words joined by dashes');
  if (RESERVED.includes(slug)) throw Error(`${slug} is reserved`);

  const taken = db.query('SELECT 1 FROM namespaces WHERE slug = $slug').get({ slug });
  if (taken) throw Error(`${slug} is taken`);

  return decode(
    db
      .query(
        'INSERT INTO namespaces (slug, title, official, ownerId, createdAt) VALUES ($slug, $title, 0, $ownerId, $createdAt) RETURNING *',
      )
      .get({ slug, title: String(title).trim() || slug, ownerId: identity.id, createdAt: now() }),
  );
};

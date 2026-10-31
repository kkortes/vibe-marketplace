import { namespace as decode, now } from '../../../db.js';
import { slug as slugPattern } from '../../../user.js';

const RESERVED = ['vibe', 'stylecheat', 'codie', 'api', 'docs', 'admin', 'modules', 'js', 'css', 'images', 'component', 'components', 'namespace', 'tag'];

export default async ({ slug, title }, { db, identity }) => {
  if (!slugPattern.test(String(slug))) throw Error('A namespace is lowercase words joined by dashes');
  if (RESERVED.includes(slug)) throw Error(`${slug} is reserved`);

  const taken = await db.prepare('SELECT 1 FROM namespaces WHERE slug = ?').bind(slug).first();
  if (taken) throw Error(`${slug} is taken`);

  return decode(
    await db
      .prepare('INSERT INTO namespaces (slug, title, official, ownerId, createdAt) VALUES (?, ?, 0, ?, ?) RETURNING *')
      .bind(slug, title?.trim() || slug, identity.id, now())
      .first(),
  );
};

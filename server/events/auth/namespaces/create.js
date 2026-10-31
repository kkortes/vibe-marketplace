import { namespace as decode, now } from '../../../db.js';
import { slug as slugPattern } from '../../../user.js';

const RESERVED = ['vibe', 'stylecheat', 'codie', 'api', 'docs', 'admin', 'modules', 'js', 'css', 'images', 'component', 'components', 'namespace', 'tag'];

export default async ({ slug, title, unlisted = false }, { db, identity }) => {
  if (!slugPattern.test(String(slug))) throw Error('A namespace is lowercase words joined by dashes');
  if (RESERVED.includes(slug)) throw Error(`${slug} is reserved`);

  const taken = await db.prepare('SELECT 1 FROM namespaces WHERE slug = ?').bind(slug).first();
  if (taken) throw Error(`${slug} is taken`);

  // The limit is read from the row rather than the session, so raising it takes
  // effect without signing in again.
  const { owned, allowed } = await db
    .prepare('SELECT (SELECT COUNT(*) FROM namespaces WHERE ownerId = ?1) AS owned, namespaceCount AS allowed FROM users WHERE id = ?1')
    .bind(identity.id)
    .first();
  if (owned >= allowed) throw Error(`Your account may own ${allowed} ${allowed === 1 ? 'namespace' : 'namespaces'}`);

  return decode(
    await db
      .prepare('INSERT INTO namespaces (slug, title, official, unlisted, ownerId, createdAt) VALUES (?, ?, 0, ?, ?, ?) RETURNING *')
      .bind(slug, title?.trim() || slug, unlisted ? 1 : 0, identity.id, now())
      .first(),
  );
};

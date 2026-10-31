import { namespace as decode, now } from '../../../db.js';
import { slug as slugPattern } from '../../../user.js';

const RESERVED = ['vibe', 'stylecheat', 'codie', 'api', 'docs', 'admin', 'modules', 'js', 'css', 'component', 'components', 'namespace', 'tag'];

export default async ({ slug, title }, { db, identity }) => {
  if (!slugPattern.test(String(slug))) throw Error('A namespace is lowercase words joined by dashes');
  if (RESERVED.includes(slug)) throw Error(`${slug} is reserved`);

  const taken = await db.prepare('SELECT 1 FROM namespaces WHERE slug = ?').bind(slug).first();
  if (taken) throw Error(`${slug} is taken`);

  // The cap is read in the same statement as the insert, so two creates at once
  // cannot both slip under it.
  const created = await db
    .prepare(
      `INSERT INTO namespaces (slug, title, official, ownerId, createdAt)
       SELECT ?1, ?2, 0, ?3, ?4 FROM users
       WHERE id = ?3 AND namespaceCount > (SELECT count(*) FROM namespaces WHERE ownerId = ?3)
       RETURNING *`,
    )
    .bind(slug, title?.trim() || slug, identity.id, now())
    .first();

  if (!created) throw Error('You own as many namespaces as your account allows');

  return { ...decode(created), components: 0 };
};

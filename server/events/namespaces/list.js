import { namespace } from '../../db.js';

export default async (_, { db }) =>
  (await db.prepare('SELECT slug, title, official, unlisted, ownerId FROM namespaces ORDER BY official DESC, slug').all()).results.map(
    namespace,
  );

import { namespace } from '../../../db.js';

export default async (_, { db, identity }) =>
  (
    await db.prepare('SELECT slug, title, official, unlisted FROM namespaces WHERE ownerId = ? ORDER BY slug').bind(identity.id).all()
  ).results.map(namespace);

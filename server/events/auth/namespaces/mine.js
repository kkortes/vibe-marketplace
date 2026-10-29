import { namespace } from '../../../db.js';

export default async (_, { db, identity }) =>
  db
    .query('SELECT slug, title, official FROM namespaces WHERE ownerId = $ownerId ORDER BY slug')
    .all({ ownerId: identity.id })
    .map(namespace);

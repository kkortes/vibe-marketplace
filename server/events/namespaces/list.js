import { namespace } from '../../db.js';

export default async (_, { db }) =>
  db
    .query('SELECT slug, title, official, ownerId FROM namespaces ORDER BY official DESC, slug')
    .all()
    .map(namespace);

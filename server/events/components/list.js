import { tagged } from '../../db.js';

// Every published component, readable by anyone. The catalogue is small enough
// to hand over whole, so search and filtering stay instant on the client.
export default async (_, { db }) =>
  (
    await db
      .prepare(
        `SELECT namespace, slug, title, description, category, icon, latest, defaults, updatedAt,
           (SELECT json_group_array(tag) FROM tags WHERE tags.namespace = components.namespace AND tags.slug = components.slug) AS tags
         FROM components WHERE latest > 0 ORDER BY namespace, slug`,
      )
      .all()
  ).results.map(tagged);

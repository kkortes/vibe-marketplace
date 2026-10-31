import { tagged } from '../../db.js';

// Published components, readable by anyone. The catalogue is small enough to
// hand over whole, so search and filtering stay instant on the client. Asked
// for one namespace, it lists that namespace whether listed or not; asked for
// none, it is the frontpage's catalogue, which leaves unlisted namespaces out.
export default async (query, { db }) =>
  (
    await db
      .prepare(
        `SELECT namespace, components.slug, components.title, description, category, icon, latest, defaults, updatedAt,
           (SELECT json_group_array(tag) FROM tags WHERE tags.namespace = components.namespace AND tags.slug = components.slug) AS tags
         FROM components JOIN namespaces ON namespaces.slug = components.namespace
         WHERE latest > 0 AND (?1 IS NULL AND unlisted = 0 OR namespace = ?1)
         ORDER BY namespace, components.slug`,
      )
      .bind(query?.namespace ?? null)
      .all()
  ).results.map(tagged);

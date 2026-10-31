import { namespace } from '../../../db.js';

export default async (_, { db, identity }) =>
  (
    await db
      .prepare(
        `SELECT namespaces.slug, namespaces.title, namespaces.official, namespaces.unlisted, count(components.slug) AS components FROM namespaces
         LEFT JOIN components ON components.namespace = namespaces.slug
         WHERE namespaces.ownerId = ? GROUP BY namespaces.slug ORDER BY namespaces.slug`,
      )
      .bind(identity.id)
      .all()
  ).results.map(namespace);

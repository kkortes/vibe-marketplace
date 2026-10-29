import { component } from '../../db.js';

// Every published component, readable by anyone. The catalogue is small enough
// to hand over whole, so search and filtering stay instant on the client.
export default async (_, { db }) =>
  (
    await db
      .prepare(
        'SELECT namespace, slug, title, description, category, icon, latest, defaults, updatedAt FROM components WHERE latest > 0 ORDER BY namespace, slug',
      )
      .all()
  ).results.map(component);

import { catalogue, tagged } from '../../db.js';

// Published components, readable by anyone. The catalogue is small enough to
// hand over whole, so search and filtering stay instant on the client. Asked
// for one namespace, it lists that namespace whether listed or not; asked for
// none, it is the frontpage's catalogue, which leaves unlisted namespaces out.
export default async (query, { db }) =>
  (
    await db
      .prepare(catalogue('?1 IS NULL AND namespaces.unlisted = 0 OR components.namespace = ?1'))
      .bind(query?.namespace ?? null)
      .all()
  ).results.map(tagged);

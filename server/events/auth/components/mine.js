import { catalogue, tagged } from '../../../db.js';

// The published components in every namespace the caller owns, unlisted ones
// included, for the namespace tabs on /components.
export default async (_, { db, identity }) =>
  (await db.prepare(catalogue('namespaces.ownerId = ?')).bind(identity.id).all()).results.map(tagged);

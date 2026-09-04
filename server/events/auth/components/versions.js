// Under auth/, so a session is what buys the history. Rendering a component
// never needs one.
export default async ({ namespace, slug }, { mongo }) =>
  mongo
    .collection('revisions')
    .find(
      { namespace, slug },
      { projection: { _id: 0, version: 1, notes: 1, authorName: 1, createdAt: 1 } },
    )
    .sort({ version: -1 })
    .toArray();

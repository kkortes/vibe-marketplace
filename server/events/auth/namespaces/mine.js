export default async (_, { mongo, identity }) =>
  mongo
    .collection('namespaces')
    .find(
      { ownerId: identity.id },
      { projection: { _id: 0, slug: 1, title: 1, official: 1 } },
    )
    .sort({ slug: 1 })
    .toArray();

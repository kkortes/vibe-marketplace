export default async (_, { mongo }) =>
  mongo
    .collection('namespaces')
    .find({}, { projection: { _id: 0, slug: 1, title: 1, official: 1, ownerId: 1 } })
    .sort({ official: -1, slug: 1 })
    .toArray();

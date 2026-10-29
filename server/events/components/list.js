// Every published component, readable by anyone. The catalogue is small enough
// to hand over whole, so search and filtering stay instant on the client.
export default async (_, { mongo }) =>
  mongo
    .collection('components')
    .find(
      { latest: { $gt: 0 } },
      {
        projection: {
          _id: 0,
          namespace: 1,
          slug: 1,
          title: 1,
          description: 1,
          category: 1,
          icon: 1,
          latest: 1,
          defaults: 1,
          updatedAt: 1,
        },
      },
    )
    .sort({ namespace: 1, slug: 1 })
    .toArray();

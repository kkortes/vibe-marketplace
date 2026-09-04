// A published revision is frozen: the unique index is what makes a second
// write to the same version an error rather than an edit.
export default async (mongo) => {
  await mongo.collection('namespaces').createIndex({ slug: 1 }, { unique: true });
  await mongo.collection('components').createIndex({ namespace: 1, slug: 1 }, { unique: true });
  await mongo.collection('revisions').createIndex({ namespace: 1, slug: 1, version: 1 }, { unique: true });
  await mongo.collection('sessions').createIndex({ token: 1 }, { unique: true });
  await mongo.collection('sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
};

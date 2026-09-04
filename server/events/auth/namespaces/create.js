import { slug as slugPattern } from '../../../user.js';

const RESERVED = ['vibe', 'stylecheat', 'codie', 'api', 'docs', 'admin', 'modules', 'js', 'css'];

export default async ({ slug, title }, { mongo, identity }) => {
  if (!slugPattern.test(String(slug))) throw Error('A namespace is lowercase words joined by dashes');
  if (RESERVED.includes(slug)) throw Error(`${slug} is reserved`);

  const taken = await mongo.collection('namespaces').findOne({ slug });
  if (taken) throw Error(`${slug} is taken`);

  const namespace = {
    slug,
    title: String(title).trim() || slug,
    official: false,
    ownerId: identity.id,
    createdAt: new Date(),
  };

  await mongo.collection('namespaces').insertOne(namespace);

  const { _id, ...created } = namespace;
  return created;
};

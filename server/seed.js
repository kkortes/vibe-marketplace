import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

import createIndexes from './indexes.js';
import components from './seed/vibe.js';
import { defaults } from './props.js';

dotenv.config();

const client = new MongoClient(process.env.MONGO_CONNECT);
await client.connect();

const mongo = client.db('vibe-marketplace');

await createIndexes(mongo);

await mongo.collection('namespaces').updateOne(
  { slug: 'vibe' },
  {
    $set: { title: 'Vibe', official: true, ownerId: null },
    $setOnInsert: { createdAt: new Date() },
  },
  { upsert: true },
);

await mongo.collection('components').deleteMany({ namespace: 'vibe' });
await mongo.collection('revisions').deleteMany({ namespace: 'vibe' });

for (const { slug, title, description, category, icon, versions } of components) {
  await mongo.collection('components').insertOne({
    namespace: 'vibe',
    slug,
    title,
    description,
    category,
    icon,
    latest: versions.length,
    defaults: defaults(versions.at(-1).props),
    ownerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await mongo.collection('revisions').insertMany(
    versions.map(({ html, props, notes }, i) => ({
      namespace: 'vibe',
      slug,
      version: i + 1,
      html: html.trim(),
      props,
      notes,
      authorId: null,
      authorName: 'Vibe',
      createdAt: new Date(),
    })),
  );

  console.info(`Seeded vibe/${slug} through v${versions.length}`);
}

await client.close();

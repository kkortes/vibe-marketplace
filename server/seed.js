import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

import createIndexes from './indexes.js';
import gameStack from './seed/game-stack.js';
import written from './seed/vibe.js';
import { defaults, validate } from './props.js';

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

// Seeded props go through the same validation a published revision does, so the
// catalogue can never hold a schema the publish event would have refused.
const catalogue = [...written, ...(await gameStack())].map((component) => ({
  ...component,
  versions: component.versions.map((version) => ({ ...version, props: validate(version.props) })),
}));

for (const { slug, title, description, category, icon, versions } of catalogue) {
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
      html,
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

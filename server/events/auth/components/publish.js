import { defaults, validate } from '../../../props.js';
import { slug as slugPattern } from '../../../user.js';

const CATEGORIES = ['Interactive', 'Forms', 'Layout', 'Navigation', 'Feedback'];

// Publishing only ever inserts. A revision that exists is frozen — the way to
// change a component is to publish the next version of it.
export default async (
  { namespace, slug, title, description, category, icon, html, props = [], notes = '' },
  { mongo, identity },
) => {
  if (!slugPattern.test(String(slug))) throw Error('A slug is lowercase words joined by dashes');
  if (!String(title).trim()) throw Error('A component needs a title');
  if (!String(html).trim()) throw Error('A component needs markup');
  if (!CATEGORIES.includes(category)) throw Error(`Category must be one of ${CATEGORIES.join(', ')}`);

  const schema = validate(props);

  const owner = await mongo.collection('namespaces').findOne({ slug: namespace });

  if (!owner) throw Error(`No namespace ${namespace}`);
  if (owner.ownerId !== identity.id) throw Error(`${namespace} is not yours to publish to`);

  const existing = await mongo.collection('components').findOne({ namespace, slug });

  if (existing && existing.ownerId !== identity.id)
    throw Error(`${namespace}/${slug} belongs to someone else`);

  const component = await mongo.collection('components').findOneAndUpdate(
    { namespace, slug },
    {
      $inc: { latest: 1 },
      $set: { title, description, category, icon, defaults: defaults(schema), updatedAt: new Date() },
      $setOnInsert: { namespace, slug, ownerId: identity.id, createdAt: new Date() },
    },
    { upsert: true, returnDocument: 'after' },
  );

  await mongo.collection('revisions').insertOne({
    namespace,
    slug,
    version: component.latest,
    html,
    props: schema,
    notes,
    authorId: identity.id,
    authorName: identity.name,
    createdAt: new Date(),
  });

  return { namespace, slug, version: component.latest };
};

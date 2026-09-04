// Public: anyone may read and render any published component, at latest or at
// a pinned version. Only the version *history* asks for a session.
export default async ({ namespace, slug, version }, { mongo }) => {
  const component = await mongo
    .collection('components')
    .findOne({ namespace, slug }, { projection: { _id: 0, ownerId: 0 } });

  if (!component) throw Error(`No component ${namespace}/${slug}`);

  const revision = await mongo
    .collection('revisions')
    .findOne(
      { namespace, slug, version: version || component.latest },
      { projection: { _id: 0, namespace: 0, slug: 0 } },
    );

  if (!revision) throw Error(`No version ${version} of ${namespace}/${slug}`);

  return { ...component, revision };
};

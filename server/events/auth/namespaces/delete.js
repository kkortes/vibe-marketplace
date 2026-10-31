// Only an empty namespace goes: once a component is published in it, its
// revisions are frozen addresses under its slug.
export default async ({ slug }, { db, identity }) => {
  const deleted = await db
    .prepare(
      'DELETE FROM namespaces WHERE slug = ?1 AND ownerId = ?2 AND NOT EXISTS (SELECT 1 FROM components WHERE namespace = ?1) RETURNING slug',
    )
    .bind(slug, identity.id)
    .first();

  if (!deleted) throw Error(`${slug} is not an empty namespace of yours`);

  return deleted;
};

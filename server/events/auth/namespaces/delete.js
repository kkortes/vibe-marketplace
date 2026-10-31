// A namespace is part of every address published under it, so only one that
// never published can go.
export default async ({ slug }, { db, identity }) => {
  const found = await db
    .prepare('SELECT ownerId, (SELECT COUNT(*) FROM components WHERE namespace = ?1) AS published FROM namespaces WHERE slug = ?1')
    .bind(slug)
    .first();

  if (!found) throw Error(`No namespace ${slug}`);
  if (found.ownerId !== identity.id) throw Error(`${slug} is not yours to delete`);
  if (found.published) throw Error(`${slug} has published components and can no longer be deleted`);

  await db.prepare('DELETE FROM namespaces WHERE slug = ?').bind(slug).run();

  return { slug };
};

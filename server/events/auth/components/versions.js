// Under auth/, so a session is what buys the history. Rendering a component
// never needs one.
export default async ({ namespace, slug }, { db }) =>
  (
    await db
      .prepare(
        'SELECT version, notes, authorName, createdAt FROM revisions WHERE namespace = ? AND slug = ? ORDER BY version DESC',
      )
      .bind(namespace, slug)
      .all()
  ).results;

// Under auth/, so a session is what buys the history. Rendering a component
// never needs one.
export default async ({ namespace, slug }, { db }) =>
  db
    .query(
      'SELECT version, notes, authorName, createdAt FROM revisions WHERE namespace = $namespace AND slug = $slug ORDER BY version DESC',
    )
    .all({ namespace, slug });

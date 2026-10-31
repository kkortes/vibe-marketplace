// The four most common auto tags and the four most common user tags, counted
// in the database so the answer costs the same at ten components or ten
// thousand. Like the frontpage they filter, they leave unlisted namespaces out.
// Stylecheat is no row in tags but a published component's saved styling.
export default async (_, { db }) => {
  const [auto, user] = await db.batch([
    db.prepare(
      `SELECT tag FROM (
         SELECT namespace, tag FROM tags
         UNION ALL SELECT namespace, 'Stylecheat' FROM components WHERE latest > 0 AND styling = 'stylecheat'
       ) AS auto JOIN namespaces ON namespaces.slug = auto.namespace WHERE unlisted = 0 GROUP BY tag ORDER BY COUNT(*) DESC, tag LIMIT 4`,
    ),
    db.prepare(
      'SELECT category AS tag FROM components JOIN namespaces ON namespaces.slug = components.namespace WHERE latest > 0 AND unlisted = 0 GROUP BY category ORDER BY COUNT(*) DESC, category LIMIT 4',
    ),
  ]);

  return { auto: auto.results.map(({ tag }) => tag), user: user.results.map(({ tag }) => tag) };
};

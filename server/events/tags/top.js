// The four most common auto tags and the four most common user tags, counted
// in the database so the answer costs the same at ten components or ten
// thousand.
export default async (_, { db }) => {
  const [auto, user] = await db.batch([
    db.prepare('SELECT tag FROM tags GROUP BY tag ORDER BY COUNT(*) DESC, tag LIMIT 4'),
    db.prepare(
      'SELECT category AS tag FROM components WHERE latest > 0 GROUP BY category ORDER BY COUNT(*) DESC, category LIMIT 4',
    ),
  ]);

  return { auto: auto.results.map(({ tag }) => tag), user: user.results.map(({ tag }) => tag) };
};

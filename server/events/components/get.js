import { component as decodeComponent, revision as decodeRevision } from '../../db.js';

// Public: anyone may read and render any published component, at latest or at
// a pinned version. Only the version *history* asks for a session.
export default async ({ namespace, slug, version }, { db }) => {
  const component = decodeComponent(
    db
      .query(
        'SELECT namespace, slug, title, description, category, icon, latest, defaults, createdAt, updatedAt FROM components WHERE namespace = $namespace AND slug = $slug',
      )
      .get({ namespace, slug }),
  );

  if (!component) throw Error(`No component ${namespace}/${slug}`);

  const revision = decodeRevision(
    db
      .query(
        'SELECT version, html, props, notes, authorId, authorName, createdAt FROM revisions WHERE namespace = $namespace AND slug = $slug AND version = $version',
      )
      .get({ namespace, slug, version: version || component.latest }),
  );

  if (!revision) throw Error(`No version ${version} of ${namespace}/${slug}`);

  return { ...component, revision };
};

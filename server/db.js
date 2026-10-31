import { TAGS, stylingTags } from '../app/js/tags.js';

// The schema lives in ./migrations and is applied by `wrangler d1 migrations
// apply`. D1 enforces foreign keys on its own.
//
// SQLite has no booleans or nested values, so those columns are decoded on the
// way out into the shapes the client has always received.
export const component = (row) => row && { ...row, defaults: JSON.parse(row.defaults) };

// Tags come back from json_group_array in no particular order, so they are put
// back in the order the component page lists them. The tags table holds what
// is read off the markup; the Stylecheat tag comes from the saved styling.
export const tagged = (row) => {
  const tags = [...JSON.parse(row.tags), ...stylingTags(row.styling)];
  return { ...component(row), tags: TAGS.filter((tag) => tags.includes(tag)) };
};

export const revision = (row) => row && { ...row, props: JSON.parse(row.props) };

export const namespace = (row) => ({ ...row, official: !!row.official, unlisted: !!row.unlisted });

export const now = () => new Date().toISOString();

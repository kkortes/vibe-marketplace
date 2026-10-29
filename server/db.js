// The schema lives in ./migrations and is applied by `wrangler d1 migrations
// apply`. D1 enforces foreign keys on its own.
//
// SQLite has no booleans or nested values, so those columns are decoded on the
// way out into the shapes the client has always received.
export const component = (row) => row && { ...row, defaults: JSON.parse(row.defaults) };

export const revision = (row) => row && { ...row, props: JSON.parse(row.props) };

export const namespace = (row) => ({ ...row, official: !!row.official });

export const now = () => new Date().toISOString();

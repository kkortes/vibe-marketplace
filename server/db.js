import { Database } from 'bun:sqlite';

// A published revision is frozen: the unique key on (namespace, slug, version)
// is what makes a second write to the same version an error rather than an edit.
const SCHEMA = `
  CREATE TABLE IF NOT EXISTS namespaces (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    official INTEGER NOT NULL DEFAULT 0,
    ownerId TEXT,
    createdAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS components (
    namespace TEXT NOT NULL REFERENCES namespaces(slug),
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    icon TEXT,
    latest INTEGER NOT NULL,
    defaults TEXT NOT NULL,
    ownerId TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    PRIMARY KEY (namespace, slug)
  );
  CREATE TABLE IF NOT EXISTS revisions (
    namespace TEXT NOT NULL,
    slug TEXT NOT NULL,
    version INTEGER NOT NULL,
    html TEXT NOT NULL,
    props TEXT NOT NULL,
    notes TEXT NOT NULL,
    authorId TEXT,
    authorName TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    PRIMARY KEY (namespace, slug, version),
    FOREIGN KEY (namespace, slug) REFERENCES components(namespace, slug)
  );
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    googleId TEXT NOT NULL UNIQUE,
    email TEXT,
    name TEXT,
    picture TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expiresAt INTEGER NOT NULL
  )
`;

export const open = (filename = `${import.meta.dir}/vibe-marketplace.sqlite`) => {
  const db = new Database(filename, { create: true, strict: true });

  db.run('PRAGMA journal_mode = WAL');
  db.run('PRAGMA foreign_keys = ON');
  SCHEMA.split(';').forEach((statement) => db.run(statement));

  return db;
};

// SQLite has no booleans or nested values, so those columns are decoded on the
// way out into the shapes the client has always received.
export const component = (row) => row && { ...row, defaults: JSON.parse(row.defaults) };

export const revision = (row) => row && { ...row, props: JSON.parse(row.props) };

export const namespace = (row) => ({ ...row, official: !!row.official });

export const now = () => new Date().toISOString();

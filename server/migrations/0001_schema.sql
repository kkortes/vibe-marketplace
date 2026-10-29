-- A published revision is frozen: the primary key on (namespace, slug, version)
-- is what makes a second write to the same version an error rather than an edit.
CREATE TABLE namespaces (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  official INTEGER NOT NULL DEFAULT 0,
  ownerId TEXT,
  createdAt TEXT NOT NULL
);

CREATE TABLE components (
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

CREATE TABLE revisions (
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

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  googleId TEXT NOT NULL UNIQUE,
  email TEXT,
  name TEXT,
  picture TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE sessions (
  token TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expiresAt INTEGER NOT NULL
);

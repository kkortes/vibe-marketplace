-- How many namespaces a user may own. Raised by hand, per user, in the database.
ALTER TABLE users ADD COLUMN namespaceCount INTEGER NOT NULL DEFAULT 1;

-- An example for each event a revision listens for, keyed by its name: the
-- detail a custom event carries, or the init a keyboard event is built from.
-- The component page sends it to try the listener out.
ALTER TABLE revisions ADD COLUMN events TEXT NOT NULL DEFAULT '{}';

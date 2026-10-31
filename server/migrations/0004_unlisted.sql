-- An unlisted namespace keeps its components off the frontpage; they still
-- render at their addresses and list on the namespace's own page.
ALTER TABLE namespaces ADD COLUMN unlisted INTEGER NOT NULL DEFAULT 0;

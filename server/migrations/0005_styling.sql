-- How a component expects to be styled where it lands: 'inline' carries its own
-- styles, 'stylecheat' assumes Stylecheat on the consumer's page. Its owner
-- picks it on the component page.
ALTER TABLE components ADD COLUMN styling TEXT NOT NULL DEFAULT 'inline';

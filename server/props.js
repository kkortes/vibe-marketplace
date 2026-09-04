// `json` is the type for a prop an attribute cannot spell: an array or an
// object. It is passed by binding rather than as a literal, which is what the
// docs and the copyable snippet both show.
const TYPES = ['text', 'number', 'boolean', 'select', 'json'];

// The frozen truth about props lives on the revision. `defaults` is the copy
// the catalogue carries, so a card can render a live preview without fetching
// a revision per card.
export const defaults = (props = []) =>
  Object.fromEntries(props.map(({ name, default: value }) => [name, value]));

export const validate = (props) => {
  if (!Array.isArray(props)) throw Error('Props must be a list');

  return props.map(({ name, type, default: value, description = '', options = [] }) => {
    // An attribute name is lowercased by the HTML parser, and vibe matches prop
    // names case-insensitively, so camelCase is a real and common way to write
    // one. What an attribute genuinely cannot carry is whitespace.
    if (!/^[a-z][a-zA-Z0-9-]*$/.test(String(name)))
      throw Error(`"${name}" is not a usable prop name — start lowercase, then letters, digits or dashes`);

    if (!TYPES.includes(type)) throw Error(`Prop "${name}" needs a type: ${TYPES.join(', ')}`);

    if (type === 'select' && !options.length)
      throw Error(`Prop "${name}" is a select and needs options`);

    if (type === 'json' && (value === null || typeof value !== 'object'))
      throw Error(`Prop "${name}" is json and needs an array or object default`);

    return { name, type, default: value, description, ...(type === 'select' && { options }) };
  });
};

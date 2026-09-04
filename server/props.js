const TYPES = ['text', 'number', 'boolean', 'select'];

// The frozen truth about props lives on the revision. `defaults` is the copy
// the catalogue carries, so a card can render a live preview without fetching
// a revision per card.
export const defaults = (props = []) =>
  Object.fromEntries(props.map(({ name, default: value }) => [name, value]));

export const validate = (props) => {
  if (!Array.isArray(props)) throw Error('Props must be a list');

  return props.map(({ name, type, default: value, description = '', options = [] }) => {
    if (!/^[a-z][a-z0-9-]*$/.test(String(name)))
      throw Error(`"${name}" is not a usable prop name — lowercase letters, digits and dashes`);

    if (!TYPES.includes(type)) throw Error(`Prop "${name}" needs a type: ${TYPES.join(', ')}`);

    if (type === 'select' && !options.length)
      throw Error(`Prop "${name}" is a select and needs options`);

    return { name, type, default: value, description, ...(type === 'select' && { options }) };
  });
};

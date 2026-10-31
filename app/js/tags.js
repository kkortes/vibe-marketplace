// Auto tags are read off a revision's markup, so they describe what the code
// does rather than what its author says it does.

const scripts = (html) => [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(([, code]) => code);

// The object handed to component(), braces and all, found by depth rather
// than a regex so nested objects stay inside it.
const stateOf = (code) => {
  const start = code.indexOf('component({');
  if (start < 0) return '';
  const open = start + 'component('.length;
  let depth = 0;
  for (let i = open; i < code.length; i++) {
    depth += code[i] === '{' ? 1 : code[i] === '}' ? -1 : 0;
    if (!depth) return code.slice(open, i + 1);
  }
  return code.slice(open);
};

const logic = /=>|\bfunction\b|\w+\s*\([^)]*\)\s*\{/;

// Script beyond importing vibe and handing component() plain data.
const js = (html) =>
  scripts(html).some((code) => {
    const state = stateOf(code);
    const rest = code
      .replace(/^\s*import\s[^;]*['"]@ape-egg\/vibe[^'"]*['"];?\s*$/gm, '')
      .replace(`component(${state});`, '')
      .replace(`component(${state})`, '')
      .trim();
    return Boolean(rest) || logic.test(state);
  });

// Anything assigned to or stepped on `this` is state that changes at runtime.
const state = (html) => /this\.\w+\s*(?:[-+*/]?=(?!=)|\+\+|--)|(?:\+\+|--)this\.\w+/.test(html);

// The state's own level, with whatever sits inside a nested bracket emptied,
// so a key's value reads `() => …` or `() {}` whatever it holds.
const surface = (state) => {
  let depth = 0;
  return [...state]
    .filter((char) => {
      const opens = '{[('.includes(char);
      const closes = '}])'.includes(char);
      depth += opens - closes;
      return depth < 2 || (opens && depth === 2);
    })
    .join('');
};

// Functions handed to component() land on the component's state at `$[id]`,
// where the page it is used in can call them.
export const functions = (html) =>
  scripts(html).flatMap((code) =>
    [...surface(stateOf(code)).matchAll(/[{,]\s*(?:async\s+)?(\w+)\s*(?:\(\)\s*\{|:\s*(?:async\s*)?(?:function\b|\(\)\s*=>|\w+\s*=>))/g)].map(([, name]) => name),
  );

const styled = (html) => /<style[\s>]|\sstyle=/.test(html);

export const TAGS = ['Props', 'State', 'JS', 'Functions', 'CSS', 'Stylecheat'];

// User tags: the category an author files a component under.
export const CATEGORIES = ['Interactive', 'Forms', 'Layout', 'Navigation', 'Feedback', 'Game'];

export const autoTags = ({ html, props }) =>
  [
    props?.length && 'Props',
    state(html) && 'State',
    js(html) && 'JS',
    functions(html).length && 'Functions',
    !styled(html) && 'CSS',
  ].filter(Boolean);

// Stylecheat is a promise about the page a component lands in, not something
// read off its markup, so its tag rides on the component's saved styling.
export const stylingTags = (styling) => (styling === 'stylecheat' ? ['Stylecheat'] : []);

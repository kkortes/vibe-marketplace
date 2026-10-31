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

const styled = (html) => /<style[\s>]|\sstyle=/.test(html);

export const TAGS = ['Props', 'State', 'JS', 'CSS'];

// User tags: the category an author files a component under.
export const CATEGORIES = ['Interactive', 'Forms', 'Layout', 'Navigation', 'Feedback'];

export const autoTags = ({ html, props }) =>
  [
    props?.length && 'Props',
    state(html) && 'State',
    js(html) && 'JS',
    !styled(html) && 'CSS',
  ].filter(Boolean);

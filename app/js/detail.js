import codie from '/modules/@ape-egg/codie/codie.js';

import { SOURCE_URL } from '/js/env.js';
import { address, source } from '/js/pin.js';
import { call } from '/js/ws.js';

// The Worker serves this page at the component's own address, /<namespace>/<slug>.
const params = new URLSearchParams(location.search);
const [namespace, slug] = location.pathname.slice(1).split('/');

const readable = (value) => JSON.stringify(value, null, 2);

// The version in view lives in the hash as #v<n>, the form a pinned address
// carries; a bare #<n> is read too. No hash means the latest.
const hashed = () => Number(location.hash.match(/^#v?(\d+)$/)?.[1]) || 0;

// Which props a component takes is the thing being documented, so the attribute
// *names* on the tag are data. That is the one place the page writes markup
// instead of templating it — every value on it stays bound to `values`, so
// editing a prop in the docs re-renders the component and nothing else.
const mount = () => {
  const attrs = window.$.props.map(({ name }) => `${name}="@[values.${name}]"`).join(' ');

  document.querySelector('preview-host').innerHTML =
    `<component src="${window.$.previewSource}" ${attrs}></component>`;
};

let editor;
let draft;

// The code view renders through the same `<component src>` as the published
// revision, from a blob of whatever is in the editor.
const preview = (html) => {
  draft && URL.revokeObjectURL(draft);
  draft = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  window.$.previewSource = draft;
  mount();
};

const attach = (html) => {
  editor ??= codie('codie');
  editor.editable = true;
  editor.numberedRows = true;
  editor.code = html;
  editor.onEdit = ({ raw }) => preview(raw);
};

export const state = {
  namespace,
  slug,
  component: null,
  revision: null,
  props: [],
  values: {},
  drafts: {},
  invalid: {},
  version: 0,
  versions: [],
  previewSource: '',
  pinned: false,
  missing: '',
  origin: SOURCE_URL,
  coding: false,
  // Newest first: the strip lays them out reversed, so it reads 1 to latest and
  // opens scrolled to the latest.
  tabs: [],

  showing() {
    return this.version || this.component?.latest || 0;
  },

  outdated() {
    return this.component && this.showing() < this.component.latest;
  },

  // A boolean prop is carried the way HTML carries one — the attribute is there
  // or it is not; dismissable="false" would read as true. An array or an object
  // has no literal form an attribute can hold, so it is shown bound instead.
  snippet() {
    const attrs = this.props
      .map(({ name, type }) =>
        type === 'boolean'
          ? this.values[name] && ` ${name}`
          : type === 'json'
            ? ` ${name}="@[${name}]"`
            : ` ${name}="${this.values[name]}"`,
      )
      .filter(Boolean)
      .join('');

    const at = this.pinned ? this.showing() : 0;

    return `<component src="${address(SOURCE_URL, this.namespace, this.slug, at)}"${attrs}></component>`;
  },

  include() {
    return [
      '<script type="module">',
      `  import { resolvePins } from '${SOURCE_URL}/js/pin.js';`,
      '  resolvePins();',
      '</script>',
    ].join('\n');
  },

  // Back through history replays the card's morph in reverse and lands on the
  // scroll position the visitor left; a shared link has nothing to go back to.
  close() {
    const fromHere = document.referrer && new URL(document.referrer).origin === location.origin;
    fromHere ? history.back() : location.assign('/');
  },

  copy() {
    navigator.clipboard.writeText(this.snippet());
    this.notice = 'Snippet copied';
  },

  // A json prop is edited as text and only committed once it parses, so a
  // half-typed bracket leaves the preview on the last value that made sense.
  setJson(name, text) {
    this.drafts[name] = text;

    try {
      this.values[name] = JSON.parse(text);
      this.invalid[name] = false;
    } catch {
      this.invalid[name] = true;
    }
  },

  structured() {
    return this.props.some(({ type }) => type === 'json');
  },

  reset() {
    this.values = Object.fromEntries(this.props.map(({ name, default: value }) => [name, value]));

    this.drafts = Object.fromEntries(
      this.props
        .filter(({ type }) => type === 'json')
        .map(({ name, default: value }) => [name, readable(value)]),
    );

    this.invalid = {};
  },

  async show(version) {
    try {
      const { revision, ...component } = await call('components/get', {
        namespace,
        slug,
        version: version || undefined,
      });

      this.component = component;
      this.tabs = Array.from({ length: component.latest }, (_, i) => component.latest - i);
      this.revision = revision;
      this.version = revision.version;
      this.props = revision.props || [];
      this.previewSource = source(SOURCE_URL, namespace, slug, revision.version);
      this.reset();
      this.missing = '';
      // Replaced rather than pushed, so going back still leaves the page.
      if (version) history.replaceState(null, '', `#v${revision.version}`);
    } catch ({ message }) {
      this.missing = message;
      return;
    }

    await window.$.ready;
    mount();
    attach(window.$.revision.html);
  },
};

const loadVersions = async () => {
  if (!window.$.user) return;

  window.$.versions = await call('auth/components/versions', { namespace, slug });
};

export const load = async () => {
  await window.$.show(hashed() || Number(params.get('v')) || 0);
  await loadVersions();

  addEventListener('hashchange', () => window.$.show(hashed()));

  window.$.on('afterUpdate', (current, previous) => current.user !== previous.user && loadVersions());
};

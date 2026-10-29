import { SOURCE_URL } from '/js/env.js';
import { address, source } from '/js/pin.js';
import { call } from '/js/ws.js';

const params = new URLSearchParams(location.search);
const [namespace, slug] = (params.get('c') || '').split('/');

const readable = (value) => JSON.stringify(value, null, 2);

// Which props a component takes is the thing being documented, so the attribute
// *names* on the tag are data. That is the one place the page writes markup
// instead of templating it — every value on it stays bound to `values`, so
// editing a prop in the docs re-renders the component and nothing else.
const mount = () => {
  const attrs = window.$.props.map(({ name }) => `${name}="@[values.${name}]"`).join(' ');

  document.querySelector('preview-host').innerHTML =
    `<component src="${window.$.previewSource}" ${attrs}></component>`;
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
      this.revision = revision;
      this.version = revision.version;
      this.props = revision.props || [];
      this.previewSource = source(SOURCE_URL, namespace, slug, revision.version);
      this.reset();
      this.missing = '';
    } catch ({ message }) {
      this.missing = message;
      return;
    }

    await window.$.ready;
    mount();
  },
};

const loadVersions = async () => {
  if (!window.$.user) return;

  window.$.versions = await call('auth/components/versions', { namespace, slug });
};

export const load = async () => {
  await window.$.show(Number(params.get('v')) || 0);
  await loadVersions();

  window.$.on('afterUpdate', (current, previous) => current.user !== previous.user && loadVersions());
};

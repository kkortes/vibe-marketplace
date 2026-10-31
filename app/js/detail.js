import codie from '/modules/codie/codie.js';

import { SOURCE_URL } from '/js/env.js';
import { address, source } from '/js/pin.js';
import { guard, take, state as publishing } from '/js/publishing.js';
import { autoTags } from '/js/tags.js';
import { call } from '/js/ws.js';

// The Worker serves this page at the component's own address, /<namespace>/<slug>.
const params = new URLSearchParams(location.search);
const [namespace, slug] = location.pathname.slice(1).split('/');

const readable = (value) => JSON.stringify(value, null, 2);

// Stylecheat is a promise about the page a component lands in, not something
// read off its markup, so its tag rides on the visitor's pick.
const tagged = (revision, styling) => [...autoTags(revision), ...(styling === 'stylecheat' ? ['Stylecheat'] : [])];

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

let usage;

// The tag under "Use it" is read-only and redrawn on every update, so it
// follows the selected tab and every prop value as it is typed.
const showUsage = () => (usage.code = window.$.snippet());

const attach = (html) => {
  editor ??= codie('codie');
  editor.editable = true;
  editor.numberedRows = true;
  editor.code = html;
  editor.onEdit = ({ raw }) => {
    preview(raw);
    window.$.edit('html', raw);
  };
  window.$.unpublished = null;

  if (!usage) {
    usage = codie('codie[usage]');
    window.$.on('afterUpdate', showUsage);
  }
  showUsage();
};

export const state = {
  ...publishing,
  namespace,
  slug,
  component: null,
  revision: null,
  props: [],
  values: {},
  drafts: {},
  invalid: {},
  version: 0,
  previewSource: '',
  missing: '',
  coding: false,
  // Newest first: the strip lays them out reversed, so it reads 1 to latest and
  // opens scrolled to the latest.
  tabs: [],
  // The selected tab: a pinned version, or 0 for Latest, which follows
  // whatever was published last and carries no hash.
  tab: 0,
  tags: [],
  styling: 'inline',

  showing() {
    return this.version || this.component?.latest || 0;
  },

  outdated() {
    return this.component && this.showing() < this.component.latest;
  },

  // The bytes behind the selected tab. A tab opened on the #v<n> form would
  // show the latest, since the fragment never reaches the server.
  url() {
    return source(SOURCE_URL, this.namespace, this.slug, this.tab);
  },

  // A boolean prop is carried the way HTML carries one — the attribute is there
  // or it is not; dismissable="false" would read as true. An array or an object
  // has no literal form an attribute can hold, so it is shown bound instead.
  // One attribute per row, the way the tag reads best once it is pasted.
  snippet() {
    const attrs = this.props
      .map(({ name, type }) =>
        type === 'boolean'
          ? this.values[name] && name
          : type === 'json'
            ? `${name}="@[${name}]"`
            : `${name}="${this.values[name]}"`,
      )
      .filter(Boolean);

    return [
      '<component',
      `  src="${address(SOURCE_URL, this.namespace, this.slug, this.tab)}"`,
      ...attrs.map((attr) => `  ${attr}`),
      '></component>',
    ].join('\n');
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
    this.leave(() => (fromHere ? history.back() : location.assign('/')));
  },

  // The markup, title and description are edited in place; whatever is not
  // edited is published as the revision in view carries it. Editing back to
  // what was there leaves nothing to publish, unless nothing is published here yet.
  edit(key, value) {
    const { component: { title, description, category, icon, latest }, revision: { html, props } } = this;
    const original = { namespace, slug, title, description, category, icon, html, props };
    const edited = { ...original, ...this.unpublished, [key]: value };

    this.unpublished = !latest || ['html', 'title', 'description'].some((k) => edited[k] !== original[k]) ? edited : null;
  },

  style(styling) {
    this.styling = styling;
    this.tags = tagged(this.revision, styling);
  },

  // Another tab replaces the code in the editor.
  open(version) {
    this.leave(() => this.show(version));
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

  render(component, revision, version) {
    this.component = component;
    this.tabs = Array.from({ length: component.latest }, (_, i) => component.latest - i);
    this.revision = revision;
    this.version = revision.version;
    this.tab = version;
    this.next = component.latest + 1;
    this.props = revision.props || [];
    this.tags = tagged(revision, this.styling);
    this.previewSource = source(SOURCE_URL, namespace, slug, revision.version);
    this.reset();
    this.missing = '';
    // Replaced rather than pushed, so going back still leaves the page.
    history.replaceState(null, '', version ? `#v${revision.version}` : location.pathname + location.search);
  },

  async show(version) {
    try {
      const { revision, ...component } = await call('components/get', {
        namespace,
        slug,
        version: version || undefined,
      });

      this.render(component, revision, version);
    } catch ({ message }) {
      this.missing = message;
      return;
    }

    await window.$.ready;
    mount();
    attach(window.$.revision.html);
  },

  // An edit carried here from another namespace's component lands as the next
  // version of the visitor's own component by its slug, or as v1 of a new one,
  // open in the editor it was made in.
  async clone(carried) {
    await this.show(0);
    this.missing && this.render({ ...carried, latest: 0 }, { version: 1, html: carried.html, props: carried.props }, 0);

    await window.$.ready;
    preview(carried.html);
    attach(carried.html);
    this.unpublished = carried;
    this.coding = true;
  },
};

export const load = async () => {
  await guard();

  const carried = take(namespace, slug);

  await (carried ? window.$.clone(carried) : window.$.show(hashed() || Number(params.get('v')) || 0));
  addEventListener('hashchange', () => window.$.show(hashed()));
};

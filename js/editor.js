import codie from '/modules/@ape-egg/codie/codie.js';

import { call } from '/js/ws.js';

const params = new URLSearchParams(location.search);
const target = params.get('c');
const [namespace, slug] = target ? target.split('/') : [params.get('ns') || '', ''];

const STARTER = `<script type="module">
  import component from '@ape-egg/vibe/component';

  component({ open: false });
</script>

<my-panel>
  <h3>@[title]</h3>
  <button secondary onclick="this.open = !this.open">Toggle</button>
  <!-- if this.open -->
  <p>@[body]</p>
  <!-- /if -->
</my-panel>
`;

const defaults = (props) =>
  Object.fromEntries(
    props.filter(({ name }) => name).map(({ name, default: value }) => [name, value]),
  );

let editor;
let draft;

// The draft is mounted the same way a published component is — through
// `<component src>` — so what the preview shows is the real mount path, props,
// slots, scripts and all. The source is a blob of whatever is in the editor.
const remount = () => {
  draft && URL.revokeObjectURL(draft);
  draft = URL.createObjectURL(new Blob([window.$.code], { type: 'text/html' }));

  const attrs = window.$.props
    .filter(({ name }) => name)
    .map(({ name }) => `${name}="@[values.${name}]"`)
    .join(' ');

  document.querySelector('preview-host').innerHTML =
    `<component src="${draft}" ${attrs}></component>`;
};

export const state = {
  namespace,
  slug,
  title: '',
  description: '',
  category: 'Interactive',
  icon: 'stack',
  notes: '',
  code: '',
  props: [],
  values: {},
  from: 0,
  latest: 0,
  mine: [],
  types: ['text', 'number', 'boolean', 'select'],
  categories: ['Interactive', 'Forms', 'Layout', 'Navigation', 'Feedback'],
  icons: ['stack', 'cog', 'layout', 'bell', 'embed', 'user', 'crow', 'eye', 'pencil', 'book'],

  owns() {
    return this.mine.some(({ slug }) => slug === this.namespace);
  },

  addProp() {
    this.props.push({ name: '', type: 'text', default: '', description: '', options: [] });
  },

  dropProp(index) {
    this.props.splice(index, 1);
    this.sync();
  },

  // A default is typed as text and stored as the type it declares, so the docs
  // hand the component a real number or a real boolean.
  setDefault(index, value) {
    const { type } = this.props[index];

    this.props[index].default =
      type === 'number' ? Number(value) : type === 'boolean' ? value === 'true' : value;

    this.sync();
  },

  setOptions(index, value) {
    this.props[index].options = value
      .split(',')
      .map((option) => option.trim())
      .filter(Boolean);
  },

  sync() {
    this.values = defaults(this.props);
    remount();
  },

  async publish() {
    this.notice = '';

    try {
      const { version } = await call('auth/components/publish', {
        namespace: this.namespace,
        slug: this.slug,
        title: this.title,
        description: this.description,
        category: this.category,
        icon: this.icon,
        html: this.code,
        props: this.props.filter(({ name }) => name),
        notes: this.notes,
      });

      this.latest = version;
      this.from = version;
      this.notes = '';
      this.notice = `Published as v${version}. That revision is frozen — the next change is v${version + 1}.`;
    } catch ({ message }) {
      this.notice = message;
    }
  },
};

const attach = () => {
  editor = codie('[codie]');
  editor.editable = true;
  editor.numberedRows = true;
  editor.code = window.$.code;

  editor.onEdit = ({ raw }) => {
    window.$.code = raw;
    remount();
  };
};

export const load = async () => {
  if (window.$.user) window.$.mine = await call('auth/namespaces/mine');

  if (slug) {
    const { revision, ...component } = await call('components/get', { namespace, slug });

    window.$.title = component.title;
    window.$.description = component.description;
    window.$.category = component.category;
    window.$.icon = component.icon;
    window.$.latest = component.latest;
    window.$.from = revision.version;
    window.$.props = (revision.props || []).map((prop) => ({ options: [], ...prop }));
    window.$.code = revision.html;
  } else {
    window.$.code = STARTER;
  }

  window.$.values = defaults(window.$.props);

  await window.$.ready;
  attach();

  window.$.on(
    'afterUpdate',
    async (current, previous) =>
      current.user !== previous.user &&
      (window.$.mine = current.user ? await call('auth/namespaces/mine') : []),
  );
};

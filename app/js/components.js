import { send } from '/js/publishing.js';
import { call } from '/js/ws.js';

// A slug is the name lowercased, accents dropped, with every run of anything
// else turned into one dash.
const slugify = (name) =>
  name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const escaped = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;');

const dialog = (name) => document.querySelector(`dialog[${name}]`);

export const state = {
  mine: [],
  // The selected tab: a namespace slug, or '' for All.
  namespace: '',
  slug: '',
  unlisted: false,
  draft: { title: '', description: '' },
  failure: '',

  compose() {
    this.slug = '';
    this.unlisted = false;
    this.failure = '';
    dialog('namespace').showModal();
  },

  outline() {
    this.draft = { title: '', description: '' };
    this.failure = '';
    dialog('draft').showModal();
  },

  dismiss(name) {
    dialog(name).close();
  },

  slugged() {
    return slugify(this.draft.title);
  },

  async create() {
    try {
      const created = await call('auth/namespaces/create', { slug: this.slug, unlisted: this.unlisted });

      this.mine = [...this.mine, created];
      this.dismiss('namespace');
      this.notice = `${created.slug} is yours and has its own tab now.`;
    } catch ({ message }) {
      this.failure = message;
    }
  },

  // The component is not written anywhere yet: it is carried to its own page,
  // which opens on Latest with Publish ready, and only publishing creates it.
  async add() {
    const { namespace } = this;
    const title = this.draft.title.trim();
    const slug = this.slugged();

    if ((title.match(/\p{L}/gu) ?? []).length < 3) return (this.failure = 'A name needs at least 3 letters');
    if (slug === 'tag') return (this.failure = 'tag is reserved for /<namespace>/tag/<name>');

    const taken = (await call('components/list', { namespace })).some((component) => component.slug === slug);
    if (taken) return (this.failure = `${namespace}/${slug} already exists`);

    send({
      namespace,
      slug,
      title,
      description: this.draft.description.trim() || null,
      category: 'Layout',
      icon: null,
      html: `<h2>${escaped(title)}</h2>`,
      props: [],
    });
    location.assign(`/${namespace}/${slug}`);
  },
};

const refresh = async () => {
  if (!window.$.user) {
    window.$.mine = [];
    window.$.namespace = '';
    return;
  }

  window.$.mine = await call('auth/namespaces/mine');
};

export const load = async () => {
  await refresh();

  window.$.on('afterUpdate', (current, previous) => current.user !== previous.user && refresh());
};

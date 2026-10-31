import { call } from '/js/ws.js';

export const state = {
  mine: [],
  // The selected tab: a namespace slug, or '' for All.
  namespace: '',
  slug: '',
  failure: '',

  compose() {
    this.slug = '';
    this.failure = '';
    document.querySelector('dialog[namespace]').showModal();
  },

  dismiss() {
    document.querySelectorAll('dialog').forEach((dialog) => dialog.close());
  },

  deletable() {
    return this.mine.some(({ slug, components }) => slug === this.namespace && !components);
  },

  confirm() {
    this.failure = '';
    document.querySelector('dialog[removal]').showModal();
  },

  async remove() {
    try {
      const { slug } = await call('auth/namespaces/delete', { slug: this.namespace });

      this.mine = this.mine.filter((ns) => ns.slug !== slug);
      this.namespace = '';
      this.dismiss();
      this.notice = `${slug} is deleted.`;
    } catch ({ message }) {
      this.failure = message;
    }
  },

  async create() {
    try {
      const created = await call('auth/namespaces/create', { slug: this.slug });

      this.mine = [...this.mine, created];
      this.dismiss();
      this.notice = `${created.slug} is yours and has its own tab now.`;
    } catch ({ message }) {
      this.failure = message;
    }
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

import { call } from '/js/ws.js';

export const state = {
  mine: [],
  owned: [],
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
    document.querySelector('dialog[namespace]').close();
  },

  async create() {
    try {
      const created = await call('auth/namespaces/create', { slug: this.slug });

      this.mine = [...this.mine, created];
      this.dismiss();
      this.notice = `${created.slug} is yours. Its tab sits next to All.`;
    } catch ({ message }) {
      this.failure = message;
    }
  },
};

const refresh = async () => {
  if (!window.$.user) {
    window.$.mine = [];
    window.$.owned = [];
    window.$.namespace = '';
    return;
  }

  const [mine, components] = await Promise.all([
    call('auth/namespaces/mine'),
    call('components/list'),
  ]);

  window.$.mine = mine;
  window.$.owned = components.filter(({ namespace }) =>
    mine.some(({ slug }) => slug === namespace),
  );
};

export const load = async () => {
  await refresh();

  window.$.on('afterUpdate', (current, previous) => current.user !== previous.user && refresh());
};

import { call } from '/js/ws.js';

export const state = {
  mine: [],
  owned: [],
  // The selected tab: a namespace slug, or '' for All.
  namespace: '',
  slug: '',
  title: '',

  async create() {
    this.notice = '';

    try {
      const created = await call('auth/namespaces/create', {
        slug: this.slug,
        title: this.title,
      });

      this.mine = [...this.mine, created];
      this.notice = `${created.slug} is yours. Publish anything you like under it.`;
      this.slug = '';
      this.title = '';
    } catch ({ message }) {
      this.notice = message;
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

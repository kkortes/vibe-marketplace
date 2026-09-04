import { SOURCE_URL } from '/js/env.js';
import { address, pin } from '/js/pin.js';
import { call } from '/js/ws.js';

export const state = {
  // The hero renders the very tag it prints, pin and all.
  featured: pin(address(SOURCE_URL, 'vibe', 'counter', 3)),
  components: [],
  namespaces: [],
  matches: [],
  categories: ['All'],
  category: 'All',
  scope: 'all',
  query: '',
  loading: true,

  filter() {
    const needle = this.query.trim().toLowerCase();

    this.matches = this.components.filter(
      (c) =>
        (this.category === 'All' || c.category === this.category) &&
        (this.scope === 'all' || c.namespace === this.scope) &&
        (!needle ||
          `${c.namespace}/${c.slug} ${c.title} ${c.description}`.toLowerCase().includes(needle)),
    );
  },
};

export const load = async () => {
  const [components, namespaces] = await Promise.all([
    call('components/list'),
    call('namespaces/list'),
  ]);

  window.$.namespaces = namespaces;
  window.$.components = components;
  window.$.categories = ['All', ...new Set(components.map(({ category }) => category))];
  window.$.loading = false;
  window.$.filter();
};

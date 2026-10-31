import { call } from '/js/ws.js';
import { guard, state as publishing } from '/js/publishing.js';

// The four most common names, counted over the namespace's own components so
// the bar offers no tag that would empty the list.
const top = (names) =>
  Object.entries(Object.groupBy(names, (name) => name))
    .sort(([a, { length: x }], [b, { length: y }]) => y - x || a.localeCompare(b))
    .slice(0, 4)
    .map(([name]) => name);

const [, namespace, , linked = ''] = location.pathname.split('/').map(decodeURIComponent);

const removal = () => document.querySelector('dialog[removal]');

export const state = {
  ...publishing,
  // The Worker serves this page at /<namespace> and /<namespace>/tag/<name>.
  namespace,
  components: [],
  matches: [],
  filters: { auto: [], user: [] },
  tag: 'All',
  query: '',
  loading: true,

  tagged: (name) => `/${namespace}/tag/${encodeURIComponent(name.toLowerCase())}`,

  // Picking the tag already picked unpicks it, back to every component. The
  // filter lives in the address, so a tag can be linked and reloaded.
  pick(name) {
    this.tag = this.tag === name ? 'All' : name;
    history.replaceState(null, '', this.tag === 'All' ? `/${namespace}` : this.tagged(this.tag));
    this.filter();
  },

  filter() {
    const needle = this.query.trim().toLowerCase();

    this.matches = this.components.filter(
      (c) =>
        (this.tag === 'All' || c.category === this.tag || c.tags.includes(this.tag)) &&
        (!needle || `${c.namespace}/${c.slug} ${c.title} ${c.description}`.toLowerCase().includes(needle)),
    );
  },

  // Only a namespace that never published can be deleted; the server checks
  // that again rather than trusting the empty list.
  doubt() {
    this.failure = '';
    removal().showModal();
  },

  keep() {
    removal().close();
  },

  async remove() {
    try {
      await call('auth/namespaces/delete', { slug: namespace });
      location.assign('/components');
    } catch ({ message }) {
      this.failure = message;
    }
  },
};

export const load = async () => {
  await guard();

  const components = await call('components/list', { namespace });

  window.$.components = components;
  window.$.filters = { auto: top(components.flatMap(({ tags }) => tags)), user: top(components.map(({ category }) => category)) };
  window.$.tag = components.flatMap(({ tags, category }) => [...tags, category]).find((name) => name.toLowerCase() === linked) || 'All';
  window.$.loading = false;
  window.$.filter();
};

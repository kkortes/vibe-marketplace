import codie from '/modules/@ape-egg/codie/codie.js';

import { SOURCE_URL } from '/js/env.js';
import { address, pin } from '/js/pin.js';
import { call } from '/js/ws.js';

const tag = { src: address(SOURCE_URL, 'vibe', 'counter', 3), label: 'Items', step: '1' };

export const state = {
  // The hero renders the very tag it prints, pin and all, and keeps rendering
  // it as the tag is edited.
  demo: { ...tag, src: pin(tag.src) },
  components: [],
  namespaces: [],
  matches: [],
  categories: ['All'],
  category: 'All',
  scope: 'all',
  query: '',
  loading: true,
  scrolled: false,

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

const print = ({ src, label, step }) =>
  `<component\n  src="${src}"\n  label="${label}"\n  step="${step}"\n></component>`;

// A template parses the edited tag without running anything in it.
const read = (raw) => {
  const template = document.createElement('template');
  template.innerHTML = raw;
  return template.content.querySelector('component');
};

export const edit = () => {
  const editor = codie('[codie]');
  editor.editable = true;
  editor.code = print(tag);
  editor.onEdit = ({ raw }) => {
    const component = read(raw);
    if (!component) return;
    window.$.demo = {
      src: pin(component.getAttribute('src') || ''),
      label: component.getAttribute('label') || '',
      step: component.getAttribute('step') || '',
    };
  };
};

// The hero fills the first screen until the visitor first scrolls; a page that
// opens already scrolled, like a reload halfway down, starts collapsed.
export const intro = () => {
  window.$.scrolled = scrollY > 0;
  addEventListener('scroll', () => (window.$.scrolled = true), { once: true });
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

import codie from '/modules/codie/codie.js';

import { SOURCE_URL } from '/js/env.js';
import { address, pin } from '/js/pin.js';
import { call } from '/js/ws.js';

const tag = { src: address(SOURCE_URL, 'vibe', 'counter', 3), label: 'Items', step: '1' };

export const state = {
  // The hero renders the very tag it prints, pin and all, and keeps rendering
  // it as the tag is edited.
  demo: { ...tag, src: pin(tag.src) },
  components: [],
  matches: [],
  // The four most common of each kind, counted by the server.
  filters: { auto: [], user: [] },
  tag: 'All',
  // Off shows the vibe namespace only.
  all: false,
  query: '',
  loading: true,
  scrolled: false,

  filter() {
    const needle = this.query.trim().toLowerCase();

    this.matches = this.components.filter(
      (c) =>
        (this.tag === 'All' || c.category === this.tag || c.tags.includes(this.tag)) &&
        (this.all || c.namespace === 'vibe') &&
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
  const [components, filters] = await Promise.all([call('components/list'), call('tags/top')]);

  window.$.components = components;
  window.$.filters = filters;
  window.$.loading = false;
  window.$.filter();
};

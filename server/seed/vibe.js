// The vibe-owned catalogue. Each component's markup is its own file in
// ./remote, read as is; only the catalogue entry around it is written here.
// Components carry their own styles and fall back to plain values for every
// theme variable, so they render on a page that has never heard of stylecheat.

const read = (name) => Bun.file(`${import.meta.dir}/remote/${name}`).text();

const overlay = {
  slug: 'overlay',
  title: 'Overlay',
  description: 'Shows any component over a dimmed, blurred backdrop that fades and scales in, and closes on Escape or a click outside it.',
  category: 'Layout',
  icon: 'layout',
  versions: [
    {
      notes: 'Ported from the webdev-game-stack Overlay.',
      props: [
        {
          name: 'component',
          type: 'text',
          default: '',
          description: 'Address of the component to show. Bind it to state of your own: the overlay shows while it is set and unsets it on close.',
        },
        {
          name: 'props',
          type: 'json',
          default: {},
          description: 'Handed to the shown component as its props prop. Next to it, that component gets close, called as $.close().',
        },
        {
          name: 'noescape',
          type: 'boolean',
          default: false,
          description: 'Escape leaves the overlay open while set. A click on the backdrop, or on any element inside with a close attribute, still closes it.',
        },
      ],
      html: await read('overlay.html'),
    },
  ],
};

export default [overlay];

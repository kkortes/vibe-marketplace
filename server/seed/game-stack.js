// The seeded components. Their code lives in ./remote, published byte for byte;
// only the catalogue entry around each one is written here.

const read = (name) => Bun.file(`${import.meta.dir}/remote/${name}`).text();

const one = async ({ file, notes = 'Imported from webdev-game-stack.', props = [], ...rest }) => ({
  ...rest,
  versions: [{ html: await read(file), props, notes }],
});

export default () =>
  Promise.all(
    [
      {
        file: 'Notifications.html',
        notes: 'Ported from the webdev-game-stack Notifications.',
        slug: 'notifications',
        title: 'Notifications',
        description: 'A top-right stack of notifications that fly in and fade out one by one. Post into it from anywhere with a notify event.',
        category: 'Feedback',
        icon: 'bell',
      },
      {
        file: 'Overlay.html',
        notes: 'Ported from the webdev-game-stack Overlay.',
        slug: 'overlay',
        title: 'Overlay',
        description: 'Shows any component over a dimmed, blurred backdrop that fades and scales in, and closes on Escape or a click outside it.',
        category: 'Layout',
        icon: 'layout',
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
      },
    ].map(one),
  );

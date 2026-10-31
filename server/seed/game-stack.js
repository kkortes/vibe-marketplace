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
    ].map(one),
  );

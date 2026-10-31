// Every seeded component is a file in ./remote, published exactly as it reads.
// Only the catalogue entry around each one is written here.

const read = (name) => Bun.file(`${import.meta.dir}/remote/${name}`).text();

const one = async ({ file, notes, props = [], ...rest }) => ({
  ...rest,
  versions: [{ html: await read(file), props, notes }],
});

export default () =>
  Promise.all(
    [
      {
        slug: 'dialog',
        title: 'Dialog',
        description: 'Renders any component full-screen over a blurred backdrop, and hands it a close.',
        category: 'Layout',
        icon: 'layout',
        file: 'Dialog.html',
        notes: 'Ported from the webdev-game-stack Dialog.',
        props: [
          {
            name: 'component',
            type: 'text',
            default: '',
            description: 'Address of the component to show. Bind it to state of your own: the dialog shows while it is set and unsets it on close.',
          },
          {
            name: 'props',
            type: 'json',
            default: {},
            description: 'Handed to the shown component as its props prop. Next to it, that component gets close, called as $.close().',
          },
        ],
      },
    ].map(one),
  );

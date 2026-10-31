// The webdev-game-stack remote components, published byte for byte. Nothing
// here edits their markup — the files in ./remote are copies of the originals,
// and only the catalogue entry around each one is written here.

const read = (name) => Bun.file(`${import.meta.dir}/remote/${name}`).text();

const one = async ({ file, notes = 'Imported from webdev-game-stack.', props = [], ...rest }) => ({
  ...rest,
  versions: [{ html: await read(file), props, notes }],
});

export default () => Promise.all([].map(one));

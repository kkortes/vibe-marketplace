// The vibe-owned catalogue. Components carry their own styles and fall back to
// plain values for every theme variable, so they render on a page that has
// never heard of stylecheat. Their markup lives in ./remote, read at seed time.

const read = (name) => Bun.file(`${import.meta.dir}/remote/${name}`).text();

const keystrokes = {
  slug: 'keystrokes',
  title: 'Keystrokes',
  description: 'Tracks which game keys are held and hands the map to state of your own.',
  category: 'Interactive',
  icon: 'desktop',
  versions: [
    {
      notes: 'Ported from the webdev-game-stack Keystrokes.',
      props: [
        {
          name: 'keys',
          type: 'json',
          default: {},
          description: 'Bind it to state of your own. Every press and release writes the full map there: each tracked key, true while held. Meta or Ctrl lets go of all of them.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: false,
          description: 'Only Enter, Escape and both Shift keys get through while set, for when the game keyboard is off.',
        },
        {
          name: 'debug',
          type: 'boolean',
          default: false,
          description: 'Shows the held keys in a fixed corner at the bottom right.',
        },
      ],
      file: 'keystrokes.html',
    },
  ],
};

const loaded = async (component) => ({
  ...component,
  versions: await Promise.all(
    component.versions.map(async ({ file, ...version }) => ({ ...version, html: (await read(file)).trim() })),
  ),
});

export default () => Promise.all([keystrokes].map(loaded));

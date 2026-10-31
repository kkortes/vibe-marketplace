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
        file: 'OverlaySlider.html',
        notes: 'Ported from the old-battle-brawlers AccountProgression panel. The slides are whatever sits between the component tags, in Stylecheat carousel markup: <slides x><slide>…</slide></slides>, each slide holding any HTML or another <component src>.',
        slug: 'overlay-slider',
        title: 'Overlay Slider',
        description: 'Shows your own slides over a dimmed, blurred backdrop that fades and scales in, and closes on Escape or a click outside them. Needs Stylecheat.',
        category: 'Layout',
        icon: 'images',
        props: [
          {
            name: 'open',
            type: 'boolean',
            default: false,
            description: 'Shows the slider while set. Bind it to state of your own: Escape, a click outside the slides or a click on any element inside with a close attribute sets it back to false.',
          },
        ],
      },
      {
        file: 'Keystrokes.html',
        notes: 'Ported from the webdev-game-stack Keystrokes.',
        slug: 'keystrokes',
        title: 'Keystrokes',
        description: 'Tracks which game keys are held and hands the map to state of your own.',
        category: 'Interactive',
        icon: 'desktop',
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
      },
    ].map(one),
  );

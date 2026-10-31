// The vibe-owned catalogue. The markup of each component is a file in ./remote,
// and only the catalogue entry around it is written here.

const read = (name) => Bun.file(`${import.meta.dir}/remote/${name}`).text();

const overlaySlider = {
  slug: 'overlay-slider',
  title: 'Overlay Slider',
  description: 'Shows your own slides over a dimmed, blurred backdrop that fades and scales in, and closes on Escape or a click outside them. Needs Stylecheat.',
  category: 'Layout',
  icon: 'images',
  versions: [
    {
      notes: 'Ported from the old-battle-brawlers AccountProgression panel. The slides are whatever sits between the component tags, in Stylecheat carousel markup: <slides x><slide>…</slide></slides>, each slide holding any HTML or another <component src>.',
      props: [
        {
          name: 'open',
          type: 'boolean',
          default: false,
          description: 'Shows the slider while set. Bind it to state of your own: Escape, a click outside the slides or a click on any element inside with a close attribute sets it back to false.',
        },
      ],
      html: await read('OverlaySlider.html'),
    },
  ],
};

// Every file ends with a newline, which is not part of the component.
const trimmed = (component) => ({
  ...component,
  versions: component.versions.map((version) => ({ ...version, html: version.html.trim() })),
});

export default [overlaySlider].map(trimmed);

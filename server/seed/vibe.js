// The vibe-owned catalogue. Components carry their own styles and fall back to
// plain values for every theme variable, so they render on a page that has
// never heard of stylecheat.

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
      html: `
<script type="module">
  import component from '@ape-egg/vibe/component';

  const id = component({ close: () => root().dispatchEvent(new Event('close')) });

  const root = () => document.querySelector(\`overlay-slider[data-vibe-internal-component-id="\${id}"]\`);

  const escape = ({ code }) => code === 'Escape' && root().hasAttribute('open') && $[id].close();

  addEventListener('keydown', escape);

  $.on('unmount', () => removeEventListener('keydown', escape));
</script>

<overlay-slider
  open="@[open]"
  onclose="$.open = false"
  onclick="(event.target === event.currentTarget || event.currentTarget.contains(event.target.closest('[close]'))) && this.close()"
>
  <carousel>
    <slot></slot>
  </carousel>
</overlay-slider>

<style>
  overlay-slider {
    position: fixed;
    inset: 0;
    z-index: 10;
    display: grid;
    grid-template-rows: 80px 1fr 80px;
    place-items: center;
    background: rgb(0 0 0 / 0.1);
    box-shadow: inset 0 0 10vw rgb(0 0 0 / 0.5);
    backdrop-filter: blur(1px);
    opacity: 0;
    scale: 1.2;
    pointer-events: none;
    transition: opacity 200ms 75ms, scale 200ms 75ms;
  }

  overlay-slider[open] {
    opacity: 1;
    scale: 1;
    pointer-events: auto;
  }

  overlay-slider > carousel {
    grid-row: 2;
    width: 320px;
    max-width: calc(100% - 96px);
  }

  @media (max-width: 768px) {
    overlay-slider { grid-template-rows: calc(var(--unit) * 8) 1fr calc(var(--unit) * 8); }
    overlay-slider > carousel { min-width: calc(100% - 80px); max-width: calc(100% - var(--unit) * 8); }
  }
</style>
`,
    },
  ],
};

// These are written here as template literals, so they carry the newline that
// opens them.
const trimmed = (component) => ({
  ...component,
  versions: component.versions.map((version) => ({ ...version, html: version.html.trim() })),
});

export default [overlaySlider].map(trimmed);

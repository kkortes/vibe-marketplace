// The vibe-owned catalogue. Components carry their own styles and fall back to
// plain values for every theme variable, so they render on a page that has
// never heard of stylecheat.

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
      html: `
<script type="module">
  import component from '@ape-egg/vibe/component';

  const id = component({ close: () => root().dispatchEvent(new Event('close')) });

  const root = () => document.querySelector(\`overlay-root[data-vibe-internal-component-id="\${id}"]\`);

  const escape = ({ code }) =>
    code === 'Escape' && root().getAttribute('open') && !root().getAttribute('noescape') && $[id].close();

  addEventListener('keydown', escape);

  $.on('unmount', () => removeEventListener('keydown', escape));
</script>

<overlay-root
  open="@[component ? 'open' : '']"
  noescape="@[noescape ? 'noescape' : '']"
  onclose="$.component = undefined"
>
  <!-- if component -->
  <overlay-backdrop
    onclick="(event.target === event.currentTarget || event.target.closest('[close]:not(component)')) && this.close()"
  >
    <overlay-box>
      <component src="@[component]" props="@[props]" close="@[this.close]"></component>
    </overlay-box>
  </overlay-backdrop>
  <!-- /if -->
</overlay-root>

<style>
  overlay-backdrop {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: grid;
    grid-template-rows: 80px 1fr 80px;
    place-items: center;
    overflow: hidden auto;
    background: rgb(0 0 0 / 0.2);
    box-shadow: inset 0 0 10vw rgb(0 0 0 / 0.5);
    backdrop-filter: blur(1px);
    transition: opacity 200ms 75ms, scale 200ms 75ms;

    @starting-style {
      opacity: 0;
      scale: 0.95;
    }
  }

  overlay-box {
    grid-row: 2;
    min-width: 700px;
    max-width: calc(100% - 96px);
  }

  @media (max-width: 768px) {
    overlay-backdrop { grid-template-rows: calc(var(--unit, 4px) * 8) 1fr calc(var(--unit, 4px) * 8); }
    overlay-box { min-width: calc(100% - 80px); max-width: calc(100% - calc(var(--unit, 4px) * 8)); }
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

export default [overlay].map(trimmed);

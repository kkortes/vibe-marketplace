// The vibe-owned catalogue. Components carry their own styles and fall back to
// plain values for every theme variable, so they render on a page that has
// never heard of stylecheat.

const dialog = {
  slug: 'dialog',
  title: 'Dialog',
  description: 'Renders any component full-screen over a blurred backdrop, and hands it a close.',
  category: 'Layout',
  icon: 'layout',
  versions: [
    {
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
      html: `
<script type="module">
  import component from '@ape-egg/vibe/component';

  // A frame passes before the dialog goes, so whatever sits under the pointer
  // does not catch a mouseenter from the click that closed it.
  const id = component({
    close: () =>
      requestAnimationFrame(() =>
        document.querySelector(\`dialog-root[data-vibe-internal-component-id="\${id}"]\`).dispatchEvent(new Event('close')),
      ),
  });
</script>

<dialog-root onclose="$.component = undefined">
  <!-- if component -->
  <dialog-overlay>
    <dialog-box>
      <component src="@[component]" props="@[props]" close="@[this.close]"></component>
    </dialog-box>
  </dialog-overlay>
  <!-- /if -->
</dialog-root>

<style>
  dialog-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    padding: 80px 48px;
    overflow-y: auto;
    background: rgb(0 0 0 / 0.1);
    box-shadow: inset 0 0 10vw rgb(0 0 0 / 0.5);
    backdrop-filter: blur(1px);
    transition: opacity 200ms 75ms, scale 200ms 75ms;

    @starting-style {
      opacity: 0;
      scale: 0.95;
    }
  }

  dialog-box {
    width: 320px;
    max-width: 100%;
    margin: auto;
  }

  @media (max-width: 768px) {
    dialog-overlay { padding: calc(var(--unit, 4px) * 8) calc(var(--unit, 4px) * 4); }
    dialog-box { width: 100%; }
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

export default [dialog].map(trimmed);

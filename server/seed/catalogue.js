// The whole seeded catalogue. Each component's code lives in ./remote, published
// byte for byte; only the catalogue entry around it is written here, with the
// namespace it is seeded under when that is not vibe.

const read = (name) => Bun.file(`${import.meta.dir}/remote/${name}`).text();

const one = async ({ file, namespace = 'vibe', notes, props = [], events = {}, ...rest }) => ({
  ...rest,
  namespace,
  versions: [{ html: await read(file), props, events, notes }],
});

export default await Promise.all(
  [
    {
      file: 'Notifications.html',
      notes: 'Ported to Vibe.',
      slug: 'notifications',
      title: 'Notifications',
      description: 'A top-right stack of notifications that fly in and fade out one by one. Post into it from anywhere with a notify event.',
      category: 'Feedback',
      icon: 'bell',
      styling: 'stylecheat',
    },
    {
      file: 'Overlay.html',
      notes: 'Ported to Vibe.',
      slug: 'overlay',
      title: 'Overlay',
      description: 'Shows any component over a dimmed, blurred backdrop that fades and scales in, and closes on Escape or a click outside it.',
      category: 'Layout',
      icon: 'layout',
      styling: 'stylecheat',
      props: [
        {
          name: 'open',
          type: 'boolean',
          default: false,
          description: 'Shows the overlay while set. Bind it to state of your own: Escape, a click on the backdrop or a click on any element inside with a close attribute sets it back to false.',
        },
        {
          name: 'component',
          type: 'text',
          default: 'data:text/html,<card p-6><p>Escape, a click outside or the button closes me.</p><button close>Close</button></card>',
          description: 'Address of the component to show while open. The default is an inline one, so a page elsewhere passes its own.',
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
    {
      file: 'OverlaySlider.html',
      notes: 'Ported from the old-battle-brawlers AccountProgression panel. The slides are whatever sits between the component tags, in Stylecheat carousel markup: <slides x><slide>…</slide></slides>, each slide holding any HTML or another <component src>.',
      slug: 'overlay-slider',
      title: 'Overlay Slider',
      description: 'Shows your own slides over a dimmed, blurred backdrop that fades and scales in, and closes on Escape or a click outside them. Needs Stylecheat.',
      category: 'Layout',
      icon: 'images',
      styling: 'stylecheat',
      props: [
        {
          name: 'open',
          type: 'boolean',
          default: false,
          description: 'Shows the slider while set. Bind it to state of your own: Escape, a click outside the slides or a click on any element inside with a close attribute sets it back to false.',
        },
        {
          name: 'slides',
          type: 'html',
          default: [
            '<slides x>',
            '  <slide>',
            '    <card p-6>',
            '      <h4>First slide</h4>',
            '      <p>Swipe or scroll sideways for the next one.</p>',
            '    </card>',
            '  </slide>',
            '  <slide>',
            '    <card p-6>',
            '      <h4>Second slide</h4>',
            '      <p>Any HTML fits here, or another component.</p>',
            '    </card>',
            '  </slide>',
            '  <slide>',
            '    <card p-6>',
            '      <h4>Third slide</h4>',
            '      <p>The last one. Escape or a click beside the cards closes it too.</p>',
            '      <button close>Close</button>',
            '    </card>',
            '  </slide>',
            '</slides>',
          ].join('\n'),
          description: 'The markup between the tags: a <slides x> holding one <slide> per slide.',
        },
      ],
    },
    {
      file: 'Keystrokes.html',
      notes: 'Ported to Vibe.',
      slug: 'keystrokes',
      title: 'Keystrokes',
      description: 'Tracks which keyboard keys are pressed in realtime.',
      category: 'Interactive',
      icon: 'desktop',
      // The keys it tracks come from its keys prop, which no example read off its
      // code can know, so its examples press one of the default keys.
      events: { keydown: { code: 'Digit1' }, keyup: { code: 'Digit1' } },
      props: [
        {
          name: 'keys',
          type: 'json',
          default: { digit1: false, digit2: false, digit3: false, digit4: false, digit5: false },
          description: 'The keys it tracks, each named by its lowercased event code (keyw, arrowup, digit1) and false to start. Bind it to state of your own: every press and release writes the full map back there, each key true while held. Meta or Ctrl lets go of all of them.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: false,
          description: 'No key registers while set, for when the game keyboard is off.',
        },
        {
          name: 'debug',
          type: 'boolean',
          default: true,
          description: 'Shows the whole key map, every tracked key true or false, in a fixed corner at the bottom right.',
        },
      ],
    },
    {
      file: 'Dialog.html',
      notes: 'Ported to Vibe.',
      slug: 'dialog',
      title: 'Dialog',
      description: 'Renders any component full-screen over a blurred backdrop, and hands it a close.',
      category: 'Layout',
      icon: 'layout',
      styling: 'stylecheat',
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
    // The game card from ws-card-game (src/components/Card.svelte), rewritten
    // from Tailwind into plain CSS. Its fonts load from Google Fonts and its
    // icons and paper grain are inlined; the art is the one thing it fetches by prop.
    {
      file: 'Card.html',
      namespace: 'webdev',
      notes: 'Ported to Vibe and rewritten from Tailwind into plain CSS.',
      slug: 'card',
      title: 'Card',
      description: 'A trading card, full art or framed, in the colour of its element.',
      category: 'Game',
      icon: 'image',
      styling: 'stylecheat',
      props: [
        { name: 'name', type: 'text', default: 'Oskar', description: 'Card name. Trusted HTML.' },
        {
          name: 'image',
          type: 'text',
          default: '/images/card/oskar.jpg',
          description: 'URL of the card art. The default is served by viberary, so a page elsewhere passes its own.',
        },
        {
          name: 'type',
          type: 'select',
          options: ['fullart', 'framed-full', 'framed-centered'],
          default: 'fullart',
          description: 'Layout. fullart fills the whole frame with its art and has no stat box or rarity symbol; framed-full covers a framed window with its art; framed-centered fits its art in that window instead.',
        },
        { name: 'kind', type: 'text', default: 'god', description: 'The black tag before the subtypes, such as god, unit or relic.' },
        {
          name: 'color',
          type: 'select',
          options: ['red', 'yellow', 'lime', 'sky', 'violet', 'brown', 'amber', 'gray', 'beige'],
          default: 'yellow',
          description: 'Frame palette: fire red, lightning yellow, nature lime, frost sky, void violet, earth brown, light amber, dark gray, physical beige.',
        },
        {
          name: 'icon',
          type: 'select',
          options: ['fire', 'lightning', 'nature', 'frost', 'void', 'earth', 'light', 'dark', 'physical', 'none'],
          default: 'lightning',
          description: 'Element in the mana circle when there is no cost. None drops the circle.',
        },
        { name: 'cost', type: 'number', default: 0, description: 'Mana cost. 0 shows the element icon instead.' },
        { name: 'rarity', type: 'number', default: 3, description: 'From 1 to 4; picks the colour and order of the rarity shapes.' },
        { name: 'damage', type: 'number', default: 0, description: 'Damage. With health at 0 too, or on fullart, there is no stat box.' },
        { name: 'health', type: 'number', default: 0, description: 'Health.' },
        { name: 'subtypes', type: 'json', default: ['lightning'], description: 'Tags after the type, as strings.' },
        {
          name: 'keywords',
          type: 'json',
          default: [],
          description: 'Keyword tags. aggressive, swift, echoing, still, sturdy and regenerative carry their own colour.',
        },
        {
          name: 'text',
          type: 'text',
          default: 'I always start the game.',
          description: 'Rules text. Trusted HTML.',
        },
        { name: 'flavourText', type: 'text', default: '', description: 'Italic lore under the rules text. Trusted HTML.' },
        { name: 'serial', type: 'text', default: '[CS] 1/137', description: 'Set and number, bottom left.' },
        { name: 'artist', type: 'text', default: 'Wyndagger', description: 'Artist credit, bottom right.' },
      ],
    },
  ].map(one),
);

// The webdev namespace: components carried over from the webdev-game-stack
// project. Their markup is long, so each lives in ./webdev and is read here.

const read = (name) => Bun.file(`${import.meta.dir}/webdev/${name}`).text();

const trimmed = (component) => ({
  ...component,
  versions: component.versions.map((version) => ({ ...version, html: version.html.trim() })),
});

// The game card from webdev-game-stack (game/ws-card-game, src/components/Card.svelte),
// rewritten from Tailwind into plain CSS. Its fonts load from Google Fonts and its
// icons and paper grain are inlined; the art is the one thing it fetches by prop.
const card = {
  slug: 'card',
  title: 'Card',
  description: 'A trading card, full art or framed, in the colour of its element.',
  category: 'Game',
  icon: 'image',
  versions: [
    {
      notes: 'Ported from the webdev-game-stack card.',
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
      html: await read('card.html'),
    },
  ],
};

export default [card].map(trimmed);

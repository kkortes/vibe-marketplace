// The vibe-owned catalogue. Components carry their own styles and fall back to
// plain values for every theme variable, so they render on a page that has
// never heard of stylecheat.

const read = (name) => Bun.file(`${import.meta.dir}/vibe/${name}`).text();

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
  description: 'A trading card for gods, units, spells and relics, framed in the colour of its element.',
  category: 'Game',
  icon: 'image',
  versions: [
    {
      notes: 'Ported from the webdev-game-stack card.',
      props: [
        { name: 'name', type: 'text', default: 'Mons Igneus', description: 'Card name. Trusted HTML.' },
        {
          name: 'image',
          type: 'text',
          default: 'https://viberary.korte.kim/images/card/mons-igneus.jpg',
          description: 'URL of the card art.',
        },
        {
          name: 'type',
          type: 'select',
          options: ['unit', 'god', 'spell', 'relic'],
          default: 'unit',
          description: 'A god fills the whole frame with its art; a relic fits its art instead of covering.',
        },
        {
          name: 'color',
          type: 'select',
          options: ['red', 'yellow', 'lime', 'sky', 'violet', 'brown', 'amber', 'gray', 'beige'],
          default: 'red',
          description: 'Frame palette: fire red, lightning yellow, nature lime, frost sky, void violet, earth brown, light amber, dark gray, physical beige.',
        },
        {
          name: 'icon',
          type: 'select',
          options: ['fire', 'lightning', 'nature', 'frost', 'void', 'earth', 'light', 'dark', 'physical', 'none'],
          default: 'fire',
          description: 'Element in the mana circle when there is no cost. None drops the circle.',
        },
        { name: 'cost', type: 'number', default: 10, description: 'Mana cost. 0 shows the element icon instead.' },
        { name: 'rarity', type: 'number', default: 4, description: 'From 1 to 4; picks the colour and order of the rarity shapes.' },
        { name: 'damage', type: 'number', default: 6, description: 'Damage. With health at 0 too, there is no stat box.' },
        { name: 'health', type: 'number', default: 10, description: 'Health.' },
        { name: 'subtypes', type: 'json', default: ['dragon'], description: 'Tags after the type, as strings.' },
        {
          name: 'keywords',
          type: 'json',
          default: ['flying'],
          description: 'Keyword tags. aggressive, swift, echoing, still, sturdy and regenerative carry their own colour.',
        },
        {
          name: 'text',
          type: 'text',
          default: 'When this unit arrives, deal its damage to target unit.',
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

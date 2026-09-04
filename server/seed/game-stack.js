// The webdev-game-stack remote components, published byte for byte. Nothing
// here edits their markup — the files in ./remote are copies of the originals,
// and only the catalogue entry around each one is written here.
//
// Two things these carry over from the app they were built in, and neither is
// papered over: several read theme variables that project defines (--sheen-*,
// --scrim-*, --gold-*, --c-fg), so they render with those declarations dropped;
// and the overlay ones are position: fixed singletons driven by app state
// rather than by props, so their defaults are empty and the docs are where you
// fill them in.

const read = (name) => Bun.file(`${import.meta.dir}/remote/${name}`).text();

const one = async ({ file, notes = 'Imported from webdev-game-stack.', props = [], ...rest }) => ({
  ...rest,
  versions: [{ html: await read(file), props, notes }],
});

export default () =>
  Promise.all([
    one({
      file: 'Pagination.html',
      slug: 'pagination',
      title: 'Pagination',
      description: 'Previous and next around a page counter, disabled at both ends.',
      category: 'Navigation',
      icon: 'chevron-right',
      props: [
        { name: 'page', type: 'number', default: 2, description: 'Current page, counted from zero.' },
        { name: 'pageCount', type: 'number', default: 7, description: 'How many pages there are.' },
        {
          name: 'prev',
          type: 'text',
          default: '$.page--',
          description: 'Expression run when Previous is pressed. It is inlined into the handler.',
        },
        {
          name: 'next',
          type: 'text',
          default: '$.page++',
          description: 'Expression run when Next is pressed.',
        },
      ],
    }),

    one({
      file: 'BoxRange.html',
      slug: 'box-range',
      title: 'Box Range',
      description: 'A row of numbered boxes that fill up to whichever one you point at.',
      category: 'Forms',
      icon: 'cog',
      props: [
        { name: 'min', type: 'number', default: 1, description: 'First number in the row.' },
        { name: 'max', type: 'number', default: 8, description: 'Last number in the row.' },
        { name: 'value', type: 'number', default: 3, description: 'How many boxes read as filled.' },
        {
          name: 'onchange',
          type: 'text',
          default: '$.value = ',
          description: 'Called with the clicked number. The expression is inlined, so it is written as a prefix.',
        },
      ],
    }),

    one({
      file: 'CardDisc.html',
      slug: 'card-disc',
      title: 'Card Disc',
      description:
        'A round portrait chip. It mounts a Mugshot component from the host page, so on its own it renders the disc and its frame.',
      category: 'Layout',
      icon: 'image',
      props: [
        { name: 'image', type: 'text', default: '', description: 'Portrait URL handed to the inner Mugshot.' },
        { name: 'name', type: 'text', default: 'Ada', description: 'Name handed to the inner Mugshot.' },
        { name: 'x', type: 'number', default: 50, description: 'Horizontal focus of the portrait, in percent.' },
        { name: 'y', type: 'number', default: 40, description: 'Vertical focus of the portrait, in percent.' },
        { name: 'zoom', type: 'number', default: 5, description: 'Zoom applied to the portrait.' },
        { name: 'sm', type: 'boolean', default: false, description: 'Renders the small fixed-size disc.' },
      ],
    }),

    one({
      file: 'CardHand.html',
      slug: 'card-hand',
      title: 'Card Hand',
      description: 'Fans an array of cards into a hand, each one a Card Disc, with hover and selection.',
      category: 'Layout',
      icon: 'stack',
      props: [
        {
          name: 'cards',
          type: 'json',
          default: [
            { id: 1, name: 'Ada', x: 50, y: 40 },
            { id: 2, name: 'Grace', x: 50, y: 40, selected: true },
            { id: 3, name: 'Alan', x: 50, y: 40 },
            { id: 4, name: 'Edsger', x: 50, y: 40 },
          ],
          description: 'The hand. Each card needs an id, and may carry name, image, x, y and selected.',
        },
        { name: 'angle', type: 'number', default: 8, description: 'Degrees of rotation between neighbouring cards.' },
        { name: 'distance', type: 'number', default: 320, description: 'Pixels from the fan pivot to the cards.' },
        { name: 'size', type: 'number', default: 110, description: 'Card diameter in pixels.' },
        { name: 'zoom', type: 'number', default: 5, description: 'Zoom passed down to every Card Disc.' },
        { name: 'flipped', type: 'boolean', default: false, description: 'Greys the whole hand out.' },
        {
          name: 'dimUnselected',
          type: 'boolean',
          default: false,
          description: 'Greys every card that is not selected.',
        },
      ],
    }),

    one({
      file: 'BarGraph.html',
      slug: 'bar-graph',
      title: 'Bar Graph',
      description: 'Labelled horizontal bars drawn as one SVG, scaled to the largest value.',
      category: 'Layout',
      icon: 'layout',
      props: [
        {
          name: 'bars',
          type: 'json',
          default: [
            { name: 'Strength', value: 82, color: 'oklch(0.6 0.17 25)', note: '82', label: 'Strength 82' },
            { name: 'Agility', value: 64, color: 'oklch(0.6 0.17 145)', note: '64', label: 'Agility 64' },
            { name: 'Wits', value: 41, color: 'oklch(0.6 0.17 265)', note: '41', label: 'Wits 41' },
          ],
          description: 'One entry per bar: name, value, color, note and label.',
        },
      ],
    }),

    one({
      file: 'LineGraph.html',
      slug: 'line-graph',
      title: 'Line Graph',
      description: 'Multiple series over a shared axis, with a wrapping legend, drawn as SVG.',
      category: 'Layout',
      icon: 'layout',
      props: [
        {
          name: 'series',
          type: 'json',
          default: [
            { name: 'Damage', values: [4, 9, 15, 22, 30, 41] },
            { name: 'Armour', values: [2, 5, 9, 14, 20, 27] },
            { name: 'Speed', values: [1, 2, 4, 7, 11, 16] },
          ],
          description: 'One entry per line: name and values, optionally group and border.',
        },
        {
          name: 'percent',
          type: 'boolean',
          default: false,
          description: 'Formats the axis as percentages instead of plain numbers.',
        },
      ],
    }),

    one({
      file: 'Table.html',
      slug: 'table',
      title: 'Table',
      description: 'A bare table shell with skeleton rows while the real rows are still loading.',
      category: 'Layout',
      icon: 'layout',
      props: [
        {
          name: 'skeleton',
          type: 'number',
          default: 4,
          description: 'How many placeholder rows to draw under the slotted content.',
        },
      ],
    }),

    one({
      file: 'DataInspector.html',
      slug: 'data-inspector',
      title: 'Data Inspector',
      description: 'A collapsible tree over any object, with a copy-to-JSON button. Remembers what you opened.',
      category: 'Interactive',
      icon: 'eye',
      props: [
        {
          name: 'data',
          type: 'json',
          default: {
            user: { name: 'Ada', roles: ['admin', 'author'] },
            counts: { components: 18, revisions: 24 },
            ready: true,
          },
          description: 'The object to walk. Anything JSON-shaped works.',
        },
      ],
    }),

    one({
      file: 'Notifications.html',
      slug: 'notifications',
      title: 'Notifications',
      description:
        'A fixed toast viewport that stacks, swipes away and pauses on hover. Driven by a notifications array on app state, so it is empty until something pushes to it.',
      category: 'Feedback',
      icon: 'bell',
      props: [
        { name: 'up', type: 'boolean', default: false, description: 'Pin the viewport to the top.' },
        { name: 'down', type: 'boolean', default: true, description: 'Pin the viewport to the bottom.' },
        { name: 'left', type: 'boolean', default: false, description: 'Pin the viewport to the left.' },
        { name: 'right', type: 'boolean', default: true, description: 'Pin the viewport to the right.' },
        { name: 'offsetX', type: 'number', default: 0, description: 'Nudge the viewport horizontally, in pixels.' },
        { name: 'offsetY', type: 'number', default: 0, description: 'Nudge the viewport vertically, in pixels.' },
      ],
    }),

    one({
      file: 'AchievementReveal.html',
      slug: 'achievement-reveal',
      title: 'Achievement Reveal',
      description:
        'A full-screen card that pops, holds for two seconds and fades. Reads a queue, so nothing is drawn while the queue is empty.',
      category: 'Feedback',
      icon: 'checkmark',
      props: [
        {
          name: 'achievementReveals',
          type: 'json',
          default: [],
          description:
            'The queue. Add an entry with id, icon, title and description to see one — it takes over the screen and fades itself out.',
        },
      ],
    }),

    one({
      file: 'PromptModal.html',
      slug: 'prompt-modal',
      title: 'Prompt Modal',
      description:
        'A two-column review dialog for an image prompt: the prompt itself, a free-text addition, and reference images you pick by clicking.',
      category: 'Interactive',
      icon: 'embed',
      props: [
        {
          name: 'promptModal',
          type: 'json',
          default: { open: false, title: '', preview: '', extra: '', extraLabel: '', images: [] },
          description:
            'The dialog state. Set open to true, with title, preview, extraLabel and an images array, to see it.',
        },
      ],
    }),

    one({
      file: 'Tooltip.html',
      slug: 'tooltip',
      title: 'Tooltip',
      description:
        'A pointer-following tooltip layer with an optional comparison table behind the alt key. Positioned from app state, so it stays hidden until something anchors it.',
      category: 'Feedback',
      icon: 'search',
      props: [
        {
          name: 'tooltip',
          type: 'json',
          default: { visible: false, x: 0, y: 0, direction: 'up', props: {} },
          description: 'Position and contents. Set visible to true with x, y and a direction to place it.',
        },
      ],
    }),
  ]);

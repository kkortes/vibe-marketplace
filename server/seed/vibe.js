// The vibe-owned catalogue. Components carry their own styles and fall back to
// plain values for every theme variable, so they render on a page that has
// never heard of stylecheat.

const counter = {
  slug: 'counter',
  title: 'Counter',
  description: 'A number with two buttons. Each instance keeps its own count.',
  category: 'Interactive',
  icon: 'stack',
  versions: [
    {
      notes: 'First cut — a count and two buttons.',
      props: [],
      html: `
<script type="module">
  import component from '@ape-egg/vibe/component';

  component({ count: 0 });
</script>

<counter-card>
  <counter-value>@[this.count]</counter-value>
  <counter-controls>
    <button secondary onclick="this.count--">&minus;</button>
    <button secondary onclick="this.count++">+</button>
  </counter-controls>
</counter-card>

<style>
  counter-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(var(--unit, 4px) * 3);
    padding: calc(var(--unit, 4px) * 6);
    border: 1px solid var(--border, #e4e4e7);
    border-radius: var(--radius, 8px);
  }

  counter-value {
    font-size: calc(var(--unit, 4px) * 11);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  counter-controls {
    display: flex;
    gap: calc(var(--unit, 4px) * 2);
  }
</style>
`,
    },
    {
      notes: 'Added a label so the number says what it counts.',
      props: [
        {
          name: 'label',
          type: 'text',
          default: 'Items',
          description: 'Caption shown above the number.',
        },
      ],
      html: `
<script type="module">
  import component from '@ape-egg/vibe/component';

  component({ count: 0 });
</script>

<counter-card>
  <counter-label>@[label]</counter-label>
  <counter-value>@[this.count]</counter-value>
  <counter-controls>
    <button secondary onclick="this.count--">&minus;</button>
    <button secondary onclick="this.count++">+</button>
  </counter-controls>
</counter-card>

<style>
  counter-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(var(--unit, 4px) * 3);
    padding: calc(var(--unit, 4px) * 6);
    border: 1px solid var(--border, #e4e4e7);
    border-radius: var(--radius, 8px);
  }

  counter-label {
    font-size: calc(var(--unit, 4px) * 3.25);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted-foreground, #71717a);
  }

  counter-value {
    font-size: calc(var(--unit, 4px) * 11);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  counter-controls {
    display: flex;
    gap: calc(var(--unit, 4px) * 2);
  }
</style>
`,
    },
    {
      notes: 'Step size is a prop now, and there is a reset.',
      props: [
        {
          name: 'label',
          type: 'text',
          default: 'Items',
          description: 'Caption shown above the number.',
        },
        {
          name: 'step',
          type: 'number',
          default: 1,
          description: 'How much a button press moves the count.',
        },
      ],
      html: `
<script type="module">
  import component from '@ape-egg/vibe/component';

  component({
    count: 0,
    bump(by) {
      this.count += Number(by) || 1;
    },
  });
</script>

<counter-card>
  <counter-label>@[label]</counter-label>
  <counter-value>@[this.count]</counter-value>
  <counter-controls>
    <button secondary onclick="this.bump(-@[step])">&minus;</button>
    <button secondary onclick="this.bump(@[step])">+</button>
    <button tertiary onclick="this.count = 0">Reset</button>
  </counter-controls>
</counter-card>

<style>
  counter-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(var(--unit, 4px) * 3);
    padding: calc(var(--unit, 4px) * 6);
    border: 1px solid var(--border, #e4e4e7);
    border-radius: var(--radius, 8px);
  }

  counter-label {
    font-size: calc(var(--unit, 4px) * 3.25);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted-foreground, #71717a);
  }

  counter-value {
    font-size: calc(var(--unit, 4px) * 11);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  counter-controls {
    display: flex;
    gap: calc(var(--unit, 4px) * 2);
  }
</style>
`,
    },
  ],
};

const switchField = {
  slug: 'switch-field',
  title: 'Switch Field',
  description: 'A labelled switch with an optional line of help text under it.',
  category: 'Forms',
  icon: 'cog',
  versions: [
    {
      notes: 'A switch and a label.',
      props: [
        {
          name: 'label',
          type: 'text',
          default: 'Email notifications',
          description: 'The label sitting next to the switch.',
        },
      ],
      html: `
<switch-field>
  <label>
    <input type="checkbox" role="switch" />
    <span>@[label]</span>
  </label>
</switch-field>

<style>
  switch-field label {
    display: flex;
    align-items: center;
    gap: calc(var(--unit, 4px) * 3);
    cursor: pointer;
  }
</style>
`,
    },
    {
      notes: 'Help text and a danger tone.',
      props: [
        {
          name: 'label',
          type: 'text',
          default: 'Email notifications',
          description: 'The label sitting next to the switch.',
        },
        {
          name: 'hint',
          type: 'text',
          default: 'We only write when something breaks.',
          description: 'Help text under the label. Left out when empty.',
        },
        {
          name: 'tone',
          type: 'select',
          options: ['neutral', 'danger'],
          default: 'neutral',
          description: 'Danger tints the hint red, for switches that delete things.',
        },
      ],
      html: `
<switch-field data-tone="@[tone]">
  <label>
    <input type="checkbox" role="switch" />
    <span>@[label]</span>
  </label>
  <!-- if hint -->
  <switch-hint>@[hint]</switch-hint>
  <!-- /if -->
</switch-field>

<style>
  switch-field {
    display: flex;
    flex-direction: column;
    gap: calc(var(--unit, 4px) * 1);
  }

  switch-field label {
    display: flex;
    align-items: center;
    gap: calc(var(--unit, 4px) * 3);
    cursor: pointer;
  }

  switch-hint {
    font-size: calc(var(--unit, 4px) * 3.25);
    color: var(--muted-foreground, #71717a);
  }

  switch-field[data-tone="danger"] switch-hint {
    color: var(--destructive, #dc2626);
  }
</style>
`,
    },
  ],
};

const statCard = {
  slug: 'stat-card',
  title: 'Stat Card',
  description: 'One number with a caption and a direction, for dashboards.',
  category: 'Layout',
  icon: 'layout',
  versions: [
    {
      notes: 'Label and value.',
      props: [
        { name: 'label', type: 'text', default: 'Revenue', description: 'What the number measures.' },
        { name: 'value', type: 'text', default: '€24,180', description: 'The number itself, already formatted.' },
      ],
      html: `
<stat-card>
  <stat-label>@[label]</stat-label>
  <stat-value>@[value]</stat-value>
</stat-card>

<style>
  stat-card {
    display: flex;
    flex-direction: column;
    gap: calc(var(--unit, 4px) * 1);
    padding: calc(var(--unit, 4px) * 5);
    border: 1px solid var(--border, #e4e4e7);
    border-radius: var(--radius, 8px);
    min-width: calc(var(--unit, 4px) * 44);
  }

  stat-label {
    font-size: calc(var(--unit, 4px) * 3.25);
    color: var(--muted-foreground, #71717a);
  }

  stat-value {
    font-size: calc(var(--unit, 4px) * 8);
    font-weight: 700;
    line-height: 1.1;
  }
</style>
`,
    },
    {
      notes: 'Delta and trend, so the number has a direction.',
      props: [
        { name: 'label', type: 'text', default: 'Revenue', description: 'What the number measures.' },
        { name: 'value', type: 'text', default: '€24,180', description: 'The number itself, already formatted.' },
        { name: 'delta', type: 'text', default: '+12.4%', description: 'Change against the previous period.' },
        {
          name: 'trend',
          type: 'select',
          options: ['up', 'flat', 'down'],
          default: 'up',
          description: 'Colours the delta. Up is green, down is red, flat is grey.',
        },
      ],
      html: `
<stat-card>
  <stat-label>@[label]</stat-label>
  <stat-value>@[value]</stat-value>
  <!-- if delta -->
  <stat-delta data-trend="@[trend]">@[delta]</stat-delta>
  <!-- /if -->
</stat-card>

<style>
  stat-card {
    display: flex;
    flex-direction: column;
    gap: calc(var(--unit, 4px) * 1);
    padding: calc(var(--unit, 4px) * 5);
    border: 1px solid var(--border, #e4e4e7);
    border-radius: var(--radius, 8px);
    min-width: calc(var(--unit, 4px) * 44);
  }

  stat-label {
    font-size: calc(var(--unit, 4px) * 3.25);
    color: var(--muted-foreground, #71717a);
  }

  stat-value {
    font-size: calc(var(--unit, 4px) * 8);
    font-weight: 700;
    line-height: 1.1;
  }

  stat-delta {
    font-size: calc(var(--unit, 4px) * 3.5);
    font-weight: 600;
    color: var(--muted-foreground, #71717a);
  }

  stat-delta[data-trend="up"] { color: #16a34a; }
  stat-delta[data-trend="down"] { color: var(--destructive, #dc2626); }
</style>
`,
    },
  ],
};

const hint = {
  slug: 'hint',
  title: 'Hint',
  description: 'A short notice in one of three tones, for forms and empty states.',
  category: 'Feedback',
  icon: 'bell',
  versions: [
    {
      notes: 'Three tones and a dismiss.',
      props: [
        {
          name: 'text',
          type: 'text',
          default: 'Unpinned components always render their latest revision.',
          description: 'The message.',
        },
        {
          name: 'tone',
          type: 'select',
          options: ['info', 'success', 'danger'],
          default: 'info',
          description: 'Picks the accent colour and the left bar.',
        },
        {
          name: 'dismissable',
          type: 'boolean',
          default: true,
          description: 'Shows a close button that hides the hint.',
        },
      ],
      html: `
<script type="module">
  import component from '@ape-egg/vibe/component';

  component({ open: true });
</script>

<hint-box data-tone="@[tone]" gone="@[!this.open]">
  <hint-text>@[text]</hint-text>
  <!-- if dismissable -->
  <button tertiary onclick="this.open = false">&times;</button>
  <!-- /if -->
</hint-box>

<style>
  hint-box[gone] { display: none; }

  hint-box {
    display: flex;
    align-items: center;
    gap: calc(var(--unit, 4px) * 3);
    padding: calc(var(--unit, 4px) * 3) calc(var(--unit, 4px) * 4);
    border-left: 3px solid #2563eb;
    border-radius: var(--radius, 8px);
    background: color-mix(in oklab, #2563eb 8%, transparent);
    font-size: calc(var(--unit, 4px) * 3.5);
  }

  hint-text { flex: 1; }

  hint-box[data-tone="success"] {
    border-left-color: #16a34a;
    background: color-mix(in oklab, #16a34a 8%, transparent);
  }

  hint-box[data-tone="danger"] {
    border-left-color: #dc2626;
    background: color-mix(in oklab, #dc2626 8%, transparent);
  }
</style>
`,
    },
  ],
};

const copyButton = {
  slug: 'copy-button',
  title: 'Copy Button',
  description: 'Copies a string to the clipboard and says so until you move away.',
  category: 'Interactive',
  icon: 'embed',
  versions: [
    {
      notes: 'Copy, then confirm.',
      props: [
        { name: 'label', type: 'text', default: 'Copy', description: 'Resting label.' },
        { name: 'value', type: 'text', default: 'npm install @ape-egg/vibe', description: 'What lands on the clipboard.' },
        { name: 'done', type: 'text', default: 'Copied', description: 'Label shown after a successful copy.' },
      ],
      html: `
<script type="module">
  import component from '@ape-egg/vibe/component';

  component({
    copied: false,
    async copy(value) {
      await navigator.clipboard.writeText(value);
      this.copied = true;
    },
  });
</script>

<button secondary data-value="@[value]" onclick="this.copy(event.currentTarget.dataset.value)" onmouseleave="this.copied = false">
  <!-- if this.copied -->@[done]<!-- else -->@[label]<!-- /if -->
</button>
`,
    },
  ],
};

const avatar = {
  slug: 'avatar',
  title: 'Avatar',
  description: 'Initials in a circle, coloured from the name. No image to load.',
  category: 'Layout',
  icon: 'user',
  versions: [
    {
      notes: 'Initials, sized.',
      props: [
        { name: 'name', type: 'text', default: 'Ada Lovelace', description: 'Full name. The first two initials are drawn.' },
        {
          name: 'size',
          type: 'select',
          options: ['sm', 'md', 'lg'],
          default: 'md',
          description: 'Diameter of the circle.',
        },
      ],
      html: `
<avatar-circle data-size="@[size]">@[name.split(' ').slice(0, 2).map(part => part[0]).join('').toUpperCase()]</avatar-circle>

<style>
  avatar-circle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: calc(var(--unit, 4px) * 10);
    height: calc(var(--unit, 4px) * 10);
    border-radius: 50%;
    background: var(--primary, #18181b);
    color: var(--primary-foreground, #fafafa);
    font-weight: 700;
    font-size: calc(var(--unit, 4px) * 3.5);
    user-select: none;
  }

  avatar-circle[data-size="sm"] {
    width: calc(var(--unit, 4px) * 7);
    height: calc(var(--unit, 4px) * 7);
    font-size: calc(var(--unit, 4px) * 2.75);
  }

  avatar-circle[data-size="lg"] {
    width: calc(var(--unit, 4px) * 16);
    height: calc(var(--unit, 4px) * 16);
    font-size: calc(var(--unit, 4px) * 6);
  }
</style>
`,
    },
  ],
};

export default [counter, switchField, statCard, hint, copyButton, avatar];

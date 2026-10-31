import { describe, expect, test } from 'bun:test';

import { autoTags, functions } from '../app/js/tags.js';

const script = (state) => `<script type="module">component(${state});</script>`;

describe('functions', () => {
  test('lists every function handed to component(), however it is written', () => {
    expect(
      functions(script(`{ count: 0, increment() { this.count++; }, async load(a) { go(); }, open: () => {}, pick: (n) => n, f: function () {} }`)),
    ).toEqual(['increment', 'load', 'open', 'pick', 'f']);
  });

  test('a function nested in a value is not the component\'s own', () => {
    expect(functions(script(`{ user: { greet() {} }, items: [() => 1] }`))).toEqual([]);
  });

  test('tags a component that exposes one', () => {
    expect(autoTags({ html: script(`{ close: () => {} }`), props: [] })).toContain('Functions');
    expect(autoTags({ html: script(`{ count: 0 }`), props: [] })).not.toContain('Functions');
  });
});

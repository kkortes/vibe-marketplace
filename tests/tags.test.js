import { describe, expect, test } from 'bun:test';

import { autoTags, listeners } from '../app/js/tags.js';

const script = (code) => `<script type="module">${code}</script>`;

describe('listeners', () => {
  test('lists every event listened for on the window or the document, once each', () => {
    expect(
      listeners(script(`addEventListener('notify', notify); window.addEventListener("keydown", a); addEventListener('keydown', b); document.addEventListener('visibilitychange', c);`)),
    ).toEqual([
      { target: 'window', event: 'notify' },
      { target: 'window', event: 'keydown' },
      { target: 'document', event: 'visibilitychange' },
    ]);
  });

  test('a listener on an element of its own is out of the page\'s reach', () => {
    expect(listeners(script(`root().addEventListener('click', go); el.addEventListener('input', go);`))).toEqual([]);
  });

  test('tags a component that attaches one', () => {
    expect(autoTags({ html: script(`addEventListener('notify', notify);`), props: [] })).toContain('Functions');
    expect(autoTags({ html: script(`component({ close: () => {} });`), props: [] })).not.toContain('Functions');
  });
});

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

  test('reads a detail example off a destructured handler, valued by what the markup compares it with', () => {
    const [{ example }] = listeners(
      `${script(`const notify = ({ detail: { type, message } }) => show(type, message.trim()); addEventListener('notify', notify);`)}<!-- if item.type === 'error' -->`,
    );
    expect(example).toEqual({ type: 'error', message: 'message' });
  });

  test('reads what an inline handler takes off its event, a called method dropped', () => {
    const [{ example }] = listeners(script(`addEventListener('save', (event) => store(event.detail.user.name.trim(), event.detail.id));`));
    expect(example).toEqual({ user: { name: 'name' }, id: 'id' });
  });

  test('a keyboard listener gets the key and code it reads, a real key where nothing is compared', () => {
    const [escape] = listeners(script(`const escape = ({ code }) => code === 'Escape' && close(); addEventListener('keydown', escape);`));
    const [held] = listeners(script(`function held(event) { const { code, metaKey } = event; return code.toLowerCase(); } addEventListener('keyup', held);`));
    expect(escape.example).toEqual({ code: 'Escape' });
    expect(held.example).toEqual({ code: 'Enter' });
  });

  test('a handler that reads nothing off its event has no example', () => {
    expect(listeners(script(`addEventListener('resize', () => fit());`))[0].example).toBeUndefined();
  });

  test('tags a component that attaches one', () => {
    expect(autoTags({ html: script(`addEventListener('notify', notify);`), props: [] })).toContain('Functions');
    expect(autoTags({ html: script(`component({ close: () => {} });`), props: [] })).not.toContain('Functions');
  });
});

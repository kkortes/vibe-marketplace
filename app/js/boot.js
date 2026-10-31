import afterVibeReady from '/js/afterVibeReady.js';
import { initAuth } from '/js/auth.js';
import { initWs } from '/js/ws.js';
import { resolvePins } from '/js/pin.js';

// The page calls vibe() itself, inside `mount`: the compiler reads a page's
// state from that call alone, and stamps a page it finds none for as if every
// key were undefined. Pinned `<component src>` tags are resolved before `mount`
// reads the document, so the runtime only ever sees an address it can fetch.
export default (mount, onOpen) => {
  resolvePins();

  window.$ = mount();

  afterVibeReady();
  initWs(onOpen);
  initAuth();

  return window.$;
};

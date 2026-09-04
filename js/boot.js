import vibe from '/modules/@ape-egg/vibe/index.js';

import afterVibeReady from '/js/afterVibeReady.js';
import globalState from '/js/globalState.js';
import { initAuth, signIn, signOut } from '/js/auth.js';
import { initWs } from '/js/ws.js';
import { resolvePins } from '/js/pin.js';

export default (state = {}, onOpen, config = {}) => {
  // Pinned `<component src>` tags are resolved before vibe reads the document,
  // so the runtime only ever sees an address it can actually fetch.
  resolvePins();

  window.$ = vibe({ ...globalState, ...state, signIn, signOut }, config);

  afterVibeReady();
  initWs(onOpen);
  initAuth();

  return window.$;
};

import { get } from '/js/localStorage.js';

export default {
  user: null,
  // With no stored token there is nothing to resume, so the sign-in control in
  // the chrome is right from the first paint instead of behind a spinner that
  // waits on a socket it does not need.
  authReady: !get('mkp-session'),
  wsConnected: false,
  userMenuOpen: false,
  darkMode: get('mkp-darkMode') ?? true,
  // Set once the frontpage search bar has stuck; the wordmark clears it.
  browsed: get('mkp-browsed') ?? false,
  path: location.pathname,
  notice: '',
  // The tag picked in the catalogue. The frontpage and /<namespace> filter in place;
  // picking one anywhere else opens the frontpage filtered by it.
  tag: '',
  pick: (name) => location.assign(`/tag/${encodeURIComponent(name.toLowerCase())}`),
};

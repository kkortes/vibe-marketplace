import { get } from '/js/localStorage.js';

export default {
  user: null,
  // With no stored token there is nothing to resume, so the sign-in control in
  // the chrome is right from the first paint instead of behind a spinner that
  // waits on a socket it does not need.
  authReady: !get('mkp-session'),
  wsConnected: false,
  userMenuOpen: false,
  darkMode: get('mkp-darkMode'),
  notice: '',
};

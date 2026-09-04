import { get } from '/js/localStorage.js';

export default {
  user: null,
  authReady: false,
  wsConnected: false,
  userMenuOpen: false,
  darkMode: get('mkp-darkMode'),
  notice: '',
};

import { call } from '/js/ws.js';
import { set } from '/js/localStorage.js';

const GOOGLE_CLIENT_ID =
  '818843980176-15qn16b9k8b0gfv2q518bf4dbb159vg7.apps.googleusercontent.com';

const handleCredential = async ({ credential }) => {
  try {
    const { token, user } = await call('login/google', { token: credential });

    set('mkp-session', token);
    window.$.user = user;

    // Hand the fresh token to the socket client so an automatic reconnect
    // replays it. `aaw/resume` is the event that binds a token to a connection.
    await call('aaw/resume', { token });
  } catch ({ message }) {
    window.$.notice = message;
  }
};

const configure = () =>
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredential,
    auto_select: true,
  });

export const signIn = () => {
  configure();
  google.accounts.id.prompt();
};

export const signOut = async () => {
  await call('aaw/logout');

  set('mkp-session', null);
  window.$.user = null;
  window.$.userMenuOpen = false;
  google.accounts.id.disableAutoSelect();
};

export const initAuth = () =>
  document.readyState === 'complete'
    ? configure()
    : window.addEventListener('load', configure);

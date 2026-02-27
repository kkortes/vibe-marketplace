import { ws } from '/js/ws.js';
import { set } from '/js/localStorage.js';

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';

const handleCredential = async (response) => {
  try {
    const user = await ws.sendAsync('auth/google', { token: response.credential });
    set('mkp-session', user.token);
    window.$.user = user;
  } catch ({ error }) {
    console.error('Auth failed:', error);
  }
};

export const signIn = () => {
  google.accounts.id.prompt();
};

export const signOut = () => {
  window.$.user = null;
  set('mkp-session', null);
  google.accounts.id.disableAutoSelect();
};

export const initAuth = () => {
  const tryInit = () => {
    if (typeof google === 'undefined') return;
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredential,
      auto_select: true,
    });
  };

  if (document.readyState === 'complete') {
    tryInit();
  } else {
    window.addEventListener('load', tryInit);
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const user = await ws.sendAsync('auth/email', { email, password });
    set('mkp-session', user.token);
    window.$.user = user;
  } catch ({ error }) {
    console.error('Auth failed:', error);
  }
};

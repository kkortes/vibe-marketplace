import aaw from '/node_modules/async-await-websockets/client.js';
import { get } from '/js/localStorage.js';

const WS_URL = 'ws://localhost:1337';

export let ws = null;

export const initWs = () => {
  ws = aaw(WS_URL);

  ws.on('open', async () => {
    window.$.wsConnected = true;

    const token = get('mkp-session');
    if (token) {
      try {
        const user = await ws.sendAsync('auth/session', { token });
        window.$.user = user;
      } catch (_) {
        // Session expired, silently clear
      }
    }
  });

  ws.on('close', () => { window.$.wsConnected = false; });
};

import aaw from "/lib/aaw.js";
import { get } from "/js/localStorage.js";

// const WS_URL = 'ws://localhost:1337';
const WS_URL = "wss://vibe-marketplace.onrender.com";

export let ws = null;

export const initWs = () => {
  ws = aaw(WS_URL);
  window.ws = ws;

  ws.on("open", async () => {
    window.$.wsConnected = true;

    const token = get("mkp-session");
    if (token) {
      try {
        const user = await ws.sendAsync("auth/session", { token });
        window.$.user = user;
      } catch (_) {
        // Session expired, silently clear
      }
    }
  });

  ws.on("close", () => {
    window.$.wsConnected = false;
  });
};

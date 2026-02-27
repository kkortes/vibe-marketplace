const local = ['localhost', '127.0.0.1'].includes(window.location.hostname);

export const WS_URL = local ? 'ws://localhost:1337' : 'wss://vibe-marketplace.onrender.com';
export const HTTP_URL = local ? 'http://localhost:8080' : 'https://vibe-marketplace.korte.kim';

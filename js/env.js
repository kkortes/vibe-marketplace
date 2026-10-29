const { hostname } = window.location;
const local = hostname === '127.0.0.1' || hostname.split('.').at(-1) === 'localhost';

export const WS_URL = local ? 'ws://localhost:1337' : 'wss://vibe-marketplace.onrender.com';
export const HTTP_URL = local ? 'http://localhost:8080' : 'https://vibe-marketplace.korte.kim';

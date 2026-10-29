const { hostname } = window.location;
const local = hostname === '127.0.0.1' || hostname.split('.').at(-1) === 'localhost';

export const WS_URL = local ? 'ws://localhost:1337' : 'wss://vibe-marketplace.onrender.com';

// Where a component's own source lives. This is the origin that ends up inside
// every `<component src>` a visitor copies off the site.
export const SOURCE_URL = local ? 'http://localhost:8080' : 'https://vibe-components.com';

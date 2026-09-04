const local = ['localhost', '127.0.0.1'].includes(window.location.hostname);

export const WS_URL = local ? 'ws://localhost:1337' : 'wss://vibe-marketplace.onrender.com';

// Where a component's own source lives. This is the origin that ends up inside
// every `<component src>` a visitor copies off the site.
export const SOURCE_URL = local ? 'http://localhost:8080' : 'https://vibe-components.com';

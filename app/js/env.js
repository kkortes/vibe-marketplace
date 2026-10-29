const { hostname } = window.location;
const local = hostname === '127.0.0.1' || hostname.split('.').at(-1) === 'localhost';

export const ORIGIN = local ? 'https://viberary.local.korte.kim' : 'https://viberary.korte.kim';

// The Worker that serves this site also answers the socket, at `/ws`.
export const WS_URL = local ? 'ws://localhost:1337/ws' : `${ORIGIN.replace('https', 'wss')}/ws`;

// Where a component's own source lives. This is the origin that ends up inside
// every `<component src>` a visitor copies off the site.
export const SOURCE_URL = local ? 'http://localhost:1337' : ORIGIN;

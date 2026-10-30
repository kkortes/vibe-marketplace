const { hostname } = window.location;
const local = hostname === '127.0.0.1' || hostname.split('.').at(-1) === 'localhost' || hostname.includes('.local.');

// In dev, `bun dev` runs the same Worker as production behind whichever host
// the page was opened on, so the page's own origin is the site, the socket and
// the component source alike.
export const ORIGIN = local ? window.location.origin : 'https://viberary.korte.kim';

// The Worker that serves this site also answers the socket, at `/ws`.
export const WS_URL = `${ORIGIN.replace(/^http/, 'ws')}/ws`;

// Where a component's own source lives. This is the origin that ends up inside
// every `<component src>` a visitor copies off the site.
export const SOURCE_URL = ORIGIN;

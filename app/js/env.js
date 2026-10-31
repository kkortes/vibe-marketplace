const { hostname } = window.location;
const local = hostname === '127.0.0.1' || hostname.split('.').at(-1) === 'localhost' || hostname.includes('.local.');

// A Workers preview is served at `<alias>-viberary.viberary.workers.dev`;
// production's own workers.dev host is `viberary.viberary.workers.dev`, without
// the alias, so the leading dash tells them apart.
export const PREVIEW = hostname.endsWith('-viberary.viberary.workers.dev');

// In dev and on a preview, the page's own Worker is the site, the socket and the
// component source alike, so a preview talks to its own preview database.
export const ORIGIN = local || PREVIEW ? window.location.origin : 'https://viberary.korte.kim';

// The Worker that serves this site also answers the socket, at `/ws`.
export const WS_URL = `${ORIGIN.replace(/^http/, 'ws')}/ws`;

// Where a component's own source lives. This is the origin that ends up inside
// every `<component src>` a visitor copies off the site.
export const SOURCE_URL = ORIGIN;

import { call } from '/js/ws.js';

export const state = {
  // The Worker serves this page at /<namespace>.
  namespace: location.pathname.slice(1),
  listed: [],
  loading: true,
};

export const load = async () => {
  window.$.listed = (await call('components/list')).filter(({ namespace }) => namespace === window.$.namespace);
  window.$.loading = false;
};

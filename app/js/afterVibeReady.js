import { get, set } from '/js/localStorage.js';

if (get('mkp-darkMode')) {
  document.body.classList.add('dark');
}

const afterVibeReady = () => {
  window.$.on('afterUpdate', (current, prev) => {
    if (current.darkMode !== prev.darkMode) {
      set('mkp-darkMode', current.darkMode);
      document.body.classList.toggle('dark', current.darkMode);
    }
  });
};

export default afterVibeReady;

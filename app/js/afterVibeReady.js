import { set } from '/js/localStorage.js';
import globalState from '/js/globalState.js';

document.body.classList.toggle('dark', globalState.darkMode);

const afterVibeReady = () => {
  window.$.on('afterUpdate', (current, prev) => {
    if (current.darkMode !== prev.darkMode) {
      set('mkp-darkMode', current.darkMode);
      document.body.classList.toggle('dark', current.darkMode);
    }
  });
};

export default afterVibeReady;

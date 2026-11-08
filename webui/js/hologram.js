/* AAIRAGALAXY HOLOGRAM ENGINE */
(() => {
  "use strict";

  let active = true;

  function setHologramActive(nextState) {
    active = Boolean(nextState);
    const hologram = document.querySelector(".hologram");
    if (hologram) hologram.classList.toggle("hologram-disabled", !active);
    return active;
  }

  window.AairaHologram = {
    activate: () => setHologramActive(true),
    deactivate: () => setHologramActive(false),
    toggle: () => setHologramActive(!active),
    isActive: () => active
  };
})();

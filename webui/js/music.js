/* AAIRAGALAXY VISUALIZER CONTROLS
 * This module animates the visualizer only; it does not play audio.
 */
(() => {
  "use strict";

  let enabled = true;

  function setVisualizerEnabled(nextState) {
    enabled = Boolean(nextState);
    document.querySelectorAll(".musicbar").forEach(bar => {
      bar.classList.toggle("visualizer-paused", !enabled);
    });
    return enabled;
  }

  function getVisualizerStatus() {
    return { enabled, audioPlayback: false };
  }

  window.AairaMusic = {
    play: () => setVisualizerEnabled(true),
    pause: () => setVisualizerEnabled(false),
    toggle: () => setVisualizerEnabled(!enabled),
    getStatus: getVisualizerStatus
  };
})();

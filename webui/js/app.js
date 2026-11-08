/* AAIRAGALAXY APPLICATION */
(() => {
  "use strict";

  function initializeClock() {
    const clock = document.getElementById("clock");
    if (!clock) return;

    const update = () => {
      const now = new Date();
      clock.dateTime = now.toISOString();
      clock.textContent = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    };

    update();
    window.setInterval(update, 1000);
  }

  function initializeApplication() {
    initializeClock();

    if (typeof initializeTelemetry === "function") {
      initializeTelemetry();
    }

    const input = document.getElementById("userInput");
    if (input) {
      input.addEventListener("keydown", event => {
        if (event.key === "Enter" && typeof sendMessage === "function") {
          event.preventDefault();
          sendMessage();
        }
      });
    }

    console.info("AairaGalaxy initialized.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApplication, { once: true });
  } else {
    initializeApplication();
  }
})();

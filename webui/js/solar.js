/* AAIRAGALAXY SOLAR SYSTEM ENGINE */
(() => {
  "use strict";

  const PLANETS = ["mercury", "venus", "earth", "mars", "jupiter", "saturn"];
  let paused = false;

  function setSolarPaused(nextState) {
    paused = Boolean(nextState);
    const solar = document.querySelector(".solar");
    if (solar) solar.classList.toggle("solar-paused", paused);
    return paused;
  }

  function focusPlanet(name) {
    const planetName = String(name || "").toLowerCase();
    if (!PLANETS.includes(planetName)) return false;

    const target = document.querySelector(".planet." + planetName);
    if (!target) return false;

    document.querySelectorAll(".planet.planet-selected").forEach(node => {
      node.classList.remove("planet-selected");
    });
    target.classList.add("planet-selected");
    window.setTimeout(() => target.classList.remove("planet-selected"), 2200);
    return true;
  }

  function getSolarStatus() {
    return { paused, planets: PLANETS.slice() };
  }

  window.AairaSolar = { setPaused: setSolarPaused, focusPlanet, getStatus: getSolarStatus };
})();

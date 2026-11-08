/* AAIRAGALAXY AI ENGINE */
function addConsoleMessage(label, message) {
  const chatbox = document.getElementById("chatbox");
  if (!chatbox) return;
  const line = document.createElement("div");
  const prefix = document.createElement("span");
  prefix.textContent = "> " + String(label) + ": ";
  const content = document.createElement("span");
  content.textContent = String(message);
  line.append(prefix, content);
  chatbox.appendChild(line);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("userInput");
  if (!input) return;
  const rawText = input.value.trim();
  if (!rawText) return;

  const text = rawText.toLowerCase();
  addConsoleMessage("YOU", rawText);
  input.value = "";
  let response = "Command not recognized. Try: status, solar pause, solar resume, focus earth, music pause, hologram, camera, time, or diagnostic.";

  if (/^(hello|hi|hey)\b/.test(text)) {
    response = "Hello. AairaGalaxy command core is online.";
  } else if (text.includes("stop camera") || text.includes("close camera")) {
    if (typeof stopCamera === "function") { stopCamera(); response = "Camera stopped."; }
    else response = "Camera module is unavailable.";
  } else if (text.includes("camera") || text.includes("webcam")) {
    if (typeof startCamera === "function") {
      startCamera();
      response = "Camera activation requested. Approve the browser permission prompt.";
    } else response = "Camera module is unavailable.";
  } else if (text.includes("solar pause") || text.includes("pause orbit")) {
    if (window.AairaSolar) { window.AairaSolar.setPaused(true); response = "Planetary orbits paused."; }
  } else if (text.includes("solar resume") || text.includes("resume orbit")) {
    if (window.AairaSolar) { window.AairaSolar.setPaused(false); response = "Planetary orbits resumed."; }
  } else if (text.startsWith("focus ") || text.startsWith("show planet ")) {
    const planet = text.replace(/^focus\s+|^show planet\s+/, "").trim().split(/\s+/)[0];
    response = window.AairaSolar && window.AairaSolar.focusPlanet(planet)
      ? "Focused on " + planet + "."
      : "Planet not found. Available: Mercury, Venus, Earth, Mars, Jupiter, Saturn.";
  } else if (text.includes("music pause") || text.includes("visualizer pause")) {
    if (window.AairaMusic) { window.AairaMusic.pause(); response = "Visualizer paused. No audio playback is controlled by this module."; }
  } else if (text.includes("music") || text.includes("visualizer")) {
    if (window.AairaMusic) { window.AairaMusic.play(); response = "Music visualizer animation enabled. This does not start audio playback."; }
  } else if (text.includes("hologram off") || text.includes("hide hologram")) {
    if (window.AairaHologram) { window.AairaHologram.deactivate(); response = "Hologram display hidden."; }
  } else if (text.includes("hologram")) {
    if (window.AairaHologram) { window.AairaHologram.activate(); response = "Hologram display activated."; }
  } else if (text.includes("status")) {
    const camera = typeof getCameraStatus === "function" && getCameraStatus();
    const solar = window.AairaSolar ? window.AairaSolar.getStatus() : null;
    response = "Interface operational. Camera " + (camera ? "active" : "inactive") +
      ". Orbits " + (solar && solar.paused ? "paused." : "running.");
  } else if (text.includes("solar") || text.includes("planet")) {
    response = "Solar system display ready. Try 'focus earth' or 'solar pause'.";
  } else if (text.includes("scan")) {
    response = "Sector scan animation started.";
    document.body.classList.add("scan-active");
    window.setTimeout(() => document.body.classList.remove("scan-active"), 700);
  } else if (text.includes("time")) {
    response = "Current system time: " + new Date().toLocaleTimeString();
  } else if (text.includes("diagnostic")) {
    response = "Interface diagnostic completed. Browser CPU and RAM metrics are not exposed.";
    document.querySelectorAll(".hudbox").forEach(panel => {
      panel.classList.add("diagnostic-active");
      window.setTimeout(() => panel.classList.remove("diagnostic-active"), 1200);
    });
  } else if (text.includes("terminal")) {
    response = "Terminal interface ready. Remote shell execution is disabled.";
  } else if (text.includes("weather")) {
    response = "Weather data is unavailable in offline mode.";
  }

  window.setTimeout(() => {
    addConsoleMessage("AAIRAGALAXY", response);
    if (typeof speakMessage === "function") speakMessage(response);
  }, 200);
}

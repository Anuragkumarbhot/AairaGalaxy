/* AAIRAGALAXY PHASE 4 — CONVERSATION + SAFE LOCAL TOOLS */
(function () {
  "use strict";
  const HISTORY_KEY = "aaira.conversation.v1";
  const PERMISSIONS_KEY = "aaira.tool-permissions.v1";
  const MAX_MESSAGES = 80;
  let aairaConversation = loadHistory();

  function loadHistory() {
    try {
      const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      if (!Array.isArray(saved)) return [];
      return saved.filter(item => item && ["user", "assistant"].includes(item.role) &&
        typeof item.content === "string").slice(-MAX_MESSAGES);
    } catch (_) { return []; }
  }
  function persistHistory() {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(aairaConversation.slice(-MAX_MESSAGES))); }
    catch (_) { addConsoleMessage("STORAGE", "Conversation could not be saved. Device storage may be full."); }
  }
  function appendHistory(role, content) {
    aairaConversation.push({ role, content: String(content).slice(0, 4000), at: Date.now() });
    aairaConversation = aairaConversation.slice(-MAX_MESSAGES);
    persistHistory();
  }
  function getPermissions() {
    try { return JSON.parse(localStorage.getItem(PERMISSIONS_KEY) || "{}"); }
    catch (_) { return {}; }
  }
  function runLocalTool(toolName, action) {
    const permissions = getPermissions();
    if (permissions[toolName] !== true) {
      const approved = window.confirm(
        "AairaGalaxy permission request\n\nAllow this local action: " + toolName +
        "?\n\nOnly this named action is allowed. No terminal or arbitrary shell access is provided."
      );
      if (!approved) return "Permission denied for " + toolName + ".";
      permissions[toolName] = true;
      try { localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions)); }
      catch (_) { return "Permission could not be saved; action was not executed."; }
    }
    try { return action(); }
    catch (_) { return "The requested local action failed."; }
  }
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
  function renderHistory() {
    const chatbox = document.getElementById("chatbox");
    if (!chatbox) return;
    chatbox.replaceChildren();
    addConsoleMessage("AAIRAGALAXY", "Conversation history restored from this browser.");
    aairaConversation.slice(-20).forEach(item => addConsoleMessage(item.role === "user" ? "YOU" : "AAIRA", item.content));
  }
  async function askAairaAI(message) {
    addConsoleMessage("AAIRA", "Connecting to AI service...");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          language: window.AairaVoice ? window.AairaVoice.getLanguage() : "en",
          history: aairaConversation.slice(0, -1).slice(-12).map(item => ({ role: item.role, content: item.content }))
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "AI service returned HTTP " + response.status);
      if (!data.reply) throw new Error("AI service returned an empty response.");
      appendHistory("assistant", data.reply);
      addConsoleMessage("AAIRAGALAXY AI", data.reply);
      if (window.AairaVoice) window.AairaVoice.speakMessage(data.reply);
    } catch (error) {
      const detail = error && error.message ? error.message : "Unknown connection error";
      addConsoleMessage("AI OFFLINE", detail + ". Check the backend and API configuration.");
    }
  }
  function sendMessage() {
    const input = document.getElementById("userInput");
    if (!input) return;
    const rawText = input.value.trim();
    if (!rawText) return;
    input.value = "";
    addConsoleMessage("YOU", rawText);
    appendHistory("user", rawText);
    const text = rawText.toLowerCase();
    let response = null;

    if (/^(hello|hi|hey)\b/.test(text)) {
      response = "Hello. AairaGalaxy is online. You can speak in English, Hindi, or Punjabi.";
    } else if (text.includes("stop camera") || text.includes("close camera")) {
      response = runLocalTool("camera", () => {
        if (typeof stopCamera !== "function") return "Camera module is unavailable.";
        stopCamera(); return "Camera stopped.";
      });
    } else if (text.includes("camera") || text.includes("webcam")) {
      response = runLocalTool("camera", () => {
        if (typeof startCamera !== "function") return "Camera module is unavailable.";
        startCamera(); return "Camera request sent. Approve the browser permission prompt if shown.";
      });
    } else if (text.includes("solar pause") || text.includes("pause orbit")) {
      response = runLocalTool("solar-display", () => {
        if (!window.AairaSolar) return "Solar module is unavailable.";
        window.AairaSolar.setPaused(true); return "Planetary orbits paused.";
      });
    } else if (text.includes("solar resume") || text.includes("resume orbit")) {
      response = runLocalTool("solar-display", () => {
        if (!window.AairaSolar) return "Solar module is unavailable.";
        window.AairaSolar.setPaused(false); return "Planetary orbits resumed.";
      });
    } else if (text.startsWith("focus ") || text.startsWith("show planet ")) {
      const planet = text.replace(/^focus\s+|^show planet\s+/, "").trim().split(/\s+/)[0];
      response = runLocalTool("solar-display", () =>
        window.AairaSolar && window.AairaSolar.focusPlanet(planet)
          ? "Focused on " + planet + "."
          : "Planet not found. Available: Mercury, Venus, Earth, Mars, Jupiter, Saturn.");
    } else if (text.includes("music pause") || text.includes("visualizer pause")) {
      response = runLocalTool("visualizer", () => {
        if (!window.AairaMusic) return "Visualizer module is unavailable.";
        window.AairaMusic.pause(); return "Visualizer animation paused.";
      });
    } else if (text.includes("music") || text.includes("visualizer")) {
      response = runLocalTool("visualizer", () => {
        if (!window.AairaMusic) return "Visualizer module is unavailable.";
        window.AairaMusic.play(); return "Visualizer animation enabled. No audio playback was started.";
      });
    } else if (text.includes("hologram off") || text.includes("hide hologram")) {
      response = runLocalTool("hologram", () => {
        if (!window.AairaHologram) return "Hologram module is unavailable.";
        window.AairaHologram.deactivate(); return "Hologram hidden.";
      });
    } else if (text.includes("hologram")) {
      response = runLocalTool("hologram", () => {
        if (!window.AairaHologram) return "Hologram module is unavailable.";
        window.AairaHologram.activate(); return "Hologram activated.";
      });
    } else if (text.includes("status")) {
      const camera = typeof getCameraStatus === "function" && getCameraStatus();
      const solar = window.AairaSolar ? window.AairaSolar.getStatus() : null;
      response = "Interface operational. Camera " + (camera ? "active" : "inactive") +
        ". Orbits " + (solar && solar.paused ? "paused." : "running.");
    } else if (text.includes("time")) {
      response = "Current system time: " + new Date().toLocaleTimeString();
    } else if (text.includes("terminal") || text.includes("shell") || text.includes("command prompt")) {
      response = "Direct terminal and arbitrary shell execution are disabled for safety.";
    }

    if (response !== null) {
      addConsoleMessage("AAIRAGALAXY", response);
      appendHistory("assistant", response);
      if (window.AairaVoice) window.AairaVoice.speakMessage(response);
    } else {
      askAairaAI(rawText);
    }
  }
  function clearConversation() {
    if (!window.confirm("Delete this browser's saved AairaGalaxy conversation?")) return;
    aairaConversation = [];
    persistHistory();
    const chatbox = document.getElementById("chatbox");
    if (chatbox) chatbox.replaceChildren();
    addConsoleMessage("AAIRAGALAXY", "Conversation history cleared.");
  }
  function exportConversation() {
    const blob = new Blob([JSON.stringify(aairaConversation, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "aairagalaxy-conversation.json";
    link.click();
    URL.revokeObjectURL(url);
  }
  window.addConsoleMessage = addConsoleMessage;
  window.sendMessage = sendMessage;
  window.clearConversation = clearConversation;
  window.exportConversation = exportConversation;
  document.addEventListener("DOMContentLoaded", renderHistory);
})();
/* AAIRAGALAXY AI ENGINE */
function addConsoleMessage(label, message) {
  const chatbox = document.getElementById("chatbox");
  if (!chatbox) {
    console.error("AairaGalaxy: chatbox element not found.");
    return;
  }

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
  if (!input) {
    console.error("AairaGalaxy: userInput element not found.");
    return;
  }

  const rawText = input.value.trim();
  if (!rawText) return;

  const text = rawText.toLowerCase();
  addConsoleMessage("YOU", rawText);
  input.value = "";

  let response = "Command not recognized. Try: status, solar, scan, music, camera, stop camera, time, or diagnostic.";

  if (/^(hello|hi|hey)\b/.test(text)) {
    response = "Hello. AairaGalaxy neural systems are online.";
  } else if (text.includes("stop camera") || text.includes("close camera")) {
    if (typeof stopCamera === "function") {
      stopCamera();
      response = "Camera stopped.";
    } else {
      response = "Camera module is not available.";
    }
  } else if (text.includes("camera") || text.includes("webcam")) {
    if (typeof startCamera === "function") {
      startCamera();
      response = "Camera activation requested. Grant browser permission if prompted.";
    } else {
      response = "Camera module is not available.";
    }
  } else if (text.includes("status")) {
    const camera = typeof getCameraStatus === "function" && getCameraStatus();
    response = "AairaGalaxy interface operational. Camera " + (camera ? "active." : "inactive.");
  } else if (text.includes("solar") || text.includes("planet")) {
    response = "Orbital display synchronized.";
    const solar = document.querySelector(".solar");
    if (solar) {
      solar.style.transform = "scale(0.75)";
      window.setTimeout(() => { solar.style.transform = ""; }, 1200);
    }
  } else if (text.includes("scan")) {
    response = "Sector scan animation started.";
    document.body.classList.add("scan-active");
    window.setTimeout(() => document.body.classList.remove("scan-active"), 700);
  } else if (text.includes("music")) {
    response = "Music visualizer activated.";
    document.querySelectorAll(".musicbar").forEach(bar => {
      bar.style.animationDuration = (Math.random() + 0.5) + "s";
    });
  } else if (text.includes("time")) {
    response = "Current system time: " + new Date().toLocaleTimeString();
  } else if (text.includes("ai")) {
    response = "AairaGalaxy local command engine is active.";
  } else if (text.includes("diagnostic")) {
    response = "Interface diagnostic completed.";
    document.querySelectorAll(".hudbox").forEach(panel => {
      panel.classList.add("diagnostic-active");
      window.setTimeout(() => panel.classList.remove("diagnostic-active"), 1200);
    });
  } else if (text.includes("terminal")) {
    response = "Terminal interface ready. Remote shell execution is not enabled.";
  } else if (text.includes("weather")) {
    response = "Weather data is unavailable in offline mode.";
  }

  window.setTimeout(() => {
    addConsoleMessage("AAIRAGALAXY", response);
    if (typeof speakMessage === "function") speakMessage(response);
  }, 250);
}

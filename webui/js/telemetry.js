/* AAIRAGALAXY TELEMETRY ENGINE */
let batteryManager = null;
let telemetryTimer = null;

function getNetworkConnection() {
  return navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
}

async function initializeTelemetry() {
  await initializeBattery();
  updateNetwork();
  updateBattery();
  updateUnsupportedMetrics();

  if (telemetryTimer) window.clearInterval(telemetryTimer);
  telemetryTimer = window.setInterval(() => {
    updateBattery();
    updateNetwork();
  }, 10000);

  window.addEventListener("pagehide", () => {
    if (telemetryTimer) window.clearInterval(telemetryTimer);
    telemetryTimer = null;
  }, { once: true });
}

async function initializeBattery() {
  if (typeof navigator.getBattery !== "function") return;
  try {
    batteryManager = await navigator.getBattery();
    batteryManager.addEventListener("levelchange", updateBattery);
    batteryManager.addEventListener("chargingchange", updateBattery);
  } catch (error) {
    console.info("AairaGalaxy: battery telemetry unavailable.", error);
  }
}

function updateBattery() {
  const bar = document.getElementById("batteryBar");
  if (!bar) return;
  if (!batteryManager || typeof batteryManager.level !== "number") {
    bar.style.width = "0%";
    bar.title = "Battery telemetry unavailable in this browser";
    return;
  }
  const level = Math.round(batteryManager.level * 100);
  bar.style.width = level + "%";
  bar.title = "Battery: " + level + "%" + (batteryManager.charging ? " (charging)" : "");
}

function updateNetwork() {
  const bar = document.getElementById("netBar");
  if (!bar) return;
  const connection = getNetworkConnection();
  if (!connection) {
    bar.style.width = "0%";
    bar.title = "Network quality telemetry unavailable";
    return;
  }
  const downlink = Number(connection.downlink);
  const quality = Number.isFinite(downlink) ? Math.min(100, Math.max(5, downlink * 10)) : 0;
  bar.style.width = quality + "%";
  bar.title = "Network: " + (connection.effectiveType || "connection detected") +
    (Number.isFinite(downlink) ? " · " + downlink + " Mbps estimated downlink" : "");
}

function updateUnsupportedMetrics() {
  ["cpuBar", "ramBar"].forEach(id => {
    const bar = document.getElementById(id);
    if (!bar) return;
    bar.style.width = "0%";
    bar.title = "Not exposed by standard browser APIs";
  });
}

function getTelemetryStatus() {
  const connection = getNetworkConnection();
  return {
    battery: batteryManager ? Math.round(batteryManager.level * 100) : null,
    charging: batteryManager ? Boolean(batteryManager.charging) : null,
    network: connection ? (connection.effectiveType || null) : null,
    downlinkMbps: connection && Number.isFinite(Number(connection.downlink)) ? Number(connection.downlink) : null,
    cpu: null,
    ram: null
  };
}

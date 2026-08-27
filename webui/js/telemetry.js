/* AAIRAGALAXY TELEMETRY ENGINE */

let batteryManager = null;


async function initializeTelemetry() {

    initializeBattery();

    updateNetwork();

    updateBattery();

    setInterval(() => {

        updateBattery();
        updateNetwork();

    }, 5000);
}


/* BATTERY */

async function initializeBattery() {

    if (!("getBattery" in navigator)) {

        return;
    }

    try {

        batteryManager =
            await navigator.getBattery();

        batteryManager.addEventListener(
            "levelchange",
            updateBattery
        );

        batteryManager.addEventListener(
            "chargingchange",
            updateBattery
        );

        updateBattery();

    } catch (error) {

        console.warn(
            "Battery API unavailable:",
            error
        );
    }
}


function updateBattery() {

    const batteryBar =
        document.getElementById("batteryBar");

    if (!batteryBar) {
        return;
    }

    if (!batteryManager) {

        batteryBar.style.width = "0%";
        batteryBar.title = "Battery data unavailable";

        return;
    }

    const level =
        Math.round(
            batteryManager.level * 100
        );

    batteryBar.style.width =
        level + "%";

    batteryBar.title =
        `Battery: ${level}%`;
}


/* NETWORK */

function updateNetwork() {

    const netBar =
        document.getElementById("netBar");

    if (!netBar) {
        return;
    }

    const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

    if (!connection) {

        netBar.style.width = "0%";
        netBar.title = "Network information unavailable";

        return;
    }

    let quality = 50;

    if (connection.downlink) {

        quality =
            Math.min(
                100,
                Math.max(
                    10,
                    connection.downlink * 10
                )
            );
    }

    netBar.style.width =
        quality + "%";

    netBar.title =
        `Network: ${
            connection.effectiveType || "unknown"
        }`;
}


/* PUBLIC STATUS */

function getTelemetryStatus() {

    const status = {

        battery: null,
        network: null,
        cpu: null,
        ram: null

    };

    if (batteryManager) {

        status.battery =
            Math.round(
                batteryManager.level * 100
            );
    }

    const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

    if (connection) {

        status.network =
            connection.effectiveType || null;
    }

    /*
     * CPU and RAM are intentionally null.
     *
     * Browsers do not reliably expose real system
     * CPU/RAM usage. Do not invent values.
     */

    return status;
}
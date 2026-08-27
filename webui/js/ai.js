/* AAIRAGALAXY AI ENGINE */

function addConsoleMessage(label, message) {
    const chatbox = document.getElementById("chatbox");

    if (!chatbox) {
        console.error("AairaGalaxy: chatbox element not found.");
        return;
    }

    const line = document.createElement("div");

    const prefix = document.createElement("span");
    prefix.textContent = `> ${label}: `;

    const content = document.createElement("span");
    content.textContent = message;

    line.appendChild(prefix);
    line.appendChild(content);

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

    if (rawText === "") {
        return;
    }

    const text = rawText.toLowerCase();

    /* USER MESSAGE */
    addConsoleMessage("YOU", rawText);

    /* DEFAULT RESPONSE */
    let response = "Command not recognized.";

    /* HELLO */
    if (
        text.includes("hello") ||
        text.includes("hi")
    ) {

        response =
            "Hello Anurag. Neural systems online.";

    }

    /* STATUS */
    else if (text.includes("status")) {

        response =
            "All AairaGalaxy systems operational.";

    }

    /* SOLAR */
    else if (
        text.includes("solar") ||
        text.includes("planet")
    ) {

        response =
            "Orbital telemetry synchronized.";

        const solar = document.querySelector(".solar");

        if (solar) {

            solar.style.transform = "scale(0.75)";

            setTimeout(() => {

                solar.style.transform = "scale(0.68)";

            }, 1200);
        }
    }

    /* SCAN */
    else if (text.includes("scan")) {

        response =
            "Scanning nearby sectors...";

        document.body.style.filter =
            "brightness(1.3)";

        setTimeout(() => {

            document.body.style.filter =
                "brightness(1)";

        }, 700);
    }

    /* MUSIC */
    else if (text.includes("music")) {

        response =
            "Music reactor initialized.";

        const bars =
            document.querySelectorAll(".musicbar");

        bars.forEach(bar => {

            bar.style.animationDuration =
                (Math.random() + 0.5) + "s";

        });
    }

    /* CAMERA */
    else if (
        text.includes("camera") ||
        text.includes("webcam")
    ) {

        response =
            "Camera command received.";

        if (typeof startCamera === "function") {

            startCamera();

        } else {

            response =
                "Camera module is not available.";

        }
    }

    /* STOP CAMERA */
    else if (
        text.includes("stop camera") ||
        text.includes("close camera")
    ) {

        response =
            "Camera stop command received.";

        if (typeof stopCamera === "function") {

            stopCamera();

        } else {

            response =
                "Camera module is not available.";

        }
    }

    /* TIME */
    else if (text.includes("time")) {

        response =
            "The current system time is " +
            new Date().toLocaleTimeString();

    }

    /* AI */
    else if (text.includes("ai")) {

        response =
            "AairaGalaxy AI core fully active.";

    }

    /* DIAGNOSTIC */
    else if (text.includes("diagnostic")) {

        response =
            "Running neural diagnostics...";

        const panels =
            document.querySelectorAll(".hudbox");

        panels.forEach(panel => {

            panel.style.boxShadow =
                "0 0 40px cyan";

            setTimeout(() => {

                panel.style.boxShadow =
                    "0 0 20px cyan";

            }, 1200);

        });
    }

    /* TERMINAL */
    else if (text.includes("terminal")) {

        response =
            "Terminal systems synchronized.";

    }

    /* WEATHER */
    else if (text.includes("weather")) {

        response =
            "Weather telemetry unavailable offline.";

    }

    /* RESPONSE */
    setTimeout(() => {

        addConsoleMessage(
            "AAIRAGALAXY",
            response
        );

        if (typeof speakMessage === "function") {

            speakMessage(response);

        }

    }, 500);

    /* CLEAR INPUT */
    input.value = "";
}
/* AAIRAGALAXY CAMERA / GESTURE ENGINE */

let cameraStream = null;
let cameraActive = false;


async function startCamera() {

    if (cameraActive && cameraStream) {

        console.log("AairaGalaxy: camera already active.");

        return;
    }

    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        addConsoleMessage(
            "CAMERA",
            "Camera API is not available in this browser."
        );

        return;
    }

    try {

        cameraStream =
            await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });

        const webcam =
            document.getElementById("webcam");

        if (!webcam) {

            cameraStream
                .getTracks()
                .forEach(track => track.stop());

            cameraStream = null;

            addConsoleMessage(
                "CAMERA",
                "Webcam display element not found."
            );

            return;
        }

        webcam.srcObject = cameraStream;

        webcam.muted = true;

        await webcam.play();

        cameraActive = true;

        addConsoleMessage(
            "CAMERA",
            "Camera feed active."
        );

    } catch (error) {

        cameraStream = null;
        cameraActive = false;

        console.error(
            "AairaGalaxy camera error:",
            error
        );

        addConsoleMessage(
            "CAMERA",
            "Camera permission denied or camera unavailable."
        );
    }
}


function stopCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(track => track.stop());

        cameraStream = null;
    }

    const webcam =
        document.getElementById("webcam");

    if (webcam) {

        webcam.srcObject = null;
    }

    cameraActive = false;

    addConsoleMessage(
        "CAMERA",
        "Camera stopped."
    );
}


function getCameraStatus() {

    return cameraActive;
}


/*
IMPORTANT:
Do NOT automatically call startCamera() here.

Camera activation must happen only after
a user action or Aaira command.
*/
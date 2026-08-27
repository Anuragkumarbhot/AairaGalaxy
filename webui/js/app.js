/* AAIRAGALAXY APPLICATION */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            typeof initializeTelemetry ===
            "function"
        ) {

            initializeTelemetry();
        }

        console.log(
            "AairaGalaxy initialized."
        );
    }
);
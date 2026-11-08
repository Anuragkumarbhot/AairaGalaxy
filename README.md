# 🌌 AairaGalaxy

A futuristic, browser-based AI operating-system interface built with HTML, CSS, and vanilla JavaScript.

## Features

- Animated starfield and solar-system visualization
- Local command console
- Browser speech recognition and speech synthesis (where supported)
- User-initiated webcam preview
- Battery and network telemetry when the browser exposes those APIs
- Responsive HUD interface

## Project structure

```text
AairaGalaxy/
├── index.html                 # Root entry point; forwards to webui/
├── README.md
└── webui/
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        ├── app.js
        ├── ai.js
        ├── gesture.js
        ├── hologram.js
        ├── music.js
        ├── solar.js
        ├── stars.js
        ├── telemetry.js
        └── voice.js
```

## Run locally

From the repository root:

```bash
python -m http.server 8080
```

Open:

```text
http://localhost:8080/
```

The root page forwards to `/webui/index.html`.

## Browser permissions and compatibility

- Camera and microphone access require user permission. Use HTTPS or localhost.
- Speech recognition availability varies by browser. The command input remains available as a fallback.
- Battery and network information are optional browser APIs and may not be exposed.
- CPU and RAM usage are not reported because standard browsers do not provide reliable access to those system metrics.
- No camera is started automatically.

## Security notes

The command console renders user-provided text with DOM `textContent`, not HTML. Camera access is started only after an explicit user command or button action. Do not place private API keys in frontend JavaScript.

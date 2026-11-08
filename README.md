# 🌌 AairaGalaxy

A futuristic browser-based assistant dashboard built with HTML, CSS, and vanilla JavaScript.

## Features

- Animated starfield and solar-system visualization
- Local command console with keyboard and optional voice input
- Solar orbit pause/resume and planet focus commands
- Hologram visibility controls
- Music visualizer animation controls (visualizer only; no audio playback)
- User-initiated webcam preview
- Battery and network telemetry when browser APIs expose the data
- Responsive mobile HUD and reduced-motion support

## Project structure

```text
AairaGalaxy/
├── index.html
├── README.md
└── webui/
    ├── index.html
    ├── css/style.css
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

Open `http://localhost:8080/`. The root page forwards to `/webui/index.html`.

## Assistant commands

| Command | Action |
|---|---|
| `status` | Show interface and camera status |
| `solar pause` | Pause planetary orbits |
| `solar resume` | Resume planetary orbits |
| `focus earth` | Highlight a planet (also Mercury, Venus, Mars, Jupiter, Saturn) |
| `music pause` | Pause the visualizer animation |
| `music` | Enable the visualizer animation |
| `hologram` | Show the hologram |
| `hologram off` | Hide the hologram |
| `camera` | Request camera permission and show preview |
| `stop camera` | Stop camera tracks |
| `time` | Display local system time |
| `diagnostic` | Run basic interface diagnostics |

## Browser permissions and compatibility

- Camera and microphone require user permission and a secure context (HTTPS or localhost).
- Speech recognition varies by browser; typed commands remain available.
- Battery and network telemetry are optional browser APIs.
- Standard browsers do not expose reliable system CPU/RAM usage; these values are deliberately not fabricated.
- No camera is started automatically.

## Security

The command console inserts user text with DOM `textContent`, not HTML. Camera access is user-initiated. Do not put private API keys in frontend JavaScript. The current assistant is a local command engine, not an OpenAI-connected model.

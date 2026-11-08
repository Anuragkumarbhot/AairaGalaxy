# 🌌 AairaGalaxy

A futuristic browser-based assistant dashboard built with HTML, CSS, and vanilla JavaScript, with an optional secure AI backend.

## Features

- Animated starfield and solar-system visualization
- Local command console with keyboard and optional voice input
- Solar orbit pause/resume and planet focus commands
- Hologram visibility controls
- Music visualizer animation controls (visualizer only; no audio playback)
- User-initiated webcam preview
- Battery and network telemetry when browser APIs expose the data
- Responsive mobile HUD and reduced-motion support
- Conversational AI through the server-side OpenAI Responses API (when configured)
- English, Hindi, and Punjabi speech recognition / speech synthesis selection (browser and installed-language support varies)
- Persistent browser conversation history with clear and JSON export controls
- Optional foreground-only wake-word mode; the page must remain open and listening
- Per-tool consent before local camera, solar display, visualizer, or hologram actions
- Android deployment architecture documented under `android/` (native APK is a later milestone)

## Run with the Node.js server

Requires Node.js 18 or newer.

```bash
npm start
```

Open http://127.0.0.1:3000/. Run `npm run check` to validate JavaScript syntax.

To enable AI, create a private `.env` file in the repository root (copy the format from `.env.example`) and set your own `OPENAI_API_KEY`. The optional `OPENAI_MODEL` setting defaults to `gpt-4.1-mini`. Restart the server after changing environment settings.

**Never put an API key in frontend JavaScript, HTML, GitHub commits, or screenshots.** The `.env` file is excluded by `.gitignore`.

## Static preview

You can still preview the frontend without the AI backend:

```bash
python -m http.server 8080 --directory webui
```

Open http://localhost:8080/. Local commands work; conversational AI requires the Node.js server.

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

Other messages are sent to the AI backend when configured. Select the response/voice language in the dashboard. Conversations are stored in this browser's localStorage; they are not synced to another device. Use the history controls to export or delete them.

## API

- `GET /` — serves the dashboard
- `POST /api/chat` — accepts JSON `{ "message": "...", "history": [] }` and returns `{ "reply": "..." }`

The backend limits request size, applies a basic per-IP rate limit, validates chat history, times out upstream requests, and keeps the API key server-side. It binds to localhost by default. For public deployment, use HTTPS, a reverse proxy, authentication, and a persistent rate limiter before exposing the service.

## Browser permissions and compatibility

- Camera and microphone require user permission and a secure context (HTTPS or localhost).
- Speech recognition varies by browser; typed commands remain available.
- Punjabi speech requires a compatible speech provider / installed language pack.
- Wake-word detection is a foreground browser prototype, not an always-on background service.
- Local tool permissions are browser-local consent gates, not Android OS permissions.
- Battery and network telemetry are optional browser APIs.
- Standard browsers do not expose reliable system CPU/RAM usage; these values are deliberately not fabricated.
- No camera is started automatically.

## Project structure

```text
AairaGalaxy/
├── index.html
├── server.js
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── android/
│   ├── README.md
│   └── ANDROID_ARCHITECTURE.md
└── webui/
    ├── index.html
    ├── css/style.css
    └── js/
```

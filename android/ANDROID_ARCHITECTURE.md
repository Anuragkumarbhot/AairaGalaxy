# AairaGalaxy Android Deployment Architecture

Status: architecture baseline for the native Android milestone. This document is not an APK or a claim that a native Android app has been built.

## Target architecture

- **Android client:** Kotlin + AndroidX, with a native assistant shell and a WebView-hosted AairaGalaxy interface during the migration stage.
- **UI assets:** bundle the existing `webui/` files inside the Android application's assets. Do not load the production UI from an untrusted remote host.
- **AI gateway:** the existing Node.js backend calls the OpenAI Responses API. The OpenAI API key remains exclusively on the server and must never be embedded in the APK, WebView JavaScript, or Android resources.
- **Conversation storage:** browser localStorage is the Phase 4 prototype. Native release should migrate conversation storage to Room, with an explicit clear/export control and an optional encrypted database.
- **Voice input:** Android SpeechRecognizer with runtime RECORD_AUDIO permission; language tags `en-IN`, `hi-IN`, and `pa-IN`. Device speech-service language availability varies.
- **Voice output:** Android TextToSpeech with language availability checks and graceful fallback.
- **Wake word:** foreground-only opt-in prototype. Production always-on wake detection requires a dedicated, battery-aware Android foreground service, a persistent notification, microphone permission, and platform-policy review. Do not imply background listening is active in the web build.
- **Tool execution:** expose only named, typed capabilities (camera, UI display controls, etc.). Each capability has a permission state and user-visible confirmation. Never expose arbitrary shell execution to the AI model.
- **Networking:** HTTPS only outside localhost development. Add authenticated user sessions, per-user rate limits, request logging with redaction, and server-side authorization before public deployment.

## Android permission matrix

| Capability | Android permission / gate | Default |
|---|---|---|
| Microphone / speech input | `RECORD_AUDIO` runtime permission | Off until user starts voice |
| Camera preview | `CAMERA` runtime permission | Off until user requests camera |
| Notifications for foreground service | Notification permission where required by Android version | Off until service is enabled |
| Wake-word foreground service | Foreground service + microphone service type; platform restrictions apply | Disabled |
| Local display tools | In-app per-tool consent | Ask before first use |
| Arbitrary terminal / shell | Not exposed | Denied |

## Staged delivery

1. **Phase 4 — Voice intelligence:** multilingual browser voice, opt-in foreground wake-word prototype, persistent browser conversation, per-tool consent.
2. **Phase 5 — Android shell:** Gradle project, Kotlin activity, bundled web assets, runtime permissions, back navigation, lifecycle handling.
3. **Phase 6 — Native voice:** Android SpeechRecognizer / TextToSpeech adapters, language availability and error handling.
4. **Phase 7 — Native persistence and wake service:** Room database, optional encryption, foreground-service design, battery and privacy testing.
5. **Release hardening:** signed builds, HTTPS backend, auth, privacy policy, data deletion/export, Play policy checks, device testing.

## Important limitations

- Browser SpeechRecognition is not consistently available on all Android browsers and may stop unexpectedly.
- A browser tab cannot provide reliable always-on wake-word detection while backgrounded or the screen is off.
- Punjabi recognition depends on the installed speech provider and language pack.
- Browser localStorage is per-browser/profile and is not a substitute for account-synced or encrypted native storage.
- The current local Node backend binds to localhost by default. It is for development, not a public production deployment.

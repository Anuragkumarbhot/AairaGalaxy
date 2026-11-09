# AairaGalaxy Android — Phase 5

The native Kotlin Android application shell is included in this directory.

## Requirements

- Android Studio with Android SDK Platform 35
- JDK 17
- Gradle 8.9 (Android Gradle Plugin 8.7.3)

## Open and build

Open the android/ directory in Android Studio and allow Gradle sync. Run the app configuration on an emulator or Android device.

On a machine with Gradle 8.9 and Android SDK 35 installed:

    cd android
    gradle assembleDebug

Expected output: app/build/outputs/apk/debug/app-debug.apk

The Gradle build copies the current repository webui/ directory into generated Android assets. There is no manually maintained duplicate frontend.

## Configure the AI backend

The APK does not contain an OpenAI API key. The backend remains a separate Node.js service.

Build with a backend URL:

    gradle assembleDebug -PAIRA_API_BASE_URL=https://your-api.example

Use an HTTPS origin controlled by the project operator. The URL is exposed to the bundled UI through a read-only JavaScript bridge. If unset, AI calls use the relative /api/chat path and will not reach a separately hosted service from the Android asset origin.

Never put an OpenAI API key in this project, Android resources, JavaScript, or an APK.

## Security

- Microphone and camera are requested only when the web UI requests them.
- Android runtime permissions are checked before WebView capture permissions are granted.
- Web content is served through AndroidX WebKit's local asset origin.
- File/content access, mixed content, and external navigation are disabled.
- No arbitrary shell or terminal bridge is exposed.
- Wake-word operation is not an always-on Android service in this milestone.

## Scope

Phase 5 provides the Kotlin application shell and Gradle build configuration. Native SpeechRecognizer/TextToSpeech, Room persistence, a foreground wake-word service, signed release builds, and device QA remain future work.

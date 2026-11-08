/* AAIRAGALAXY PHASE 4 — MULTILINGUAL VOICE ENGINE */
(function () {
  "use strict";
  const LANGUAGES = {
    en: { label: "English", recognition: "en-IN", speech: "en-IN" },
    hi: { label: "Hindi", recognition: "hi-IN", speech: "hi-IN" },
    pa: { label: "Punjabi", recognition: "pa-IN", speech: "pa-IN" }
  };
  const LANGUAGE_KEY = "aaira.language.v1";
  let recognition = null;
  let recognitionActive = false;
  let wakeWordEnabled = false;
  let wakeWordArmed = false;

  function getLanguage() {
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY);
      return LANGUAGES[saved] ? saved : "en";
    } catch (_) { return "en"; }
  }
  function setLanguage(code) {
    if (!LANGUAGES[code]) return;
    try { localStorage.setItem(LANGUAGE_KEY, code); } catch (_) {}
    if (recognitionActive && recognition) recognition.stop();
    const selector = document.getElementById("voiceLanguage");
    if (selector) selector.value = code;
    addConsoleMessage("VOICE", LANGUAGES[code].label + " selected.");
  }
  function speakMessage(message) {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      addConsoleMessage("VOICE", "Speech output is not supported by this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(message));
    utterance.lang = LANGUAGES[getLanguage()].speech;
    utterance.rate = 1;
    utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const prefix = utterance.lang.toLowerCase().split("-")[0];
    const match = voices.find(voice => voice.lang.toLowerCase().startsWith(prefix));
    if (match) utterance.voice = match;
    window.speechSynthesis.speak(utterance);
  }
  function recognitionConstructor() {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }
  function stopListening() {
    wakeWordEnabled = false;
    wakeWordArmed = false;
    if (recognition) {
      try { recognition.stop(); } catch (_) {}
    }
    recognitionActive = false;
    const button = document.getElementById("wakeWordButton");
    if (button) button.textContent = "Enable wake word";
    addConsoleMessage("VOICE", "Wake-word listening stopped.");
  }
  function startRecognition(isWakeMode) {
    const SpeechRecognition = recognitionConstructor();
    if (!SpeechRecognition) {
      addConsoleMessage("VOICE", "Speech recognition is unavailable. Use the text input instead.");
      if (isWakeMode) wakeWordEnabled = false;
      return;
    }
    if (recognitionActive && recognition) {
      recognition.stop();
      return;
    }
    try {
      recognition = new SpeechRecognition();
      recognition.lang = LANGUAGES[getLanguage()].recognition;
      recognition.continuous = Boolean(isWakeMode);
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onstart = () => {
        recognitionActive = true;
        addConsoleMessage("VOICE", isWakeMode
          ? "Wake-word mode active in the foreground. Say Aaira to begin."
          : "Microphone listening. Speak now.");
      };
      recognition.onresult = event => {
        for (let i = event.resultIndex || 0; i < event.results.length; i += 1) {
          const result = event.results[i] && event.results[i][0];
          const transcript = result && result.transcript ? result.transcript.trim() : "";
          if (!transcript) continue;
          if (isWakeMode && !wakeWordArmed) {
            if (/\baaira\b/i.test(transcript) || /ऐरा|आयरा/.test(transcript)) {
              wakeWordArmed = true;
              addConsoleMessage("WAKE WORD", "Aaira detected. Listening for your request...");
              speakMessage("I am listening.");
            }
            continue;
          }
          if (isWakeMode && wakeWordArmed) wakeWordArmed = false;
          const input = document.getElementById("userInput");
          if (input) {
            input.value = transcript.replace(/^\s*aaira[,.]?\s*/i, "");
            if (input.value.trim()) sendMessage();
          }
        }
      };
      recognition.onerror = event => {
        addConsoleMessage("VOICE", "Recognition error: " + (event.error || "unknown"));
        if (event.error === "not-allowed" || event.error === "service-not-allowed") stopListening();
      };
      recognition.onend = () => {
        recognitionActive = false;
        if (wakeWordEnabled && isWakeMode) {
          try { recognition.start(); } catch (_) {}
        } else if (!wakeWordEnabled) {
          addConsoleMessage("VOICE", "Listening stopped.");
        }
      };
      recognition.start();
    } catch (error) {
      recognitionActive = false;
      if (isWakeMode) wakeWordEnabled = false;
      addConsoleMessage("VOICE", "Could not start microphone. Check permission and use localhost or HTTPS.");
      console.warn("AairaGalaxy voice:", error);
    }
  }
  function speakAI() { startRecognition(false); }
  function toggleWakeWord() {
    if (wakeWordEnabled) {
      stopListening();
      return;
    }
    wakeWordEnabled = true;
    wakeWordArmed = false;
    const button = document.getElementById("wakeWordButton");
    if (button) button.textContent = "Disable wake word";
    startRecognition(true);
  }
  window.AairaVoice = { getLanguage, setLanguage, speakMessage, stopListening, toggleWakeWord };
  window.speakMessage = speakMessage;
  window.speakAI = speakAI;
  window.toggleWakeWord = toggleWakeWord;
  window.stopAairaVoice = stopListening;
  document.addEventListener("DOMContentLoaded", () => {
    const selector = document.getElementById("voiceLanguage");
    if (selector) {
      selector.value = getLanguage();
      selector.addEventListener("change", () => setLanguage(selector.value));
    }
  });
})();
/* AAIRAGALAXY VOICE ENGINE */
let recognition = null;
let recognitionActive = false;

function speakMessage(message) {
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    addConsoleMessage("VOICE", "Speech synthesis is not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel();
  const speech = new SpeechSynthesisUtterance(String(message));
  speech.lang = "en-US";
  speech.rate = 1;
  speech.pitch = 1;
  window.speechSynthesis.speak(speech);
}

function speakAI() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    addConsoleMessage("VOICE", "Speech recognition is not supported. Use the command input instead.");
    return;
  }

  if (recognitionActive && recognition) {
    recognition.stop();
    return;
  }

  try {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      recognitionActive = true;
      addConsoleMessage("VOICE", "Microphone listening. Speak a command.");
    };

    recognition.onresult = event => {
      const result = event.results && event.results[0] && event.results[0][0];
      const transcript = result && result.transcript ? result.transcript.trim() : "";
      if (!transcript) {
        addConsoleMessage("VOICE", "No speech was recognized.");
        return;
      }

      const input = document.getElementById("userInput");
      if (input) {
        input.value = transcript;
        sendMessage();
      } else {
        addConsoleMessage("VOICE", transcript);
      }
    };

    recognition.onerror = event => {
      addConsoleMessage("VOICE", "Recognition error: " + (event.error || "unknown error"));
    };

    recognition.onend = () => {
      recognitionActive = false;
      addConsoleMessage("VOICE", "Listening stopped.");
    };

    recognition.start();
  } catch (error) {
    recognitionActive = false;
    addConsoleMessage("VOICE", "Unable to start microphone. Check browser permission and HTTPS.");
    console.warn("AairaGalaxy speech recognition error:", error);
  }
}

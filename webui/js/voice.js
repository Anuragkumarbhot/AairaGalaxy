/* AAIRAGALAXY VOICE ENGINE */

let recognition;

/* SPEAK */

function speakMessage(text){

const speech =
new SpeechSynthesisUtterance(text);

speech.lang = "en-US";

speech.rate = 1;

speech.pitch = 1;

window.speechSynthesis.speak(
speech
);

}

/* START AI */

function speakAI(){

const chatbox =
document.getElementById(
"chatbox"
);

/* API */

const SpeechRecognition =

window.SpeechRecognition ||

window.webkitSpeechRecognition;

/* CHECK */

if(!SpeechRecognition){

alert(
"Speech recognition not supported in this browser."
);

return;

}

/* CREATE */

recognition =
new SpeechRecognition();

/* SETTINGS */

recognition.lang = "en-US";

recognition.continuous = false;

recognition.interimResults = false;

/* START */

recognition.start();

/* STATUS */

chatbox.innerHTML +=

`
<br>
> VOICE:
Microphone activated.
`;

chatbox.scrollTop =
chatbox.scrollHeight;

/* RESULT */

recognition.onresult =
(event)=>{

const transcript =

event.results[0][0]
.transcript
.toLowerCase();

/* SHOW */

chatbox.innerHTML +=

`
<br>
> YOU SAID:
${transcript}
`;

/* INPUT */

document.getElementById(
"userInput"
).value = transcript;

/* SEND */

sendMessage();

};

/* ERROR */

recognition.onerror =
(event)=>{

chatbox.innerHTML +=

`
<br>
> ERROR:
${event.error}
`;

console.log(event.error);

};

/* END */

recognition.onend = ()=>{

chatbox.innerHTML +=

`
<br>
> VOICE:
Listening stopped.
`;

};

}

/* AAIRAGALAXY AI ENGINE */

function sendMessage(){

const input =
document.getElementById(
"userInput"
);

const chatbox =
document.getElementById(
"chatbox"
);

const text =
input.value.toLowerCase();

/* EMPTY */

if(text.trim() === ""){

return;

}

/* USER */

chatbox.innerHTML +=

`
<br>
> YOU:
${text}
`;

/* RESPONSE */

let response =

"Unknown command detected.";

/* HELLO */

if(
text.includes("hello")
||
text.includes("hi")
){

response =

"Hello Anurag. Neural systems online.";

}

/* STATUS */

else if(
text.includes("status")
){

response =

"All AairaGalaxy systems operational.";

}

/* SOLAR */

else if(
text.includes("solar")
||
text.includes("planet")
){

response =

"Orbital telemetry synchronized.";

document.querySelector(
".solar"
).style.transform =

"scale(0.75)";

/* RESET */

setTimeout(()=>{

document.querySelector(
".solar"
).style.transform =

"scale(0.68)";

},1200);

}

/* SCAN */

else if(
text.includes("scan")
){

response =

"Scanning nearby sectors...";

/* FLASH */

document.body.style.filter =

"brightness(1.3)";

setTimeout(()=>{

document.body.style.filter =

"brightness(1)";

},700);

}

/* MUSIC */

else if(
text.includes("music")
){

response =

"Music reactor initialized.";

const bars =

document.querySelectorAll(
".musicbar"
);

bars.forEach(bar=>{

bar.style.animationDuration =

Math.random() + "s";

});

}

/* CAMERA */

else if(
text.includes("camera")
||
text.includes("webcam")
){

response =

"Neural camera feed active.";

}

/* TIME */

else if(
text.includes("time")
){

response =

"The current system time is " +

new Date()
.toLocaleTimeString();

}

/* AI */

else if(
text.includes("ai")
){

response =

"AairaGalaxy AI core fully active.";

}

/* DIAGNOSTIC */

else if(
text.includes("diagnostic")
){

response =

"Running neural diagnostics...";

/* PANELS */

const panels =

document.querySelectorAll(
".hudbox"
);

panels.forEach(panel=>{

panel.style.boxShadow =

"0 0 40px cyan";

setTimeout(()=>{

panel.style.boxShadow =

"0 0 20px cyan";

},1200);

});

}

/* TERMINAL */

else if(
text.includes("terminal")
){

response =

"Terminal systems synchronized.";

}

/* WEATHER */

else if(
text.includes("weather")
){

response =

"Weather telemetry unavailable offline.";

}

/* DEFAULT */

else{

response =

"Command not recognized.";

}

/* AI MESSAGE */

setTimeout(()=>{

chatbox.innerHTML +=

`
<br>
> AAIRAGALAXY:
${response}
`;

/* SCROLL */

chatbox.scrollTop =
chatbox.scrollHeight;

/* VOICE */

if(typeof speakMessage
!== "undefined"){

speakMessage(response);

}

},500);

/* CLEAR */

input.value = "";

}

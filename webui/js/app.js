/* AAIRAGALAXY CORE */

/* CLOCK */

function startClock(){

setInterval(()=>{

const clock =
document.getElementById(
"clock"
);

if(clock){

clock.innerHTML =

new Date()
.toLocaleTimeString();

}

},1000);

}

/* BOOT */

function bootSequence(){

const chatbox =
document.getElementById(
"chatbox"
);

const logs = [

"Initializing neural systems...",

"Loading galaxy tracker...",

"Connecting orbital radar...",

"Synchronizing telemetry...",

"Activating AI core...",

"Initializing voice assistant...",

"AairaGalaxy online."

];

/* LIGHTWEIGHT LOOP */

let i = 0;

const bootLoop = setInterval(()=>{

if(i >= logs.length){

clearInterval(
bootLoop
);

if(typeof speakMessage
!== "undefined"){

speakMessage(
"AairaGalaxy systems online"
);

}

return;

}

chatbox.innerHTML +=

`
<br>
> SYSTEM:
${logs[i]}
`;

chatbox.scrollTop =
chatbox.scrollHeight;

i++;

},1000);

}

/* LIVE SYSTEM HUD */

function liveSystemHUD(){

const cpu =
document.getElementById(
"cpuBar"
);

const ram =
document.getElementById(
"ramBar"
);

const net =
document.getElementById(
"netBar"
);

const battery =
document.getElementById(
"batteryBar"
);

/* LOWER REFRESH */

setInterval(()=>{

cpu.style.width =
Math.random()*100 + "%";

ram.style.width =
Math.random()*100 + "%";

net.style.width =
Math.random()*100 + "%";

battery.style.width =
Math.random()*100 + "%";

},4000);

}

/* START */

window.onload = ()=>{

startClock();

bootSequence();

liveSystemHUD();

};

/* READY */

console.log(
"AairaGalaxy core online."
);

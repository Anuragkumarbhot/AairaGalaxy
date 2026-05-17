/* LIGHT CAMERA SYSTEM */

const webcam =
document.getElementById(
"webcam"
);

async function startCamera(){

try{

const stream =

await navigator
.mediaDevices
.getUserMedia({

video:true,
audio:false

});

webcam.srcObject =
stream;

await webcam.play();

}
catch(error){

console.log(error);

}

}

startCamera();

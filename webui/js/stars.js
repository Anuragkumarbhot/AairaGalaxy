/* LIGHTWEIGHT GALAXY ENGINE */

const canvas =
document.getElementById("bg");

const ctx =
canvas.getContext("2d");

/* SIZE */

canvas.width =
window.innerWidth;

canvas.height =
window.innerHeight;

/* PARTICLES */

const particles = [];

/* LOWER COUNT */

const total = 70;

/* PARTICLE */

class Particle{

constructor(){

this.x =
Math.random()*canvas.width;

this.y =
Math.random()*canvas.height;

this.size =
Math.random()*2;

this.speedX =
(Math.random()-0.5)*0.2;

this.speedY =
(Math.random()-0.5)*0.2;

}

/* UPDATE */

update(){

this.x += this.speedX;

this.y += this.speedY;

if(this.x < 0)
this.x = canvas.width;

if(this.x > canvas.width)
this.x = 0;

if(this.y < 0)
this.y = canvas.height;

if(this.y > canvas.height)
this.y = 0;

}

/* DRAW */

draw(){

ctx.beginPath();

ctx.arc(
this.x,
this.y,
this.size,
0,
Math.PI*2
);

ctx.fillStyle =
"rgba(0,255,255,0.7)";

ctx.fill();

}

}

/* INIT */

function init(){

particles.length = 0;

for(let i=0;i<total;i++){

particles.push(
new Particle()
);

}

}

/* ANIMATE */

function animate(){

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);

particles.forEach(p=>{

p.update();

p.draw();

});

requestAnimationFrame(
animate
);

}

/* START */

init();

animate();

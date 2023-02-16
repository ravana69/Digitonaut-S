const TAU = Math.PI * 2;

let canvas, ctx, angle, circles;

class Circle {
  constructor() {
    this.size = 1;
    this.startAngle = angle;
    this.color = `hsla(${angle},100%,50%,1)`;
    this.position = new Vector2(canvas.width * 0.5, canvas.height * 0.5);
    this.velocity = new Vector2(
    Math.cos(angle * TAU / 360) * 2,
    Math.sin(angle * TAU / 360) * 2);

  }
  update() {
    this.color = `hsla(${this.startAngle + angle},100%,50%,1)`;
    this.position.add(this.velocity);
    this.size += 1.5;
  }}


function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function draw() {
  for (let i = circles.length - 1; i >= 0; i--) {
    let circle = circles[i];
    circle.update();
    if (
    circle.position.x > canvas.width + circle.size ||
    circle.position.y > canvas.height + circle.size ||
    circle.position.x < -circle.size ||
    circle.position.y < -circle.size)
    {
      circles.splice(i, 1);
      continue;
    }
    ctx.beginPath();
    ctx.strokeStyle = circle.color;
    ctx.arc(circle.position.x, circle.position.y, circle.size, 0, TAU);
    ctx.lineWidth = 0.1;
    ctx.stroke();
    ctx.closePath();
  }
}

function loop() {
  angle = angle < 359 ? angle + 1 : 0;
  if (angle % 6 === 0) circles.push(new Circle());
  draw();
  window.requestAnimationFrame(loop);
}

function init() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  angle = 0;
  circles = [];
  resize();
  loop();
}

window.onload = init;
window.onresize = resize;
window.requestAnimationFrame = function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    });

}();
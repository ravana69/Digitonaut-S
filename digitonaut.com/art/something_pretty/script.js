var time = 0;
var lineWeight = 50;
var lines = 20;
var canvas;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  frameRate(60);
  noFill();
  stroke(0);
  strokeWeight(lineWeight);
}

function update() {
  time++;
}

function draw() {
  update();
  blendMode(NORMAL);
  background(0);
  blendMode(SCREEN);
  for (var i = 0; i < lines; i++) {
    var r = 200+55*sin(0.4 + -i*0.1 + time*0.05);
    var g = 100+55*sin(i*0.1 + time*0.1);
    var b = 200+55*sin(time*0.1);
    var a = 100*sin(Math.PI*i/lines);
    var p1x = - i - 1*i*(cos(time*0.05));
    var p1y = height * 0.5 - 10 * (pow((height*(i+3)/lines), 0.5)) + 2 * pow(height*0.5*(lines-i)/lines, sin((time-20)*0.02 + 0.2));
    var p2x = width / 2 + width * (0.4 * cos(i*0.01 + time*0.05));
    var p2y = height * (0.5 + 0.5 * sin(Math.PI*0.5 + i*Math.PI/lines)) - 500 * pow(sin(i / lines + PI), 6)+ 2 * pow(height*0.5*(lines-i)/lines, sin((time-15)*0.02 + 0.2));
    var p3x = width + 5 + 5 * sin(time*0.02 - PI*0.4);
    var p3y = height * 1 - pow((height*(i+lines*0.2)/lines), (0.7+0.3*sin(time*0.03+0.3)));
    stroke(r, g, b, a);
    quadraticCurve(p1x, p1y, p2x, p2y, p3x, p3y);
  }
}

function quadraticCurve(p1x, p1y, p2x, p2y, p3x, p3y) {
  beginShape();
  vertex(p1x, p1y);
  quadraticVertex(p2x, p2y, p3x, p3y);
  endShape();
}
/*
Satellites

Patterns are created by a nested system of satellites that orbit around each other.

Controls:
	- Click to change to a new pattern.

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

var maxLevel = 10;
var maxChildCount = 3;
var countDown = 0;

var gid;
var topPlanet;
var alphaVal;
var hueVal;


function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB, 255);
	reset();
}


function draw() {
	if (alphaVal > 0) {
		push();
		translate(width / 2, height / 2);
		movePlanet(topPlanet);
		pop();
	} else {
		countDown--;
		if (countDown < 0) {
			reset();
		}
	}
	
	alphaVal -= 0.5;
}


function mousePressed() {
	reset();
}


function reset() {
	background(0);
	
	countDown = 72;
	gid = 0;
	hueVal = random(255);
	alphaVal = 255;
	topPlanet = new Planet(maxLevel);
	
	// Reset until we get a decent number of planets.
	if (gid > 120) {
		loop();
	} else {
		reset();
	}
}


function movePlanet(planet) {
	planet.rot += planet.rotRate * map(planet.level, 0, maxLevel, 1, 0.1);
	
	push();
	
	rotate(radians(planet.rot));
	translate(planet.length, 0);
	
	if (planet.id % 4 == 0) {
		stroke(hueVal, 255, 255, alphaVal);
	} else if (planet.id % 3 == alphaVal) {
		stroke((hueVal + 40) % 255, 255, 255, alphaVal);
	} else if (planet.id % 2 == 0) {
		stroke((hueVal + 127) % 255, 255, 255, alphaVal);
	} else {
		stroke((hueVal + 127 + 40) % 255, 255, 255, alphaVal);
	}
	
	let thickness = map(planet.level, 0, maxLevel, 0.1, 5);
	let mult = map(alphaVal, 0, 255, 0, 2);
	strokeWeight(thickness * mult);
	
	point(0, 0);
	
	if (planet.children.length > 0) {
		for (let i = 0; i < planet.children.length; i++) {
			movePlanet(planet.children[i]);
		}
	}
	
	pop();
}

function Planet(level) {
	this.id = gid;
	gid++;
	
	this.level = level;
	this.length = map(this.level, 0, maxLevel, 10, 100) * random(0.75, 1.25);
	this.rotRate = random(-0.2, 0.2) * 5;
	this.rot = random(360);
	this.children = [];
	
	if (this.level > 0) {
		let childCount = int(random(1, maxChildCount));
		for (let i = 0; i < childCount; i++) {
			this.children.push(new Planet(this.level - 1));
		}
	}
}
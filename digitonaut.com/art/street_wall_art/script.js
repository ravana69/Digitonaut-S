var colors = "fe5d26-f2c078-faedca-c1dbb3-7ebc89-b8b8d1-5b5f97-ffc145-fffffb-ff6b6c".split("-").map(a=>"#"+a)
class Walker{
	constructor(args){
		this.p =  args.p || createVector(0,0)
		this.color = random(colors)
		this.span = 30
		this.ratio = random(1)
	}
	update(){
		if (random()<0.5){
			this.p.x+=random([-this.span,this.span])
		}else{
			this.p.y+=random([-this.span,this.span])
		}
		// this.p.add(p5.Vector.random2D().mult(5))
	}
	draw(){
		push()
			// blendMode(SCREEN)
			noStroke()
			this.span*=0.99995
			translate(this.p.x + noise(this.p.y/10)*20,
								this.p.y + noise(this.p.x/10)*20)
			scale(random(0.1,0.9)+noise(this.p.x,this.p.y,1000)*0.1,
						random(0.1,0.9)+noise(this.p.x,this.p.y,50000)*0.1)
		// this.span
			fill(this.color)
			if (random()<0.5){
				// rectMode(CENTER)
				rect(0,0,this.span*0.9,this.span*0.9,2)
			}else{
				ellipse(this.span/2,this.span/2,this.span*this.ratio )
			}
		pop()
	}
}
let walkers = []
let overAllTexture
function setup() {
	createCanvas(windowWidth, windowHeight);
	background(100);
	fill(0)
	pixelDensity(2)
	rect(0,0,width,height)
	for(var i=0;i<200;i++){
		walkers.push(new Walker({
			p: createVector(width/2,height/2)
		}))
	}
	frameRate(20)
	overAllTexture=createGraphics(width,height)
	overAllTexture.loadPixels()
	// noStroke()
	for(var i=0;i<width+50;i++){
		for(var o=0;o<height+50;o++){
			overAllTexture.set(i,o,color(100,noise(i/3,o/3,i*o/50)*random([1,20,40])))
		}
	}
	overAllTexture.updatePixels()
}

function draw() {
	walkers.forEach(walker=>{
		walker.update()
		walker.draw()
	})
	if (frameCount%2==0){
		push()
			blendMode(MULTIPLY)
			image(overAllTexture,0,0)
		pop()
	}
	if (mouseIsPressed){
		walkers.push(new Walker({
			p: createVector(mouseX,mouseY)
		}))
	}
	// ellipse(mouseX, mouseY, 20, 20);
}
// function mousePressed(){
	
// 
// function keyPressed(){
// 	save()
// }


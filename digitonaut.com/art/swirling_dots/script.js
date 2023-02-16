var container = document.body;

var maxorbit = 40;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, container.offsetWidth / container.offsetHeight, 0.1, 100000 );

var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize( container.offsetWidth, container.offsetHeight );
container.appendChild( renderer.domElement );

var startTime = new Date().getTime();
var currentTime = 0;


var geometry = new THREE.BufferGeometry();

var uniforms = {
	time: { value: 1.0 }
}

var shaderMaterial = new THREE.ShaderMaterial( {
	uniforms:       uniforms,
	vertexShader:   document.getElementById('vertexshader').textContent,
	fragmentShader: document.getElementById('fragmentshader').textContent,
	blending:       THREE.AdditiveBlending,
	depthTest:      false,
	transparent:    true,
	vertexColors:   true
});

var geometry = new THREE.BufferGeometry();
var positions = [];
var sizes = [];

function mod(x,y){
	return x % y;
}

var rands = [], orbital;
for ( var x = 0; x < 500; x++) {
	for ( var y = 0; y < 200; y++) {
		rands = [];
		rands.push(Math.random() * (maxorbit/2) + 1);
		rands.push(Math.random() * (maxorbit/2) + maxorbit);

		orbital = (rands.reduce(function(p, c) {
			return p + c;
		}, 0) / rands.length);

		positions.push(0);
		positions.push(orbital - 30);
		positions.push((Math.random() * 6) + 0.5);
		sizes.push( 1 );
	}
}

geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
geometry.addAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setDynamic( true ) );
var spacetime = new THREE.Points( geometry, shaderMaterial );
spacetime.position.x = 0;
spacetime.position.y = 0;
spacetime.position.z = 0;
scene.add( spacetime );


camera.position.y = 0;
camera.position.x = 0;
camera.position.z = 100;

function animate() {
	var now = new Date().getTime();
	currentTime = (now - startTime) / 10000;
	uniforms.time.value = currentTime;


	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();
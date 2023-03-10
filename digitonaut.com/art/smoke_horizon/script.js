var container;
	var camera, scene, renderer;
	var uniforms, material, mesh;
	var mouseX = 0, mouseY = 0,
	lat = 0, lon = 0, phy = 0, theta = 0;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	init();
	var startTime = Date.now();
	animate();

	function init() {
		container = document.getElementById( 'container' );

		camera = new THREE.Camera();
		camera.position.z = 1;
		scene = new THREE.Scene();

		uniforms = {
			u_time: { type: "f", value: 1.0 },
			u_resolution: { type: "v2", value: new THREE.Vector2() }
		};

		material = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: document.getElementById( 'vertexShader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentShader' ).textContent
		});

		mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
		scene.add( mesh );

		renderer = new THREE.WebGLRenderer();
		container.appendChild( renderer.domElement );

		uniforms.u_resolution.value.x = window.innerWidth;
		uniforms.u_resolution.value.y = window.innerHeight;
		renderer.setSize( window.innerWidth, window.innerHeight );
	}

	function animate() {
		requestAnimationFrame( animate );
		render();
	}

	function render() {
		var elapsedMilliseconds = Date.now() - startTime;
		var elapsedSeconds = elapsedMilliseconds / 1000.;
		uniforms.u_time.value = 60. * elapsedSeconds * 0.03;
		renderer.render( scene, camera );
	}
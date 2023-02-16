console.clear();
import * as THREE from "https://cdn.skypack.dev/three@0.132.2/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

THREE.BufferGeometry.prototype.tripleFace = tripleFace;

let scene = new THREE.Scene();
scene.background = new THREE.Color(0x7f7f7f);
let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
camera.position.set(0, 0, 15);
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;

let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.setScalar(1);
scene.add(
  light, 
  new THREE.AmbientLight(0xffffff, 0.05),
  new THREE.HemisphereLight( 0xff007f, 0x007fff)
);

let g = new THREE.IcosahedronGeometry(5, 20).tripleFace();
let m = new THREE.MeshStandardMaterial({ 
  color: 0x7f7f7f, 
  metalness: 0.25,
  roughness: 0.75,
  onBeforeCompile: shader => {
    shader.uniforms.time = m.userData.uniforms.time;
    shader.vertexShader = `
      uniform float time;
      attribute float onMove;
      attribute vec3 center;
			varying vec3 vCenter;
      
      ${simplexNoise}
      
      ${shader.vertexShader}
    `.replace(
      `#include <fog_vertex>`,
      `#include <fog_vertex>
        vCenter = center;
      `
    ).replace(
      `#include <begin_vertex>`,
      `#include <begin_vertex>
        
       vec3 tN = normalize(transformed);
       float N = snoise(vec4(tN * 4., time));
       N = N * 0.5 + 0.5;
       N = pow(N, 8.);
       transformed += tN * N * 4. * onMove;
      
      `
    );
    console.log(shader.vertexShader);
    shader.fragmentShader = `
      varying vec3 vCenter;
      
      ${shader.fragmentShader}
    `.replace(
      `#include <dithering_fragment>`,
      `#include <dithering_fragment>
        
        float thickness = 1.;
        vec3 afwidth = fwidth( vCenter.xyz );
        vec3 edge3 = smoothstep( ( thickness - 1.0 ) * afwidth, thickness * afwidth, vCenter.xyz );
        float edge = 1. - min( min( edge3.x, edge3.y ), edge3.z );
        
        gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1), edge);
      `
    );
    //console.log(shader.fragmentShader);
  }
});
m.userData = {
  uniforms: {
    time: {value: 0} 
  }
}
let o = new THREE.Mesh(g, m);
scene.add(o);

window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

let clock = new THREE.Clock();

renderer.setAnimationLoop(() => {
  let t = clock.getElapsedTime() * 0.1;
  m.userData.uniforms.time.value = t;
  controls.update();
  renderer.render(scene, camera);
});

function tripleFace() {
  let geometry = this;
  let pos = geometry.attributes.position;
  if (geometry.index != null) {
    console.log("Works for non-indexed geometries!");
    return;
  }

  let facesCount = pos.count / 3;

  let pts = [];
  let onMove = [];
  let triangle = new THREE.Triangle();
  let a = new THREE.Vector3(),
    b = new THREE.Vector3(),
    c = new THREE.Vector3();
  for (let i = 0; i < facesCount; i++) {
    a.fromBufferAttribute(pos, i * 3 + 0);
    b.fromBufferAttribute(pos, i * 3 + 1);
    c.fromBufferAttribute(pos, i * 3 + 2);
    triangle.set(a, b, c);
    let o = new THREE.Vector3();
    triangle.getMidpoint(o);

    // make it tetrahedron-like
    let l = a.distanceTo(b);
    let h = 0; //(Math.sqrt(3) / 2) * l; // scale it at your will
    let d = o.clone().normalize().setLength(h);
    o.add(d);

    pts.push(
      o.clone(), a.clone(), b.clone(),
      o.clone(), b.clone(), c.clone(),
      o.clone(), c.clone(), a.clone()
    );
    onMove.push(1, 0, 0, 1, 0, 0, 1, 0, 0);
  }

  let g = new THREE.BufferGeometry().setFromPoints(pts);
  g.setAttribute("onMove", new THREE.Float32BufferAttribute(onMove, 1));
  g.computeVertexNormals();
  setupAttributes(g);
  return g;
}

function setupAttributes(geometry) {
  const vectors = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 1)
  ];

  const position = geometry.attributes.position;
  const centers = new Float32Array(position.count * 3);

  for (let i = 0, l = position.count; i < l; i++) {
    vectors[i % 3].toArray(centers, i * 3);
  }

  geometry.setAttribute("center", new THREE.BufferAttribute(centers, 3));
}
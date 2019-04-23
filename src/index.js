import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";

let camera, scene, renderer, controls;
let geometry, material, mesh;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
  camera.position.z = 1;

  scene = new THREE.Scene();

  geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  material = new THREE.MeshNormalMaterial();

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  controls = new OrbitControls(camera);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.rotateSpeed = 0.3;
  controls.panSpeed = 0.3;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);


  //controls.update() must be called after any manual changes to the camera's transform
  // camera.position.set(0, 20, 100);
  // controls.update();
}

function animate() {
  requestAnimationFrame(animate);

  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.02;
  controls.update();

  renderer.render(scene, camera);
}


import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import * as STLLoader from "three-stl-loader";

import hubAsset from "./assets/hub.stl";
import bladeAsset from "./assets/blade.stl";

let camera, scene, renderer, controls;
let windTurbine;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
  camera.position.z = 2.4;
  scene = new THREE.Scene();
  windTurbine = new THREE.Group();
  windTurbine.position.set(0, 0, 0);

  controls = new OrbitControls(camera);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.rotateSpeed = 0.2;
  controls.panSpeed = 0.3;

  let loader = new (STLLoader(THREE));
  loader.load(hubAsset, function (geometry) {
    let material = new THREE.MeshNormalMaterial();
    let mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(0.01, 0.01, 0.01);
    mesh.position.set(-0.074, 0, 0);
    mesh.rotation.set(Math.PI/2, 0, 0);
    windTurbine.add(mesh);
  });

  // Blade 1
  loader.load(bladeAsset, function (geometry) {
    let material = new THREE.MeshNormalMaterial();
    let mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(0.01, 0.01, 0.01);
    mesh.position.set(0.103, -0.055, 0.046);
    mesh.rotation.set(Math.PI/2, Math.PI/2, 0);
    windTurbine.add(mesh);
  });

  // Blade 2
  loader.load(bladeAsset, function (geometry) {
    let material = new THREE.MeshNormalMaterial();
    let mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(0.01, 0.01, 0.01);
    mesh.position.set(-0.1, -0.057, 0.046);
    mesh.rotation.set(Math.PI/2, -Math.PI/6, 0);
    windTurbine.add(mesh);
  });

  // Blade 3
  loader.load(bladeAsset, function (geometry) {
    let material = new THREE.MeshNormalMaterial();
    let mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(0.01, 0.01, 0.01);
    mesh.position.set(0, 0.118, 0.046);
    mesh.rotation.set(Math.PI/2, -5 * Math.PI/6, 0);
    windTurbine.add(mesh);
  });

  scene.add(windTurbine);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //controls.update() must be called after any manual changes to the camera's transform
  // camera.position.set(0, 20, 100);
  // controls.update();
}

function animate() {
  requestAnimationFrame(animate);
  windTurbine.rotation.z += 0.2;
  renderer.render(scene, camera);
}


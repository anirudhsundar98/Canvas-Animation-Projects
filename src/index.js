import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import * as STLLoader from "three-stl-loader";

import hubAsset from "./assets/hub.stl";
import bladeAsset from "./assets/blade.stl";

let camera, scene, renderer;

// Blade data
let blades = [
  { // Blade 1
    mesh: null,
    position: {
      engaged: { x: 0.103, y: -0.055, z: 0.046 },
      disengaged: { x: 0.303, y: -0.055, z: 0.146 }
    },
    acceleration: { x: 0.003, y: 0, z: 0.003 }
  },
  { // Blade 2
    mesh: null,
    position: {
      engaged: { x: -0.1, y: -0.057, z: 0.046 },
      disengaged: { x: -0.2, y: -0.23, z: 0.146 }
    },
    acceleration: { x: -0.0015, y: -0.0026, z: 0.003 }
  },
  { // Blade 3
    mesh: null,
    position: {
      engaged: { x: 0, y: 0.118, z: 0.046 },
      disengaged: { x: -0.1, y: 0.2912, z: 0.146 }
    },
    acceleration: { x: -0.0015, y: 0.0026, z: 0.003 }
  }
];

// Wind Turbine is the Group of the Hub and 3 blades
let windTurbine = {
  object: null,
  rotation: {
    speed: {
      value: 0.01,
      max: 0.01
    },
    acceleration: 0.00025
  },
  isRotating: true,
  isEngaged: true,
  engage: function () {
    this.isEngaged = true;
    this.isRotating = true;
  },
  disengage: function () {
    this.isEngaged = false;
    this.isRotating = false;
  },
  stopRotation: function () {
    this.isRotating = false;
  },
  update: function () {
    if (this.isRotating) {
      if (this.rotation.speed.value < this.rotation.speed.max) {
        this.rotation.speed.value += this.rotation.acceleration;
      }
    } else {
      if (this.rotation.speed.value > 0) {
        this.rotation.speed.value -= this.rotation.acceleration;
      }
    }

    if (this.isEngaged) {
      // Blades are connected with the hub. Move them into engaged positions
      // XY plan movement happens before Z movement
      for (let blade of blades) {
        if (
          Math.abs(blade.mesh.position.x - blade.position.engaged.x) > Math.abs(blade.acceleration.x)
          || Math.abs(blade.mesh.position.y - blade.position.engaged.y) > Math.abs(blade.acceleration.y)
        ) {
          if (Math.abs(blade.mesh.position.x - blade.position.engaged.x) > Math.abs(blade.acceleration.x)) {
            blade.mesh.position.x -= blade.acceleration.x;
          }
          if (Math.abs(blade.mesh.position.y - blade.position.engaged.y) > Math.abs(blade.acceleration.y)) {
            blade.mesh.position.y -= blade.acceleration.y;
          }
        } else if (Math.abs(blade.mesh.position.z - blade.position.engaged.z) > Math.abs(blade.acceleration.z)) {
          blade.mesh.position.z -= blade.acceleration.z;
        }
      }
    } else {
      // Blades are connected with the hub. Move them into engaged positions
      for (let blade of blades) {
        // XY plan movement happens after Z movement
        if ( Math.abs(blade.mesh.position.z - blade.position.disengaged.z) > Math.abs(blade.acceleration.z) ) {
          blade.mesh.position.z += blade.acceleration.z;
        } else {
          if ( Math.abs(blade.mesh.position.x - blade.position.disengaged.x) > Math.abs(blade.acceleration.x) ) {
            blade.mesh.position.x += blade.acceleration.x;
          }
          if ( Math.abs(blade.mesh.position.y - blade.position.disengaged.y) > Math.abs(blade.acceleration.y) ) {
            blade.mesh.position.y += blade.acceleration.y;
          }
        }
      }
    }

    windTurbine.object.rotation.z += windTurbine.rotation.speed.value;
  }
};

windTurbine.engage = windTurbine.engage.bind(windTurbine);
windTurbine.disengage = windTurbine.disengage.bind(windTurbine);
windTurbine.stopRotation = windTurbine.stopRotation.bind(windTurbine);
windTurbine.update = windTurbine.update.bind(windTurbine);

function init() {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
  camera.position.z = 3.1;
  scene = new THREE.Scene();
  windTurbine.object = new THREE.Group();
  windTurbine.object.position.set(0, 0, 0);

  let controls = new OrbitControls(camera);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.rotateSpeed = 0.2;
  controls.panSpeed = 0.3;

  let loader = new (STLLoader(THREE));

  // Hub
  loader.load(hubAsset, function (geometry) {
    let material = new THREE.MeshNormalMaterial();
    let mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(0.01, 0.01, 0.01);
    mesh.position.set(-0.074, 0, 0);
    mesh.rotation.set(Math.PI/2, 0, 0);
    windTurbine.object.add(mesh);
  });

  // Blade 1
  loader.load(bladeAsset, function (geometry) {
    let material = new THREE.MeshNormalMaterial();
    blades[0].mesh = new THREE.Mesh(geometry, material);
    blades[0].mesh.scale.set(0.01, 0.01, 0.01);
    blades[0].mesh.position.set(0.103, -0.055, 0.046);
    blades[0].mesh.rotation.set(Math.PI/2, Math.PI/2, 0);
    windTurbine.object.add(blades[0].mesh);
  });

  // Blade 2
  loader.load(bladeAsset, function (geometry) {
    let material = new THREE.MeshNormalMaterial();
    blades[1].mesh = new THREE.Mesh(geometry, material);
    blades[1].mesh.scale.set(0.01, 0.01, 0.01);
    blades[1].mesh.position.set(-0.1, -0.057, 0.046);
    blades[1].mesh.rotation.set(Math.PI/2, -Math.PI/6, 0);
    windTurbine.object.add(blades[1].mesh);
  });

  // Blade 3
  loader.load(bladeAsset, function (geometry) {
    let material = new THREE.MeshNormalMaterial();
    blades[2].mesh = new THREE.Mesh(geometry, material);
    blades[2].mesh.scale.set(0.01, 0.01, 0.01);
    blades[2].mesh.position.set(0, 0.118, 0.046);
    blades[2].mesh.rotation.set(Math.PI/2, -5 * Math.PI/6, 0);
    windTurbine.object.add(blades[2].mesh);
  });

  scene.add(windTurbine.object);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  if (blades[0].mesh && blades[1].mesh && blades[2].mesh) {
    windTurbine.update();
  }
  renderer.render(scene, camera);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    (windTurbine.isRotating) ? windTurbine.stopRotation() : windTurbine.engage();
  }

  if (e.key === "Shift") {
    (windTurbine.isEngaged) ? windTurbine.disengage() : windTurbine.engage();
  }
});

init();
animate();

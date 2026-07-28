import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 2, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

document.body.appendChild(renderer.domElement);

// Light
const ambientLight = new THREE.AmbientLight(
  0xffffff,
  2
);

scene.add(ambientLight);

const directionalLight =
  new THREE.DirectionalLight(
    0xffffff,
    3
  );

directionalLight.position.set(
  5,
  10,
  5
);

scene.add(directionalLight);

// Load GLB
const loader = new GLTFLoader();

let model;

loader.load(
  '/models/bronze_moses_at_augustana_university.glb',

  (gltf) => {
    model = gltf.scene;

    scene.add(model);

    console.log('Loaded', model);
  },

  (xhr) => {
    console.log(
      `${(
        xhr.loaded /
        xhr.total *
        100
      ).toFixed(2)}% loaded`
    );
  },

  (error) => {
    console.error(error);
  }
);

// Resize
window.addEventListener('resize', () => {
  camera.aspect =
    window.innerWidth /
    window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
});

// Animation
function animate() {
  requestAnimationFrame(animate);

  if (model) {
    model.rotation.y += 0.005;
  }

  renderer.render(
    scene,
    camera
  );
}

animate();
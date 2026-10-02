import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// Camera
const perspectiveCamera = new THREE.PerspectiveCamera(
  75, //fov: goc nhin theo chieu doc, tinh bang do
  window.innerWidth / window.innerHeight,   //ti le khung hinh chieu rong/ chieu cao
  0.1,          //khoang cach gan nhat camera nhin thay
  1000          //khoang cach xa nhat camera nhin thay
);

perspectiveCamera.position.set(0, 2, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(perspectiveCamera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.autoRotate = true;
controls.autoRotateSpeed = 2;

// Light
const ambientLight = new THREE.AmbientLight(
  0xffffff,
  0.35
);

scene.add(ambientLight);

const directionalLight =
  new THREE.DirectionalLight(
    0xffffff,
    0.4
  );

directionalLight.position.set(
  5,
  10,
  5
);

scene.add(directionalLight);

const museumLight = new THREE.DirectionalLight(0xffc36b, 4);
scene.add(museumLight, museumLight.target);

// Load GLB
const loader = new GLTFLoader();

let model;
let shouldHideModel = false;

const hideButton = document.querySelector('.hide-button');

hideButton.addEventListener('click', () => {
  model.visible = !model.visible;
  shouldHideModel = !shouldHideModel;
});

loader.load(
  './models/bronze_moses_at_augustana_university.glb',

  (gltf) => {
    model = gltf.scene;
    model.visible = !shouldHideModel;

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Center the model so it rotates around its own middle.
    model.position.sub(center);

    const verticalFov = THREE.MathUtils.degToRad(perspectiveCamera.fov);
    const fitHeightDistance = size.y / (2 * Math.tan(verticalFov / 2));
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * perspectiveCamera.aspect);
    const fitWidthDistance = size.x / (2 * Math.tan(horizontalFov / 2));
    const perspectiveCameraDistance = Math.max(fitHeightDistance, fitWidthDistance) * 1.25;

    const modelSize = Math.max(size.x, size.y, size.z);
    museumLight.position.set(-modelSize, modelSize, modelSize);
    museumLight.target.position.set(0, 0, 0);

    perspectiveCamera.position.set(0, 0, perspectiveCameraDistance);
    perspectiveCamera.near = perspectiveCameraDistance / 100;
    perspectiveCamera.far = perspectiveCameraDistance * 100;
    perspectiveCamera.updateProjectionMatrix();
    perspectiveCamera.lookAt(0, 0, 0);

    controls.target.set(0, 0, 0);
    controls.minDistance = perspectiveCameraDistance * 0.2;
    controls.maxDistance = perspectiveCameraDistance * 4;
    controls.update();

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
  perspectiveCamera.aspect =
    window.innerWidth /
    window.innerHeight;

  perspectiveCamera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
});

// Animation
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(
    scene,
    perspectiveCamera
  );
}

animate();

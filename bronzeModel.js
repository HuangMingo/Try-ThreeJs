import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// Camera
const camera = new THREE.PerspectiveCamera(
  75, //độ mở của camera
  window.innerWidth / window.innerHeight, //tỉ lệ khung hình
  0.1, //vật phải cách camera tối thiểu near thì mới nhìn thấy
  2000 //vật cách camera quá far thì không được render
);

camera.position.set(0, 0, 25); //Đặt vị trí camera

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

// Controls
const controls = new OrbitControls(
  camera,
  renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableRotate = true;
controls.enableZoom = true;

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

    const verticalFov = THREE.MathUtils.degToRad(camera.fov);
    const fitHeightDistance = size.y / (2 * Math.tan(verticalFov / 2));
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
    const fitWidthDistance = size.x / (2 * Math.tan(horizontalFov / 2));
    const perspectiveCameraDistance = Math.max(fitHeightDistance, fitWidthDistance) * 1.25;

    const modelSize = Math.max(size.x, size.y, size.z);
    museumLight.position.set(-modelSize, modelSize, modelSize);
    museumLight.target.position.set(0, 0, 0);

    // camera.position.set(0, 0, perspectiveCameraDistance);
    camera.near = perspectiveCameraDistance / 100;
    camera.far = perspectiveCameraDistance * 100;
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);

    controls.target.set(0, 0, 0);
    controls.minDistance = perspectiveCameraDistance * 0.2;
    controls.maxDistance = perspectiveCameraDistance * 4;
    controls.update();

    scene.add(model);

    // Canh camera va tam xoay theo kich thuoc thuc cua model.
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const distance = sphere.radius / Math.sin(
      THREE.MathUtils.degToRad(camera.fov / 2)
    );

    // camera.position.set(
    //   sphere.center.x,
    //   sphere.center.y,
    //   sphere.center.z
    // );

    camera.near = Math.max(distance / 100, 0.1);
    camera.far = distance * 100;
    camera.updateProjectionMatrix();

    controls.target.copy(sphere.center);
    controls.minDistance = sphere.radius * 0.5;
    controls.maxDistance = sphere.radius * 10;
    controls.update();

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
  controls.update();

  renderer.render(
    scene,
    camera
  );
}

animate();


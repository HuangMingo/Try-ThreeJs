import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// Camera
const camera = new THREE.PerspectiveCamera(
  75, //độ mở của camera
  window.innerWidth / window.innerHeight, //tỉ lệ khung hình
  0.1, //vật phải cách camera tối thiểu near thì mới nhìn thấy
  1000 //vật cách camera quá far thì không được render
);

camera.position.set(0, 2, 5); //Đặt vị trí camera

// Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

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

    // Canh camera va tam xoay theo kich thuoc thuc cua model.
    const box = new THREE.Box3().setFromObject(model);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const distance = sphere.radius / Math.sin(
      THREE.MathUtils.degToRad(camera.fov / 2)
    );

    camera.position.set(
      sphere.center.x,
      sphere.center.y,
      sphere.center.z

    );

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

  controls.update();

  renderer.render(
    scene,
    camera
  );
}

animate();

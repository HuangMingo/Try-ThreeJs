import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
//Tạo scene
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();

const materials = [
  new THREE.MeshBasicMaterial({ color: 'gray' }), // phải
  new THREE.MeshBasicMaterial({ color: 'gray' }), // trái
  new THREE.MeshBasicMaterial({ color: 'gray' }), // trên
  new THREE.MeshBasicMaterial({ color: 'gray' }), // dưới
  new THREE.MeshBasicMaterial({ color: 'red' }),  // trước
  new THREE.MeshBasicMaterial({ color: 'gray' })  // sau
];

const cube = new THREE.Mesh(
  geometry,
  materials
);

scene.add(cube);

camera.position.z = 5;

renderer.render(scene, camera);
const cursor = {
  x: 0,
  y: 0
}

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / window.innerWidth - 0.5
  cursor.y = event.clientY / window.innerHeight - 0.5
})
function animate() {
  requestAnimationFrame(animate)

  cube.rotation.y = cursor.x * Math.PI * 2
  cube.rotation.x = cursor.y * Math.PI * 2

  renderer.render(scene, camera)
  camera.position.x = cursor.x * 5
  camera.position.y = -cursor.y * 5

  camera.lookAt(cube.position)

  renderer.render(scene, camera)
}

animate();
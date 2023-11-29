import * as THREE from 'three';
import { Planet } from './planet.js';
import { CameraController } from './camera-controller.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 200, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let planet = new Planet(95000, 256, 256);
scene.add(planet.mesh);

const cameraController = new CameraController(camera, scene, planet);

let prevTime = performance.now();
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);
function animate() {
    requestAnimationFrame(animate);
    const time = performance.now();
    const deltaTime = (time - prevTime) / 1000;
    cameraController.update(deltaTime);
    renderer.render(scene, camera);
    prevTime = time;
}

animate();

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene 
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(15, 15, 30);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Sun
const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Earth
const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x9090FF, shininess: 50, specular: 0x222222 });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
const earthOrbitSpeed = 0.001;
scene.add(earth);

// Earth Orbit Ring
const earthOrbitGeometry = new THREE.TorusGeometry(5, 0.01, 16, 100);
const earthOrbitMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
const earthOrbit = new THREE.Mesh(earthOrbitGeometry, earthOrbitMaterial);
earthOrbit.rotation.x = Math.PI / 2;
scene.add(earthOrbit);

// Moon
const moonGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const moonMaterial = new THREE.MeshPhongMaterial({ color: 0xAAAAAA, shininess: 10, specular: 0x111111 });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
const moonOrbitSpeed = 0.002;
scene.add(moon);

// Moon Orbit Ring (relative to Earth's position)
const moonOrbitGeometry = new THREE.TorusGeometry(0.7, 0.005, 16, 100);
const moonOrbitMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 });
const moonOrbit = new THREE.Mesh(moonOrbitGeometry, moonOrbitMaterial);
moonOrbit.rotation.x = Math.PI / 2;
earth.add(moonOrbit);

// Sunlight
const sunlight = new THREE.PointLight(0xffffff, 1.5, 500);
sunlight.position.set(0, 0, 0);
scene.add(sunlight);

// Shadows
renderer.shadowMap.enabled = true;
sunlight.castShadow = true;
earth.castShadow = true;
earth.receiveShadow = true;
moon.castShadow = true;
moon.receiveShadow = true;

// General controls
const controls = new OrbitControls(camera, renderer.domElement);


function animate() {
    requestAnimationFrame(animate);
    updateOrbit(earth, sun, 5, earthOrbitSpeed);
    updateOrbit(moon, earth, 0.7, moonOrbitSpeed);
    renderer.render(scene, camera);
}

function updateOrbit(object, center, orbitRadius, orbitSpeed) {
    object.position.x = center.position.x + Math.cos(Date.now() * orbitSpeed) * orbitRadius;
    object.position.z = center.position.z + Math.sin(Date.now() * orbitSpeed) * orbitRadius;
}

animate();

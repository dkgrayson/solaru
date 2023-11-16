import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Objects
class CelestialBody extends THREE.Mesh {
    constructor(radius, widthSegments, heightSegments, materialConfig) {
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        const material = new THREE.MeshPhongMaterial(materialConfig);
        super(geometry, material);
    }
}

class Sun extends THREE.Mesh {
    constructor(radius, widthSegments, heightSegments, materialConfig) {
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        const material = new THREE.MeshBasicMaterial(materialConfig);
        super(geometry, material);
        this.rotation.x = Math.PI / 2;
    }
}

class CelestialRing extends THREE.Mesh {
    constructor(radius, radialSegments , tubularSegments, arc, materialConfig) {
        const geometry = new THREE.TorusGeometry(radius, radialSegments, tubularSegments, arc);
        const material = new THREE.MeshBasicMaterial(materialConfig);
        super(geometry, material);
    }
}

// Scene 
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(15, 15, 30);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Celestial Objects and setup
const sun = new Sun(
    1.5,
    32,
    32,
    {color: 0xFFFF00 }
);

scene.add(sun);

const earth = new CelestialBody(
    0.5,
    32,
    32,
    { color: 0x9090FF, shininess: 50, specular: 0x222222 }
);

scene.add(earth);

const moon = new CelestialBody(
    0.1,
    32,
    32,
    { color: 0xAAAAAA, shininess: 10, specular: 0x111111 }
);

scene.add(moon);

const earthOrbitSpeed = 0.001;
const earthOrbit = new CelestialRing(
    5,
    0.01,
    16,
    100,
    { color: 0x888888 }
);

const moonOrbitSpeed = 0.002;
const moonOrbit = new CelestialRing(
    0.7,
    0.0105,
    16,
    100,
    { color: 0x888888 }
);

moonOrbit.rotation.x = earthOrbit.rotation.x = Math.PI / 2;
scene.add(earthOrbit);
scene.add(moonOrbit);
earth.add(moonOrbit);

const sunlight = new THREE.PointLight(0xffffff, 1.5, 500);
sunlight.position.set(0, 0, 0);
sunlight.castShadow = true;
scene.add(sunlight);

// Main loop
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

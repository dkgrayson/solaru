import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gltf from './coastal.gltf';

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
camera.position.set(45, 45, 90);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xFFFFFF);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

const loader = new GLTFLoader();

// Celestial Objects and setup
let planets = [];
const sun = new Sun(
    4.5,
    32,
    32,
    { color: 0xFFFF00 }
);
scene.add(sun);

function createPlanet(radius, color, distanceFromSun, orbitSpeed) {
    const materialConfig = { color: color};
    const planet = new CelestialBody(radius, 32, 32, materialConfig);
    planet.userData = { distanceFromSun, orbitSpeed };

    const orbitRing = new CelestialRing(distanceFromSun, 0.01, 16, 100, { color: 0x000000 });
    orbitRing.rotation.x = Math.PI / 2;
    scene.add(orbitRing);

    return planet;
}

function loadPlanet(gltfPath, distanceFromSun, orbitSpeed) {
    loader.load(gltfPath, (gltf) => {
        const planet = gltf.scene;
        planet.userData = { distanceFromSun, orbitSpeed };

        planet.scale.set(0.01, 0.01, 0.01);

        planets.push(planet);
        scene.add(planet);
    }, undefined, (error) => {
        console.error(error);
    });
}

loadPlanet('./coastal.gltfcdcd s', 12, 0.004);
// loadPlanet(gltf, 20, 0.003);
// loadPlanet(gltf, 28, 0.002);
// loadPlanet(gltf, 38, 0.0018);
// loadPlanet(gltf, 60, 0.001);
// loadPlanet(gltf, 78, 0.0009);
// loadPlanet(gltf, 96, 0.0004);
// loadPlanet(gltf, 115, 0.0001);

const sunlight = new THREE.PointLight(0xffffff, 1.5, 500);
sunlight.position.set(0, 0, 0);
sunlight.castShadow = true;
scene.add(sunlight);


// Main loop
function animate() {
    requestAnimationFrame(animate);
    updatePlanets(); // Update planet positions
    renderer.render(scene, camera);
}

function updatePlanets() {
    planets.forEach(planet => {
        const { distanceFromSun, orbitSpeed } = planet.userData;
        planet.position.x = Math.cos(Date.now() * orbitSpeed) * distanceFromSun;
        planet.position.z = Math.sin(Date.now() * orbitSpeed) * distanceFromSun;
    });
}

animate();

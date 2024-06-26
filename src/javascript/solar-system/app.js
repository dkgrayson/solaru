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
renderer.setClearColor(0xFFFFFF);

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

function createPlanet(radius, color, distanceFromSun, orbitSpeed) {
    const materialConfig = { color: color, shininess: 50, specular: 0x222222 };
    const planet = new CelestialBody(radius, 32, 32, materialConfig);
    planet.userData = { distanceFromSun, orbitSpeed };
    return planet;
}

// Create planets
const mercury = createPlanet(0.5, 0x909090, 10, 0.004);
const venus = createPlanet(1.2, 0xa0522d, 18, 0.003);
const earth = createPlanet(1.3, 0x9090FF, 25, 0.002);
const mars = createPlanet(0.7, 0xb22222, 35, 0.0018);
const jupiter = createPlanet(3, 0xf4a460, 55, 0.001);
const saturn = createPlanet(2.5, 0xdaa520, 70, 0.0009);
const uranus = createPlanet(2, 0xadff2f, 85, 0.0004);
const neptune = createPlanet(1.9, 0x4169e1, 100, 0.0001);

// Add planets to the scene
const planets = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune];
planets.forEach(planet => scene.add(planet));

const earthOrbit = new CelestialRing(
    5,
    0.01,
    16,
    100,
    { color: 0x888888 }
);

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

function updateOrbit(object, center, orbitRadius, orbitSpeed) {
    object.position.x = center.position.x + Math.cos(Date.now() * orbitSpeed) * orbitRadius;
    object.position.z = center.position.z + Math.sin(Date.now() * orbitSpeed) * orbitRadius;
}

animate();
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
const sunGeometry = new THREE.SphereGeometry(1.5, 640, 640); // Increased segment count for smoother appearance
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
const earthOrbitGeometry = new THREE.TorusGeometry(5, 0.01, 16, 100); // 5 is the Earth's orbit radius
const earthOrbitMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
const earthOrbit = new THREE.Mesh(earthOrbitGeometry, earthOrbitMaterial);
earthOrbit.rotation.x = Math.PI / 2; // Rotate to lie in the XY plane
scene.add(earthOrbit);

// Moon
const moonGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const moonMaterial = new THREE.MeshPhongMaterial({ color: 0xAAAAAA, shininess: 10, specular: 0x111111 });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
const moonOrbitSpeed = 0.002;
scene.add(moon);

// Moon Orbit Ring (relative to Earth's position)
const moonOrbitGeometry = new THREE.TorusGeometry(0.7, 0.005, 16, 100); // 0.7 is the Moon's orbit radius
const moonOrbitMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 });
const moonOrbit = new THREE.Mesh(moonOrbitGeometry, moonOrbitMaterial);
moonOrbit.rotation.x = Math.PI / 2;
earth.add(moonOrbit); // Add to Earth so it moves with the Earth

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
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let isDragging = false;
let centralObject = sun;


function onMouseClick(event) {
    // Convert the mouse position to a normalized value between -1 and 1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects([sun, earth, moon]);

    if (intersects.length > 0) {
        // Focus on the first intersected object
        focusOnObject(intersects[0].object);
    }
}

function focusOnObject(object) {
    centralObject = object;

    // Hide or show orbit rings based on the central object
    earthOrbit.visible = centralObject !== earth; // Hide if Earth is the center
    moonOrbit.visible = centralObject !== moon; // Hide if Moon is the center


    // Update the camera to look at and move towards the new central object
    const distance = 10; // Adjust as needed
    camera.position.x = centralObject.position.x + distance;
    camera.position.y = centralObject.position.y + distance;
    camera.position.z = centralObject.position.z + distance;
    camera.lookAt(centralObject.position);
}

function animate() {
    requestAnimationFrame(animate);

    // Adjust the orbit calculation based on the new central object
    if (centralObject === sun) {
        // Earth and Moon orbit around the Sun
        updateOrbit(earth, sun, 5, earthOrbitSpeed);
        updateOrbit(moon, earth, 0.7, moonOrbitSpeed);
    } else if (centralObject === earth) {
        // Sun and Moon orbit around the Earth
        updateOrbit(sun, earth, 5, -earthOrbitSpeed); // Negative speed for reverse orbit
        updateOrbit(moon, earth, 0.7, moonOrbitSpeed);
    } // Add similar logic if the Moon or other planets are chosen as the center

    renderer.render(scene, camera);
}

function onMouseUp(event) {
    if (!isDragging) {
        // Run the focus change logic only if there was no significant drag
        onMouseClick(event);
    }
}

function updateOrbit(object, center, orbitRadius, orbitSpeed) {
    object.position.x = center.position.x + Math.cos(Date.now() * orbitSpeed) * orbitRadius;
    object.position.z = center.position.z + Math.sin(Date.now() * orbitSpeed) * orbitRadius;
}

controls.addEventListener('start', function () {
    isDragging = true;
});

controls.addEventListener('end', function () {
    isDragging = false;
});

window.addEventListener('mouseup', onMouseUp, false);

animate();

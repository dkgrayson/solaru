import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

export class CameraController {
    constructor(camera, scene, planet) {
        this.controls = new PointerLockControls(camera, document.body);
        this.planet = planet;
        this.camera = camera;
        scene.add(this.controls.getObject());

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.speed = 25;

        this.isJumping = false;
        this.verticalVelocity = 0;
        this.gravity = -1.8;
        this.jumpSpeed = 1;

        this.cameraHeightAboveSurface = 20;

        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
        document.addEventListener('keyup', this.onKeyUp.bind(this), false);

        document.addEventListener('click', () => {
            this.controls.lock();
        }, false);
    }

    onKeyDown(event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = true;
                break;
            case 'Space':
            if (!this.isJumping) {
                this.isJumping = true;
                this.verticalVelocity = this.jumpSpeed;
            }
            break;
        }
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = false;
                break;
        }
    }

    update(deltaTime) {
        // Calculate the normal at the camera's position
        let cameraPosition = this.controls.getObject().position;
        let planetCenter = this.planet.mesh.position;
        let normal = new THREE.Vector3().subVectors(cameraPosition, planetCenter).normalize();
    
        // Update the camera's 'up' vector
        this.camera.up.copy(normal);
    
        // Calculate the forward and right vectors tangential to the planet's surface
        let forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion).normalize();
        forward.projectOnPlane(normal);
        let right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion).normalize();
        right.projectOnPlane(normal);
    
        // Update the direction based on key input
        this.direction.set(0, 0, 0);
        if (this.moveForward) this.direction.add(forward);
        if (this.moveBackward) this.direction.sub(forward);
        if (this.moveLeft) this.direction.sub(right);
        if (this.moveRight) this.direction.add(right);
        if (this.isJumping) {
            // Apply gravity more gently for a smoother jump
            this.verticalVelocity += (this.gravity * deltaTime) * 0.5;  // Scale the gravity effect
    
            // Update the camera's vertical position
            this.controls.getObject().position.y += this.verticalVelocity * deltaTime;
    
            // Check if the camera has landed
            let distanceFromPlanetCenter = this.controls.getObject().position.distanceTo(this.planet.mesh.position);
            let planetRadius = this.planet.mesh.geometry.parameters.radius;
            if (distanceFromPlanetCenter <= (planetRadius + this.cameraHeightAboveSurface)) {
                this.controls.getObject().position.y = planetRadius + this.cameraHeightAboveSurface;
                this.isJumping = false;
                this.verticalVelocity = 0;
            }
        }
        // Apply the movement
        let velocity = this.direction.normalize().multiplyScalar(this.speed * deltaTime);
        this.controls.getObject().position.add(velocity);
    
        // Adjust the camera's height based on the normal
        let desiredPosition = new THREE.Vector3().addVectors(planetCenter, normal.multiplyScalar(this.planet.mesh.geometry.parameters.radius + this.cameraHeightAboveSurface));
        this.controls.getObject().position.lerp(desiredPosition, 0.1); // Smooth transition to desired position
    }
    
}

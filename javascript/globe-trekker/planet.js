import * as THREE from 'three';

export class Planet {
    constructor(radius, widthSegments, heightSegments, color) {
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true
        });
        this.mesh = new THREE.Mesh(geometry, material);
    }
}


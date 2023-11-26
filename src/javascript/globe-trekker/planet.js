import * as THREE from 'three';

export class Planet {
    constructor(radius, widthSegments, heightSegments) {
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        let texture = new THREE.TextureLoader().load(
            'https://images.pexels.com/photos/2117937/pexels-photo-2117937.jpeg'
        )
        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.repeat.set(128, 128);
        let material = new THREE.MeshBasicMaterial({
            map: texture
        });

        this.mesh = new THREE.Mesh(geometry, material);
    }
}

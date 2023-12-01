import * as THREE from 'three';
import SurfaceTexture from '../../resources/globe-trekker/surface.jpg'


export class Planet {
    constructor(radius, widthSegments, heightSegments, onReady) {
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        const textureLoader = new THREE.TextureLoader().setCrossOrigin('anonymous');
        textureLoader.load(
            SurfaceTexture,
            (texture) => {
                const material = new THREE.MeshBasicMaterial({ map: texture });
                this.mesh = new THREE.Mesh(geometry, material);
                if (onReady) {
                    onReady(this.mesh);
                }
            },
            undefined,
            (error) => {
                console.error('An error occurred loading the texture:', error);
            }
        );
    }
}

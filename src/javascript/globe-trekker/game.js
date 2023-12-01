import { CameraController } from './camera-controller.js';
import { Planet } from './planet.js';
import BackgroundImage from '../../resources/globe-trekker/sky.jpg'
import * as THREE from 'three';

export class Game {
  constructor() {
    this.initialize_();
  }

  initialize_() {
    this.initializeRenderer_();
    this.initializeLights_();
    this.initializescene();
    this.initializeApp();

    this.previousRAF_ = null;
    this.raf_();
    this.onWindowResize_();
  }

  initializeApp() {
     this.fpsCamera_ = new CameraController(this.camera_, this.objects_);
  }

  initializeRenderer_() {
    this.threejs_ = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.threejs_.shadowMap.enabled = true;
    this.threejs_.shadowMap.type = THREE.PCFSoftShadowMap;
    this.threejs_.setPixelRatio(window.devicePixelRatio);
    this.threejs_.setSize(window.innerWidth, window.innerHeight);
    this.threejs_.outputColorSpace  = THREE.SRGBColorSpace;
    this.threejs_.gammaFactor = 2.2;
    this.threejs_.gammaOutput = true;

    document.body.appendChild(this.threejs_.domElement);

    window.addEventListener('resize', () => {
      this.onWindowResize_();
    }, false);

    const fov = 15;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 20000;
    this.camera_ = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera_.position.set(0, 10000, 0);


    this.scene = new THREE.Scene();

    this.uiCamera_ = new THREE.OrthographicCamera(
        -1, 1, 1 * aspect, -1 * aspect, 1, 10000);
    this.uiScene = new THREE.Scene();
  }

  initializescene() {
    this.objects_ = [];
    const planet = new Planet(95000, 256, 256, (mesh) => {
      this.scene.add(mesh);
    })


    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(BackgroundImage, (texture) => {
      const skyGeo = new THREE.SphereGeometry(95000 + 1000, 256, 256);
      const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
      const sky = new THREE.Mesh(skyGeo, material);
      this.scene.add(sky);
    });
    this.scene.fog = new THREE.Fog(0xffffff, 1, 10000);
  }

  initializeLights_() {
    const distance = 50.0;
    const angle = Math.PI / 4.0;
    const penumbra = 0.5;
    const decay = 1.0;

    let light = new THREE.SpotLight(0xFFFFFF, 100.0, distance, angle, penumbra, decay);
    light.castShadow = true;
    light.shadow.bias = -0.00001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 10000;
    light.position.set(25, 25, 0);
    light.lookAt(0, 0, 0);
    this.scene.add(light);

    // Updated HemisphereLight setup
    const upColour = 0xFFFF80;
    const downColour = 0x808080;
    light = new THREE.HemisphereLight(upColour, downColour, 0.5);
    light.color.setHSL(0.6, 1, 0.6);
    light.groundColor.setHSL(0.095, 1, 0.75);
    light.position.set(0, 4, 0);
    this.scene.add(light);
  }

  onWindowResize_() {
    this.camera_.aspect = window.innerWidth / window.innerHeight;
    this.camera_.updateProjectionMatrix();

    this.uiCamera_.left = -this.camera_.aspect;
    this.uiCamera_.right = this.camera_.aspect;
    this.uiCamera_.updateProjectionMatrix();

    this.threejs_.setSize(window.innerWidth, window.innerHeight);
  }

  raf_() {
    requestAnimationFrame((t) => {
      if (this.previousRAF_ === null) {
        this.previousRAF_ = t;
      }

      this.step_(t - this.previousRAF_);
      this.threejs_.autoClear = true;
      this.threejs_.render(this.scene, this.camera_);
      this.threejs_.autoClear = false;
      this.threejs_.render(this.uiScene, this.uiCamera_);
      this.previousRAF_ = t;
      this.raf_();
    });
  }

  step_(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;
    this.fpsCamera_.update(timeElapsedS);
  }
}

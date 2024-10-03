import * as THREE from 'three';
import { MTLLoader } from '../libs/MTLLoader.js';
import { OBJLoader } from '../libs/OBJLoader.js';
import { Planeta } from './Planeta.js';

class PlanetaEsfera extends Planeta {
  constructor(gui, titleGui) {
    super(gui, titleGui);
    
    this.createGUI(gui);
    
    const textureLoader = new THREE.TextureLoader();
    const bumpMap = textureLoader.load('../imgs/planeta.jpg');
    
    var material = new THREE.MeshStandardMaterial({
      color: 0x8B4513,
      bumpMap: bumpMap,       // Añadir el bump map
      bumpScale: 0.5          // Ajustar la escala del relieve
    });     
    
    var geometry = new THREE.SphereGeometry(15, 32, 16);
    var bola = new THREE.Mesh(geometry, material);
    this.add(bola);

    var directionalLightRoja = new THREE.DirectionalLight(0xff0000, 2);
    directionalLightRoja.position.set(0, 20, -10);
    bola.add(directionalLightRoja);

    this.phaseOffset = Math.random() * Math.PI * 2;;

    this.loadModels();
  }

  loadModels() {
    this.loadCar();
    this.loadTrees();
  }

  loadCar() {
    var materialLoaderC = new MTLLoader();
    var objectLoaderC = new OBJLoader();
    
    materialLoaderC.load('modelos/Low-Poly-Racing-Car.mtl', (materials) => {
      objectLoaderC.setMaterials(materials);
      objectLoaderC.load('modelos/Low-Poly-Racing-Car.obj', (object) => {
        object.scale.set(0.025, 0.025, 0.025);
        object.position.set(0, 10, 10);
        object.rotation.set(45 * Math.PI / 180, 25 * Math.PI / 180, 0);
        this.add(object);
      });
    });
  }

  loadTrees() {
    var materialLoaderA = new MTLLoader();
    var objectLoaderA = new OBJLoader();

    const treePositions = [
      { position: [0, 15, 0], rotation: [0, 0, 0] },
      { position: [0, 15, 0], rotation: [0, 0, 45 * Math.PI / 180] },
      { position: [0, 15, 0], rotation: [0, 0, -45 * Math.PI / 180] },
      { position: [13, 5, 5], rotation: [0, 0, -45 * Math.PI / 180] },
      { position: [-13, 5, 5], rotation: [0, 0, 45 * Math.PI / 180] },
      { position: [-13, 5, 1], rotation: [0, 0, 45 * Math.PI / 180] },
      { position: [0, -3, 15], rotation: [75 * Math.PI / 180, 0, 0] },
      { position: [0, -3, 15], rotation: [75 * Math.PI / 180, 0, -45 * Math.PI / 180] },
      { position: [0, -3, 15], rotation: [75 * Math.PI / 180, 0, 45 * Math.PI / 180] }
    ];

    treePositions.forEach(({ position, rotation }) => {
      materialLoaderA.load('modelos/Lowpoly_tree_sample.mtl', (materials) => {
        objectLoaderA.setMaterials(materials);
        objectLoaderA.load('modelos/Lowpoly_tree_sample.obj', (object) => {
          object.scale.set(0.35, 0.35, 0.35);
          object.position.set(...position);
          object.rotation.set(...rotation);
          this.add(object);
        });
      });
    });
  }

  animateOrbit(time) {
    const orbitRadius = 55;
    const orbitSpeed = 20;
    const orbitCenter = new THREE.Vector3(0, 0, 0);
    const angle = (time * orbitSpeed) + this.phaseOffset; 
    const x = Math.cos(angle) * orbitRadius + orbitCenter.x;  
    const y = Math.sin(angle) * orbitRadius + orbitCenter.y;
    const z = orbitCenter.z;

    this.position.set(x, y, z);
  }

  efecto(personaje){
    personaje.vulnerable = false;
  }

  createGUI(gui) {
    
  }

  update() {
    this.position.set(this.guiControls.posX, this.guiControls.posY, this.guiControls.posZ);
    this.rotation.set(this.guiControls.rotX, this.guiControls.rotY, this.guiControls.rotZ);
    this.scale.set(this.guiControls.sizeX, this.guiControls.sizeY, this.guiControls.sizeZ);
  }
}

export { PlanetaEsfera }

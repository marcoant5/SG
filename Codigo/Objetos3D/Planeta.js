import * as THREE from '../libs/three.module.js';

class Planeta extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();
    this.gui = gui;
    this.titleGui = titleGui;
  }

  efecto(personaje){

  }
}

export { Planeta };

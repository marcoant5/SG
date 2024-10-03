import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'
import { objetoColision } from './objetoColision.js';

class triggerFinal extends objetoColision {
  constructor(Tubo, gui) {
    super();

    // Parte correspondiente de la interfaz
    this.createGUI (gui);
    const geometry = new THREE.CylinderGeometry(4, 4, 0.1, 32);
    geometry.rotateZ(Math.PI / 2);
    const material = new THREE.MeshBasicMaterial({ visible: false });
    this.trigger = new THREE.Mesh(geometry, material);

    this.lapCount = 0;

    this.angulo = Math.PI / 2;
    this.nodoPosOrientTubo = new THREE.Object3D();
    this.movimientoLateral = new THREE.Object3D();
    this.posSuperficie = new THREE.Object3D();

    this.Tubo = Tubo;

    var geomTubo = Tubo.obtenerGeometria();

    this.tubo = geomTubo;
    this.path = Tubo.obtenerRecorrido();
    this.radio = geomTubo.parameters.radius;
    this.segmentos = geomTubo.parameters.tubularSegments;
    this.binormals = this.path.computeFrenetFrames(this.segmentos, true).binormals;

    this.add(this.nodoPosOrientTubo);
    this.nodoPosOrientTubo.add(this.movimientoLateral);
    this.movimientoLateral.add(this.posSuperficie);
    this.movimientoLateral.rotateZ(this.angulo);
    this.posSuperficie.add(this.trigger);
    this.posSuperficie.position.y = 0;

    const position = this.path.getPointAt(0.95);
    this.nodoPosOrientTubo.position.copy(position);

    this.box = new THREE.Box3().setFromObject(this.trigger);
  }

  efecto(){
    this.lapCount++;
  }

  createGUI(gui) {
    // Controles para el tamaño, la orientación y la posición de la caja
  }

  update() {
    // Actualizar la caja englobante
    this.box.setFromObject(this.trigger);

    // Actualizar otras transformaciones
    TWEEN.update();
  }
}

export { triggerFinal };

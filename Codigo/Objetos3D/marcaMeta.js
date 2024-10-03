import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'
import { objetoColision } from './objetoColision.js';

class marcaMeta extends THREE.Object3D{
  constructor(Tubo, gui) {
    super();

    var loader = new THREE.TextureLoader();
    var textura = loader.load('/imgs/bandera-cuadros-carrera.jpg');

    var material = new THREE.MeshStandardMaterial({ map: textura });

    // Parte correspondiente de la interfaz
    this.createGUI (gui);
    const geometry = new THREE.TorusGeometry( 6, 1, 20, 100 );
    geometry.rotateY(90*Math.PI/180);
    geometry.rotateZ(-45*Math.PI/180);
    this.trigger = new THREE.Mesh(geometry, material);

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
  }

  createGUI(gui) {
    // Controles para el tamaño, la orientación y la posición de la caja
  }

  update() {

  }
}

export { marcaMeta };

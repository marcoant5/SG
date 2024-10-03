import * as THREE from 'three';
import { CSG } from '../libs/CSG-v2.js';
import { objetoColision } from './objetoColision.js';

class Estrella extends objetoColision {
  constructor(Tubo, gui) {
    super();

    this.createGUI(Tubo, gui);

    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('/imgs/estrellaTextura.jpg');
    var material = new THREE.MeshStandardMaterial({ map: texture });

    var geometry1 = new THREE.CylinderGeometry( 0.001, 5, 20, 4 );
    var geometry2 = new THREE.CylinderGeometry( 0.001, 5, 20, 4 );
    var geometry3 = new THREE.CylinderGeometry( 0.001, 5, 20, 4 );
    var geometry4 = new THREE.CylinderGeometry( 0.001, 5, 20, 4 );
    var geometry5 = new THREE.CylinderGeometry( 0.001, 5, 20, 4 );

    geometry1.translate(0, 10, 0);
    geometry2.translate(0, 10, 0);
    geometry2.rotateZ(80*Math.PI/180);
    geometry3.translate(0, 10, 0);
    geometry3.rotateZ(-80*Math.PI/180);
    geometry4.translate(0, 10, 0);
    geometry4.rotateZ(150*Math.PI/180);
    geometry5.translate(0, 10, 0);
    geometry5.rotateZ(-150*Math.PI/180);

    var pico1 = new THREE.Mesh(geometry1, material);
    var pico2 = new THREE.Mesh(geometry2, material);
    var pico3 = new THREE.Mesh(geometry3, material);
    var pico4 = new THREE.Mesh(geometry4, material);
    var pico5 = new THREE.Mesh(geometry5, material);

    var csg = new CSG();
    csg.union([pico1, pico2, pico3, pico4, pico5]);
    this.estrella = csg.toMesh();
    this.mesh = new THREE.Object3D();
    this.mesh.add(this.estrella);

    // Añadir la caja englobante
    this.boundingBox = new THREE.Box3().setFromObject(this.estrella);

    this.angulo = Math.PI / 2;
    this.nodoPosOrientTubo = new THREE.Object3D();
    this.movimientoLateral = new THREE.Object3D();
    this.posSuperficie = new THREE.Object3D();
		this.mesh.scale.set(0.025, 0.025, 0.025);

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
    this.posSuperficie.add(this.mesh);
    this.posSuperficie.position.y = 1.85;
    this.mesh.scale.set(0.025, 0.025, 0.025);

    this.box = new THREE.Box3().setFromObject(this.estrella);
    /*this.boxHelper = new THREE.Box3Helper(this.box, 0xffff00);
    this.add(this.boxHelper);
    this.boxHelper = false;*/
  }

  colocar(punto, angulo){
    var posTmp = this.path.getPointAt(punto);
    this.nodoPosOrientTubo.position.copy(posTmp);
    var tangente = this.path.getTangentAt(punto);
    posTmp.add(tangente);
    var segmentoActual = Math.floor(punto * this.segmentos);
    this.nodoPosOrientTubo.up = this.binormals[segmentoActual];
    this.nodoPosOrientTubo.lookAt(posTmp);
    this.nodoPosOrientTubo.rotation.z = angulo;
  }

  clone() {
    const cloned = new Estrella(this.Tubo, this.gui);
    // Copiar otras propiedades necesarias si es necesario
    return cloned;
  }

  efecto(personaje){
    personaje.ajustarVelocidad(0.98);
    this.visible = false;
  }

  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
  }

  update () {
    // Actualizar la caja englobante
    this.box.setFromObject(this.estrella);
  }
}

export { Estrella }

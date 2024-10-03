import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'
import { objetoColision } from './objetoColision.js';

class bolaDragon extends objetoColision {
  constructor(Tubo, gui) {
    super();

    // Parte correspondiente de la interfaz
    this.createGUI (gui);

    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('/imgs/bolaTextura.jpg');
    var material = new THREE.MeshBasicMaterial({ map: texture });

    var geometryEsf = new THREE.SphereGeometry(3, 32, 32);

    var mesh = new THREE.Mesh(geometryEsf, material);

    var shape = new THREE.Shape();
    shape.moveTo(0,2);
    shape.lineTo(0.585, 0.618);
    shape.lineTo(1.902, 0.618);
    shape.lineTo(0.8, -0.25);
    shape.lineTo(1.176, -1.618);
    shape.lineTo(0, -0.8);
    shape.lineTo(-1.176, -1.618);
    shape.lineTo(-0.8, -0.25);
    shape.lineTo(-1.902, 0.618);
    shape.lineTo(-0.585, 0.618);
    shape.lineTo(0, 2);

    var opciones = {
      depth: 8,
      steps: 2,
      bevelEnabled: false,
      curveSegments: 10,
      bevelSegments: 1,
      bevelThickness: 0.1,
    };

    var geometry = new THREE.ExtrudeGeometry(shape, opciones);
    var mesh1 = new THREE.Mesh(geometry, material);
    mesh1.position.set(0,0,-3);

    var planetaBola = new CSG();
    planetaBola.subtract([mesh, mesh1]);
    this.bola = planetaBola.toMesh(); 

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
    this.posSuperficie.add(this.bola);
    this.posSuperficie.position.y = 1.85;

    this.box = new THREE.Box3().setFromObject(this.bola);
    
    /*this.boxHelper = new THREE.Box3Helper(this.box, 0xffff00);
    this.add(this.boxHelper);
    this.boxHelper = true;*/
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
    const clonedBola = new bolaDragon(this.Tubo, this.gui);
    // Copiar otras propiedades necesarias si es necesario
    return clonedBola;
  }

  efecto(personaje){
    personaje.ajustarVelocidad(1.02);
    this.visible = false;
  }

  createGUI(gui) {
    // Controles para el tamaño, la orientación y la posición de la caja
  }

  update() {
    // Actualizar la caja englobante
    this.box.setFromObject(this.bola);

    // Actualizar otras transformaciones
    TWEEN.update();
  }
}

export { bolaDragon };

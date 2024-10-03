import { CSG } from '../libs/CSG-v2.js'
import { objetoColision } from './objetoColision.js';

import * as THREE from 'three'

var material = new THREE.MeshNormalMaterial();

class Martillo extends objetoColision {
  constructor(Tubo ,gui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui);

    this.agarre = this.agarre();

    this.cabezaMartillo = this.cabeza();

    this.martillo = new THREE.Object3D();
    this.martillo.add(this.agarre);
    this.martillo.add(this.cabezaMartillo);
    this.martillo.rotation.y = Math.PI / 2;
    this.anguloAnimacion = 0;
    this.direccionAnimacion = 1;

    this.angulo = Math.PI;
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
    this.posSuperficie.add(this.martillo);
    this.posSuperficie.position.y = 1.85;
    this.martillo.scale.set(0.4, 0.4, 0.4);

    this.box = new THREE.Box3().setFromObject(this.cabezaMartillo);
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
    this.angulo = angulo;
  }

  cabeza(){
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('/imgs/cabezaMartillo.jpg');
    var materialCabeza = new THREE.MeshStandardMaterial({ map: texture });
    var base = new THREE.BoxGeometry(0.75, 0.65, 0.3);
    var baseM = new THREE.Mesh(base, materialCabeza);
    
    var circuloD = new THREE.SphereGeometry(0.45);
    var circuloI = new THREE.SphereGeometry(0.45);
    circuloD.translate(0.55, -0.35, 0);
    var circuloDM = new THREE.Mesh(circuloD, materialCabeza);
    circuloI.translate(-0.55, -0.35, 0);
    var circuloIM = new THREE.Mesh(circuloI, materialCabeza);

    var octahedron = new THREE.OctahedronGeometry(0.212, 0);
    octahedron.rotateX(45*Math.PI/180);
    octahedron.translate(0.37, 0.18, 0);
    var pico = new THREE.Mesh(octahedron, materialCabeza);

    var baseCabeza1 = new CSG();
    baseCabeza1.union([circuloDM, baseM])
    baseCabeza1.subtract([circuloDM]);
    baseCabeza1.subtract([circuloIM]);
    var baseCabeza1M = baseCabeza1.toMesh();
    var baseCabeza2 = new CSG();
    baseCabeza2.union([baseCabeza1M, pico]);
    var cabeza = baseCabeza2.toGeometry();
    cabeza.scale(1.9, 1.7, 1.7);
    cabeza.translate(0, 3.7, 0);
    var cabezaM = new THREE.Mesh(cabeza, materialCabeza);

    var maza = this.maza();

    var astaF = this.asta();
    var astaA = this.asta();
    astaA.position.set(0,0,-0.30)

    var cabezaMartilloC = new CSG();
    cabezaMartilloC.union([cabezaM, maza, astaF, astaA]);
    var cabezaMartillo = cabezaMartilloC.toMesh();

    return cabezaMartillo;
  }

  agarre(){
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('/imgs/wood.jpg');
    var materialAgarre = new THREE.MeshStandardMaterial({ map: texture });
    var shape = new THREE.Shape();
    shape.moveTo(-2,-3);
    shape.lineTo(-2,3);
    shape.bezierCurveTo(-1, 4, 1, 4, 2, 3);
    shape.moveTo(2, 3);
    shape.lineTo(2, -3);
    shape.bezierCurveTo(1, -4, -1, -4, -2, -3);

    var options1 = { depth: 17, steps: 1, bevelEnabled: false };
    var options2 = { depth: 21, steps: 1, bevelEnabled: false };
    var mangoG = new THREE.ExtrudeGeometry(shape, options1);
    var mangoP = new THREE.ExtrudeGeometry(shape, options2);

    
    mangoG.scale(0.1, 0.07, 0.1);
    mangoP.scale(0.07, 0.06, 0.1);
    mangoP.translate(0, 0, 1.5);
    
    
    var mangoGM = new THREE.Mesh(mangoG, materialAgarre);
    var mangoPM = new THREE.Mesh(mangoP, materialAgarre);
    
    var largo = new CSG();
    largo.union([mangoGM, mangoPM]);
    var vara = largo.toMesh();

    vara.rotateX(-90*Math.PI/180);

    return vara;
  }

  maza(){
    var points = [new THREE.Vector2(0.001, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0.75, 2), new THREE.Vector2(0.75, 4), new THREE.Vector2(0.001, 4)];
    var latheGeometry = new THREE.LatheGeometry(points, 24, 0, Math.PI * 2);
    latheGeometry.scale(0.25,0.25,0.25);
    latheGeometry.rotateZ(90*Math.PI/180);
    latheGeometry.translate(1.4, 4, 0);
    var mesh = new THREE.Mesh(latheGeometry, material);

    return mesh;
  }

  asta(){
    var cilinG = new THREE.CylinderGeometry(3, 3, 1);
    var cilinP = new THREE.CylinderGeometry(3, 3, 1);
    var caja = new THREE.BoxGeometry(6,6,6);
    cilinP.translate(0.5, 0, 0);
    caja.translate(0, 0, -3);

    var cilinGM = new THREE.Mesh(cilinG, material);
    var cilinPM = new THREE.Mesh(cilinP, material);
    var cajaM = new THREE.Mesh(caja, material);

    var astaC = new CSG();
    astaC.union([cilinGM, cilinPM]);
    astaC.subtract([cilinPM]);
    astaC.subtract([cajaM]);
    var astaG = astaC.toGeometry();
    astaG.rotateZ(-90*Math.PI/180);
    astaG.rotateY(-90*Math.PI/180);
    astaG.scale(0.3, 0.3, 0.2);
    astaG.translate(-0.7, 3.35, 0.15);
    var asta = new THREE.Mesh(astaG, material);

    return asta;
  }

  clone() {
    const cloned = new Martillo(this.Tubo, this.gui);
    // Copiar otras propiedades necesarias si es necesario
    return cloned;
  }

  efecto(personaje){
    personaje.parar();
    this.visible = false;
  }
  
  createGUI (gui) {
    // Controles para el tamaño, la orientación y la posición de la caja
  }
  
  update () {
    this.anguloAnimacion -= this.direccionAnimacion; // Restar en lugar de sumar para disminuir el ángulo
    if (this.anguloAnimacion <= -90 || this.anguloAnimacion >= 0) { // Cambiar las condiciones de la animación
      this.direccionAnimacion *= -1;
    }
  
    this.martillo.rotation.x = this.anguloAnimacion * (Math.PI / 180);

    this.box.setFromObject(this.cabezaMartillo);
  }
  
}

export { Martillo }
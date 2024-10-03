import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'

var recorrido, resolucion, radio, segmentosCirculo, geometriaTubo;

class Circuito extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();

		// Parte correspondiente de la interfaz
		this.createGUI (gui, titleGui);

    var planoCircuito = [
      new THREE.Vector3(0.0, -10.0, 0.0),
      new THREE.Vector3(10.0, -10.0, 6.0),
      new THREE.Vector3(20.0, -5.0, 0.0),
      new THREE.Vector3(25.0, 0.0, -3.0), 
      new THREE.Vector3(30.0, 5.0, -6.0),
      new THREE.Vector3(30.0, 15.0, -12.0),
      new THREE.Vector3(20.0, 20.0, -6.0),
      new THREE.Vector3(15.0, 25.0, -3.0), 
      new THREE.Vector3(10.0, 30.0, 0.0),
      new THREE.Vector3(0.0, 40.0, 10.0),
      new THREE.Vector3(-10.0, 30.0, 20.0),
      new THREE.Vector3(-20.0, 20.0, 10.0),
      new THREE.Vector3(-30.0, 10.0, 0.0),
      new THREE.Vector3(-35.0, 5.0, -5.0), 
      new THREE.Vector3(-40.0, 0.0, -10.0),
      new THREE.Vector3(-35.0, -5.0, -15.0), 
      new THREE.Vector3(-30.0, -10.0, -20.0),
      new THREE.Vector3(-20.0, -20.0, -10.0),
      new THREE.Vector3(-10.0, -30.0, 0.0),
      new THREE.Vector3(0.0, -40.0, 10.0),
      new THREE.Vector3(10.0, -30.0, 20.0),
      new THREE.Vector3(20.0, -20.0, 10.0),
      new THREE.Vector3(30.0, -10.0, 0.0),
      new THREE.Vector3(35.0, -5.0, -5.0), 
      new THREE.Vector3(40.0, 0.0, -10.0),
      new THREE.Vector3(35.0, 5.0, -15.0), 
      new THREE.Vector3(30.0, 10.0, -20.0),
      new THREE.Vector3(20.0, 20.0, -30.0),
      new THREE.Vector3(10.0, 30.0, -40.0),
      new THREE.Vector3(0.0, 20.0, -30.0),
      new THREE.Vector3(-10.0, 10.0, -20.0),
      new THREE.Vector3(-20.0, 0.0, -10.0),
      new THREE.Vector3(-15.0, -5.0, -5.0),
      new THREE.Vector3(-10.0, -10.0, 0.0),
      new THREE.Vector3(0.0, -20.0, 10.0),
      new THREE.Vector3(10.0, -10.0, 20.0),
      new THREE.Vector3(5.0, 0.0, 25.0), 
      new THREE.Vector3(0.0, 0.0, 30.0),
      new THREE.Vector3(-10.0, 10.0, 40.0),
      new THREE.Vector3(-20.0, 0.0, 30.0),
      new THREE.Vector3(-30.0, -10.0, 20.0),
      new THREE.Vector3(-40.0, -20.0, 10.0),
      new THREE.Vector3(-35.0, -25.0, 5.0), 
      new THREE.Vector3(-30.0, -30.0, 0.0),
      new THREE.Vector3(-20.0, -40.0, -10.0),
      new THREE.Vector3(-10.0, -30.0, -20.0),
      new THREE.Vector3(-5.0, -25.0, -25.0), 
      new THREE.Vector3(0.0, -20.0, -30.0)
  ];
  
  

		recorrido = new THREE.CatmullRomCurve3 (planoCircuito, true);

    var loader = new THREE.TextureLoader();
    var textura = loader.load('/imgs/texturaSerpiente.jpg');
    textura.wrapS = THREE.RepeatWrapping;
    textura.wrapT = THREE.RepeatWrapping;
    textura.repeat.set(100, 5);

    var material = new THREE.MeshStandardMaterial({ map: textura });

    resolucion = 200;
    radio = 1.5;
    segmentosCirculo = 20;
    geometriaTubo = new THREE.TubeGeometry(recorrido, resolucion, radio, segmentosCirculo, true ) ;
    var tubo = new THREE.Mesh(geometriaTubo, material);

		this.add (tubo);
  }

  obtenerGeometria(){
    return geometriaTubo;
  }

  obtenerPunto(segmento){
    return recorrido.getPointAt(segmento);
  }

  obtenerRecorrido(){
    return recorrido;
  }

  obtenerResolucion(){
    return resolucion;
  }

  obtenerRadio(){
    return radio;
  }

  obtenerSegmentosCirculo(){
    return segmentosCirculo;
  }

  createGUI(gui, titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
    };

    // Se crea una sección para los controles de la caja
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
  }

  update() {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación

    TWEEN.update();
  }
}

export { Circuito };
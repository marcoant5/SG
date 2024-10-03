import * as THREE from '../libs/three.module.js';
import * as TWEEN from '../libs/tween.esm.js';
import { OBJLoader } from '../libs/OBJLoader.js'; 

class articulado extends THREE.Object3D {
  constructor() {
    super();

    const material = new THREE.MeshBasicMaterial({ color: 0xFFC0CB });
    const materialNubeCola = new THREE.MeshPhysicalMaterial({
      color: 0x0000FF,
      reflectivity: 0.5
    });

    const textureLoader = new THREE.TextureLoader();
    const faceTexture = textureLoader.load('../imgs/caraG.png');

    const materialCabeza = new THREE.MeshBasicMaterial({ map: faceTexture });

    // Cabeza
    const geometriaCabeza = new THREE.SphereGeometry(1);
    this.cabeza = new THREE.Mesh(geometriaCabeza, materialCabeza);
    this.cabeza.position.set(0, 8.5, 0);
    this.cabeza.rotation.y = -Math.PI / 2;
    this.add(this.cabeza);

    // Cuello
    const geometriaCuello = new THREE.CylinderGeometry(0.4, 0.4, 1.5);
    this.cuello = new THREE.Mesh(geometriaCuello, material);
    this.cuello.position.set(0, 7.5, 0);
    this.add(this.cuello);

    // Tronco
    const materialTronco = new THREE.MeshBasicMaterial({ color: 0xFF6600 });
    const geometriaTronco = new THREE.CylinderGeometry(1.5, 1.9, 5);
    this.tronco = new THREE.Mesh(geometriaTronco, materialTronco);
    this.tronco.position.set(0, 4.5, 0);
    this.add(this.tronco);

    // Brazos
    this.brazoIzquierdo = this.crearBrazo();
    this.brazoIzquierdo.position.set(1.75, 6.5, 0);
    this.brazoIzquierdo.rotation.z = Math.PI / 10;
    this.add(this.brazoIzquierdo);

    this.brazoDerecho = this.crearBrazo();
    this.brazoDerecho.position.set(-1.75, 6.5, 0);
    this.brazoDerecho.rotation.z = -Math.PI / 10;
    this.add(this.brazoDerecho);

    // Piernas
    this.piernaIzquierda = this.crearPierna();
    this.piernaIzquierda.position.set(0.75, 0.75, 0);
    this.add(this.piernaIzquierda);

    this.piernaDerecha = this.crearPierna();
    this.piernaDerecha.position.set(-0.75, 0.75, 0);
    this.add(this.piernaDerecha);

    // Añadir una nube debajo del personaje
    this.nube = this.crearNube(materialNubeCola);
    this.nube.position.set(0, -8.5, -0.5);
    this.add(this.nube);

    // Cargar el modelo .obj y añadirlo al personaje
    const materialPelo = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.cargarModelo('modelos/hair.obj', materialPelo);

    this.iniciarAnimaciones();
  }

  cargarModelo(ruta, material) {
    const loader = new OBJLoader();
    loader.load(
      ruta,
      (obj) => {
        obj.traverse((child) => {
          if (child.isMesh) {
            child.material = material;
          }
        });
        obj.position.set(-2, 8, 1); 
        obj.scale.set(0.15,0.15,0.15);
        obj.rotation.y = Math.PI;
        this.add(obj);
      },
    );
  }

  crearBrazo() {
    const material = new THREE.MeshBasicMaterial({ color: 0xFFC0CB });

    // Hombro
    const geometriaHombro = new THREE.SphereGeometry(0.5);
    const hombro = new THREE.Mesh(geometriaHombro, material);

    // Brazo
    const geometriaBrazo = new THREE.CylinderGeometry(0.45, 0.3, 2.5);
    const brazo = new THREE.Mesh(geometriaBrazo, material);
    brazo.position.set(0, -1.5, 0);
    hombro.add(brazo);

    // Codo
    const geometriaCodo = new THREE.SphereGeometry(0.35);
    const codo = new THREE.Mesh(geometriaCodo, material);
    codo.position.set(0, -1.35, 0);
    brazo.add(codo);

    // Antebrazo doblado
    const geometriaAntebrazo = new THREE.CylinderGeometry(0.35, 0.25, 2);
    const antebrazo = new THREE.Mesh(geometriaAntebrazo, material);
    antebrazo.rotation.x = -Math.PI / 2;
    antebrazo.position.set(0, 0, 1.15);
    codo.add(antebrazo);

    // Mano
    const geometriaMano = new THREE.SphereGeometry(0.35);
    const mano = new THREE.Mesh(geometriaMano, material);
    mano.position.set(0, -1.2, 0);
    antebrazo.add(mano);

    return hombro;
  }

  crearPierna() {
    const material = new THREE.MeshBasicMaterial({ color: 0xFF6600 });
    const materialPie = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // Muslo
    const geometriaMuslo = new THREE.CylinderGeometry(0.85, 0.5, 3.5);
    const muslo = new THREE.Mesh(geometriaMuslo, material);
    muslo.position.set(0, -2, 0);

    // Rodilla
    const geometriaRodilla = new THREE.SphereGeometry(0.5125);
    const rodilla = new THREE.Mesh(geometriaRodilla, material);
    rodilla.position.set(0, -1.8, 0);
    muslo.add(rodilla);

    // Pierna
    const geometriaPierna = new THREE.CylinderGeometry(0.5, 0.3, 3.25);
    const pierna = new THREE.Mesh(geometriaPierna, material);
    pierna.rotation.x = Math.PI / 4;
    pierna.position.set(0, -1.25, -1.25);
    rodilla.add(pierna);

    // Pie
    const geometriaPie = new THREE.BoxGeometry(1, 0.5, 2);
    const pie = new THREE.Mesh(geometriaPie, materialPie);
    pie.position.set(0, -1.75, 0.75);
    pierna.add(pie);

    return muslo;
  }

  crearNube(materialNubeCola) {
    const geometriaGrande = new THREE.SphereGeometry(3, 32, 32);
    const geometriaMediana = new THREE.SphereGeometry(2.5, 32, 32);
    const geometriaPequena = new THREE.SphereGeometry(2, 32, 32);

    const baseNube = new THREE.Mesh(geometriaGrande, materialNubeCola);
    baseNube.scale.set(1.25, 0.75, 1.25);

    const nube1 = new THREE.Mesh(geometriaMediana, materialNubeCola);
    const nube2 = new THREE.Mesh(geometriaMediana, materialNubeCola);
    const nube3 = new THREE.Mesh(geometriaPequena, materialNubeCola);
    const nube4 = new THREE.Mesh(geometriaPequena, materialNubeCola);
    const nube5 = new THREE.Mesh(geometriaMediana, materialNubeCola);

    nube1.position.set(3.25, 0.5, 0);
    nube2.position.set(-2, 1, 0);
    nube3.position.set(0, 0.75, 2);
    nube4.position.set(0, 0.5, -2.25);
    nube5.position.set(0, 1.55, 0);

    this.cola = new ColaReptil(materialNubeCola);
    this.cola.rotation.x = Math.PI / 2;
    this.cola.position.set(0, -0.5, -2);
    baseNube.add(this.cola);

    baseNube.add(nube1);
    baseNube.add(nube2);
    baseNube.add(nube3);
    baseNube.add(nube4);
    baseNube.add(nube5);

    return baseNube;
  }

  iniciarAnimaciones() {
    this.crearAnimacionBrazo(this.brazoIzquierdo, Math.PI / 4, -Math.PI / 4);
    this.crearAnimacionBrazo(this.brazoDerecho, -Math.PI / 4, Math.PI / 4);
    this.crearAnimacionBrazosArribaAbajo(this.brazoIzquierdo);
    this.crearAnimacionBrazosArribaAbajo(this.brazoDerecho);
    this.crearAnimacionPierna(this.piernaIzquierda, Math.PI / 7.9, -Math.PI / 7.9);
    this.crearAnimacionPierna(this.piernaDerecha, -Math.PI / 7.9, Math.PI / 7.9);
  }

  crearAnimacionBrazo(brazo, angulo1, angulo2) {
    const tweenIda = new TWEEN.Tween({ rotacion: angulo1 })
      .to({ rotacion: angulo2 }, 500)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(function (obj) {
        brazo.rotation.x = obj.rotacion;
      });

    const tweenVuelta = new TWEEN.Tween({ rotacion: angulo2 })
      .to({ rotacion: angulo1 }, 500)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(function (obj) {
        brazo.rotation.x = obj.rotacion;
      });

    tweenIda.chain(tweenVuelta);
    tweenVuelta.chain(tweenIda);

    tweenIda.start();
  }

  crearAnimacionBrazosArribaAbajo(brazo) {
    const posicionInicial = { y: brazo.position.y };
    const desplazamiento = 0.2;

    const tweenSube = new TWEEN.Tween(posicionInicial)
      .to({ y: brazo.position.y + desplazamiento }, 300)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(function () {
        brazo.position.y = posicionInicial.y;
      });

    const tweenBaja = new TWEEN.Tween(posicionInicial)
      .to({ y: brazo.position.y - desplazamiento }, 300)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(function () {
        brazo.position.y = posicionInicial.y;
      });

    tweenSube.chain(tweenBaja);
    tweenBaja.chain(tweenSube);

    tweenSube.start();
  }

  crearAnimacionPierna(pierna, angulo1, angulo2) {
    const tweenIda = new TWEEN.Tween({ rotacion: angulo1 })
      .to({ rotacion: angulo2 }, 500)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(function (obj) {
        pierna.rotation.x = obj.rotacion;
      });

    const tweenVuelta = new TWEEN.Tween({ rotacion: angulo2 })
      .to({ rotacion: angulo1 }, 500)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(function (obj) {
        pierna.rotation.x = obj.rotacion;
      });

    tweenIda.chain(tweenVuelta);
    tweenVuelta.chain(tweenIda);

    tweenIda.start();
  }

  update() {
    TWEEN.update();
    this.cola.update();
  }
}

class ColaReptil extends THREE.Object3D {
  constructor(material) {
    super();

    // Crear segmentos de la cola
    const segmentosCola = [];
    const numeroSegmentos = 9; // Un segmento menos para dejar espacio para el pico
    for (let i = 0; i < numeroSegmentos; i++) {
      const segmento = this.crearSegmentoCola(material, i);
      if (i > 0) {
        segmentosCola[i - 1].add(segmento);
      }
      segmentosCola.push(segmento);
    }

    // Crear y añadir el segmento final en pico
    const pico = this.crearPico(material);
    segmentosCola[segmentosCola.length - 1].add(pico);

    this.add(segmentosCola[0]);

    // Iniciar animaciones
    this.iniciarAnimacionCola(segmentosCola);
  }

  crearSegmentoCola(material, indice) {
    const geometria = new THREE.CylinderGeometry(0.6 - indice * 0.05, 0.7 - indice * 0.05, 2);
    const segmento = new THREE.Mesh(geometria, material);
    segmento.position.y = -1.5;

    return segmento;
  }

  crearPico(material) {
    const geometriaPico = new THREE.CylinderGeometry(0.3, 0.001, 1, 32);
    const pico = new THREE.Mesh(geometriaPico, material);
    pico.position.y = -1.5;
    return pico;
  }

  iniciarAnimacionCola(segmentos) {
    segmentos.forEach((segmento, indice) => {
      this.crearAnimacionMovimiento(segmento, indice);
    });
  }

  crearAnimacionMovimiento(segmento, indice) {
    const amplitudMovimiento = Math.PI / 16;
    const retraso = indice * 50;

    const tweenIda = new TWEEN.Tween({ rotacion: -amplitudMovimiento })
      .to({ rotacion: amplitudMovimiento }, 1000)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(function (obj) {
        segmento.rotation.z = obj.rotacion;
      })
      .delay(retraso);

    const tweenVuelta = new TWEEN.Tween({ rotacion: amplitudMovimiento })
      .to({ rotacion: -amplitudMovimiento }, 1000)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(function (obj) {
        segmento.rotation.z = obj.rotacion;
      });

    tweenIda.chain(tweenVuelta);
    tweenVuelta.chain(tweenIda);

    tweenIda.start();
  }

  update() {
    TWEEN.update();
  }
}

export { articulado };

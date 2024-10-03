import * as THREE from '../libs/three.module.js';
import { GUI } from '../libs/dat.gui.module.js';
import { TrackballControls } from '../libs/TrackballControls.js';
import * as TWEEN from '../libs/tween.esm.js';

// Clases de mi proyecto
import { Martillo } from './Martillo.js';
import { Estrella } from './Estrella.js';
import { PlanetaEsfera } from './PlanetaEsfera.js';
import { PlanetaToro } from './planetaToro.js';
import { planetaPiramide } from './planetaPiramide.js';
import { bolaDragon } from './bolaDragon.js';
import { Circuito } from './Circuito.js';
import { articulado } from './personajeArticulado.js';
import { marcaMeta } from './marcaMeta.js';
import { muelle } from './muelle.js';


class MyScene extends THREE.Scene {
  constructor(myCanvas) {
    super();

    this.renderer = this.createRenderer(myCanvas);
    this.gui = this.createGUI();

    this.createLights();
    this.createCamera();

    this.axis = new THREE.AxesHelper(5);
    this.add(this.axis);

    this.personaje = new articulado();
    this.add(this.personaje);

    this.model = new Circuito(this.gui, "Controles de la Escena");
    this.add(this.model);

    this.martillo = new Martillo(this.model, this.gui);
    this.martillo.scale.set(1.5, 1.5, 1.5);
    this.martillo.rotation.z = Math.PI;
    this.martillo.position.set(0, -3, 0);
    this.add(this.martillo);

    this.bola = new bolaDragon(this.model, this.gui);
    this.add(this.bola);

    this.estrella = new Estrella(this.model, this.gui);
    this.estrella.scale.set(2.5, 2.5, 2.5);
    this.estrella.rotation.z = -Math.PI / 2;
    this.estrella.position.set(0, -5, 0);
    this.add(this.estrella);

    this.muelle = new muelle(this.model, this.gui);
    this.add(this.muelle);

    this.meta = new marcaMeta(this.model, this.gui);
    this.meta.position.set(0, 0, 0);
    this.add(this.meta);

    this.planetaToro = new PlanetaToro(this.gui, "planetaToro");
    this.add(this.planetaToro);

    this.planetaPiramide = new planetaPiramide(this.gui, "planetaPiramide");
    this.add(this.planetaPiramide);

    this.planetaEsfera = new PlanetaEsfera(this.gui, "planetaEsfera");
    this.add(this.planetaEsfera);

    this.objects = {
      'personaje': this.personaje,
      'martillo': this.martillo,
      'bola': this.bola,
      'estrella': this.estrella,
      'meta': this.meta,
      'planetaToro': this.planetaToro,
      'planetaPiramide': this.planetaPiramide,
      'planetaEsfera': this.planetaEsfera,
      'model': this.model,
      'muelle': this.muelle // Añadimos el muelle a la lista de objetos
    };

    this.setObjectVisibility('personaje');

    window.addEventListener('keydown', (event) => this.onKeyDown(event));
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(6, 3, 6);
    const look = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(look);
    this.add(this.camera);

    this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement);
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    this.cameraControl.target = look;
  }

  createGUI() {
    const gui = new GUI();
    this.guiControls = {
      lightIntensity: 0.5,
      axisOnOff: true
    };

    const folder = gui.addFolder('Luz y Ejes');
    folder.add(this.guiControls, 'lightIntensity', 0, 1, 0.1).name('Intensidad de la Luz: ').onChange(value => this.setLightIntensity(value));
    folder.add(this.guiControls, 'axisOnOff').name('Mostrar ejes: ').onChange(value => this.setAxisVisible(value));

    return gui;
  }

  createLights() {
    const ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    this.add(ambientLight);

    this.spotLight = new THREE.SpotLight(0xffffff, this.guiControls.lightIntensity);
    this.spotLight.position.set(60, 60, 40);
    this.add(this.spotLight);
  }

  setLightIntensity(value) {
    this.spotLight.intensity = value;
  }

  setAxisVisible(value) {
    this.axis.visible = value;
  }

  createRenderer(myCanvas) {
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    $(myCanvas).append(renderer.domElement);
    return renderer;
  }

  getCamera() {
    return this.camera;
  }

  setCameraAspect(ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }

  onWindowResize() {
    this.setCameraAspect(window.innerWidth / window.innerHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setObjectVisibility(visibleObjectKey) {
    for (let key in this.objects) {
      if (this.objects.hasOwnProperty(key)) {
        this.objects[key].visible = (key === visibleObjectKey);
      }
    }
  }

  onKeyDown(event) {
    switch (event.key.toUpperCase()) {
      case 'P':
        this.setObjectVisibility('personaje');
        break;
      case 'M':
        this.setObjectVisibility('martillo');
        break;
      case 'B':
        this.setObjectVisibility('bola');
        break;
      case 'E':
        this.setObjectVisibility('estrella');
        break;
      case 'O':
        this.setObjectVisibility('planetaEsfera');
        break;
      case 'R':
        this.setObjectVisibility('planetaPiramide');
        break;
      case 'T':
        this.setObjectVisibility('planetaToro');
        break;
      case 'C':
        this.setObjectVisibility('model');
        break;
      case 'L':
        this.setObjectVisibility('meta');
        break;
      case 'S':
        this.setObjectVisibility('muelle');
        break;
      default:
        console.log(`Acción no definida: ${event.key}`);
    }
  }

  update() {
    this.renderer.render(this, this.getCamera());
    this.cameraControl.update();
    if (this.personaje && typeof this.personaje.update === 'function') {
      this.personaje.update();
    }
    requestAnimationFrame(() => this.update());
  }
}

$(function () {
  const scene = new MyScene("#WebGL-output");
  window.addEventListener("resize", () => scene.onWindowResize());
  scene.update();
});

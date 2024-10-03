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
  import { Personaje } from './Personaje.js';
  import { Planeta } from './Planeta.js';
  import { triggerFinal } from './triggerFinal.js';
  import { marcaMeta } from './marcaMeta.js';
  import { muelle } from './muelle.js';

  class MyScene extends THREE.Scene {
    constructor(myCanvas) {
      super();

      // Inicializar el puntaje y contador de vueltas
      this.score = 0;
      this.colisionTimeout = 0;

      this.timerElement = document.getElementById('timer');
      this.lapElement = document.getElementById('laps');

      this.renderer = this.createRenderer(myCanvas);
      this.gui = this.createGUI();
      this.createLights();
      this.createCamera();
      this.activeCamera = this.camera;

      this.axis = new THREE.AxesHelper(10);
      this.add(this.axis);
      this.setAxisVisible(false);

      this.t = 0;
      this.tdebug = 0;
      this.deltaT = 0.0001;

      this.mouse = new THREE.Vector2();
      this.raycaster = new THREE.Raycaster();
      this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this), false);

      this.model = new Circuito(this.gui, "Controles de la Escena");
      this.add(this.model);

      this.objetosColisionables = [];

      this.personaje = new Personaje(this.model, this.gui);
      this.add(this.personaje);
      this.secondCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.secondCamera.position.set(0, 3, 8);
      this.personaje.posSuperficie.add(this.secondCamera);

      this.martillo = new Martillo(this.model, this.gui);
      this.colocarEnCircuito(this.martillo, 5);

      this.bola = new bolaDragon(this.model, this.gui);
      this.colocarEnCircuito(this.bola, 20);

      this.estrella = new Estrella(this.model, this.gui);
      this.colocarEnCircuito(this.estrella, 20);

      this.muelle = new muelle(this.model, this.gui);
      this.colocarEnCircuito(this.muelle, 10);

      // Crear y añadir el trigger invisible
      this.lapTrigger = new triggerFinal(this.model, this.gui);
      this.objetosColisionables.push(this.lapTrigger);
      this.add(this.lapTrigger);

      this.meta = new marcaMeta(this.model, this.gui);
      this.add(this.meta);

      this.objetosDisparables = [];

      this.planetaToro = new PlanetaToro(this.gui, "planetaToro");
      this.planetaToro.scale.set(0.5, 0.5, 0.5);
      this.add(this.planetaToro);
      this.objetosDisparables.push(this.planetaToro);

      this.planetaPiramide = new planetaPiramide(this.gui, "planetaPiramide");
      this.planetaPiramide.scale.set(0.7, 0.7, 0.7);
      this.add(this.planetaPiramide);
      this.objetosDisparables.push(this.planetaPiramide);

      this.planetaEsfera = new PlanetaEsfera(this.gui, "planetaEsfera");
      this.planetaEsfera.scale.set(0.5, 0.5, 0.5);
      this.add(this.planetaEsfera);
      this.objetosDisparables.push(this.planetaEsfera);

      // Variables para control de luz
      this.minAmbientIntensity = 0;
      this.maxAmbientIntensity = 1;
      this.lightDecrement = 0.001; // Ajustar para velocidad de decremento

      // Cargar las texturas de los cuatro cielos
      const loader = new THREE.TextureLoader();
      this.textures = {
      day: loader.load('/imgs/fondoTex-1.png'),
      evening: loader.load('/imgs/fondoTex-2.png'),
      night: loader.load('/imgs/fondoTex-3.png'),
      midnight: loader.load('/imgs/fondoTex-4.png')
      };

      // Crear el mesh de fondo con una de las texturas
      this.backgroundMesh = this.createBackground(this.textures.day);
      this.backgroundMesh.visible = true;
      this.add(this.backgroundMesh);

      // Inicializar el temporizador de 2 minutos
      this.startTime = Date.now();
      this.timerDuration = 2 * 60 * 1000; // 2 minutos en milisegundos
    }

    updateTimer() {
      const elapsedTime = Date.now() - this.startTime;
      const remainingTime = this.timerDuration - elapsedTime;

      if (remainingTime <= 0) {
        this.timerElement.innerText = "00:00";
        this.endGame();
        return;
      }

      const minutes = Math.floor(remainingTime / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);

      this.timerElement.innerText = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateScore(cantidad) {
      if(this.score + cantidad >= 0)
        this.score += cantidad;
      else
      this.score = 0;
    }

    updateLapCount() {
      const lapCount = this.lapTrigger.lapCount;
    
      if (lapCount < 2) {
        this.lapElement.innerText = `Vuelta ${lapCount + 1}/3`;
      } else if (lapCount === 2) {
        this.lapElement.innerText = "Última Vuelta";
      }
    
      if (lapCount >= 3) {
        this.endGame();
      }
    }
    

    endGame() {
      const elapsedTime = Date.now() - this.startTime;
      const remainingTime = this.timerDuration - elapsedTime;
      this.updateScore(Math.floor(remainingTime / 1000)); // Agregar el tiempo restante al puntaje
    
      // Guardar el puntaje en localStorage
      localStorage.setItem('score', this.score);
    
      // Redirigir a la página del leaderboard
      window.location.href = 'leaderboard.html';
    }    

    stopGame() {
      cancelAnimationFrame(this.update);
    }

    getRandomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    colocarEnCircuito(modelo, veces) {
      for (let i = 0; i < veces; i++) { // Por ejemplo, clonar 5 bolas
        const clonedModel = modelo.clone();
        const randomPosition = this.getRandomInRange(0, 1);
        const randomRotation = this.getRandomInRange(0, 2 * Math.PI);
        clonedModel.colocar(randomPosition, randomRotation);
        this.add(clonedModel);
        this.objetosColisionables.push(clonedModel);
      }
    }

    createCamera() {
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.set(70, 5, 70);
      var look = new THREE.Vector3(0, 0, 0);
      this.camera.lookAt(look);
      this.add(this.camera);

      this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement);
      this.cameraControl.rotateSpeed = 5;
      this.cameraControl.zoomSpeed = -2;
      this.cameraControl.panSpeed = 0.5;
      this.cameraControl.target = look;
    }

    createSecondCamera() {
      this.secondCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.add(this.secondCamera);
    }

    createGround() {
      var geometryGround = new THREE.BoxGeometry(5, 0.02, 5);
      var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
      var materialGround = new THREE.MeshStandardMaterial({ map: texture });
      var ground = new THREE.Mesh(geometryGround, materialGround);
      ground.position.y = -0.01;
      this.add(ground);
    }

    createBackground(texture) {
      const geometry = new THREE.BoxGeometry(1000, 1000, 1000);
      const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
      const mesh = new THREE.Mesh(geometry, material);
      return mesh;
    }

    createGUI() {
      var gui = new GUI({ autoPlace: false }); // No agregar automáticamente al DOM
      this.guiControls = {
        lightPower: 100.0,
        ambientIntensity: 1,
        axisOnOff: true
      };
    
      var folder = gui.addFolder('Luz y Ejes');
    
      folder.add(this.guiControls, 'ambientIntensity', 0, 1, 0.05)
        .name('Luz ambiental: ')
        .onChange((value) => this.setAmbientIntensity(value));
    
      folder.add(this.guiControls, 'axisOnOff')
        .name('Mostrar ejes : ')
        .onChange((value) => this.setAxisVisible(value));
    
      // Display none para ocultarlo
      var guiContainer = document.createElement('div');
      guiContainer.style.display = 'none';
      guiContainer.appendChild(gui.domElement);
      document.body.appendChild(guiContainer);
    
      return gui;
    }
    

    createLights() {
      this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
      this.add(this.ambientLight);
    }

    setAmbientIntensity(valor) {
      this.ambientLight.intensity = valor;
    }

    setAxisVisible(valor) {
      this.axis.visible = valor;
    }

    createRenderer(myCanvas) {
      var renderer = new THREE.WebGLRenderer();
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

    update() {
      this.t += this.deltaT;
      this.updateTimer();
  
      if (this.colisionTimeout > 0) this.colisionTimeout--;
  
      if (this.tdebug == 1) {
        this.objetosColisionables.forEach(obj => {
          if (this.personaje.box && obj.box && this.personaje.box.intersectsBox(obj.box)) {
            obj.visible = true; // Hacer el objeto invisible
          }
        });
        this.personaje.speed = 0.0005;
        this.lapTrigger.lapCount = 0;
        this.score = 0;
        this.tdebug++;
      } else {
        this.tdebug++;
      }
  
      this.personaje.update();
  
      // Llama al método de animación de órbita para cada objeto PlanetaToro en la escena
      this.children.forEach(child => {
        if (child instanceof Planeta) {
          child.animateOrbit(this.t);
        }
      });
  
      // Detectar colisiones entre el personaje y los objetos
      this.objetosColisionables.forEach(obj => {
        obj.update();
        if (this.personaje.box && obj.box && this.personaje.box.intersectsBox(obj.box) && 0 >= this.colisionTimeout) {
          this.colisionTimeout = 5;
          if (obj instanceof triggerFinal) {
            obj.efecto();
            this.updateLapCount();
          } else {
            obj.efecto(this.personaje);
          }
    
          if (obj instanceof bolaDragon) {
            this.setAmbientIntensity(this.maxAmbientIntensity); // Luz máxima
            this.updateScore(15);
          } else if (obj instanceof Estrella) {
            this.setAmbientIntensity(this.minAmbientIntensity); // Luz mínima
            this.updateScore(-15);
          }
        }
      });
    
      // Decrementar la intensidad de la luz ambiental gradualmente
      if (this.ambientLight.intensity > this.minAmbientIntensity) {
        this.setAmbientIntensity(this.ambientLight.intensity - this.lightDecrement);
      }
  
      // Cambiar textura de fondo según la intensidad de luz ambiental
      let newTexture;
      if (this.ambientLight.intensity <= 0.25) {
        newTexture = this.textures.midnight;
      } else if (this.ambientLight.intensity <= 0.50) {
        newTexture = this.textures.night;
      } else if (this.ambientLight.intensity <= 0.75) {
        newTexture = this.textures.evening;
      } else {
        newTexture = this.textures.day;
      }
  
      // Verificar si es necesario cambiar la textura
      if (this.backgroundMesh.material.map !== newTexture) {
        this.backgroundMesh.material.map = newTexture;
        this.backgroundMesh.material.needsUpdate = true;
      }
  
      // Renderizar la escena
      this.renderer.render(this, this.activeCamera);
  
      // Actualizar la posición de la cámara según su controlador
      this.cameraControl.update();
  
      // Actualizar el resto del modelo
      this.model.update();
  
      TWEEN.update();
  
      // Solicitar la próxima actualización
      requestAnimationFrame(() => this.update(this.personaje));
    } 

    toggleCamera() {
      if (this.activeCamera === this.camera) {
        this.activeCamera = this.secondCamera;
      } else {
        this.activeCamera = this.camera;
      }
    }

    toggleBackground() {
      this.backgroundMesh.visible = !this.backgroundMesh.visible;
    }

    onMouseClick(event) {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.activeCamera);

      const intersects = this.raycaster.intersectObjects(this.objetosDisparables, true);

      if (intersects.length > 0) {
        let selectedObject = intersects[0].object;
        while (selectedObject.parent && !(selectedObject.parent instanceof Planeta)) {
          selectedObject = selectedObject.parent;
        }
        if (selectedObject.parent instanceof Planeta) {
          selectedObject.parent.visible = false;
          selectedObject.parent.efecto(this.personaje);
          this.updateScore(100); // Incrementar puntaje en 100 puntos

          // Hacer que el objeto vuelva a ser visible después de 20 segundos
          setTimeout(() => {
            selectedObject.parent.visible = true;
          }, 20000);
        }
      }
    }
  }

  $(function () {
    var scene = new MyScene("#WebGL-output");
    window.addEventListener("resize", () => scene.onWindowResize());
    window.addEventListener("keydown", function (event) {
      if (event.key === " ") {
        scene.toggleCamera();
      }
      if (event.key === ".") {
        scene.toggleBackground();
      }
    });
    scene.update();
  });

  export { MyScene };

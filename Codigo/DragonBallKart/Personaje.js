import * as THREE from 'three';
import * as TWEEN from '../libs/tween.esm.js';
import { Circuito } from './Circuito.js';
import { articulado } from './personajeArticulado.js';

class Personaje extends THREE.Object3D {
  constructor(Tubo, gui) {
    super();
    // this.createGUI(gui, "Personaje"); // Comentar esta línea si no es necesaria

    this.speed = 0.0005;
    this.angulo = Math.PI / 2;
    this.jumpPower = 0.2; // Potencia del salto
    this.jumpHeight = 2.6; // Altura máxima del salto
    this.isJumping = false; // Bandera para indicar si el personaje está saltando
    this.vulnerable = true;
    this.tiempoInvulnerable = 0;

    this.materialInvulnerable = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.material = new THREE.MeshNormalMaterial();
    this.mesh = new articulado();
    this.mesh.scale.set(0.05, 0.05, 0.05);
    this.mesh.rotation.y = Math.PI;
    this.aux = new Circuito();

    this.nodoPosOrientTubo = new THREE.Object3D();
    this.movimientoLateral = new THREE.Object3D();
    this.posSuperficie = new THREE.Object3D();

    var geomTubo = Tubo.obtenerGeometria();

    this.t = 0;
    this.tparado = 0; 
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
    this.posSuperficie.position.y = 2.25;

    var posTmp = this.path.getPointAt(this.t);
    this.nodoPosOrientTubo.position.copy(posTmp);
    var tangente = this.path.getTangentAt(this.t);
    posTmp.add(tangente);
    var segmentoActual = Math.floor(this.t * this.segmentos);
    this.nodoPosOrientTubo.up = this.binormals[segmentoActual];
    this.nodoPosOrientTubo.lookAt(posTmp);
    this.posSuperficie.rotation.y += Math.PI;

    // Añadir la caja englobante
    this.box = new THREE.Box3().setFromObject(this.mesh);
    /*this.boxHelper = new THREE.Box3Helper(this.box, 0xFFFF00);
    this.add(this.boxHelper);
    this.boxHelper = true;*/

    // Escuchar eventos del teclado para controlar el ángulo del personaje y el salto
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        this.angulo += Math.PI / 36; // Incrementa en 5 grados (en radianes)
        if (this.angulo >= Math.PI * 2) this.angulo -= Math.PI * 2; // Asegura que el ángulo esté en el rango [0, 2π)
      } else if (event.key === 'ArrowLeft') {
        this.angulo -= Math.PI / 36; // Decrementa en 5 grados (en radianes)
        if (this.angulo < 0) this.angulo += Math.PI * 2; // Asegura que el ángulo esté en el rango [0, 2π)
      } else if (event.key === 'ArrowUp' && !this.isJumping) {
        // Lógica para el salto si no está saltando
        this.jump();
      }
    });
  }

  jump() {
    this.isJumping = true;
    var jumpTween = new TWEEN.Tween(this.posSuperficie.position)
      .to({ y: this.jumpHeight }, 500) // Salto hacia arriba
      .easing(TWEEN.Easing.Quadratic.Out) // Función de aceleración para dar un efecto más natural al salto
      .onComplete(() => {
        // Cuando el personaje alcanza la altura máxima, inicia el descenso
        var fallTween = new TWEEN.Tween(this.posSuperficie.position)
          .to({ y: 2.25 }, 500) // Descenso hasta el suelo
          .easing(TWEEN.Easing.Quadratic.In) // Función de desaceleración para dar un efecto más natural al descenso
          .onComplete(() => {
            this.isJumping = false; // Se restablece la bandera de salto cuando el personaje está en el suelo
          })
          .start();
      })
      .start();
  }

  update() {
    TWEEN.update();

    // Actualizar la caja englobante
    this.box.setFromObject(this.mesh);

    if(this.speed === 0){
      if(0 >= this.tparado){
        this.speed = 0.0005;
        this.visible = true;
      }
      else{
        this.tparado -= 0.1;
        this.visible = !this.visible;
      }
    }

    // Incrementa this.t
    this.t += this.speed;

    // Si this.t supera 1, lo ajusta a 0
    if (this.t > 1) {
      this.t = 0;
    }

    // Calcula la posición y la orientación en base a this.t
    var posTmp = this.path.getPointAt(this.t);
    this.nodoPosOrientTubo.position.copy(posTmp);
    var tangente = this.path.getTangentAt(this.t);
    posTmp.add(tangente);
    var segmentoActual = Math.floor(this.t * this.segmentos);
    this.nodoPosOrientTubo.up = this.binormals[segmentoActual];
    this.nodoPosOrientTubo.lookAt(posTmp);

    // Aplica la rotación según el ángulo del personaje
    this.movimientoLateral.rotation.z = this.angulo;

    // Lógica para el tiempo invulnerable
    if (this.vulnerable === false && this.tiempoInvulnerable < 12) {
      this.mesh.material = this.materialInvulnerable;
      this.tiempoInvulnerable += 0.05;
    } else if (this.tiempoInvulnerable >= 12) {
      this.tiempoInvulnerable = 0;
      this.vulnerable = true;
      this.mesh.material = this.material;
    }

    console.log(this.speed);
  }

  ajustarVelocidad(nuevaVelocidad){
    if(this.speed * nuevaVelocidad > 0.0005 && 0.005 > this.speed * nuevaVelocidad && this.vulnerable)
      this.speed *= nuevaVelocidad;
  }

  parar(){
    if(this.vulnerable){
      this.speed = 0;
      this.tparado = 10;
    }
  }
}

export { Personaje }

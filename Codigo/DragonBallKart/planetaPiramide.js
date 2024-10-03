import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'
import { Planeta } from './Planeta.js';

class planetaPiramide extends Planeta {
  constructor() {
    super();

    var material = new THREE.MeshPhongMaterial({
      color: 0x00FF00, 
      transparent: true,
      opacity: 0.7 
    });
    var pyramidGeom = new THREE.TetrahedronGeometry (3.0);

    var pyramid1 = new THREE.Mesh (pyramidGeom, material);

    pyramid1.position.y = 1.0;
		pyramid1.rotation.set ((7.0*Math.PI) / 36.0, 0.0, -Math.PI / 4.0);

    var pyramid2 = new THREE.Mesh (pyramidGeom, material);

    pyramid2.position.y = -1.0;
		pyramid2.rotation.set ((-7.0*Math.PI) / 36.0, 0.0, -Math.PI / 4.0);

    var planetaPi = new CSG();
    planetaPi.union([pyramid1, pyramid2]);
    var Pi = planetaPi.toMesh();

    var directionalLightVerde = new THREE.DirectionalLight(0x00ff00, 2);
    directionalLightVerde.position.set(0, 20, 10);
    Pi.add(directionalLightVerde);

    this.add(Pi);
  }

  animateOrbit(time) {
    // Aquí calcula la posición del planeta en función del tiempo
    // Por ejemplo, puedes usar funciones trigonométricas para simular un movimiento orbital
    // Aquí hay un ejemplo básico de movimiento orbital en el eje Y
    const orbitRadius = 50; // Radio de la órbita
    const orbitSpeed = 30; // Velocidad de la órbita
    const orbitCenter = new THREE.Vector3(0, 0, 0); // Centro de la órbita
    const angle = time * orbitSpeed; // Ángulo de rotación basado en el tiempo
    const x = orbitCenter.x;  // Mantener la misma altura
    const y = Math.cos(angle) * orbitRadius + orbitCenter.y;
    const z = Math.sin(angle) * orbitRadius + orbitCenter.z;
    
    // Establece la posición del planeta
    this.position.set(x, y, z);
  }

  efecto(personaje){
    personaje.ajustarVelocidad(2);
  }

  createGUI(gui) {
    
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

export { planetaPiramide };

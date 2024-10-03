
import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'
import { Planeta } from './Planeta.js';

class PlanetaToro extends Planeta {
  constructor(gui,titleGui) {
    super(gui, titleGui);
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui);
    
    var shape = new THREE.Shape();
    shape.moveTo(0.01,-8);
    shape.lineTo(8,-8);
    shape.quadraticCurveTo(0.01, 0, 8, 8);
    shape.moveTo(8, 8);
    shape.lineTo(0.01, 8);

    var points = shape.extractPoints(4).shape;
    var latheGeometryG = new THREE.LatheGeometry(points, 24, 0, Math.PI*2);
    var latheGeometryP = new THREE.LatheGeometry(points, 24, 0, Math.PI*2);
    latheGeometryP.scale(0.9, 1.1, 0.9);

    var material = new THREE.MeshStandardMaterial({
      color: 0xFF0080,
      transparent: true,
      opacity: 0.7,
      emissive: 0xFF0080, 
      emissiveIntensity: 0.5 
    });

    var revoG = new THREE.Mesh(latheGeometryG, material);
    var revoP = new THREE.Mesh(latheGeometryP, material);

    var toro = new THREE.TorusGeometry(8, 2, 16, 100);
    toro.rotateX(90*Math.PI/180);

    var meshT = new THREE.Mesh(toro, material);

    var csg = new CSG();
    csg.union([revoG, meshT]);
    csg.subtract([revoP]);
    var planeta = csg.toMesh();

    this.planeta = planeta;
    this.planeta.userData = this;

    this.add(planeta);

    var directionalLightMorada = new THREE.DirectionalLight(0x800080, 2);
    directionalLightMorada.position.set(0, 20, 10);
    planeta.add(directionalLightMorada);
  }

  animateOrbit(time) {
    // Aquí calcula la posición del planeta en función del tiempo
    // Por ejemplo, puedes usar funciones trigonométricas para simular un movimiento orbital
    // Aquí hay un ejemplo básico de movimiento orbital en el eje Y
    const orbitRadius = 50; // Radio de la órbita
    const orbitSpeed = 20; // Velocidad de la órbita
    const orbitCenter = new THREE.Vector3(0, 0, 0); // Centro de la órbita
    const angle = time * orbitSpeed; // Ángulo de rotación basado en el tiempo
    const x = Math.cos(angle) * orbitRadius + orbitCenter.x;
    const y = orbitCenter.y; // Mantener la misma altura
    const z = Math.sin(angle) * orbitRadius + orbitCenter.z;
    
    // Establece la posición del planeta
    this.position.set(x, y, z);
  }

  efecto(personaje){
    personaje.tparado = 0;
  }

  createGUI (gui) {
    
  }
  
  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
   
    this.position.set (this.guiControls.posX,this.guiControls.posY,this.guiControls.posZ);
    this.rotation.set (this.guiControls.rotX,this.guiControls.rotY,this.guiControls.rotZ);
    this.scale.set (this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);
  }
}

export { PlanetaToro }

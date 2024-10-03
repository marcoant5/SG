import * as THREE from '../libs/three.module.js'
import { objetoColision } from './objetoColision.js';

class muelle extends objetoColision {

	constructor(Tubo, gui) {
		super();
	
		this.createGUI(Tubo, gui);
		// Material de las piezas
		var muelleMat = new THREE.MeshPhongMaterial ({ color: 0x404040 })

		var muelleShape = new THREE.Shape ();
		muelleShape.moveTo (0.1, 0.0);
		muelleShape.bezierCurveTo (0.1, 0.05, 0.05, 0.1, 0.0, 0.1);
		muelleShape.bezierCurveTo (-0.05, 0.1, -0.1, 0.05, -0.1, 0.0);
		muelleShape.bezierCurveTo (-0.1, -0.05, -0.05, -0.1, 0.0, -0.1);
		muelleShape.bezierCurveTo (0.05, -0.1, 0.1, -0.05, 0.1, 0.0);

		var x = 0.0, y = 0.0, z = 0.0;
		var muelleCurve = [ new THREE.Vector3 (x, y, z) ];

		var steps = 12, levels = 8;

		var phi = Math.PI / (steps/4), radius = Math.PI/4;
		var alpha = phi * (steps/4);

		for (var i = 1; i < levels*steps; ++i) {

			alpha = (alpha+phi) % ((steps/2) * phi);

			x = radius*Math.cos (alpha) + radius;
			y = (i%steps == 0) ? y : y + 0.05;
			z = radius*Math.sin (alpha);

			muelleCurve.push (new THREE.Vector3 (x, y, z));
		}

		var muellePath = new THREE.CatmullRomCurve3 (muelleCurve);
		var muelleOptions = { steps: 200, curveSegments: 25, extrudePath: muellePath };
		var muelleGeometry = new THREE.ExtrudeGeometry (muelleShape, muelleOptions);

		this.muelle = new THREE.Mesh (muelleGeometry, muelleMat);

		this.add (this.muelle);

		this.box = new THREE.Box3().setFromObject(this.muelle);

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
		this.posSuperficie.add(this.muelle);
		this.posSuperficie.position.y = 1.6;
		this.muelle.scale.set(0.25, 0.25, 0.25);
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
		const cloned = new muelle(this.Tubo, this.gui);
		// Copiar otras propiedades necesarias si es necesario
		return cloned;
	}

	efecto(personaje) {
		this.visible = false;
		if (!personaje.isJumping) {
			personaje.isJumping = true;
			var originalJumpHeight = personaje.jumpHeight;
			personaje.jumpHeight = 10; // Establece una altura de salto muy grande
			personaje.jump();

			// Restaurar la altura de salto original después del salto
			setTimeout(() => {
				personaje.jumpHeight = originalJumpHeight;
			}, 1000); // Ajusta el tiempo según la duración del salto
		}
	}

	createGUI (gui,titleGui) {
		// Controles para el tamaño, la orientación y la posición de la caja
	}

	update () {
		// Actualizar la caja englobante
		this.box.setFromObject(this.muelle);
	}
}

export { muelle }

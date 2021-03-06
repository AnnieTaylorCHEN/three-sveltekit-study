<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import GUI from 'lil-gui';
	// @ts-ignore
	import * as CANNON from 'cannon-es';

	let canvasEl: HTMLElement;

	interface debugObject {
		createSphere: () => void;
		createBox: () => void;
		reset: () => void;
	}

	onMount(() => {
		if (browser) {
			// sizes
			const sizes = {
				width: window.innerWidth,
				height: window.innerHeight
			};

			window.addEventListener('resize', () => {
				// Update sizes
				sizes.width = window.innerWidth;
				sizes.height = window.innerHeight;

				// Update camera
				camera.aspect = sizes.width / sizes.height;
				camera.updateProjectionMatrix();

				// Update renderer
				renderer.setSize(sizes.width, sizes.height);
				renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			});

			// scene
			const scene = new THREE.Scene();

			// sounds
			const hitSound = new Audio('/sounds/hit.mp3');

			const playHitSound = (collision) => {
				const impactStrength = collision.contact.getImpactVelocityAlongNormal();

				if (impactStrength > 1.5) {
					hitSound.volume = Math.random();
					hitSound.currentTime = 0;
					hitSound.play();
				}
			};

			// texture
			const cubeTextureLoader = new THREE.CubeTextureLoader();

			const environmentMapTexture = cubeTextureLoader.load([
				'/textures/environmentMaps/3/px.jpg',
				'/textures/environmentMaps/3/nx.jpg',
				'/textures/environmentMaps/3/py.jpg',
				'/textures/environmentMaps/3/ny.jpg',
				'/textures/environmentMaps/3/pz.jpg',
				'/textures/environmentMaps/3/nz.jpg'
			]);

			// physics
			const world = new CANNON.World();
			world.broadphase = new CANNON.SAPBroadphase(world);
			world.allowSleep = true; // improves performance
			world.gravity.set(0, -9.82, 0);

			// Default material
			const concreteMaterial = new CANNON.Material('concrete');
			const plasticMaterial = new CANNON.Material('plastic');
			// the above can be simplfied to one default material if using
			const defaultContactMaterial = new CANNON.ContactMaterial(concreteMaterial, plasticMaterial, {
				friction: 0.1,
				restitution: 0.7 // higher the number, bounce will be higher
			});
			world.defaultContactMaterial = defaultContactMaterial;

			// Floor
			const floorShape = new CANNON.Plane();
			const floorBody = new CANNON.Body();
			floorBody.mass = 0;
			floorBody.addShape(floorShape);
			floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5); // to turn
			world.addBody(floorBody);

			// utils
			const objectsToUpdate = [];

			// Create sphere
			const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
			const sphereMaterial = new THREE.MeshStandardMaterial({
				metalness: 1,
				roughness: 0,
				envMap: environmentMapTexture
				// envMapIntensity: 0.5
			});

			const createSphere = (radius, position) => {
				// Three.js mesh
				const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
				mesh.castShadow = true;
				mesh.scale.set(radius, radius, radius);
				mesh.position.copy(position);
				scene.add(mesh);

				// Cannon.js body
				const shape = new CANNON.Sphere(radius);

				const body = new CANNON.Body({
					mass: 1,
					position: new CANNON.Vec3(0, 3, 0),
					shape: shape,
					material: plasticMaterial
				});
				body.position.copy(position);
				body.addEventListener('collide', playHitSound);
				world.addBody(body);

				// Save in objects
				objectsToUpdate.push({ mesh, body });
			};

			// Create box
			const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
			const boxMaterial = new THREE.MeshStandardMaterial({
				metalness: 1,
				roughness: 0,
				envMap: environmentMapTexture
				// envMapIntensity: 0.5
			});
			const createBox = (width, height, depth, position) => {
				// Three.js mesh
				const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
				mesh.scale.set(width, height, depth);
				mesh.castShadow = true;
				mesh.position.copy(position);
				scene.add(mesh);

				// Cannon.js body
				const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5));

				const body = new CANNON.Body({
					mass: 1,
					position: new CANNON.Vec3(0, 3, 0),
					shape: shape,
					material: plasticMaterial
				});
				body.position.copy(position);
				body.addEventListener('collide', playHitSound);
				world.addBody(body);

				// Save in objects
				objectsToUpdate.push({ mesh, body });
			};

			createBox(0.5, 0.75, 1, { x: 0, y: 3, z: 0 });

			// Floor
			const floor = new THREE.Mesh(
				new THREE.PlaneGeometry(10, 10),
				new THREE.MeshStandardMaterial({
					color: '#777777',
					metalness: 0.3,
					roughness: 0.4,
					envMap: environmentMapTexture
					// envMapIntensity: 0.5
				})
			);
			floor.receiveShadow = true;
			floor.rotation.x = -Math.PI * 0.5;
			scene.add(floor);

			// Light
			const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
			scene.add(ambientLight);

			const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
			directionalLight.castShadow = true;
			directionalLight.shadow.mapSize.set(1024, 1024);
			directionalLight.shadow.camera.far = 15;
			directionalLight.shadow.camera.left = -7;
			directionalLight.shadow.camera.top = 7;
			directionalLight.shadow.camera.right = 7;
			directionalLight.shadow.camera.bottom = -7;
			directionalLight.position.set(5, 5, 5);
			scene.add(directionalLight);

			// camera
			// Base camera
			const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
			camera.position.set(-3, 3, 8);
			scene.add(camera);

			// Controls
			const controls = new OrbitControls(camera, canvasEl);
			controls.enableDamping = true;

			// renderer
			let renderer: THREE.WebGLRenderer;
			const createScene = (canvasEl) => {
				renderer = new THREE.WebGLRenderer({ canvas: canvasEl });
				renderer.setSize(sizes.width, sizes.height);
				renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 2 is usually enough, higher = expensive computing
				renderer.render(scene, camera);
			};

			createScene(canvasEl);

			//animation
			const clock = new THREE.Clock();
			let oldElapsedTime = 0;

			const tick = () => {
				const elapsedTime = clock.getElapsedTime();
				const deltaTime = elapsedTime - oldElapsedTime;
				oldElapsedTime = elapsedTime;

				// Update physics
				world.step(1 / 60, deltaTime, 3);

				for (const object of objectsToUpdate) {
					object.mesh.position.copy(object.body.position);
					object.mesh.quaternion.copy(object.body.quaternion); // the rotation part which makes objects which are colliding to each other fall more naturally
				}

				// Update controls
				controls.update();

				// Render
				renderer.render(scene, camera);

				// Call tick again on the next frame
				window.requestAnimationFrame(tick);
			};
			tick();

			// debug
			const debugObject: debugObject = {
				createSphere: function (): void {
					throw new Error('Function not implemented.');
				},
				createBox: function (): void {
					throw new Error('Function not implemented.');
				},
				reset: function (): void {
					throw new Error('Function not implemented.');
				}
			};

			debugObject.createSphere = () => {
				createSphere(Math.random() * 0.5, {
					x: (Math.random() - 0.5) * 3,
					y: 3,
					z: (Math.random() - 0.5) * 3
				});
			};

			debugObject.createBox = () => {
				createBox(Math.random(), Math.random(), Math.random(), {
					x: (Math.random() - 0.5) * 3,
					y: 3,
					z: (Math.random() - 0.5) * 3
				});
			};

			debugObject.reset = () => {
				for (const object of objectsToUpdate) {
					// Remove body
					object.body.removeEventListener('collide', playHitSound);
					world.removeBody(object.body);

					// Remove mesh
					scene.remove(object.mesh);
				}

				objectsToUpdate.splice(0, objectsToUpdate.length);
			};

			const gui = new GUI({ width: 350 });
			gui.add(debugObject, 'createSphere');
			gui.add(debugObject, 'createBox');
			gui.add(debugObject, 'reset');

			return () => gui.destroy();
		}
	});
</script>

<section>
	<p>Click on control's parameters to rain balls and boxes!</p>
	<canvas bind:this={canvasEl} />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
	}

	:global(.lil-gui.autoPlace) {
		top: 150px;
	}
</style>

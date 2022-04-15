<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

	let canvasEl: HTMLElement;

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

			// models
			const dracoLoader = new DRACOLoader();
			dracoLoader.setDecoderPath('/draco/'); // use this if other files are too big

			const gltfLoader = new GLTFLoader();
			gltfLoader.setDRACOLoader(dracoLoader);

			let mixer = null;

			gltfLoader.load('/models/Fox/glTF/Fox.gltf', (gltf) => {
				gltf.scene.scale.set(0.025, 0.025, 0.025); //fox original is too big
				scene.add(gltf.scene);

				// Animation
				mixer = new THREE.AnimationMixer(gltf.scene);
				const action = mixer.clipAction(gltf.animations[2]); // array index for different actions
				action.play();
			});

			// floor
			const floor = new THREE.Mesh(
				new THREE.PlaneGeometry(10, 10),
				new THREE.MeshStandardMaterial({
					color: '#013220',
					metalness: 0,
					roughness: 0.5
				})
			);
			floor.receiveShadow = true;
			floor.rotation.x = -Math.PI * 0.5;
			scene.add(floor);

			// lights
			const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
			scene.add(ambientLight);

			const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
			directionalLight.castShadow = true;
			directionalLight.shadow.mapSize.set(1024, 1024);
			directionalLight.shadow.camera.far = 15;
			directionalLight.shadow.camera.left = -7;
			directionalLight.shadow.camera.top = 7;
			directionalLight.shadow.camera.right = 7;
			directionalLight.shadow.camera.bottom = -7;
			directionalLight.position.set(-5, 5, 0);
			scene.add(directionalLight);

			// camera
			// Base camera
			const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
			camera.position.set(2, 2, 2);
			scene.add(camera);

			// Controls
			const controls = new OrbitControls(camera, canvasEl);
			controls.target.set(0, 0.75, 0);
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
			let previousTime = 0;

			const tick = () => {
				const elapsedTime = clock.getElapsedTime();
				const deltaTime = elapsedTime - previousTime;
				previousTime = elapsedTime;

				// Model animation
				if (mixer) {
					mixer.update(deltaTime); //so action is set on move
				}

				// Update controls
				controls.update();

				// Render
				renderer.render(scene, camera);

				// Call tick again on the next frame
				window.requestAnimationFrame(tick);
			};
			tick();
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

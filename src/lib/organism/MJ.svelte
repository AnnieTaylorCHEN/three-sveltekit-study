<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import mjVertexShader from './shaders/mj/vertex.glsl?raw';
	import mjFragmentShader from './shaders/mj/fragment.glsl?raw';
	import GUI from 'lil-gui';
	import { DoubleSide } from 'three';

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

			// texture
			const textureLoader = new THREE.TextureLoader();
			const flagTexture = textureLoader.load('/textures/flag/mj-flag.png');

			// geometry
			const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

			const count = geometry.attributes.position.count;
			const randoms = new Float32Array(count); // create an array with exact count for vertices

			for (let i = 0; i < count; i++) {
				randoms[i] = Math.random(); // fill the array below with random value
			}

			geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1)); // aRandom is attribute random

			// material
			const material = new THREE.ShaderMaterial({
				vertexShader: mjVertexShader,
				fragmentShader: mjFragmentShader,
				side: DoubleSide,
				uniforms: {
					uFrequency: { value: new THREE.Vector2(10, 5) },
					uTime: { value: 0 },
					uColor: { value: new THREE.Color('orange') },
					uTexture: { value: flagTexture }
				} // u stands for uniform in the variable names
			});

			// Mesh
			const mesh = new THREE.Mesh(geometry, material);
			mesh.scale.y = 2 / 3;
			scene.add(mesh);

			// camera
			// Base camera
			const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
			camera.position.set(0.5, -0.5, 1);
			scene.add(camera);

			// Controls
			const controls = new OrbitControls(camera, canvasEl);
			controls.target.set(0, 0, 0);
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

			const tick = () => {
				const elapsedTime = clock.getElapsedTime();

				// // Update material
				material.uniforms.uTime.value = elapsedTime; // uTime must be small value

				// Update controls
				controls.update();

				// Render
				renderer.render(scene, camera);

				// Call tick again on the next frame
				window.requestAnimationFrame(tick);
			};
			tick();

			// debug
			const gui = new GUI({ width: 350 });
			gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX');
			gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY');
			return () => gui.destroy();
		}
	});
</script>

<section>
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

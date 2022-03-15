<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

			//scene
			const scene = new THREE.Scene();

			//textures
			const textureLoader = new THREE.TextureLoader();
			const particleTexture = textureLoader.load('/textures/particles/9.png');

			// objects
			// Geometry
			let particlesGeometry: THREE.BufferGeometry;
			particlesGeometry = new THREE.BufferGeometry();
			const count = 1000;

			const positions = new Float32Array(count * 3); // xyz in array
			const colors = new Float32Array(count * 3); //rgb in array

			for (let i = 0; i < count * 3; i++) {
				positions[i] = (Math.random() - 0.5) * 8;
				colors[i] = Math.random();
			}

			particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
			particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

			// Material
			const particlesMaterial = new THREE.PointsMaterial();

			particlesMaterial.size = 0.3;
			particlesMaterial.sizeAttenuation = true; //attenuated by the camera depth
			// particlesMaterial.color = new THREE.Color('#ff88cc');
			particlesMaterial.transparent = true;
			particlesMaterial.alphaMap = particleTexture;
			// particlesMaterial.alphaTest = 0.001 // to avoid seeing edge of particles
			// particlesMaterial.depthTest = false // this is better than the above but can create bugs if you have other objects with different colors
			particlesMaterial.depthWrite = false;
			particlesMaterial.blending = THREE.AdditiveBlending; // get glowing lights

			particlesMaterial.vertexColors = true; // must be set when we are using our own color attributes of rgb array

			// Points
			const particles = new THREE.Points(particlesGeometry, particlesMaterial);
			scene.add(particles);

			//camera with args 75 degree, aspect ratio, minmax range
			const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000);
			camera.position.z = 8;
			scene.add(camera);

			// renderer
			let renderer: THREE.WebGLRenderer;
			const createScene = (canvasEl) => {
				renderer = new THREE.WebGLRenderer({ canvas: canvasEl });
				renderer.setSize(sizes.width, sizes.height);
				renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 2 is usually enough, higher = expensive computing
				renderer.render(scene, camera);
			};

			createScene(canvasEl);

			//controls
			const controls = new OrbitControls(camera, canvasEl);
			controls.enableDamping = true;

			//animation
			const clock = new THREE.Clock();
			const tick = () => {
				const elapsedTime = clock.getElapsedTime();

				// Update particles
				for (let i = 0; i < count; i++) {
					const i3 = i * 3;

					const x = particlesGeometry.attributes.position.array[i3];
					// @ts-ignore
					particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x); // y is 2nd in the sub array of i3 = [x, y, z], we offset it with x to create waves
				}
				particlesGeometry.attributes.position.needsUpdate = true;

				//controls update
				controls.update();

				//render, call tick again on the next frame
				renderer.render(scene, camera);
				window.requestAnimationFrame(tick);
			};
			tick();
		}
	});
</script>

<section>
	<p>
		Note this is not the best performance version. It's better to create your own shader to animate
		particles.
	</p>
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
</style>

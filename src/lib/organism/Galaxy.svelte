<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import GUI from 'lil-gui';

	let canvasEl: HTMLElement;

	interface Parameters {
		count: number;
		size: number;
		radius: number;
		branches: number;
		spin: number;
		randomness: number;
		randomnessPower: number;
		insideColor: string;
		outsideColor: string;
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

			//scene
			const scene = new THREE.Scene();

			// objects: galaxy
			let parameters: Parameters = {
				count: 0,
				size: 0,
				radius: 0,
				branches: 0,
				spin: 0,
				randomness: 0,
				randomnessPower: 0,
				insideColor: '',
				outsideColor: ''
			};
			parameters.count = 100000;
			parameters.size = 0.01;
			parameters.radius = 5;
			parameters.branches = 6;
			parameters.spin = 1;
			parameters.randomness = 0.2;
			parameters.randomnessPower = 3;
			parameters.insideColor = '#e72eff';
			parameters.outsideColor = '#1505f5';

			let geometry = null;
			let material = null;
			let points = null;

			const generateGalaxy = () => {
				// Destroy old galaxy
				if (points !== null) {
					geometry.dispose();
					material.dispose();
					scene.remove(points);
				}

				// geometry
				geometry = new THREE.BufferGeometry();

				const positions = new Float32Array(parameters.count * 3);
				const colors = new Float32Array(parameters.count * 3);

				const colorInside = new THREE.Color(parameters.insideColor);
				const colorOutside = new THREE.Color(parameters.outsideColor);

				for (let i = 0; i < parameters.count; i++) {
					// Position
					const i3 = i * 3;

					const radius = Math.random() * parameters.radius; //random position within radius length

					const spinAngle = radius * parameters.spin; // bigger spin number, further from center, more curls/circles
					const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2; // when we use % we get repeatation of [0, 1, 2] for 3 branches, we get the degree divided by the branches multiplied by full circle which is PI * 2

					const randomX =
						Math.pow(Math.random(), parameters.randomnessPower) *
						(Math.random() < 0.5 ? 1 : -1) *
						parameters.randomness *
						radius; // use power to make sure value centers mostly on the main "axis" and spread a bit around it. When it's under 1, the power can make sure lower value get less and closer to 1 value. When only using positive it will look like the galaxy is cut by half on x axis, which is too flat on bottom, so we give it a random -1 and 1 so the value can have both positive and negative, which centers more "evenly". Then we multiply radius to create more distance for the "spread effect".
					const randomY =
						Math.pow(Math.random(), parameters.randomnessPower) *
						(Math.random() < 0.5 ? 1 : -1) *
						parameters.randomness *
						radius;
					const randomZ =
						Math.pow(Math.random(), parameters.randomnessPower) *
						(Math.random() < 0.5 ? 1 : -1) *
						parameters.randomness *
						radius;

					positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX; //x
					positions[i3 + 1] = randomY; //y
					positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ; //z

					// Color
					const mixedColor = colorInside.clone(); // we use a clone so we don't change the original
					mixedColor.lerp(colorOutside, radius / parameters.radius); // Linear Interpolation, returns a value between two others at a point on a linear scale.

					colors[i3] = mixedColor.r;
					colors[i3 + 1] = mixedColor.g;
					colors[i3 + 2] = mixedColor.b;
				}

				geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
				geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

				/**
				 * Material
				 */
				material = new THREE.PointsMaterial({
					size: parameters.size,
					sizeAttenuation: true,
					depthWrite: false,
					blending: THREE.AdditiveBlending,
					vertexColors: true
				});

				/**
				 * Points
				 */
				points = new THREE.Points(geometry, material);
				scene.add(points);
			};

			generateGalaxy();

			//camera with args 75 degree, aspect ratio, minmax range
			const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000);
			camera.position.x = 3;
			camera.position.y = 3;
			camera.position.z = 3;
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
				points.rotation.y = elapsedTime * 0.03;

				//controls update
				controls.update();

				//render, call tick again on the next frame
				renderer.render(scene, camera);
				window.requestAnimationFrame(tick);
			};
			tick();

			// DEBUG - parameters must be added as an object to tweak
			const gui = new GUI({ width: 350 });
			gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
			gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
			gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
			gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
			gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
			gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
			gui
				.add(parameters, 'randomnessPower')
				.min(1)
				.max(10)
				.step(0.001)
				.onFinishChange(generateGalaxy);
			gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
			gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);

			return () => gui.destroy();
		}
	});
</script>

<section>
	<p>Tweak the parameters to generate your own galaxy!</p>
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

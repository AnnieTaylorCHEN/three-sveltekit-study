<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
	import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

	let canvasEl: HTMLElement;

	//scene
	const scene = new THREE.Scene();

	//renderer
	let renderer: THREE.WebGLRenderer;

	onMount(() => {
		if (browser) {
			// sizes
			const sizes = {
				width: window.innerWidth,
				height: window.innerHeight
			};

			//camera with args 75 degree, aspect ratio, minmax range
			const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000);
			camera.position.x = 1;
			camera.position.y = 1;
			camera.position.z = 2;
			scene.add(camera);

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

			// textures
			const textureLoader = new THREE.TextureLoader();
			const matcapTextureThree = textureLoader.load('textures/matcaps/3.png');
			const matcapTextureEight = textureLoader.load('textures/matcaps/8.png');

			// fonts
			const fontLoader = new FontLoader();
			fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {
				// Material
				const material = new THREE.MeshMatcapMaterial({ matcap: matcapTextureThree });

				// Text geometry
				const textGeometry = new TextGeometry('Annie Taylor Chen', {
					font: font,
					size: 0.3,
					height: 0.1,
					curveSegments: 12,
					bevelEnabled: true,
					bevelThickness: 0.03,
					bevelSize: 0.02,
					bevelOffset: 0,
					bevelSegments: 5
				});
				textGeometry.center();

				const text = new THREE.Mesh(textGeometry, material);
				scene.add(text);
			});

			//donuts

			const donutGeometry = new THREE.DodecahedronGeometry(0.4, 0);
			const material = new THREE.MeshMatcapMaterial({ matcap: matcapTextureEight });

			for (let i = 0; i < 150; i++) {
				const donut = new THREE.Mesh(donutGeometry, material);
				donut.position.x = (Math.random() - 0.5) * 10;
				donut.position.y = (Math.random() - 0.5) * 10;
				donut.position.z = (Math.random() - 0.5) * 10;
				donut.rotation.x = Math.random() * Math.PI;
				donut.rotation.y = Math.random() * Math.PI;
				const scale = Math.random();
				donut.scale.set(scale, scale, scale);

				scene.add(donut);
			}

			//Renderer
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

				//update objects
				// sphere.rotation.y = 0.1 * elapsedTime;
				// plane.rotation.y = 0.1 * elapsedTime;
				// torus.rotation.y = 0.1 * elapsedTime;

				// sphere.rotation.x = 0.15 * elapsedTime;
				// plane.rotation.x = 0.15 * elapsedTime;
				// torus.rotation.x = 0.15 * elapsedTime;

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

<svelte:head>
	<title>Basic Material</title>
</svelte:head>

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
</style>

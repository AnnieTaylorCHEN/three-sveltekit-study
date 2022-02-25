<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import { Mesh } from 'three';

	let canvasEl: Element;

	//scene
	const scene = new THREE.Scene();

	//pink cube
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: 'pink' });
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	//sizes
	const sizes = {
		width: 800,
		height: 600
	};

	//camera, 75 degree, aspect ratio
	const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
	camera.position.z = 3;
	scene.add(camera);

	//renderer
	let renderer: THREE.WebGLRenderer;
	export const createScene = (canvasEl) => {
		renderer = new THREE.WebGLRenderer({ canvas: canvasEl });
		renderer.setSize(sizes.width, sizes.height);
		renderer.render(scene, camera);
	};

	//time
	// let time = Date.now();

	//Clock
	const clock = new THREE.Clock();

	//animation
	const tick = () => {
		// time
		// const currentTime = Date.now(); //tick's time
		// const deltaTime = currentTime - time; //every frame's time difference
		// time = currentTime;

		// update objects
		// mesh.rotation.y += 0.01 * deltaTime; // this can stablize time across device, no matter the speed of GPU or CPU, another way is to use clock funtion from three.js

		// Clock + update objects
		const elapsedTime = clock.getElapsedTime();
		// mesh.rotation.y = elapsedTime;

		// the following makes camera rotates by fixing the focus on the object
		camera.position.y = Math.sin(elapsedTime);
		camera.position.x = Math.cos(elapsedTime);
		camera.lookAt(mesh.position);

		//render
		renderer.render(scene, camera);
		window.requestAnimationFrame(tick);
	};

	onMount(() => {
		if (browser) {
			createScene(canvasEl);
			tick();
		}
	});
</script>

<svelte:head>
	<title>Basic</title>
</svelte:head>

<h1>Three.js x Sveltekit - Basic</h1>
<section>
	<p>Cube created with vanilla three.js</p>
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

<script>
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

	let canvasEl;

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
	let renderer;
	export const createScene = (canvasEl) => {
		renderer = new THREE.WebGLRenderer({ canvas: canvasEl });
		renderer.setSize(sizes.width, sizes.height);
		renderer.render(scene, camera);
	};

	onMount(() => {
		createScene(canvasEl);
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

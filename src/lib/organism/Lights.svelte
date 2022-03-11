<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

	let canvasEl: HTMLElement;

	//scene
	const scene = new THREE.Scene();

	//lights
	// Ambient light
	const ambientLight = new THREE.AmbientLight();
	ambientLight.color = new THREE.Color(0xffffff);
	ambientLight.intensity = 0.5;
	scene.add(ambientLight);

	// Directional light
	const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3); //greenish light
	directionalLight.position.set(0.5, 1, 0);
	scene.add(directionalLight);

	// Hemisphere light
	const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3); // red top blue bottom
	scene.add(hemisphereLight);

	// Point light
	const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2); // yellow
	pointLight.position.set(1, -0.5, 1);
	scene.add(pointLight);

	// Rect area light
	const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1); // purplish blue
	rectAreaLight.position.set(-1.5, 0, 1.5);
	rectAreaLight.lookAt(new THREE.Vector3());
	scene.add(rectAreaLight);

	// Spot light
	const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1); //bright green
	spotLight.position.set(0, 2, 3);
	scene.add(spotLight);

	spotLight.target.position.x = 0;
	scene.add(spotLight.target);

	//helper - help you see where lights come from
	const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
	scene.add(hemisphereLightHelper);

	const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
	scene.add(directionalLightHelper);

	const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
	scene.add(pointLightHelper);

	const spotLightHelper = new THREE.SpotLightHelper(spotLight);
	scene.add(spotLightHelper);

	const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
	scene.add(rectAreaLightHelper);

	// objects
	// Material
	const material = new THREE.MeshStandardMaterial();
	material.roughness = 0.4;

	// Objects
	const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
	sphere.position.x = -1.5;

	const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

	const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material);
	torus.position.x = 1.5;

	const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
	plane.rotation.x = -Math.PI * 0.5;
	plane.position.y = -0.65;

	scene.add(sphere, cube, torus, plane);

	// renderer
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
			camera.position.z = 4;
			scene.add(camera);

			//Renderer
			const createScene = (canvasEl) => {
				renderer = new THREE.WebGLRenderer({ canvas: canvasEl });
				renderer.setSize(sizes.width, sizes.height);
				renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 2 is usually enough, higher = expensive computing
				renderer.render(scene, camera);
			};

			createScene(canvasEl);

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

			//controls
			const controls = new OrbitControls(camera, canvasEl);
			controls.enableDamping = true;

			//animation
			const clock = new THREE.Clock();
			const tick = () => {
				const elapsedTime = clock.getElapsedTime();

				// Update objects
				sphere.rotation.y = 0.1 * elapsedTime;
				cube.rotation.y = 0.1 * elapsedTime;
				torus.rotation.y = 0.1 * elapsedTime;

				sphere.rotation.x = 0.15 * elapsedTime;
				cube.rotation.x = 0.15 * elapsedTime;
				torus.rotation.x = 0.15 * elapsedTime;

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
	<p>Let there be light!</p>
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

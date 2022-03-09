<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/env';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import GUI from 'lil-gui';

	let canvasEl: HTMLElement;
	let material: any; // must be defined here so gui can access to it
	let envPicSetNr: number = 4;
	let gui;

	const cursor = {
		x: 0,
		y: 0
	};

	//scene
	const scene = new THREE.Scene();

	// lights
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);

	const light = new THREE.PointLight(0xffffff, 0.5);
	light.position.x = 2;
	light.position.y = 3;
	light.position.z = 4;
	scene.add(light);


	// Sizes
	const sizes = {
		width: 1200,
		height: 800
	};

	//camera with args 75 degree, aspect ratio, minmax range
	const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000);
	camera.position.x = 1;
	camera.position.y = 1;
	camera.position.z = 2;
	scene.add(camera);

	//renderer
	let renderer: THREE.WebGLRenderer;
	export const createScene = (canvasEl) => {
		renderer = new THREE.WebGLRenderer({ canvas: canvasEl });
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 2 is usually enough, higher = expensive computing
		renderer.render(scene, camera);
	};

	onMount(() => {
		if (browser) {
			window.addEventListener('mousemove', (e) => {
				cursor.x = e.clientX / sizes.width - 0.5;
				cursor.y = e.clientY / sizes.height - 0.5;
			});

			// textures
			const textureLoader = new THREE.TextureLoader();
			const cubeTextureLoader = new THREE.CubeTextureLoader();

			const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
			const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
			const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
			const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
			const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
			const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
			const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

			const matcapTexture = textureLoader.load('/textures/matcaps/8.png');
			const gradientTexture = textureLoader.load('/textures/gradients/5.jpg');

			const environmentMapTexture = cubeTextureLoader.load([
				`/textures/environmentMaps/${envPicSetNr}/px.${envPicSetNr === 4 ? 'png' : 'jpg'}`,
				`/textures/environmentMaps/${envPicSetNr}/nx.${envPicSetNr === 4 ? 'png' : 'jpg'}`,
				`/textures/environmentMaps/${envPicSetNr}/py.${envPicSetNr === 4 ? 'png' : 'jpg'}`,
				`/textures/environmentMaps/${envPicSetNr}/ny.${envPicSetNr === 4 ? 'png' : 'jpg'}`,
				`/textures/environmentMaps/${envPicSetNr}/pz.${envPicSetNr === 4 ? 'png' : 'jpg'}`,
				`/textures/environmentMaps/${envPicSetNr}/nz.${envPicSetNr === 4 ? 'png' : 'jpg'}`
			]);

			// material series
			// MESH BASIC MATERIAL
			// material = new THREE.MeshBasicMaterial();
			// material.map = doorColorTexture; //orange colored wooden door
			// material.color = new THREE.Color('#ff0000'); // paint it to red
			// material.wireframe = true;
			// material.transparent = true;
			// material.opacity = 0.5; // work together with transparent param
			// material.alphaMap = doorAlphaTexture; // work together with transparent param
			// material.side = THREE.DoubleSide;

			// MESH NORMAL MATERIAL
			// material = new THREE.MeshNormalMaterial();
			// material.flatShading = true;

			//MESH MATCAP MATERIAL
			// material = new THREE.MeshMatcapMaterial();
			// material.matcap = matcapTexture;

			// MESH DEPTH MATERIAL
			// material = new THREE.MeshDepthMaterial();

			// MESH LAMBERT MATERIAL
			// material = new THREE.MeshLambertMaterial();

			// MESH PHONG MATERIAL
			// material = new THREE.MeshPhongMaterial();
			// material.shininess = 100;
			// material.specular = new THREE.Color(0x1188ff); // spot light color

			// MESH TOON MATERIAL
			// material = new THREE.MeshToonMaterial();
			// gradientTexture.generateMipmaps = false;
			// gradientTexture.minFilter = THREE.NearestFilter;
			// gradientTexture.magFilter = THREE.NearestFilter;
			// material.gradientMap = gradientTexture;

			// MESH PHYSICAL MATERIAL
			// material = new THREE.MeshPhysicalMaterial();
			// material.metalness = 0;
			// material.roughness = 1;
			// material.map = doorColorTexture;
			// material.aoMap = doorAmbientOcclusionTexture;
			// material.aoMapIntensity = 1;
			// material.displacementMap = doorHeightTexture;
			// material.displacementScale = 0.05;
			// material.metalnessMap = doorMetalnessTexture;
			// material.roughnessMap = doorRoughnessTexture;
			// material.normalMap = doorNormalTexture;
			// material.normalScale.set(0.5, 0.5);
			// material.transparent = true;
			// material.alphaMap = doorAlphaTexture;
			// material.clearcoat = 1;
			// material.clearcoatRoughness = 0;
			// material.side = THREE.DoubleSide;

			// MESH STANDARD MATERIAL
			material = new THREE.MeshStandardMaterial();
			material.metalness = 1;
			material.roughness = 0;
			material.envMap = environmentMapTexture;
			material.side = THREE.DoubleSide;

			// objects
			const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
			sphere.geometry.setAttribute(
				'uv2',
				new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
			);
			sphere.position.x = -1.5;

			const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
			plane.geometry.setAttribute(
				'uv2',
				new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
			);

			const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 64, 128), material);
			torus.geometry.setAttribute(
				'uv2',
				new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
			);
			torus.position.x = 1.5;
			scene.add(sphere, plane, torus);

			createScene(canvasEl);

			//controls
			const controls = new OrbitControls(camera, canvasEl);
			controls.enableDamping = true;

			//animation
			const clock = new THREE.Clock();
			const tick = () => {
				const elapsedTime = clock.getElapsedTime();

				//update objects
				sphere.rotation.y = 0.1 * elapsedTime;
				plane.rotation.y = 0.1 * elapsedTime;
				torus.rotation.y = 0.1 * elapsedTime;

				sphere.rotation.x = 0.15 * elapsedTime;
				plane.rotation.x = 0.15 * elapsedTime;
				torus.rotation.x = 0.15 * elapsedTime;

				//controls update
				controls.update();

				//render, call tick again on the next frame
				renderer.render(scene, camera);
				window.requestAnimationFrame(tick);
			};
			tick();
		}

		// DEBUG - parameters must be added as an object to tweak
		gui = new GUI({ width: 350 });
		gui.add(material, 'metalness').min(0).max(1).step(0.0001);
		gui.add(material, 'roughness').min(0).max(1).step(0.0001);
	});

	onDestroy(() => {
		if (gui) gui.destroy();
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

	:global(.lil-gui.autoPlace) {
		top: 150px;
	}
</style>

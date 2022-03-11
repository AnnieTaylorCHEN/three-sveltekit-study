<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import GUI from 'lil-gui';

	let canvasEl: HTMLElement;

	//scene
	const scene = new THREE.Scene();

	//lights
	// Ambient light
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);

	// Directional light
	const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.6);
	directionalLight.position.set(2, 2, -1);
	directionalLight.castShadow = true;
	scene.add(directionalLight);

	//Set up shadow properties for the light
	directionalLight.shadow.mapSize.width = 1024;
	directionalLight.shadow.mapSize.height = 1024;
	directionalLight.shadow.camera.near = 1;
	directionalLight.shadow.camera.far = 6;
	directionalLight.shadow.camera.top = 2;
	directionalLight.shadow.camera.right = 2;
	directionalLight.shadow.camera.bottom = -2;
	directionalLight.shadow.camera.left = -2;

	const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
	directionalLightCameraHelper.visible = false;
	scene.add(directionalLightCameraHelper);

	// Spot light
	const spotLight = new THREE.SpotLight(0xff00ff, 0.4, 10, Math.PI * 0.25);
	spotLight.position.set(0, 2, 2);
	spotLight.castShadow = true;
	scene.add(spotLight);
	scene.add(spotLight.target);

	//Set up shadow properties for the light
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 1;
	spotLight.shadow.camera.far = 6;
	spotLight.shadow.camera.fov = 30;

	const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
	spotLightCameraHelper.visible = false;
	scene.add(spotLightCameraHelper);

	// Point light
	const pointLight = new THREE.PointLight(0xffff00, 0.3);
	pointLight.position.set(-1, 1, 0);
	pointLight.castShadow = true;
	scene.add(pointLight);

	//Set up shadow properties for the light
	pointLight.shadow.mapSize.width = 1024;
	pointLight.shadow.mapSize.height = 1024;
	pointLight.shadow.camera.near = 0.1;
	pointLight.shadow.camera.far = 5;

	const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
	pointLightCameraHelper.visible = false;
	scene.add(pointLightCameraHelper);

	// objects
	// Material
	const material = new THREE.MeshStandardMaterial();
	material.roughness = 0.7;

	// Objects
	const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
	sphere.castShadow = true;

	const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
	plane.receiveShadow = true;
	plane.rotation.x = -Math.PI * 0.5;
	plane.position.y = -0.5;

	scene.add(sphere, plane);

	// renderer
	let renderer: THREE.WebGLRenderer;

	onMount(() => {
		if (browser) {
			// sizes
			const sizes = {
				width: window.innerWidth,
				height: window.innerHeight
			};

			//textures
			const textureLoader = new THREE.TextureLoader();
			const bakedShadow = textureLoader.load('/textures/shadows/bakedShadow.jpg'); //baked on the plane, can't move when object moves
			const simpleShadow = textureLoader.load('/textures/shadows/simpleShadow.jpg');

			const sphereShadow = new THREE.Mesh(
				new THREE.PlaneGeometry(1.5, 1.5),
				new THREE.MeshBasicMaterial({
					color: 0x000000,
					transparent: true,
					alphaMap: simpleShadow
				})
			);
			sphereShadow.rotation.x = -Math.PI * 0.5; //parallel to the plane
			sphereShadow.position.y = plane.position.y + 0.01; //elevate a bit above the plane
			scene.add(sphereShadow);

			//camera with args 75 degree, aspect ratio, minmax range
			const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000);
			camera.position.x = 1;
			camera.position.y = 1;
			camera.position.z = 4;
			scene.add(camera);

			//Renderer
			const createScene = (canvasEl) => {
				renderer = new THREE.WebGLRenderer({ canvas: canvasEl });
				//NOTE the final result of this page uses the "cheaper" option of textured shadow as the shadow map can be expensive
				// renderer.shadowMap.enabled = true;
				// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

				// Update sphere
				sphere.position.x = Math.cos(elapsedTime) * 1.5;
				sphere.position.z = Math.sin(elapsedTime) * 1.5;
				sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

				// Update the shadow to move with sphere
				sphereShadow.position.x = sphere.position.x;
				sphereShadow.position.z = sphere.position.z;
				sphereShadow.material.opacity = (1 - Math.abs(sphere.position.y)) * 0.3;

				//controls update
				controls.update();

				//render, call tick again on the next frame
				renderer.render(scene, camera);
				window.requestAnimationFrame(tick);
			};
			tick();

			// DEBUG - parameters must be added as an object to tweak
			const gui = new GUI({ width: 350 });
			gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
			gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001);
			gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001);
			gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001);
			gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001);

			return () => gui.destroy();
		}
	});
</script>

<section>
	<ul>
		<li>Directional light: cyan <span class="cyan" /></li>
		<li>Spot light: magenta <span class="magenta" /></li>
		<li>Point light: yellow <span class="yellow" /></li>
	</ul>
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

	:global(li span) {
		display: inline-block;
		width: 16px;
		height: 16px;
		vertical-align: bottom;
		margin-left: 0.5rem;
	}

	:global(li span).cyan {
		background: #00ffff;
	}

	:global(li span).magenta {
		background: #ff00ff;
	}

	:global(li span).yellow {
		background: #ffff00;
	}
</style>

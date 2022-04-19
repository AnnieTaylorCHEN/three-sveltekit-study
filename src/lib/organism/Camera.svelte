<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import GUI from 'lil-gui';

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

			// debug
			const debugObject = {
				envMapIntensity: 2.5
			};

			// scene
			const scene = new THREE.Scene();

			// update all materials
			const updateAllMaterials = () => {
				scene.traverse((child) => {
					if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
						// child.material.envMap = environmentMap
						child.material.envMapIntensity = debugObject.envMapIntensity;
						child.material.needsUpdate = true;
						child.castShadow = true;
						child.receiveShadow = true;
					}
				});
			};

			// loaders

			const gltfLoader = new GLTFLoader();
			const cubeTextureLoader = new THREE.CubeTextureLoader();

			// environment

			const environmentMap = cubeTextureLoader.load([
				'/textures/environmentMaps/1/px.jpg',
				'/textures/environmentMaps/1/nx.jpg',
				'/textures/environmentMaps/1/py.jpg',
				'/textures/environmentMaps/1/ny.jpg',
				'/textures/environmentMaps/1/pz.jpg',
				'/textures/environmentMaps/1/nz.jpg'
			]);

			environmentMap.encoding = THREE.sRGBEncoding;
			scene.background = environmentMap;
			scene.environment = environmentMap;

			// models
			gltfLoader.load('/models/AntiqueCamera/glTF/AntiqueCamera.gltf', (gltf) => {
				gltf.scene.scale.set(1, 1, 1);
				gltf.scene.position.set(0, -4, 0);
				gltf.scene.rotation.y = Math.PI * 0.5;
				scene.add(gltf.scene);

				gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotation');

				updateAllMaterials();
			});

			// lights
			const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
			directionalLight.castShadow = true;
			directionalLight.shadow.camera.far = 15;
			directionalLight.shadow.mapSize.set(1024, 1024);
			directionalLight.shadow.normalBias = 0.05; // so the object doesn't cast shadown on itself so it looks like it has some wavy texture on the surface
			directionalLight.position.set(-5, 2, -2.25);
			scene.add(directionalLight);

			// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
			// scene.add(directionalLightHelper);

			// camera
			// Base camera
			const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
			camera.position.set(4, 1, -4);
			scene.add(camera);

			// Controls
			const controls = new OrbitControls(camera, canvasEl);
			controls.enableDamping = true;

			// renderer
			let renderer: THREE.WebGLRenderer;
			const createScene = (canvasEl) => {
				renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true }); // antialias must be initialized here to make the edge of lines smoother
				renderer.physicallyCorrectLights = true;
				renderer.outputEncoding = THREE.sRGBEncoding;
				renderer.toneMapping = THREE.CineonToneMapping;
				renderer.toneMappingExposure = 1.3;
				renderer.shadowMap.enabled = true;
				renderer.shadowMap.type = THREE.PCFSoftShadowMap;
				renderer.setSize(sizes.width, sizes.height);
				renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 2 is usually enough, higher = expensive computing
				renderer.render(scene, camera);
			};

			createScene(canvasEl);

			//animation

			const tick = () => {
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
			gui
				.add(debugObject, 'envMapIntensity')
				.min(0)
				.max(10)
				.step(0.001)
				.onChange(updateAllMaterials);
			gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity');
			gui.add(directionalLight.position, 'x').min(-10).max(10).step(0.001).name('lightX');
			gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('lightY');
			gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ');
			gui
				.add(renderer, 'toneMapping', {
					No: THREE.NoToneMapping,
					Linear: THREE.LinearToneMapping,
					Reinhard: THREE.ReinhardToneMapping,
					Cineon: THREE.CineonToneMapping,
					ACESFilmic: THREE.ACESFilmicToneMapping
				})
				.onFinishChange(() => {
					renderer.toneMapping = Number(renderer.toneMapping); // convert string to number otherwise it can't be read correctly
					updateAllMaterials();
				});
			gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001);
			return () => gui.destroy();
		}
	});
</script>

<section>
	<p>Trying realistic render in an environment.</p>
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

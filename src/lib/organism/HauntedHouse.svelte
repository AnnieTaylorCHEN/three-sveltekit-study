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

			const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
			const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
			const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
			const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
			const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
			const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
			const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

			const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg');
			const bricksAmbientOcclusionTexture = textureLoader.load(
				'/textures/bricks/ambientOcclusion.jpg'
			);
			const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
			const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg');

			const grassColorTexture = textureLoader.load('/textures/grass/color.jpg');
			const grassAmbientOcclusionTexture = textureLoader.load(
				'/textures/grass/ambientOcclusion.jpg'
			);
			const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
			const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg');

			grassColorTexture.repeat.set(8, 8);
			grassAmbientOcclusionTexture.repeat.set(8, 8);
			grassNormalTexture.repeat.set(8, 8);
			grassRoughnessTexture.repeat.set(8, 8);

			grassColorTexture.wrapS = THREE.RepeatWrapping;
			grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
			grassNormalTexture.wrapS = THREE.RepeatWrapping;
			grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

			grassColorTexture.wrapT = THREE.RepeatWrapping;
			grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
			grassNormalTexture.wrapT = THREE.RepeatWrapping;
			grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

			// objects

			//House
			// House container
			const house = new THREE.Group();
			scene.add(house);

			// Walls
			const walls = new THREE.Mesh(
				new THREE.BoxGeometry(4, 2.5, 4),
				new THREE.MeshStandardMaterial({
					map: bricksColorTexture,
					aoMap: bricksAmbientOcclusionTexture,
					normalMap: bricksNormalTexture,
					roughnessMap: bricksRoughnessTexture
				})
			);
			walls.castShadow = true;
			walls.geometry.setAttribute(
				'uv2',
				new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
			);
			walls.position.y = 2.25;
			house.add(walls);

			// Roof
			const roof = new THREE.Mesh(
				new THREE.ConeGeometry(4.5, 1.5, 4),
				new THREE.MeshStandardMaterial({ color: '#7e2811' })
			);
			roof.rotation.y = Math.PI * 0.25;
			roof.position.y = 2.25 + 1.5;
			house.add(roof);

			// Roof round ball
			const ball = new THREE.Mesh(
				new THREE.SphereGeometry(1.2, 32, 32),
				new THREE.MeshStandardMaterial({ color: '#7e2811' })
			);
			ball.position.y = 2.25 + 2;
			house.add(ball);

			// Roof torus
			const torus = new THREE.Mesh(
				new THREE.TorusGeometry(0.3, 0.2, 64, 128),
				new THREE.MeshStandardMaterial({ color: '#7e2811' })
			);
			torus.position.y = 2.25 + 3.2;
			torus.rotation.x = Math.PI * 0.5;
			house.add(torus);

			// Roof top
			const rooftop = new THREE.Mesh(
				new THREE.ConeGeometry(0.5, 2.5, 8),
				new THREE.MeshStandardMaterial({ color: '#7e2811' })
			);
			rooftop.position.y = 2.25 + 4;
			house.add(rooftop);

			// Door
			const door = new THREE.Mesh(
				new THREE.PlaneGeometry(2, 2, 100, 100),
				new THREE.MeshStandardMaterial({
					map: doorColorTexture,
					transparent: true,
					alphaMap: doorAlphaTexture,
					aoMap: doorAmbientOcclusionTexture,
					displacementMap: doorHeightTexture,
					displacementScale: 0.1,
					normalMap: doorNormalTexture,
					metalnessMap: doorMetalnessTexture,
					roughnessMap: doorRoughnessTexture
				})
			);
			door.geometry.setAttribute(
				'uv2',
				new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
			);
			door.position.y = 1.9;
			door.position.z = 2 + 0.01;
			house.add(door);

			// Stones
			const stoneGeometry = new THREE.IcosahedronGeometry(1, 0);
			const stoneMaterial = new THREE.MeshStandardMaterial({ color: '#918E85' });

			const stone1 = new THREE.Mesh(stoneGeometry, stoneMaterial);
			stone1.castShadow = true;
			stone1.scale.set(0.5, 0.5, 0.5);
			stone1.position.set(0.8, 0.2, 2.2);

			const stone2 = new THREE.Mesh(stoneGeometry, stoneMaterial);
			stone2.castShadow = true;
			stone2.scale.set(0.25, 0.25, 0.25);
			stone2.position.set(1.4, 0.1, 2.1);

			const stone3 = new THREE.Mesh(stoneGeometry, stoneMaterial);
			stone3.castShadow = true;
			stone3.scale.set(0.4, 0.4, 0.4);
			stone3.position.set(-0.8, 0.1, 2.2);

			const stone4 = new THREE.Mesh(stoneGeometry, stoneMaterial);
			stone4.castShadow = true;
			stone4.scale.set(0.15, 0.15, 0.15);
			stone4.position.set(-1, 0.05, 2.6);

			house.add(stone1, stone2, stone3, stone4);

			// Graves
			const graves = new THREE.Group();
			scene.add(graves);

			const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.1);
			const graveMaterial = new THREE.MeshStandardMaterial({ color: '#404040' });

			for (let i = 0; i < 50; i++) {
				const angle = Math.random() * Math.PI * 2; // Random angle
				const radius = 3 + Math.random() * 6; // Random radius within 3 to 6 distance from house
				const x = Math.cos(angle) * radius; // Get the x position using cosinus
				const z = Math.sin(angle) * radius; // Get the z position using sinus

				// Create the mesh
				const grave = new THREE.Mesh(graveGeometry, graveMaterial);
				grave.castShadow = true;

				// Position
				grave.position.set(x, 0.3, z);

				// Rotation
				grave.rotation.z = (Math.random() - 0.5) * 0.4;
				grave.rotation.y = (Math.random() - 0.5) * 0.4;

				// Add to the graves container
				graves.add(grave);
			}

			// Floor
			const floor = new THREE.Mesh(
				new THREE.PlaneGeometry(20, 20),
				new THREE.MeshStandardMaterial({
					map: grassColorTexture,
					aoMap: grassAmbientOcclusionTexture,
					normalMap: grassNormalTexture,
					roughnessMap: grassRoughnessTexture
				})
			);
			floor.receiveShadow = true;
			floor.geometry.setAttribute(
				'uv2',
				new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
			);
			floor.rotation.x = -Math.PI * 0.5;
			floor.position.y = 0;
			scene.add(floor);

			//lights
			// Ambient light
			const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.3);
			scene.add(ambientLight);

			// Directional light
			const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.22);
			moonLight.castShadow = true;
			moonLight.shadow.mapSize.width = 256;
			moonLight.shadow.mapSize.height = 256;
			moonLight.shadow.camera.far = 15;
			moonLight.position.set(4, 5, -2);
			scene.add(moonLight);

			// Door light
			const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
			doorLight.castShadow = true;
			doorLight.shadow.mapSize.width = 256;
			doorLight.shadow.mapSize.height = 256;
			doorLight.shadow.camera.far = 7;

			doorLight.position.set(0, 3.1, 2.7);
			house.add(doorLight);

			/**
			 * Ghosts
			 */
			const ghost1 = new THREE.PointLight('#111cc4', 3, 3);
			ghost1.castShadow = true;
			ghost1.shadow.mapSize.width = 256;
			ghost1.shadow.mapSize.height = 256;
			ghost1.shadow.camera.far = 7;
			scene.add(ghost1);

			const ghost2 = new THREE.PointLight('#2b0acc', 3, 3);
			ghost2.castShadow = true;
			ghost2.shadow.mapSize.width = 256;
			ghost2.shadow.mapSize.height = 256;
			ghost2.shadow.camera.far = 7;
			scene.add(ghost2);

			const ghost3 = new THREE.PointLight('#491db8', 3, 3);
			ghost3.castShadow = true;
			ghost3.shadow.mapSize.width = 256;
			ghost3.shadow.mapSize.height = 256;
			ghost3.shadow.camera.far = 7;
			scene.add(ghost3);

			/**
			 * Fog
			 */
			const fog = new THREE.Fog('#262837', 1, 14);
			scene.fog = fog;

			//camera with args 75 degree, aspect ratio, minmax range
			const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000);
			camera.position.x = 4;
			camera.position.y = 2;
			camera.position.z = 11;
			scene.add(camera);

			// renderer
			let renderer: THREE.WebGLRenderer;
			const createScene = (canvasEl) => {
				renderer = new THREE.WebGLRenderer({ canvas: canvasEl });
				renderer.shadowMap.enabled = true;
				renderer.shadowMap.type = THREE.PCFSoftShadowMap;
				renderer.setClearColor('#262837'); //similar to the fog so the edge of the field can be blurred together
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

				// Ghosts
				const ghost1Angle = elapsedTime * 0.5;
				ghost1.position.x = Math.cos(ghost1Angle) * 4;
				ghost1.position.z = Math.sin(ghost1Angle) * 4;
				ghost1.position.y = Math.sin(elapsedTime * 3);

				const ghost2Angle = -elapsedTime * 0.32;
				ghost2.position.x = Math.cos(ghost2Angle) * 5;
				ghost2.position.z = Math.sin(ghost2Angle) * 5;
				ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

				const ghost3Angle = -elapsedTime * 0.18;
				ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
				ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
				ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

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
	<p>This is a floating haunted house in the grave yard with ghosts dancing around it!</p>
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

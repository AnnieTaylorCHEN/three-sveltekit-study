<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import * as THREE from 'three';
	import GUI from 'lil-gui';
	import gsap from 'gsap';

	let canvasEl: HTMLElement;

	interface cursor {
		x: number;
		y: number;
	}

	const parameters = {
		materialColor: '#ffeded'
	};

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

			// texture
			const textureLoader = new THREE.TextureLoader();
			const matcapTexture = textureLoader.load('/textures/matcaps/8.png');
			const particleTexture = textureLoader.load('/textures/particles/9.png');

			// material
			const material = new THREE.MeshMatcapMaterial({
				color: parameters.materialColor,
				matcap: matcapTexture
			});

			// objects
			const objectsDistance = 4;
			const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
			const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
			const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material);

			mesh1.position.x = 2;
			mesh2.position.x = -2;
			mesh3.position.x = 2;

			mesh1.position.y = -objectsDistance * 0;
			mesh2.position.y = -objectsDistance * 1;
			mesh3.position.y = -objectsDistance * 2;

			scene.add(mesh1, mesh2, mesh3);

			const sectionMeshes = [mesh1, mesh2, mesh3];

			// lights
			const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
			directionalLight.position.set(1, 1, 0);
			scene.add(directionalLight);

			//particles
			// particles - geometry
			const particlesCount = 200;
			const positions = new Float32Array(particlesCount * 3);

			for (let i = 0; i < particlesCount; i++) {
				positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
				positions[i * 3 + 1] =
					objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length;
				positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
			}

			const particlesGeometry = new THREE.BufferGeometry();
			particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

			// particles - material
			const particlesMaterial = new THREE.PointsMaterial({
				color: parameters.materialColor,
				sizeAttenuation: true,
				size: 0.3,
				alphaMap: particleTexture,
				blending: THREE.AdditiveBlending
			});

			// particles - points
			const particles = new THREE.Points(particlesGeometry, particlesMaterial);
			scene.add(particles);

			//camera
			// camera - group
			const cameraGroup = new THREE.Group(); // kind of like putting camera in a box, and moving the box instead of camera itself
			scene.add(cameraGroup);

			// Base camera, below our perspective is more "vertical"
			const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
			camera.position.z = 6;
			cameraGroup.add(camera);

			// renderer
			let renderer: THREE.WebGLRenderer;
			const createScene = (canvasEl) => {
				renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true });
				renderer.setSize(sizes.width, sizes.height);
				renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 2 is usually enough, higher = expensive computing
				renderer.render(scene, camera);
			};

			createScene(canvasEl);

			// scroll
			let scrollY = window.scrollY;
			let currentSection = 0;

			window.addEventListener('scroll', () => {
				scrollY = window.scrollY;
				const newSection = Math.round(scrollY / sizes.height);

				if (newSection != currentSection) {
					currentSection = newSection;

					gsap.to(sectionMeshes[currentSection].rotation, {
						duration: 1.5,
						ease: 'power2.inOut',
						x: '+=6',
						y: '+=3',
						z: '+=1.5'
					});
				}
			});

			// cursor
			const cursor: cursor = { x: 0, y: 0 };
			window.addEventListener('mousemove', (event) => {
				cursor.x = event.clientX / sizes.width - 0.5;
				cursor.y = event.clientY / sizes.height - 0.5;
			});

			//animation
			const clock = new THREE.Clock();
			let previousTime = 0;

			const tick = () => {
				const elapsedTime = clock.getElapsedTime();
				const deltaTime = elapsedTime - previousTime;
				previousTime = elapsedTime;

				// Animate camera
				camera.position.y = (-scrollY / sizes.height) * objectsDistance;

				const parallaxX = cursor.x * 0.5;
				const parallaxY = -cursor.y * 0.5;
				cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
				cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime; // add lerping to make the movement smooth, imagine we are approaching the destination, each time we want to move a bit closer, we take 10% of the rest of the remaining distance, (later we are using the 0.08 instead of 0.1). Delta time which is time between now and next frame, we use this to make sure all devices show up the same speed, so the tick function needs to follow this. 0.016s is for most 60 fps, we multiply it by 5 to get 0.08 which is close to the smooth lerping effect we want.

				// Animate meshes
				for (const mesh of sectionMeshes) {
					mesh.rotation.x += deltaTime * 0.1;
					mesh.rotation.y += deltaTime * 0.12;
				}

				//render, call tick again on the next frame
				renderer.render(scene, camera);
				window.requestAnimationFrame(tick);
			};
			tick();

			const gui = new GUI({ width: 350 });
			gui.addColor(parameters, 'materialColor').onChange(() => {
				material.color.set(parameters.materialColor);
				particlesMaterial.color.set(parameters.materialColor);
			});

			return () => gui.destroy();
		}
	});
</script>

<canvas class="bg" bind:this={canvasEl} />

<section class="part">
	<p>
		And all things, whatsoever ye shall ask in prayer, believing, ye shall receive. <br />
		<span class="verse">Matthew 21:22</span>
	</p>
</section>
<section class="part">
	<p>
		Rejoicing in hope; patient in tribulation; continuing instant in prayer. <br />
		<span class="verse">Romans 12:12</span>
	</p>
</section>
<section class="part">
	<p>
		Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not
		puffed up. <br />
		<span class="verse">1 Corinthians 13:4</span>
	</p>
</section>

<style>
	.bg {
		position: fixed;
		top: 0;
		left: 0;
		outline: none;
		background-color: #1e1a20;
		z-index: -1;
	}

	p {
		font-family: 'IM Fell English', 'Times New Roman', Times, serif;
		letter-spacing: 1.3px;
		color: #ffeded;
		font-size: 3rem;
		width: 50vw;
		margin-top: -20vh;
	}

	.verse {
		font-size: 1.5rem;
		text-align: right;
	}

	.part {
		display: flex;
		align-items: center;
		height: 100vh;
		position: relative;
		padding-left: 10%;
		padding-right: 10%;
	}

	.part:nth-child(even) {
		justify-content: flex-end;
	}
</style>

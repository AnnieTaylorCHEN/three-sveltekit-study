<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import GUI from 'lil-gui';
	import gsap from 'gsap';

	let canvasEl: HTMLElement;

	const cursor = {
		x: 0,
		y: 0
	};

	//scene
	const scene = new THREE.Scene();

	// parameters for debug tweaking
	const parameters = {
		color: '#f5c2c2',
		spin: () => {
			gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 });
		}
	};

	//pink cube
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: parameters.color });
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	//sizes
	const sizes = {
		width: 800,
		height: 600
	};

	//camera, 75 degree, aspect ratio
	const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000);
	camera.position.z = 3;
	scene.add(camera);

	//camera, orthographic
	// const aspectRatio = sizes.width / sizes.height;
	// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100);
	// camera.position.x = 2;
	// camera.position.y = 2;
	// camera.position.z = 2;
	// camera.lookAt(mesh.position);
	// scene.add(camera);

	//renderer
	let renderer: THREE.WebGLRenderer;
	export const createScene = (canvasEl) => {
		renderer = new THREE.WebGLRenderer({ canvas: canvasEl });
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 2 is usually enough, higher = expensive computing
		renderer.render(scene, camera);
	};

	//time
	// let time = Date.now();

	//Clock
	const clock = new THREE.Clock();

	//animation
	const tik = () => {
		// time
		// const currentTime = Date.now(); //tick's time
		// const deltaTime = currentTime - time; //every frame's time difference
		// time = currentTime;

		// update objects
		// mesh.rotation.y += 0.01 * deltaTime; // this can stablize time across device, no matter the speed of GPU or CPU, another way is to use clock funtion from three.js

		// Clock + update objects
		// const elapsedTime = clock.getElapsedTime();
		// mesh.rotation.y = elapsedTime;

		// the following makes camera rotates by fixing the focus on the object
		// camera.position.y = Math.sin(elapsedTime);
		// camera.position.x = Math.cos(elapsedTime);
		// camera.lookAt(mesh.position);

		//update camera by moving the mouse
		// camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
		// camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
		// camera.position.y = cursor.y * 5;
		// camera.lookAt(mesh.position);

		//render
		renderer.render(scene, camera);
		window.requestAnimationFrame(tik);
	};


	onMount(() => {
		if (browser) {
			window.addEventListener('mousemove', (e) => {
				cursor.x = e.clientX / sizes.width - 0.5;
				cursor.y = e.clientY / sizes.height - 0.5;
			});

			// for full screen and adjusting to device sizes

			// window.addEventListener('resize', () => {
			// 	// update size
			// 	sizes.width = window.innerWidth;
			// 	sizes.height = window.innerHeight;

			// 	//update camera
			// 	camera.aspect = sizes.width / sizes.height;
			// 	camera.updateProjectionMatrix();

			// 	//update renderer
			// 	renderer.setSize(sizes.width, sizes.height);
			// 	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 2 is usually enough, higher = expensive computing
			// });

			// double click to toggle to fullscreen or back

			window.addEventListener('dblclick', () => {
				const fullscreen: any = document.fullscreenElement || document.webkitFullscreenElement;
				if (!fullscreen) {
					if (canvasEl.requestFullscreen) {
						canvasEl.requestFullscreen();
					} else if (canvasEl.webkitRequestFullscreen) {
						canvasEl.webkitRequestFullscreen();
					}
				} else {
					if (document.exitFullscreen) {
						document.exitFullscreen();
					} else if (document.webkitExitFullscreen) {
						document.webkitExitFullscreen();
					}
				}
			});

			createScene(canvasEl);

			//controls
			const controls = new OrbitControls(camera, canvasEl);
			controls.enableDamping = true;

			const tick = () => {
				//controls update
				controls.update();

				//render
				renderer.render(scene, camera);
				window.requestAnimationFrame(tick);
			};
			tick();
		}

		// DEBUG - parameters must be added as an object to tweak
		const gui = new GUI({ width: 350 });
		// gui.add(mesh.position, 'y', -3, 3, 0.01); // the following might be more clear to read
		gui.add(mesh.position, 'x').min(-3).max(3).step(0.01).name('cube x');
		gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('cube y');
		gui.add(mesh.position, 'z').min(-3).max(3).step(0.01).name('cube z');
		gui.add(mesh, 'visible');
		gui.add(material, 'wireframe');
		gui.addColor(parameters, 'color').onChange(() => material.color.set(parameters.color));
		gui.add(parameters, 'spin');

		return () => gui.destroy();
	});

	
</script>

<svelte:head>
	<title>Basic</title>
</svelte:head>

<section>
	<p>Cube created with vanilla three.js. Double click in canvas = toggle fullscreen mode</p>
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
		top: 200px;
	}
</style>

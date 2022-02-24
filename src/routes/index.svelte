<script context="module" lang="ts">
	export const prerender = true;
</script>

<script>
	import { CircleBufferGeometry, MeshStandardMaterial, BoxBufferGeometry, DoubleSide } from 'three';
	import {
		Canvas,
		DirectionalLight,
		HemisphereLight,
		Mesh,
		OrbitControls,
		PerspectiveCamera
	} from 'threlte';
</script>

<svelte:head>
	<title>Threlte x SvelteKit Playground</title>
</svelte:head>

<h1>Threlte x SvelteKit Playground</h1>

<section>
	<Canvas>
		<PerspectiveCamera position={{ x: 5, y: 5, z: 5 }}>
			<OrbitControls autoRotate />
		</PerspectiveCamera>

		<DirectionalLight shadow color={'white'} position={{ x: -15, y: 45, z: 20 }} />
		<HemisphereLight skyColor={'white'} groundColor={'pink'} intensity={0.4} />

		<Mesh
			castShadow
			geometry={new BoxBufferGeometry(1, 1, 1)}
			material={new MeshStandardMaterial({ color: '#0058e6' })}
		/>

		<Mesh
			receiveShadow
			position={{ y: -0.5 }}
			rotation={{ x: -90 * (Math.PI / 180) }}
			geometry={new CircleBufferGeometry(3, 72)}
			material={new MeshStandardMaterial({ side: DoubleSide, color: 'white' })}
		/>
	</Canvas>
</section>

<style>
	h1 {
		width: 100%;
	}

	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		width: 1000px;
		height: 1000px;
		z-index: -1;
	}
</style>

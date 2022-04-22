<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import Experience from '$lib/organism/Experience/Experience.js';

	let canvasEl: HTMLElement;
	let experience: any;

	onMount(() => {
		if (browser) {
			experience = new Experience(canvasEl);
		}
		return () => experience.destroy();
	});
</script>

<section>
	<p>Click on the debug button below for control access to make magic happen!</p>
	<p>TODO: I need to fix the loading issue. If it doesn't load, refresh or reload the page!</p>
	<a href="/brain-stem#debug">debug</a>
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

	a {
		display: inline-block;
		padding: 1rem 2rem;
		background: transparent;
		border: 1px solid var(--accent-color);
		border-radius: 10px;
		text-decoration: none;
		text-transform: uppercase;
		margin-bottom: 1rem;
		color: var(--accent-color);
	}

	a:hover {
		background-color: var(--accent-color);
		color: var(--pure-white);
	}
</style>

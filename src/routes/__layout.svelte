<script lang="ts">
	import Header from '$lib//molecules/header/Header.svelte';
	import '../app.css';
</script>

<Header />

<main>
	<slot />
</main>

<footer>
	<p>an experiment by <a href="https://www.annietaylorchen.com/">Annie Taylor Chen</a></p>
</footer>

<style>
	main {
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		position: fixed;
		bottom: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0.5rem 1rem;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 1rem;
		}
	}
</style>

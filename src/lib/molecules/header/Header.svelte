<script lang="ts">
	import { page } from '$app/stores';
</script>

<header>
	<nav>
		<ul>
			<li class:active={$page.url.pathname === '/'}><a sveltekit:prefetch href="/">Home</a></li>
			<li class:active={$page.url.pathname === '/basic'}>
				<a sveltekit:prefetch href="/basic">Basic</a>
			</li>
			<li class:active={$page.url.pathname === '/basic-material'}>
				<a sveltekit:prefetch href="/basic-material">Basic Material</a>
			</li>
			<li class:active={$page.url.pathname === '/three-d-text'}>
				<a sveltekit:prefetch href="/three-d-text">3D Text</a>
			</li>
			<li class:active={$page.url.pathname === '/lights'}>
				<a sveltekit:prefetch href="/lights">Lights</a>
			</li>
			<li class:active={$page.url.pathname === '/shadows'}>
				<a sveltekit:prefetch href="/shadows">Shadows</a>
			</li>
			<li class:active={$page.url.pathname === '/haunted-house'}>
				<a sveltekit:prefetch href="/haunted-house">Haunted House</a>
			</li>
			<li class:active={$page.url.pathname === '/particles'}>
				<a sveltekit:prefetch href="/particles">Particles</a>
			</li>
			<li class:active={$page.url.pathname === '/todos'}>
				<a sveltekit:prefetch href="/todos">Todos</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	nav {
		display: flex;
		justify-content: center;
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: transparent;
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li.active::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent-color);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--accent-color);
	}
</style>

<script lang="ts">
	import { page } from '$app/stores';

	$: lightFontColor = $page.url.pathname === '/scroll';
</script>

<header>
	<nav>
		<ul class:lightfontcolor={lightFontColor}>
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
			<li class:active={$page.url.pathname === '/galaxy'}>
				<a sveltekit:prefetch href="/galaxy">Galaxy</a>
			</li>
			<li class:active={$page.url.pathname === '/raycaster'}>
				<a sveltekit:prefetch href="/raycaster">Raycaster</a>
			</li>
			<li class:active={$page.url.pathname === '/scroll'}>
				<a sveltekit:prefetch href="/scroll">Scroll</a>
			</li>
			<li class:active={$page.url.pathname === '/physics'}>
				<a sveltekit:prefetch href="/physics">Physics</a>
			</li>
			<li class:active={$page.url.pathname === '/fox'}>
				<a sveltekit:prefetch href="/fox">Fox</a>
			</li>
			<li class:active={$page.url.pathname === '/camera'}>
				<a sveltekit:prefetch href="/camera">Camera</a>
			</li>
			<li class:active={$page.url.pathname === '/brain-stem'}>
				<a sveltekit:prefetch href="/brain-stem">Brain Stem</a>
			</li>
			<li class:active={$page.url.pathname === '/mj'}>
				<a sveltekit:prefetch href="/mj">MJ</a>
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
		height: 3rem;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		flex-wrap: wrap;
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
		padding: 0 0.7rem;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover,
	.lightfontcolor a:hover {
		color: var(--accent-color);
	}

	.lightfontcolor a {
		color: var(--pure-white);
	}
</style>

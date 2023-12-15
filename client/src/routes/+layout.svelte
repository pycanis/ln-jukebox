<script lang="ts">
	import { browser } from '$app/environment';
	import Particles from '$lib/components/Particles.svelte';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<Particles />

	<div class="layout">
		<main>
			<slot />
		</main>
	</div>
</QueryClientProvider>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(html, body) {
		margin: 0;
		height: 100%;
		overflow-x: hidden;
	}

	:global(body) {
		background: radial-gradient(circle, rgba(124, 18, 249, 0.7) 0%, rgba(247, 147, 26, 1) 100%);
		background-size: 200% 200%;
		background-position: 50% 50%;
		animation: gradient 2s linear infinite;
	}

	:global(p) {
		overflow-wrap: anywhere;
	}

	:global(.highlighted) {
		color: orange;
	}

	.layout {
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		padding: 10px;
		width: 1200px;
		height: 100%;

		@media only screen and (max-width: 1200px) {
			width: 800px;
		}
	}

	@keyframes gradient {
		0% {
			background-size: 100% 100%;
			background-position: 50% 50%;
		}
		50% {
			background-size: 200% 200%;
			background-position: 50% 50%;
		}
		100% {
			background-size: 100% 100%;
			background-position: 50% 50%;
		}
	}
</style>

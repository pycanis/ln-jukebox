<script lang="ts">
	import { browser } from '$app/environment';
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
		width: 800px;
		height: 100%;
	}
</style>

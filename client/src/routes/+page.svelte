<script lang="ts">
	import { QUERY_CACHE_KEYS, getQueue } from '$lib';
	import AddToQueue from '$lib/components/AddToQueue.svelte';
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
	import Queue from '$lib/components/Queue.svelte';
	import { createQuery } from '@tanstack/svelte-query';

	const queueQuery = createQuery([QUERY_CACHE_KEYS.QUEUE], getQueue);
</script>

<h1>LN Jukebox</h1>

<div class="layout">
	<div class="current">
		<AudioPlayer {queueQuery} />

		<div class="mobile">
			<AddToQueue />
		</div>

		<Queue {queueQuery} />
	</div>

	<div class="not-mobile">
		<AddToQueue />
	</div>
</div>

<style>
	.layout {
		display: flex;

		@media only screen and (max-width: 600px) {
			max-width: 100vw;
		}
	}

	.current {
		flex: 1;
		margin-right: 2rem;
	}

	.mobile {
		flex: 1;

		@media only screen and (max-width: 600px) {
			display: initial;
		}

		@media only screen and (min-width: 600px) {
			display: none;
		}
	}

	.not-mobile {
		flex: 1;

		@media only screen and (max-width: 600px) {
			display: none;
		}

		@media only screen and (min-width: 600px) {
			display: initial;
		}
	}
</style>

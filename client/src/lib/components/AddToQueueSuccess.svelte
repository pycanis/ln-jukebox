<script lang="ts">
	import { QUERY_CACHE_KEYS, getCurrentSong } from '$lib/api';
	import type { AddToQueuePaymentSuccessData } from '$lib/types';
	import { formatDuration } from '$lib/utils';
	import { createQuery } from '@tanstack/svelte-query';

	export let props: AddToQueuePaymentSuccessData;
	export let handleResetAddToQueue: () => void;

	const currentSongQuery = createQuery([QUERY_CACHE_KEYS.CURRENT_SONG], getCurrentSong);

	const timeout = setTimeout(() => {
		handleResetAddToQueue();
	}, 10000);

	const handleAddAnotherClick = () => {
		clearTimeout(timeout);

		handleResetAddToQueue();
	};
</script>

<p>
	your audio was added successfully! queue position: {props.queuePosition}. it will play in approx. {formatDuration(
		props.timeEstimateInSeconds +
			($currentSongQuery.data
				? $currentSongQuery.data.durationInSeconds - $currentSongQuery.data.currentSecond
				: 0)
	)}
</p>
<button on:click={handleAddAnotherClick}>add another</button>

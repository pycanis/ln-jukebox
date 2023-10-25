<script lang="ts">
	import { PUBLIC_API_URL, PUBLIC_WEBSOCKET_URL } from '$env/static/public';
	import { QUERY_CACHE_KEYS, getCurrentSong, type QueueItem } from '$lib/api';
	import { addedQueueItems } from '$lib/store';
	import { WebsocketEvents } from '$lib/websocketEvents';
	import { createQuery, type CreateQueryResult } from '@tanstack/svelte-query';
	import { io } from 'socket.io-client';
	import { onMount } from 'svelte';

	export let queueQuery: CreateQueryResult<QueueItem[], unknown>;

	let isPlaying = false;
	let currentSecond = 0;
	let audio: HTMLAudioElement | undefined;
	let loadingAudio = false;

	const refetchAndSetAudio = async () => {
		loadingAudio = true;

		const res = await fetch(`${PUBLIC_API_URL}/stream?ts=${Date.now()}`, {
			headers: {
				'Cache-Control': 'no-store'
			}
		});

		const buffer = await res.arrayBuffer();

		const blob = new Blob([buffer], { type: 'audio/mpeg' });

		loadingAudio = false;

		return new Audio(URL.createObjectURL(blob));
	};

	const handleTogglePlay = async () => {
		if (!audio) {
			audio = await refetchAndSetAudio();
		}

		isPlaying = !isPlaying;

		if (isPlaying) {
			const previousData = $currentSongQuery.data;

			const { data: updatedData } = await $currentSongQuery.refetch();

			if (!updatedData) {
				return;
			}

			if (previousData?.id !== updatedData.id) {
				audio.pause();
				audio = await refetchAndSetAudio();
			}

			audio.currentTime = updatedData.currentSecond;

			audio.play();
		} else {
			audio.pause();
		}
	};

	const currentSongQuery = createQuery([QUERY_CACHE_KEYS.CURRENT_SONG], getCurrentSong, {
		onSuccess: (data) => {
			if (data) {
				currentSecond = data.currentSecond;
			}
		}
	});

	onMount(() => {
		const socket = io(PUBLIC_WEBSOCKET_URL, {
			transports: ['websocket']
		});

		socket.on(WebsocketEvents.AUDIO_READY, async () => {
			audio?.pause();
			audio = await refetchAndSetAudio();

			await $currentSongQuery.refetch();
			await $queueQuery.refetch();

			if (isPlaying) {
				audio.play();
			}
		});

		socket.on(WebsocketEvents.QUEUE_UPDATED, async () => {
			await $queueQuery.refetch();
		});

		setInterval(async () => {
			currentSecond++;
		}, 1000);
	});
</script>

<h3>currently playing</h3>

<p class={$addedQueueItems.includes($currentSongQuery.data?.id ?? '') ? 'highlighted' : undefined}>
	{$currentSongQuery.data?.name || '-'}
</p>

<progress value={currentSecond} max={$currentSongQuery.data?.durationInSeconds} />

<button on:click={handleTogglePlay} disabled={loadingAudio}>{isPlaying ? 'stop' : 'play'}</button>

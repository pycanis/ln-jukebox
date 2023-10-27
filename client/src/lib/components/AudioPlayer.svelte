<script lang="ts">
	import { browser } from '$app/environment';
	import { PUBLIC_API_URL, PUBLIC_WEBSOCKET_URL } from '$env/static/public';
	import { QUERY_CACHE_KEYS, getCurrentSong, type QueueItem } from '$lib/api';
	import { DEFAULT_VOLUME, JUKEBOX_VOLUME_KEY } from '$lib/constants';
	import { addedQueueItems } from '$lib/store';
	import { WebsocketEvents } from '$lib/websocketEvents';
	import { createQuery, type CreateQueryResult } from '@tanstack/svelte-query';
	import { Howl } from 'howler';
	import { io } from 'socket.io-client';
	import { onMount } from 'svelte';

	export let queueQuery: CreateQueryResult<QueueItem[], unknown>;

	let isPlaying = false;
	let currentSecond = 0;
	let audio: Howl | undefined;
	let isLoadingAudio = false;
	let lastPlayedSongId: string | undefined;
	let volume = browser
		? Number(localStorage.getItem(JUKEBOX_VOLUME_KEY) || DEFAULT_VOLUME)
		: DEFAULT_VOLUME;

	const refetchAndSetAudio = () => {
		isLoadingAudio = true;

		audio?.unload();

		audio = new Howl({
			src: [`${PUBLIC_API_URL}/stream`],
			html5: true,
			preload: true,
			format: 'mp3',
			volume: volume / 100,
			onload: () => {
				if (isPlaying) {
					isLoadingAudio = false;

					audio?.play();
				}
			}
		});
	};

	const handleTogglePlay = async () => {
		isPlaying = !isPlaying;

		if (isPlaying) {
			if (lastPlayedSongId === $currentSongQuery.data?.id && audio?.state() === 'loaded') {
				audio.seek(currentSecond);
				audio?.play();
			} else {
				refetchAndSetAudio();
			}

			lastPlayedSongId = $currentSongQuery.data?.id;
		} else {
			audio?.pause();
		}
	};

	const handleVolumeChange = (
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		const updatedVolume = Number(e.currentTarget.value);

		volume = updatedVolume;
		audio && audio.volume(volume / 100);
		localStorage.setItem(JUKEBOX_VOLUME_KEY, volume.toString());
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
			if (isPlaying) {
				refetchAndSetAudio();
			}

			await $currentSongQuery.refetch();
			await $queueQuery.refetch();
		});

		socket.on(WebsocketEvents.QUEUE_UPDATED, async () => {
			await $queueQuery.refetch();
		});

		setInterval(() => {
			currentSecond++;
		}, 1000);
	});
</script>

<h3>currently playing</h3>

<p class={$addedQueueItems.includes($currentSongQuery.data?.id ?? '') ? 'highlighted' : undefined}>
	{$currentSongQuery.data?.name || '-'}
</p>

<progress value={currentSecond} max={$currentSongQuery.data?.durationInSeconds} />

<div class="controls">
	<input type="range" min={0} max={100} value={volume} on:change={handleVolumeChange} />

	<button on:click={handleTogglePlay} disabled={isLoadingAudio}
		>{isPlaying ? 'stop' : 'play'}</button
	>
</div>

<style>
	.controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
</style>

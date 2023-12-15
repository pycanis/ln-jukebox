<script lang="ts">
	import { QUERY_CACHE_KEYS, searchAudio } from '$lib/api';
	import { debounce } from '$lib/utils';
	import { createQuery } from '@tanstack/svelte-query';

	export let linkInput: string;
	export let isLoading: boolean;
	export let handleValidateLink: () => void;
	export let resetPaymentSection: () => void;

	let searchText = '';

	$: searchQuery = createQuery(
		[QUERY_CACHE_KEYS.SEARCH, searchText],
		() => searchAudio(searchText),
		{
			enabled: !!searchText,
			refetchOnWindowFocus: false
		}
	);

	const handleSearchInputChange = (
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		const q = e.currentTarget.value;

		debounce(() => {
			resetPaymentSection();

			searchText = q;
		}, 1200);
	};

	const handleAudioSelect = (
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		const videoId = e.currentTarget.value;

		linkInput = `https://www.youtube.com/watch?v=${videoId}`;

		handleValidateLink();
	};
</script>

<input
	type="search"
	placeholder="search audio.."
	data-theme="dark"
	disabled={$searchQuery.isFetching || isLoading}
	value={searchText}
	on:input={handleSearchInputChange}
/>

{#if !!$searchQuery.data?.length}
	{#each $searchQuery.data ?? [] as audioItem}
		<div>
			<input
				type="radio"
				id={audioItem.videoId}
				name="videoId"
				value={audioItem.videoId}
				disabled={$searchQuery.isFetching || isLoading}
				on:change={handleAudioSelect}
			/>
			<label for={audioItem.videoId}>{audioItem.title}</label>
		</div>
	{/each}
{/if}

<br />

<style>
	div {
		display: flex;
	}

	input {
		margin-top: 0.2rem;
	}

	label {
		flex: 1;
	}
</style>

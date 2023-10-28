<script lang="ts">
	import { validateLink } from '$lib/api';
	import type { AddToQueuePaymentSuccessData } from '$lib/types';
	import { debounce } from '$lib/utils';
	import { createMutation } from '@tanstack/svelte-query';
	import type { AxiosError } from 'axios';
	import AddToQueueSuccess from './AddToQueueSuccess.svelte';
	import Link from './Link.svelte';
	import Payment from './Payment.svelte';
	import Search from './Search.svelte';

	let linkInput = '';
	let displayPaymentSection = false;
	let addOption: 'search' | 'link' | undefined;
	let satsAmount: number | undefined;
	let paymentRequest = '';
	let addToQueueSuccessProps: AddToQueuePaymentSuccessData | undefined;
	let error: string | undefined;

	$: {
		if (!linkInput) error = undefined;
	}

	const validateLinkMutation = createMutation(validateLink, {
		onError: (err: AxiosError) => {
			error = err.response?.data as string;
			resetPaymentSection();
		},
		onSuccess: () => {
			error = undefined;
			displayPaymentSection = true;
		}
	});

	const resetPaymentSection = () => {
		displayPaymentSection = false;
		satsAmount = undefined;
		paymentRequest = '';
	};

	const handleValidateLink = () =>
		debounce(() => linkInput && $validateLinkMutation.mutate(linkInput));

	const handleResetAddToQueue = () => {
		addOption = undefined;
		linkInput = '';
		addToQueueSuccessProps = undefined;
		resetPaymentSection();
	};
</script>

<div class="new">
	{#if addToQueueSuccessProps}
		<AddToQueueSuccess props={addToQueueSuccessProps} {handleResetAddToQueue} />
	{:else}
		<h3>add to queue</h3>

		{#if !!addOption}
			<button type="button" on:click={handleResetAddToQueue}>reset</button>
		{/if}

		{#if !addOption}
			<div class="choice-container">
				<button
					on:click={() => {
						addOption = 'search';
					}}
					>search
				</button>
				<span>or</span>
				<button
					on:click={() => {
						addOption = 'link';
					}}
					>youtube link
				</button>
			</div>
		{/if}

		{#if addOption === 'search'}
			<Search
				bind:linkInput
				isLoading={$validateLinkMutation.isLoading}
				{handleValidateLink}
				{resetPaymentSection}
			/>
		{/if}

		{#if addOption === 'link'}
			<Link
				bind:linkInput
				isLoading={$validateLinkMutation.isLoading}
				{displayPaymentSection}
				{handleValidateLink}
			/>
		{/if}

		{#if error}
			<p>{error}</p>
		{/if}

		{#if displayPaymentSection}
			<Payment bind:addToQueueSuccessProps bind:satsAmount bind:paymentRequest {linkInput} />
		{/if}
	{/if}
</div>

<style>
	.new {
		flex: 1;
		overflow: hidden;
	}

	.choice-container {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	span {
		margin-bottom: 1rem;
	}

	p {
		color: red;
		margin-top: 1rem;
	}
</style>

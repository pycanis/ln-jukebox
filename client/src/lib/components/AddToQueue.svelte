<script lang="ts">
	import { PUBLIC_WEBSOCKET_URL } from '$env/static/public';
	import { generatePaymentRequest, validateLink } from '$lib/api';
	import type { AddToQueuePaymentSuccessData } from '$lib/types';
	import { debounce, updateAddedItems } from '$lib/utils';
	import { WebsocketEvents } from '$lib/websocketEvents';
	import { createMutation } from '@tanstack/svelte-query';
	import type { AxiosError } from 'axios';
	import qrcode from 'qrcode';
	import { io } from 'socket.io-client';
	import AddToQueueSuccess from './AddToQueueSuccess.svelte';

	let linkInput = '';
	let satsAmount: number | undefined;
	let error: string | undefined;

	let displayPaymentSection = false;

	let paymentRequest = '';
	let copyText = 'copy';

	let addToQueueSuccessProps: AddToQueuePaymentSuccessData | undefined;

	$: {
		if (!linkInput) error = undefined;
	}

	const validateLinkMutation = createMutation(validateLink, {
		onError: (err: AxiosError) => {
			error = err.response?.data as string;
		},
		onSuccess: () => {
			error = undefined;
			displayPaymentSection = true;
		}
	});

	const generatePaymentRequestMutation = createMutation(generatePaymentRequest, {
		onSuccess: (data) => {
			qrcode.toCanvas(document.getElementById('canvas'), `lightning:${data.paymentRequest}`);

			paymentRequest = data.paymentRequest;

			const socket = io(PUBLIC_WEBSOCKET_URL, {
				transports: ['websocket'],
				query: {
					paymentRequest
				}
			});

			socket.on(WebsocketEvents.PAYMENT_SUCCESS, async (data: AddToQueuePaymentSuccessData) => {
				addToQueueSuccessProps = data;

				updateAddedItems(data.queueItemId);

				socket.disconnect();
			});
		}
	});

	const handleGeneratePaymentRequest = () =>
		$generatePaymentRequestMutation.mutate({ link: linkInput, satsAmount: satsAmount as number });

	const handleValidateLink = () =>
		debounce(() => linkInput && $validateLinkMutation.mutate(linkInput));

	const handleResetAddToQueue = () => {
		linkInput = '';
		satsAmount = undefined;
		displayPaymentSection = false;
		paymentRequest = '';
		addToQueueSuccessProps = undefined;
	};

	const handleCopyToClipboard = () => {
		navigator.clipboard.writeText(paymentRequest).then(() => {
			copyText = 'copied!';

			debounce(() => {
				copyText = 'copy';
			}, 3000);
		});
	};
</script>

<div class="new">
	{#if addToQueueSuccessProps}
		<AddToQueueSuccess props={addToQueueSuccessProps} {handleResetAddToQueue} />
	{:else}
		<h3>add to queue</h3>

		<label for="link"
			>youtube link (max 10 minutes)
			{#if displayPaymentSection}
				<button type="button" on:click={handleResetAddToQueue}>reset link</button>
			{/if}
		</label>
		<input
			class="input"
			type="text"
			id="link"
			name="link"
			disabled={$validateLinkMutation.isLoading || displayPaymentSection}
			bind:value={linkInput}
			on:keyup={handleValidateLink}
		/>

		{#if $validateLinkMutation.isLoading}
			<p>loading...</p>
		{/if}

		{#if error}
			<p>{error}</p>
		{/if}

		<label for="satsAmount">sats amount (the more the higher in queue)</label>
		<input
			class="input"
			type="number"
			id="satsAmount"
			name="satsAmount"
			min={1}
			disabled={!displayPaymentSection}
			bind:value={satsAmount}
		/>

		<button
			type="button"
			disabled={!displayPaymentSection || !satsAmount || satsAmount < 1 || !!paymentRequest}
			on:click={handleGeneratePaymentRequest}>generate invoice</button
		>

		{#if displayPaymentSection}
			<canvas id="canvas" />
		{/if}

		{#if paymentRequest && displayPaymentSection}
			<p>{paymentRequest}</p>

			<button type="button" on:click={handleCopyToClipboard}>{copyText}</button>
		{/if}
	{/if}
</div>

<style>
	.new {
		flex: 1;
		overflow: hidden;
	}

	.input {
		width: 100%;
		margin-bottom: 1rem;
	}
</style>

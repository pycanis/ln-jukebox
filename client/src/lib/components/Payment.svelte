<script lang="ts">
	import { PUBLIC_WEBSOCKET_URL } from '$env/static/public';
	import { generatePaymentRequest } from '$lib/api';
	import type { AddToQueuePaymentSuccessData } from '$lib/types';
	import { debounce, updateAddedItems } from '$lib/utils';
	import { WebsocketEvents } from '$lib/websocketEvents';
	import { createMutation } from '@tanstack/svelte-query';
	import qrcode from 'qrcode';
	import { io } from 'socket.io-client';

	export let satsAmount: number | undefined;
	export let paymentRequest: string;
	export let linkInput: string;
	export let addToQueueSuccessProps: AddToQueuePaymentSuccessData | undefined;

	let copyText = 'copy';

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

	const handleCopyToClipboard = () => {
		navigator.clipboard.writeText(paymentRequest).then(() => {
			copyText = 'copied!';

			debounce(() => {
				copyText = 'copy';
			}, 3000);
		});
	};
</script>

<label for="satsAmount">sats amount (the more the higher in queue)</label>
<input
	class="input"
	type="number"
	id="satsAmount"
	name="satsAmount"
	min={1}
	bind:value={satsAmount}
	data-theme="dark"
/>

<button
	type="button"
	disabled={!satsAmount ||
		satsAmount < 1 ||
		!!paymentRequest ||
		$generatePaymentRequestMutation.isLoading}
	on:click={handleGeneratePaymentRequest}>generate invoice</button
>

<canvas id="canvas" />

{#if paymentRequest}
	<p>{paymentRequest}</p>

	<button type="button" on:click={handleCopyToClipboard}>{copyText}</button>
{/if}

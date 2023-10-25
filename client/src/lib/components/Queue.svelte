<script lang="ts">
	import type { QueueItem } from '$lib/api';
	import { addedQueueItems } from '$lib/store';
	import type { CreateQueryResult } from '@tanstack/svelte-query';

	export let queueQuery: CreateQueryResult<QueueItem[], unknown>;
</script>

<h3>next in queue</h3>

{#each $queueQuery.data ?? [] as queueItem}
	<p class={$addedQueueItems.includes(queueItem.id) ? 'highlighted' : undefined}>
		{queueItem.name} - {queueItem.satsAmount} sats
	</p>
{/each}

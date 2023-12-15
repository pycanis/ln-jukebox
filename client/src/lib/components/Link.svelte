<script lang="ts">
	export let linkInput: string;
	export let displayPaymentSection: boolean;
	export let isLoading: boolean;
	export let handleValidateLink: () => void;
</script>

<input
	type="text"
	name="link"
	data-theme="dark"
	placeholder="youtube link (max 10 minutes)"
	disabled={isLoading || displayPaymentSection}
	bind:value={linkInput}
	on:keyup={handleValidateLink}
/>

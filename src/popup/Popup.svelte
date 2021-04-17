<script lang="ts">
	import Auth from "./Auth.svelte";
	import List from "./List.svelte";
	import Settings from "./Settings.svelte";
	import { currentRoute } from "./stores/router.store";
</script>

<main>
	<Auth>
		{#if $currentRoute === "/list"}
			<List />
		{:else}
			<Settings />
		{/if}
	</Auth>
</main>

<style>
	main {
		min-width: 300px;
		height: max-content;
		min-height: 100%;
		background: #333;
		color: white;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 1rem;
	}
</style>

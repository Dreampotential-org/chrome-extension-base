<script lang="ts">
	import Auth from "./Auth.svelte";
	import Settings from "./Settings.svelte";
</script>

<main>
	<Auth>
		<Settings />
	</Auth>
</main>

<style>
	main {
		min-width: 300px;
		height: 320px;
		background: #333;
		color: white;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 1rem;
	}
</style>

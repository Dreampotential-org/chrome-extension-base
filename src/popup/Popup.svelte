<script lang="ts">
	import { onMount } from "svelte";

	const bg: any = window["chrome"].extension.getBackgroundPage();

	let mounted = false;
	let audio = true;
	let video = true;

	onMount(() => {
		const options = bg.getRecordingOptions();
		audio = options.audio;
		video = options.video;
		audio = mounted = true;
	});

	$: if (mounted) {
		bg.setRecordingOptions({ audio, video: true });
	}
</script>

<main>
	<div class="options">
		<label for="audio">
			<input type="checkbox" bind:checked={audio} />
			audio
		</label>
	</div>
	<div class="shortcuts">
		<label for="toggle">
			record/stop:
			<span>ALT+R</span>
		</label>
	</div>
</main>

<style>
	main {
		min-width: 100px;
		height: 100%;
		background: #333;
		color: white;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.options {
		padding: 0.5rem;
		height: 100%;
	}
	.options label {
		display: flex;
		align-items: center;
	}
	.shortcuts {
		padding: 0.5rem;
	}
	.shortcuts label span {
		display: block;
		text-align: center;
	}
</style>

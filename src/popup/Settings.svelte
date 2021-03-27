<script lang="ts">
    import { onMount } from "svelte";
    import { closeWindow } from "./helpers/main";

    const bg: any = window["chrome"].extension.getBackgroundPage();

    let mounted = false;
    let audio = true;
    let video = true;
    let echoCancellation = true;
    let noiseSuppression = true;
    let status = 0;

    onMount(() => {
        const options = bg.getRecordingOptions();
        audio = options.audio;
        video = options.video;
        audio = mounted = true;
    });

    $: if (mounted) {
        bg.setRecordingOptions({
            video: true,
            audio: audio ? { echoCancellation, noiseSuppression } : false,
        });
    }
</script>

<div class="status">
    <label for="status">
        Status:
        {#if status === 0}
            <span>idle</span>
        {:else if status === 1}
            <span>recording</span>
        {:else if status === 2}
            <span>uploading {0}%</span>
        {:else}
            <span>unknown</span>
        {/if}
    </label>
</div>

<div class="form" on:submit|preventDefault>
    <h3>Recording Options</h3>

    <label for="audio">
        <input type="checkbox" bind:checked={audio} />
        <span>Record Audio</span>
    </label>
    {#if audio}
        <label for="echo-cancellation">
            <input type="checkbox" bind:checked={echoCancellation} />
            <span>Echo Cancellation</span>
        </label>
        <label for="noise-suppression">
            <input type="checkbox" bind:checked={noiseSuppression} />
            <span>Noise Suppression</span>
        </label>
    {/if}
</div>

<div class="form info">
    <h3>Keyboard Shortcuts</h3>

    <span class="shortcut">
        <span class="code">ALT + R</span>
        <span>start or stop recording</span>
    </span>

    <div class="actions">
        {#if status === 0}
            <button>Record</button>
        {:else if status === 1}
            <button on:click={bg.stopRecording}>Stop Recording</button>
        {:else if status === 2}
            <button>Cancel Upload {0}%</button>
        {/if}
        <button on:click={closeWindow}>Close</button>
    </div>
</div>

<style>
    .status {
        font-size: 1.2rem;
    }
    .form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .form label {
        font-size: 1rem;
        color: #aaa;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    .shortcut {
        display: flex;
        font-size: 1rem;
        gap: 1rem;
        align-items: center;
        color: #999;
    }
    .code {
        letter-spacing: 1px;
        color: #ddd;
    }
    .actions {
        min-height: 35px;
        margin-top: 0.5rem;
        display: flex;
        justify-content: center;
        gap: 0.5rem;
    }
    .actions button {
        color: white;
        background: #444;
        padding: 0.4rem 0.7rem;
        outline: none;
        border: none;
        cursor: pointer;
        border-radius: 3px;
    }
</style>

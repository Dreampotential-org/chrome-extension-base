<script lang="ts">
    import { onMount } from "svelte";
    import { bg, closeWindow } from "./helpers/main";
    import {
        cancelUpload,
        download,
        recordingOptions,
        startRecording,
        stopRecording,
    } from "./helpers/record";
    import { logout } from "./stores/main.store";
    import { currentRoute } from "./stores/router.store";

    let mounted = false;
    let audio = true;
    let video = true;
    let echoCancellation = true;
    let noiseSuppression = true;
    let status = 0;
    let blob = null;

    onMount(() => {
        status = bg.getStatusCode();
        setInterval(() => {
            blob = bg.downloadLastRecorded();
            status = bg.getStatusCode();
        }, 1000);
        const options = bg.getRecordingOptions();
        video = options.video;
        audio = !!options.audio;
        if (typeof options.audio === "object") {
            echoCancellation = !!options.audio["echoCancellation"];
            noiseSuppression = !!options.audio["noiseSuppression"];
        } else {
            echoCancellation = noiseSuppression = true;
        }
        mounted = true;
    });

    $: if (mounted) {
        const options = audio && { echoCancellation, noiseSuppression };
        recordingOptions.set(options);
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
    <label for="echo-cancellation" class:hidden={!audio}>
        <input type="checkbox" bind:checked={echoCancellation} />
        <span>Echo Cancellation</span>
    </label>
    <label for="noise-suppression" class:hidden={!audio}>
        <input type="checkbox" bind:checked={noiseSuppression} />
        <span>Noise Suppression</span>
    </label>
</div>

<div class="form info">
    <h3>Keyboard Shortcuts</h3>

    <span class="shortcut">
        <span class="code">ALT + R</span>
        <span>start or stop recording</span>
    </span>

    <div class="actions">
        {#if status === 0}
            {#if blob}
                <button on:click={download}>Download Last</button>
            {/if}
            <button on:click={startRecording}>Record</button>
        {:else if status === 1}
            <button on:click={stopRecording}>Stop Recording</button>
        {:else if status === 2}
            <button on:click={cancelUpload}>Cancel Upload {0}%</button>
        {/if}
        <button on:click={logout}>Logout</button>
        <button on:click={closeWindow}>Close</button>
    </div>
    <div class="actions">
        <button
            class="list-uploads-btn"
            on:click={() => ($currentRoute = "/list")}>List</button
        >
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
    .hidden {
        visibility: hidden;
    }
    .list-uploads-btn {
        width: 100px;
        margin-bottom: 0.5rem;
    }
</style>

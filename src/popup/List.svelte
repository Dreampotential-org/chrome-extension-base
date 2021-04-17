<script lang="ts">
    import { bg } from "./helpers/main";
    import { currentRoute } from "./stores/router.store";

    interface Upload {
        url: string;
        at: Date;
    }

    let files: Upload[] = listUploads();

    function listUploads() {
        return JSON.parse(localStorage.getItem("UPLOADS") || "[]");
    }

    function openTab(url: string) {
        window["chrome"].tabs.create({ url });
    }

    function getDate(timestamp) {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = `${date.getMinutes()}`.padStart(2, "0");
        const seconds = `${date.getSeconds()}`.padStart(2, "0");
        const dateString = date.toDateString();
        return `${dateString} ${hours}:${minutes}:${seconds}`;
    }

    async function deleteVideo(url: string) {
        if (url) {
            await bg.deleteUpload(url);
            files = listUploads();
        }
    }

    $: if (files && files.length === 0) {
        $currentRoute = "/";
    }
</script>

<ul>
    {#each files as file}
        <li>
            <span on:click={() => openTab(file.url)}>
                {#if file.at}
                    {getDate(file.at || new Date())}
                {:else}
                    {file.url.split("/").slice(-1)[0].slice(0, 20)}...
                {/if}
            </span>
            <button class="del" on:click={() => deleteVideo(file.url)}>x</button
            >
        </li>
    {/each}
</ul>

<style>
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    li {
        font-size: 1.1rem;
        background: #777;
        margin: 0.25rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 0.3rem;
    }
    li * {
        cursor: pointer;
    }
    .del {
        padding: 0.4rem;
        background: #555;
        font-size: 1.3rem;
        color: white;
        border: none;
        outline: none;
        width: 2rem;
    }
</style>

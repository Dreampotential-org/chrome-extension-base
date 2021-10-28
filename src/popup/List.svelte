<script lang="ts">
  import Item from "./Item.svelte";

  export let list: ListItem[] = [];
  export let uploadProgress: UploadStatus;

  let active = "";
</script>

<div class="list">
  {#each list.sort((a, b) => b.created_at - a.created_at) as item}
    <Item {item} uploadProgress={uploadProgress[item.id]} bind:active />
  {/each}
</div>

<style>
  .list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-top: 0.5rem;
    max-height: 400px;
    overflow-y: auto;
  }
  .list::-webkit-scrollbar {
    background: white;
    width: 5px;
  }
  .list::-webkit-scrollbar-thumb {
    background: #252525;
  }
</style>

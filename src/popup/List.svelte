<script lang="ts">
  import Item from "./Item.svelte";

  export let list: ListItem[] = [];

  let active = "";
</script>

<div class="list">
  {#each list.sort((a, b) => b.created_at - a.created_at) as item}
    <Item {item} bind:active />
  {/each}
</div>

<style>
  .list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-top: 0.5rem;
  }
</style>

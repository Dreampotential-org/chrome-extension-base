<script lang="ts">
  import { bg } from "./helpers/main";

  export let item: { id: string; name: string };
  export let active = "";
  export let uploadProgress: number = undefined;

  let editable = false;
  const max_length_name = 26;

  $: expand = active === item.id;

  function splitName(name: string) {
    const min = Math.min(max_length_name, name.length);
    const a = name.slice(0, min / 2);
    const b = name.slice(Math.floor(-min / 2));
    return `${a}...${b}`;
  }

  function onKeyup(event: KeyboardEvent) {
    const element = event.target as HTMLInputElement;
    console.log(element.value);
    item.name = element.value;
    bg.execCommand("RENAME_ITEM", { id: item.id, name: item.name });
  }

  function deleteItem() {
    const id = item.id;
    bg.execCommand("DELETE_ITEM", { id });
  }

  let is_dbl_click_timeout = -1;

  function dblclick(event: MouseEvent) {
    clearTimeout(is_dbl_click_timeout);
    const element = event.target as HTMLInputElement;
    editable = true;
    element.setSelectionRange(0, 0);
  }

  function click(event: MouseEvent) {
    clearTimeout(is_dbl_click_timeout);
    is_dbl_click_timeout = setTimeout(() => {
      if (expand) {
        if (!editable) active = "";
      } else active = item.id;
    }, 100);
  }

  function upload() {
    bg.execCommandAsync("UPLOAD_ITEM", { id: item.id }, (url) => null);
  }

  function download() {
    bg.execCommand("DOWNLOAD_ITEM", { id: item.id });
  }

  function play() {
    bg.execCommand("PLAY_ITEM", { id: item.id });
  }

  async function copyUrl() {
    bg.execCommandAsync("COPY_URL", { id: item.id }, (url) => {
      navigator.clipboard.writeText(url);
    });
  }

  $: uploaded = uploadProgress === 100;
</script>

<div class="item" style="--progress: {uploadProgress};">
  <div class="item-top" class:uploaded>
    <input
      type="text"
      value={item.name.length > max_length_name ? splitName(item.name) : item.name}
      on:keyup={onKeyup}
      style="user-selcet: none;{editable ? 'font-style: italic;' : ''}"
      spellcheck="false"
      readonly={!editable}
      on:dblclick={dblclick}
      on:pointerup={click}
      on:blur={() => (editable = false)}
      title="Double click to rename: {item.name}"
    />
    <button on:click={play} style={expand ? "opacity: 0;" : ""} title="Play">
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#ffffff">
        <path d="M0 0h24v24H0z" fill="none" /><path d="M8 5v14l11-7z" />
      </svg>
    </button>
    <button on:click={click} title={expand ? "Expand" : "Collapse"}>
      {#if expand}
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#ffffff"
          ><path d="M0 0h24v24H0z" fill="none" /><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#ffffff"
          ><path d="M0 0h24v24H0z" fill="none" /><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      {/if}
    </button>
  </div>
  {#if expand}
    <div class="expand">
      <button on:click={play} title="play">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#ffffff">
          <path d="M0 0h24v24H0z" fill="none" /><path d="M8 5v14l11-7z" />
        </svg>
      </button>
      {#if uploaded}
        <button on:click={copyUrl} title="copy url to clipboard">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#ffffff">
            <path d="M0 0h24v24H0z" fill="none" /><path
              d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
            />
          </svg>
        </button>
      {:else if !Boolean(uploadProgress)}
        <button on:click={upload} title="upload">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff">
            <path d="M0 0h24v24H0z" fill="none" /><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
          </svg>
        </button>
      {/if}
      <button on:click={download} title="download">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#ffffff">
          <path d="M0 0h24v24H0z" fill="none" /><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
        </svg>
      </button>
      <button on:click={deleteItem} title="delete">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#ffffff">
          <path d="M0 0h24v24H0z" fill="none" /><path d="M0 0h24v24H0V0z" fill="none" /><path
            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"
          />
        </svg>
      </button>
    </div>
  {/if}
</div>

<style>
  .item-top {
    display: flex;
    background: linear-gradient(to right, #ffffff33 calc(1% * var(--progress)), #ffffff03 calc(1% * var(--progress)));
  }
  input {
    flex-grow: 1;
    background: transparent;
    color: white;
    padding: 0.5rem 0.25rem;
    font-size: 1.1rem;
    cursor: pointer;
    border: none;
    outline: none;
    padding-left: 0.5rem;
  }
  .expand {
    display: flex;
    justify-content: flex-end;
  }
  button {
    background: transparent;
    border: none;
    outline: none;
    color: white;
    cursor: pointer;
  }
  .uploaded {
    background: #ffffff03;
  }
</style>

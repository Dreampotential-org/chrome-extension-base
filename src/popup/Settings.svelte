<script lang="ts">
  import { bg } from "./helpers/main";

  let settings = bg.execCommand("GET_SETTINGS") as Settings;

  let diskQuote = settings.diskQuote / 1024 ** 3;
  let videoWidth = `${settings.videoWidth}` || "default";

  const videoWidthOptions = ["default", "640", "1280", "1920", "2560"];

  function saveAndReload() {
    bg.execCommand("SET_SETTINGS", {
      ...settings,
      diskQuote: diskQuote * 1024 ** 3,
      videoWidth: videoWidth === "default" ? 0 : parseInt(videoWidth),
    });
    bg.location.reload();
    window.close();
  }
</script>

<div class="settings">
  <h2>Disk Quote (GB)</h2>
  <input type="number" min={5} max={200} bind:value={diskQuote} />

  <h2>Video Width (px)</h2>
  <select bind:value={videoWidth}>
    {#each videoWidthOptions as option}
      <option value={option}>{option}</option>
    {/each}
  </select>

  <button on:click={saveAndReload}>Save and Reload</button>
</div>

<style>
  input,
  select {
    color: white;
    background: #ffffff55;
    outline: none;
    border: none;
    width: 100%;
    padding: 0.5rem;
    font-weight: bold;
    font-size: 1.2rem;
  }

  option {
    background: #333333;
    color: text;
  }

  button {
    background: #ffffff44;
    color: white;
    font-size: 1.1rem;
    border: none;
    width: 100%;
    padding: 0.5rem;
    cursor: pointer;
    margin-top: 2rem;
  }
</style>

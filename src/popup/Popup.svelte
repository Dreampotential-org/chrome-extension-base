<script lang="ts">
	import Auth from './auth/Auth.svelte';
  import { onMount } from "svelte";
  import { bg } from "./helpers/main";
  import List from "./List.svelte";
  import Settings from "./Settings.svelte";


  let status = bg.execCommand("GET_STATUS") || "idle";
  let list: ListItem[] = bg.execCommand("GET_LIST");
  let mic = bg.execCommand("GET_MUTE") || false;
  let settings = false;
  let userAuthenticated = false;
  let uploadProgress = bg.execCommand("GET_UPLOAD_PROGRESS") as UploadStatus;

  bg.onmessage = (message: MessageEvent) => {
    bg.log("message received:", message);
  };

  setInterval(() => {
    status = bg.execCommand("GET_STATUS");
    list = bg.execCommand("GET_LIST");
    uploadProgress = bg.execCommand("GET_UPLOAD_PROGRESS");
  }, 500);

  async function startRecording() {
    bg.execCommand("START_REC", { audio: !!mic });
  }
  async function stopRecording() {
    bg.execCommand("STOP_REC");
  }

  function logOut() {
    localStorage.removeItem('userToken');
    userAuthenticated = false
  }

  $: if (mic) {
    bg.execCommand("UNMUTE");
  } else {
    bg.execCommand("MUTE");
  }

  onMount(async () => {
    const cam = await navigator.permissions.query({ name: "camera" } as any);
    const mic = await navigator.permissions.query({
      name: "microphone",
    } as any);

   /* localStorage.removeItem('userToken')*/
    /*console.log('Extension mounted', localStorage.getItem('userToken'))*/

    if (localStorage.getItem('userToken') != null) {
      userAuthenticated = true
    }

    if (cam.state !== "granted" || mic.state !== "granted") {
      window["chrome"].tabs.create({
        url: "permission.html",
      });
    }
  });
</script>
<section>
  {#if !userAuthenticated}
   <Auth bind:authenticated={userAuthenticated} />
  {:else}
  <main>
    <div class="logout-section">
      <button class="logout-button" on:click={() => logOut()}>
        <svg class="logout-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M160 416H96c-17.67 0-32-14.33-32-32V128c0-17.67 14.33-32 32-32h64c17.67 0 32-14.33 32-32S177.7 32 160 32H96C42.98 32 0 74.98 0 128v256c0 53.02 42.98 96 96 96h64c17.67 0 32-14.33 32-32S177.7 416 160 416zM502.6 233.4l-128-128c-12.51-12.51-32.76-12.49-45.25 0c-12.5 12.5-12.5 32.75 0 45.25L402.8 224H192C174.3 224 160 238.3 160 256s14.31 32 32 32h210.8l-73.38 73.38c-12.5 12.5-12.5 32.75 0 45.25s32.75 12.5 45.25 0l128-128C515.1 266.1 515.1 245.9 502.6 233.4z"/></svg>
      </button>
   
    </div>
    <div class="buttons">
      {#if status === "idle"}
        <button on:click={startRecording}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#ffffff"
            ><path d="M24 24H0V0h24v24z" fill="none" /><circle cx="12" cy="12" r="8" />
          </svg>
        </button>
      {:else if status === "recording"}
        <button on:click={stopRecording}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#ffffff">
            <path d="M0 0h24v24H0z" fill="none" /><path d="M6 6h12v12H6z" />
          </svg>
        </button>
      {/if}
  
      <button on:click={() => status === "idle" && (mic = !mic)}>
        {#if mic}
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#ffffff"
            ><path d="M0 0h24v24H0z" fill="none" /><path
              d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"
            />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#ffffff">
            <path d="M0 0h24v24H0zm0 0h24v24H0z" fill="none" /><path
              d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"
            />
          </svg>
        {/if}
      </button>
      <button on:click={() => (settings = true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          enable-background="new 0 0 24 24"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          fill="#ffffff"
        >
          <g
            ><path d="M0,0h24v24H0V0z" fill="none" /><path
              d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
            />
          </g>
        </svg>
      </button>
    </div>
  
      {#if settings}
        <Settings />
      {:else}
        <List {list} {uploadProgress} />
      {/if}
    
  </main>
  {/if}
</section>


<style>
  main {
    min-width: 300px;
    height: max-content;
    min-height: 300px;
    background: #333;
    color: white;
    display: flex;
    flex-direction: column;
    padding: 0 1rem 1rem;
    overflow: hidden;
  }
  .buttons {
    display: flex;
    gap: 0.1rem;
  }
  button {
    background: #ffffff44;
    color: white;
    font-size: 1.1rem;
    border: none;
    width: 100%;
    padding: 0.5rem;
    cursor: pointer;
  }
  svg {
    width: 2rem;
  }

  .logout-section{
    display: flex;
    margin-top: .4rem;
  }

  .logout-section .logout-button{
    background: transparent;
    border: 1px solid transparent;
    margin-left: auto;
    width: fit-content;
    width: -moz-fit-content;
  }

  .logout-section .logout-icon{
    width: 17px;
    height: 17px;
    filter: invert(100%) sepia(100%) saturate(1%) hue-rotate(118deg) brightness(103%) contrast(101%);
    transition: ease-in-out .2s;
  }

  .logout-section .logout-icon:hover{
    cursor: pointer;
    opacity: .6;
  }
</style>

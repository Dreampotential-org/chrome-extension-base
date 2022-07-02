<script lang="ts">
import Register from './Register.svelte';
import Login from "./Login.svelte";
export let authenticated:boolean = false

let baseUrl:string = "https://api.dreampotential.org/s3_uploader/user";
let currentScreen:string = "login"

$: if (currentScreen) {
    console.log('Current screen:', currentScreen)
}

$: if (authenticated) {
    console.log('Authenticated:', authenticated)
}
</script>

<main>
    {#if currentScreen === "login"}
        <Login bind:baseUrl={baseUrl} bind:currentScreen={currentScreen} bind:authenticated={authenticated}/>  
    {:else}
        <Register bind:baseUrl={baseUrl} bind:authenticated={authenticated}/>
    {/if}

</main>
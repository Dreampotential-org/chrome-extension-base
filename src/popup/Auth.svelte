<script lang="ts">
    import { email, login, user } from "./stores/main.store";

    let pending = false;
    let password;

    async function submit() {
        pending = true;
        const res = await login({ email: $email, password });
        console.log(res);
        password = "";
        pending = false;
    }
</script>

{#if $user}
    <slot />
{:else}
    <h3>Login Dream Potential</h3>
    <form on:submit|preventDefault={submit}>
        <label for="email">
            Email:
            <input type="text" required bind:value={$email} />
        </label>

        <label for="password">
            Password:
            <input type="password" required bind:value={password} />
        </label>

        <button type="submit" disabled={pending}>
            {#if pending}
                ...
            {:else}
                Login
            {/if}
        </button>
    </form>
{/if}

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    label {
        font-size: 0.8rem;
        color: #888;
        user-select: none;
    }
    input {
        width: 100%;
        margin-top: 0.3rem;
        padding: 0.5rem;
        background: #444;
        color: #ddd;
        outline: none;
        border: none;
        font-size: 1.2rem;
        border-radius: 3px;
    }
    button[type="submit"] {
        width: 100%;
        margin: 0.5rem 0;
        font-size: 1.2rem;
        background: #4a4a4a;
        padding: 0.5rem;
        outline: none;
        border: none;
        color: white;
        cursor: pointer;
        border-radius: 3px;
    }
</style>

<script lang="ts">
    import { onMount } from 'svelte';
    export let data;

    onMount(async () => {
        await fetch("/logout", {method: "POST"});
    })

    $: ({ isLoggedIn } = data);
</script>

<h1>Logout</h1>
{#if isLoggedIn}
<p>Logging out...</p>
{:else}
<p>You have been logged out</p>
{/if}
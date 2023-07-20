<script>
  import "../app.postcss";
  import Header from "./Header.svelte";
  import "./styles.css";

  // Your selected Skeleton theme:
  import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
  
  // This contains the bulk of Skeletons required styles:
  import '@skeletonlabs/skeleton/styles/skeleton.css';
  
  // Finally, your application's global stylesheet (sometimes labeled 'app.css')
  import '../app.postcss';

  import '@skeletonlabs/skeleton/themes/theme-skeleton.css';

  import { autoModeWatcher } from '@skeletonlabs/skeleton';

  export let data;

  $: ({ loginUrl, isLoggedIn } = data);
</script>

<svelte:head>{@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}</svelte:head>
<div class="app">
  <Header />

  {#if isLoggedIn}
    Logged in!
    <form method="POST" action="/logout">
      <button class="btn variant-filled" type="submit">Logout</button>
    </form>
  {:else}
    <a href={loginUrl}>Login with Github</a>
  {/if}

  <main>
    <slot />
  </main>

  <footer>
    <p>
      visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit
    </p>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    box-sizing: border-box;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
  }

  footer a {
    font-weight: bold;
  }

  @media (min-width: 480px) {
    footer {
      padding: 12px 0;
    }
  }
</style>

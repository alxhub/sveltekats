<script lang="ts">
import type { DiscussionCommentReply } from '../../../lib/types';

let replies: Promise<DiscussionCommentReply[]>|null = null;
export let comment: string;

async function loadReplies(): Promise<DiscussionCommentReply[]> {
  return await (await fetch(`/api/replies/${comment}`)).json();
}
</script>

{#if replies === null}
  <button on:click={() => replies = loadReplies()}>Load Replies</button>
{:else}
  <ul>
    {#await replies}
      <p>Loading...</p>
    {:then replies}
      {#if replies.length > 0}
        {#each replies as reply}
        <li>
          {reply.author}
          {reply.createdAt}
          {@html reply.bodyHTML}
        </li>
        {/each}
      {:else}
        <p>(there are no replies)</p>
      {/if}
    {:catch}
      <p>An error occurred while fetching replies.</p>
    {/await}
  </ul>
{/if}
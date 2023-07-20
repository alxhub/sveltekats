<script lang="ts">
import type { DiscussionCommentReply } from '../../../lib/types';

let replies: Promise<DiscussionCommentReply[]>|null = null;
export let comment: string;

async function loadReplies(): Promise<DiscussionCommentReply[]> {
  return await (await fetch(`/api/replies/${comment}`)).json();
}
</script>

{#if replies === null}
  <button class="btn" on:click={() => replies = loadReplies()}>Load Replies</button>
{:else}
  <ul class="list">
    {#await replies}
      <div class="p-4 space-y-4">
        <div class="placeholder animate-pulse"></div>
        <div class="placeholder animate-pulse"></div>
        <div class="placeholder animate-pulse"></div>
      </div>
    {:then replies}
      {#if replies.length > 0}
        {#each replies as reply}
        <li class="p-y-1">
          <p>
            {reply.author}
            {reply.createdAt}
          </p>
          <p>
            {@html reply.bodyHTML}
          </p>
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
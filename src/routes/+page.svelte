<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>Discussions</title>
	<meta name="description" content="WPFS 2023 Discussions" />
</svelte:head>

<section>
	<h1>Discussions</h1>
	<ol class="discussions">
		{#each data.discussions as discussion (discussion.number)}
			<li class="card p-4 m-4">
				<a class="card-header" href="/discussions/{discussion.number}"><h2>{discussion.title}</h2></a>
				<p class="card-footer">by {discussion.author} on {discussion.createdAt}</p>
			</li>
		{/each}
	</ol>
</section>

<style>
	.discussions {
		margin: 0;
		padding: 0;
	}

	.discussions li {
		display: block;
	}

	.discussions li:not(:first-child) {
		border-top: 1px solid var(--color-bg-0);
	}
</style>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>
<script lang="ts">
	export let data;

	$: ({ details } = data);
</script>

<div class="text-column">
	<h1>Repository: {details.name}</h1>
	<p>{details.description}</p>

	<p>Current as of <strong>{new Date()}</strong></p>
</div>

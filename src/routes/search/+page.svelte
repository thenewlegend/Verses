<script lang="ts">
	import SearchInput from '$lib/components/SearchInput.svelte';
	import VerseCard from '$lib/components/VerseCard.svelte';
	import { goto } from '$app/navigation';
	import { Search, BookOpen } from '@lucide/svelte';

	let { data } = $props();
	let { streamed } = $derived(data);
	let searchValue = $state('');

	$effect(() => {
		searchValue = data.query || '';
	});

	function handleSearch(value: string) {
		if (value.trim()) {
			goto(`/search?q=${encodeURIComponent(value.trim())}`, { keepFocus: true });
		} else {
			goto('/search', { keepFocus: true });
		}
	}
</script>

<svelte:head>
	<title>Search{data.query ? ` — "${data.query}"` : ''} — Verses</title>
	<meta name="description" content="Search through Bible verses by text or reference." />
</svelte:head>

<div class="space-y-6 py-2">
	<div>
		<h1 class="text-2xl font-bold text-surface-900 ">Search Verses</h1>
		<p class="mt-1 text-sm text-surface-500">Search by verse text or reference</p>
	</div>

	<SearchInput bind:value={searchValue} oninput={handleSearch} />

	{#if data.query}
		{#await streamed.results}
			<div class="mt-4 h-4 w-32 skeleton"></div>
		{:then results}
			<p class="text-sm text-surface-500">
				{results.totalCount} result{results.totalCount !== 1 ? 's' : ''} for "<span class="font-medium text-surface-700 ">{data.query}</span>"
			</p>
		{/await}
	{/if}

	{#if data.query}
		{#await streamed.results}
			<div class="space-y-4">
				{#each Array(5) as _}
					<SkeletonCard compact />
				{/each}
			</div>
		{:then results}
			{#if results.verses.length > 0}
				<div class="space-y-4">
					{#each results.verses as verse}
						<VerseCard
							id={verse.id}
							verse={verse.verse}
							reference={verse.reference}
							classNumber={verse.class_number}
							compact
						/>
					{/each}
				</div>
			{:else}
				<div class="rounded-2xl bg-surface-100 p-12 text-center ">
					<Search size={40} class="mx-auto mb-3 text-surface-400" />
					<p class="text-lg font-medium text-surface-600 ">No results found</p>
					<p class="mt-1 text-sm text-surface-400">Try different keywords or check your spelling.</p>
				</div>
			{/if}
		{/await}
	{:else}
		<div class="rounded-2xl bg-surface-100 p-12 text-center ">
			<BookOpen size={40} class="mx-auto mb-3 text-surface-300" />
			<p class="text-sm text-surface-400">Type to search through all published verses.</p>
		</div>
	{/if}
</div>

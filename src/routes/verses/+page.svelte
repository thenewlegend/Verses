<script lang="ts">
	import VerseCard from '$lib/components/VerseCard.svelte';
	import SkeletonCard from '$lib/components/SkeletonCard.svelte';
	import { BookOpen, Loader2 } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	let verses = $state<any[]>([]);
	let currentPage = $state(1);
	let loading = $state(false);
	let hasMore = $derived(verses.length < data.totalCount);

	let observerTarget: HTMLElement | null = $state(null);

	async function loadMore() {
		if (loading || !hasMore) return;

		loading = true;
		const nextPage = currentPage + 1;
		const url = new URL('/api/verses', window.location.origin);
		url.searchParams.set('page', nextPage.toString());
		if (data.activeClass) {
			url.searchParams.set('class', data.activeClass.toString());
		}

		try {
			const response = await fetch(url.toString());

			if (response.ok) {
				const result = await response.json();
				verses = [...verses, ...result.verses];
				currentPage = result.currentPage;
			}
		} catch (e) {
			console.error('Failed to load more verses:', e);
		} finally {
			loading = false;
		}
	}

	// Re-initialize when data changes (e.g. filter change)
	$effect(() => {
		verses = [...data.verses];
		currentPage = data.currentPage;
	});

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !loading) {
					loadMore();
				}
			},
			{ threshold: 0.1 }
		);

		if (observerTarget) observer.observe(observerTarget);

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Browse Verses — Bible Verse App</title>
	<meta name="description" content="Browse all published Bible verses. Filter by class number." />
</svelte:head>

<div class="space-y-6 py-2">
	<div>
		<h1 class="text-2xl font-bold text-surface-900 dark:text-surface-100">Browse Verses</h1>
		<p class="mt-1 text-sm text-surface-500">{data.totalCount} verses available</p>
	</div>

	<!-- Class filter chips -->
	{#if data.classNumbers.length > 0}
		<div class="flex flex-wrap gap-2">
			<a
				href="/verses"
				class="rounded-xl px-3.5 py-2 text-sm font-medium transition-all active:scale-95 {data.activeClass === null
					? 'bg-primary-600 text-white shadow-sm'
					: 'border border-surface-200 bg-white text-surface-600 hover:border-primary-300 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300'}"
			>
				All
			</a>
			{#each data.classNumbers as cn}
				<a
					href="/verses?class={cn}"
					class="rounded-xl px-3.5 py-2 text-sm font-medium transition-all active:scale-95 {data.activeClass === cn
						? 'bg-primary-600 text-white shadow-sm'
						: 'border border-surface-200 bg-white text-surface-600 hover:border-primary-300 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300'}"
				>
					Class {cn}
				</a>
			{/each}
		</div>
	{/if}

	<!-- Verses list -->
	{#if verses.length > 0}
		<div class="space-y-4">
			{#each verses as verse (verse.id)}
				<VerseCard
					id={verse.id}
					verse={verse.verse}
					reference={verse.reference}
					classNumber={verse.class_number}
					compact
				/>
			{/each}
		</div>

		<!-- Infinite Scroll Trigger -->
		{#if hasMore}
			<div bind:this={observerTarget} class="flex justify-center py-8">
				{#if loading}
					<Loader2 class="h-6 w-6 animate-spin text-primary-600" />
				{:else}
					<div class="h-1 w-full"></div>
				{/if}
			</div>
		{/if}
	{:else}
		<div class="rounded-2xl bg-surface-100 p-12 text-center dark:bg-surface-900">
			<BookOpen size={40} class="mx-auto mb-3 text-surface-400" />
			<p class="text-lg font-medium text-surface-600 dark:text-surface-400">No verses found</p>
			<p class="mt-1 text-sm text-surface-400">
				{data.activeClass ? 'Try a different class filter.' : 'Verses will appear here once added.'}
			</p>
		</div>
	{/if}
</div>

<script lang="ts">
	import VerseCard from '$lib/components/VerseCard.svelte';
	import SkeletonCard from '$lib/components/SkeletonCard.svelte';
	import { BookOpen, Loader2, RefreshCw } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { triggerHaptic } from '$lib/utils/haptics';

	let { data } = $props();
	let { streamed } = $derived(data);

	let verses = $state<any[]>([]);
	let totalCount = $state(0);
	let classNumbers = $state<number[]>([]);
	let currentPage = $state(1);
	let loading = $state(false);
	let isSyncing = $state(false);
	let hasMore = $derived(verses.length < totalCount);

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

	// Wait for streamed data
	$effect(() => {
		streamed.verses.then(v => verses = v);
		streamed.totalCount.then(c => totalCount = c);
		streamed.classNumbers.then(cn => classNumbers = cn);
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
	async function handleSync() {
		if (isSyncing) return;
		isSyncing = true;
		triggerHaptic('strong');
		
		try {
			await invalidateAll();
			// Small delay to make the animation feel substantial
			await new Promise(resolve => setTimeout(resolve, 600));
			triggerHaptic('medium');
		} finally {
			isSyncing = false;
		}
	}
</script>

<svelte:head>
	<title>Browse Verses — Verses</title>
	<meta name="description" content="Browse all published Bible verses. Filter by class number." />
</svelte:head>

<div class="space-y-6 py-2">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-surface-900 ">Browse Verses</h1>
			{#await streamed.totalCount}
				<div class="mt-1 h-4 w-24 skeleton"></div>
			{:then count}
				<p class="mt-1 text-sm text-surface-500">{count} verses available</p>
			{/await}
		</div>
		<button 
			onclick={handleSync}
			disabled={isSyncing}
			class="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-200 bg-white text-surface-500 transition-all hover:border-primary-300 hover:text-primary-600 active:scale-90 disabled:opacity-50"
			aria-label="Sync data"
		>
			<RefreshCw size={20} class={isSyncing ? 'animate-spin' : ''} />
		</button>
	</div>

	<!-- Class filter chips -->
	<div class="flex flex-wrap gap-2">
		<a
			href="/verses"
			class="rounded-xl px-3.5 py-2 text-sm font-medium transition-all active:scale-95 {data.activeClass === null
				? 'bg-primary-600 text-white shadow-sm'
				: 'border border-surface-200 bg-white text-surface-600 hover:border-primary-300   '}"
		>
			All
		</a>
		{#await streamed.classNumbers}
			{#each Array(4) as _}
				<div class="h-9 w-20 skeleton"></div>
			{/each}
		{:then numbers}
			{#each numbers as cn}
				<a
					href="/verses?class={cn}"
					class="rounded-xl px-3.5 py-2 text-sm font-medium transition-all active:scale-95 {data.activeClass === cn
						? 'bg-primary-600 text-white shadow-sm'
						: 'border border-surface-200 bg-white text-surface-600 hover:border-primary-300   '}"
				>
					Class {cn}
				</a>
			{/each}
		{/await}
	</div>

	<!-- Verses list -->
	{#await streamed.verses}
		<div class="space-y-4">
			{#each Array(5) as _}
				<SkeletonCard compact />
			{/each}
		</div>
	{:then versesList}
		{#if versesList.length > 0}
			<div class="space-y-4">
				{#each versesList as verse (verse.id)}
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
			<div class="rounded-2xl bg-surface-100 p-12 text-center ">
				<BookOpen size={40} class="mx-auto mb-3 text-surface-400" />
				<p class="text-lg font-medium text-surface-600 ">No verses found</p>
				<p class="mt-1 text-sm text-surface-400">
					{data.activeClass ? 'Try a different class filter.' : 'Verses will appear here once added.'}
				</p>
			</div>
		{/if}
	{/await}
</div>

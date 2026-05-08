<script lang="ts">
	import VerseCard from '$lib/components/VerseCard.svelte';
	import SkeletonCard from '$lib/components/SkeletonCard.svelte';
	import { recentlyViewed } from '$lib/stores/recentlyViewed';
	import { browser } from '$app/environment';
	import { BookOpen, Sparkles, Clock, ArrowRight, RefreshCw } from '@lucide/svelte';
	import { triggerHaptic } from '$lib/utils/haptics';

	let { data } = $props();
	let { streamed } = $derived(data);

	// Verse of the day history in localStorage
	let vodHistory: Array<{ id: string; verse: string; reference: string; classNumber: number; viewedAt: string }> = $state([]);

	if (browser) {
		vodHistory = JSON.parse(localStorage.getItem('vod-history') || '[]');
	}

	$effect(() => {
		streamed.verseOfDay.then(v => {
			if (browser && v) {
				const existing = vodHistory.find((h) => h.id === v.id);
				if (!existing) {
					vodHistory = [
						{ id: v.id, verse: v.verse, reference: v.reference, classNumber: v.class_number, viewedAt: new Date().toISOString() },
						...vodHistory
					].slice(0, 20);
					localStorage.setItem('vod-history', JSON.stringify(vodHistory));
				}
			}
		});
	});

	function clearHistory() {
		vodHistory = [];
		if (browser) {
			localStorage.removeItem('vod-history');
		}
	}
	let isRefreshing = $state(false);

	async function refreshVerse() {
		if (isRefreshing) return;
		triggerHaptic('strong');
		isRefreshing = true;
		
		const { invalidateAll, goto } = await import('$app/navigation');
		const currentUrl = new URL(window.location.href);
		if (data.verseOfDay) {
			currentUrl.searchParams.set('exclude', data.verseOfDay.id);
		}
		
		await goto(currentUrl.pathname + currentUrl.search, { 
			invalidateAll: true,
			noScroll: true,
			keepFocus: true
		});
		
		isRefreshing = false;
	}
</script>

<svelte:head>
	<title>Verses — Your Daily Scripture</title>
	<meta name="description" content="Discover a new Bible verse every visit. Browse, search, and save your favorite scriptures." />
</svelte:head>

<div class="space-y-8 py-2">
	<!-- Hero: Verse of the Day -->
	{#await streamed.verseOfDay}
		<div class="h-[280px] w-full skeleton rounded-2xl"></div>
	{:then verse}
		{#if verse}
			<section class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-6 text-white shadow-elevated transition-all">
				<!-- Loading overlay -->
				{#if isRefreshing}
					<div class="absolute inset-0 z-20 flex items-center justify-center bg-primary-900/60 backdrop-blur-[2px]">
						<RefreshCw size={32} class="animate-spin text-white/80" />
					</div>
				{/if}

				<!-- Decorative elements -->
				<div class="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-white/5"></div>
				<div class="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/5"></div>

				<div class="relative">
					<div class="mb-4 flex items-center gap-2">
						<Sparkles size={16} class="text-primary-200" />
						<span class="text-xs font-semibold tracking-wider text-primary-200 uppercase">Random Verse</span>
					</div>

					<blockquote class="verse-text mb-4 text-xl leading-relaxed text-white/95">
						"{verse.verse}"
					</blockquote>

					<div class="flex items-center justify-between">
						<p class="text-sm font-semibold text-primary-200">
							— {verse.reference}
						</p>
						<span class="rounded-lg bg-white/10 px-2 py-1 text-xs font-medium text-primary-200">
							Class {verse.class_number}
						</span>
					</div>

					<div class="mt-4 flex gap-2">
						<a
							href="/verses/{verse.id}"
							onclick={() => triggerHaptic('strong')}
							class="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25 active:scale-95"
						>
							Read more <ArrowRight size={14} />
						</a>
						<button
							onclick={refreshVerse}
							disabled={isRefreshing}
							class="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20 disabled:opacity-50 active:scale-95"
						>
							<RefreshCw size={14} class={isRefreshing ? 'animate-spin' : ''} /> New verse
						</button>
					</div>
				</div>
			</section>
		{:else}
			<div class="rounded-2xl bg-surface-100 p-8 text-center ">
				<BookOpen size={32} class="mx-auto mb-3 text-surface-400" />
				<p class="text-surface-500">No verses available yet.</p>
			</div>
		{/if}
	{/await}

	<!-- Quick Actions -->
	<section class="grid grid-cols-2 gap-3">
		<a
			href="/verses"
			onclick={() => triggerHaptic('strong')}
			class="flex items-center gap-3 rounded-2xl border border-surface-200 bg-white p-4 transition-all hover:shadow-[var(--shadow-card-hover)] active:scale-[0.98]  "
		>
			<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600  ">
				<BookOpen size={20} />
			</div>
			<div>
				<p class="text-sm font-semibold text-surface-900 ">Browse All</p>
				{#await streamed.totalCount}
					<div class="h-3 w-12 skeleton mt-1"></div>
				{:then count}
					<p class="text-xs text-surface-500">{count} verses</p>
				{/await}
			</div>
		</a>
		<a
			href="/search"
			onclick={() => triggerHaptic('strong')}
			class="flex items-center gap-3 rounded-2xl border border-surface-200 bg-white p-4 transition-all hover:shadow-[var(--shadow-card-hover)] active:scale-[0.98]  "
		>
			<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10 text-accent-500">
				<Sparkles size={20} />
			</div>
			<div>
				<p class="text-sm font-semibold text-surface-900 ">Search</p>
				<p class="text-xs text-surface-500">Find a verse</p>
			</div>
		</a>
	</section>

	<!-- Class quick filters -->
	<section>
		<h2 class="mb-3 text-sm font-semibold text-surface-500 uppercase tracking-wider ">Browse by Class</h2>
		<div class="flex flex-wrap gap-2">
			{#await streamed.classNumbers}
				{#each Array(4) as _}
					<div class="h-10 w-24 skeleton"></div>
				{/each}
			{:then numbers}
				{#each numbers as cn}
					<a
						href="/class/{cn}"
						onclick={() => triggerHaptic('strong')}
						class="rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-surface-700 transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 active:scale-95      "
					>
						Class {cn}
					</a>
				{/each}
			{/await}
		</div>
	</section>

	<!-- Verse history -->
	{#if vodHistory.length > 0}
		<section>
			<div class="mb-3 flex items-center justify-between">
				<h2 class="flex items-center gap-2 text-sm font-semibold text-surface-500 uppercase tracking-wider ">
					<Clock size={14} />
					Verse History
				</h2>
				<button
					onclick={() => { triggerHaptic('strong'); clearHistory(); }}
					class="text-xs font-medium text-surface-400 transition-colors hover:text-red-500"
				>
					Clear
				</button>
			</div>
			<div class="space-y-3">
				{#each vodHistory.slice(0, 5) as item}
					<a
						href="/verses/{item.id}"
						onclick={() => triggerHaptic('strong')}
						class="block rounded-xl border border-surface-200 bg-white p-4 transition-all hover:shadow-[var(--shadow-card)] active:scale-[0.98]  "
					>
						<p class="verse-text line-clamp-2 text-sm text-surface-700 ">
							"{item.verse}"
						</p>
						<p class="mt-2 text-xs font-semibold text-primary-600 ">— {item.reference}</p>
					</a>
				{/each}
			</div>
		</section>
	{/if}
</div>

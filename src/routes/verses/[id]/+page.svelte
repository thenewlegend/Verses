<script lang="ts">
	import { Heart, Copy, Share2, ArrowLeft } from '@lucide/svelte';
	import { favorites } from '$lib/stores/favorites';
	import { recentlyViewed } from '$lib/stores/recentlyViewed';
	import { copyToClipboard } from '$lib/utils/clipboard';
	import { shareVerse } from '$lib/utils/share';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let { data } = $props();
	let verse = $derived(data.verse);
	let isFav = $derived($favorites.includes(verse.id));

	onMount(() => {
		recentlyViewed.add(verse.id);
	});
</script>

<svelte:head>
	<title>{verse.reference} — Verses</title>
	<meta name="description" content={verse.verse.slice(0, 160)} />
</svelte:head>

<div class="py-2">
	<!-- Back button -->
	<a
		href="/verses"
		class="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-surface-500 transition-colors hover:text-surface-700  "
	>
		<ArrowLeft size={16} />
		Back to verses
	</a>

	<!-- Verse display -->
	<article class="overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-[var(--shadow-card)]  ">
		<!-- Gradient header -->
		<div class="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 px-6 py-8">
			<div class="mb-2 flex items-center gap-2">
				<span class="rounded-lg bg-white/15 px-2.5 py-1 text-xs font-semibold text-white/90">
					Class {verse.class_number}
				</span>
			</div>
			<h1 class="text-xl font-bold text-white">{verse.reference}</h1>
		</div>

		<!-- Verse body -->
		<div class="p-6">
			<blockquote class="verse-text text-xl leading-[1.9] text-surface-800 ">
				"{verse.verse}"
			</blockquote>

			<div class="mt-2 text-right">
				<span class="text-base font-semibold text-primary-600 ">— {verse.reference}</span>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex items-center justify-center gap-2 border-t border-surface-100 px-6 py-4 ">
			<button
				onclick={() => copyToClipboard(`"${verse.verse}" — ${verse.reference}`)}
				class="flex items-center gap-2 rounded-xl bg-surface-100 px-5 py-3 text-sm font-medium text-surface-700 transition-all hover:bg-surface-200 active:scale-95   "
			>
				<Copy size={16} />
				Copy
			</button>
			<button
				onclick={() => shareVerse(verse.verse, verse.reference)}
				class="flex items-center gap-2 rounded-xl bg-surface-100 px-5 py-3 text-sm font-medium text-surface-700 transition-all hover:bg-surface-200 active:scale-95   "
			>
				<Share2 size={16} />
				Share
			</button>
			<button
				onclick={() => favorites.toggle(verse.id)}
				class="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all active:scale-95 {isFav
					? 'bg-red-50 text-red-600 hover:bg-red-100   '
					: 'bg-surface-100 text-surface-700 hover:bg-surface-200   '}"
			>
				<Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
				{isFav ? 'Saved' : 'Save'}
			</button>
		</div>
	</article>

	<!-- Metadata -->
	<div class="mt-6 rounded-xl bg-surface-50 p-4 text-xs text-surface-400  ">
		<p>Added {new Date(verse.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
	</div>
</div>

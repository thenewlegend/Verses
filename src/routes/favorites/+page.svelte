<script lang="ts">
	import VerseCard from '$lib/components/VerseCard.svelte';
	import { favorites } from '$lib/stores/favorites';
	import { browser } from '$app/environment';
	import { Heart, Trash2 } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	let favIds = $derived($favorites);
	let verses: any[] = $state([]);
	let loading = $state(true);

	// Fetch verse details for favorited IDs
	async function loadFavorites() {
		if (!browser || favIds.length === 0) {
			verses = [];
			loading = false;
			return;
		}

		loading = true;
		const { supabase } = data;
		const { data: fetched } = await supabase
			.from('verses')
			.select('*')
			.in('id', favIds)
			.eq('is_published', true);

		// Preserve order from favorites list
		if (fetched) {
			verses = favIds
				.map((id) => fetched.find((v) => v.id === id))
				.filter(Boolean);
		}
		loading = false;
	}

	onMount(() => {
		loadFavorites();
	});

	// Reload when favorites change
	$effect(() => {
		if (browser) {
			loadFavorites();
		}
	});
</script>

<svelte:head>
	<title>Favorites — Bible Verse App</title>
	<meta name="description" content="Your saved favorite Bible verses." />
</svelte:head>

<div class="space-y-6 py-2">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-surface-900 dark:text-surface-100">Favorites</h1>
			<p class="mt-1 text-sm text-surface-500">{favIds.length} saved verse{favIds.length !== 1 ? 's' : ''}</p>
		</div>
		{#if favIds.length > 0}
			<button
				onclick={() => favorites.clear()}
				class="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
			>
				<Trash2 size={14} />
				Clear all
			</button>
		{/if}
	</div>

	{#if loading}
		<div class="space-y-4">
			{#each Array(3) as _}
				<div class="skeleton h-40 w-full rounded-2xl"></div>
			{/each}
		</div>
	{:else if verses.length > 0}
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
	{:else}
		<div class="rounded-2xl bg-surface-100 p-12 text-center dark:bg-surface-900">
			<Heart size={40} class="mx-auto mb-3 text-surface-300" />
			<p class="text-lg font-medium text-surface-600 dark:text-surface-400">No favorites yet</p>
			<p class="mt-1 text-sm text-surface-400">Tap the heart icon on any verse to save it here.</p>
			<a
				href="/verses"
				class="mt-4 inline-block rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
			>
				Browse Verses
			</a>
		</div>
	{/if}
</div>

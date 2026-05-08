<script lang="ts">
	import VerseCard from '$lib/components/VerseCard.svelte';
	import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight } from '@lucide/svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Class {data.classNumber} — Verses</title>
	<meta name="description" content="Browse Bible verses for Class {data.classNumber}." />
</svelte:head>

<div class="space-y-6 py-2">
	<div>
		<a
			href="/verses"
			class="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-surface-500 transition-colors hover:text-surface-700  "
		>
			<ArrowLeft size={16} />
			All verses
		</a>
		<h1 class="text-2xl font-bold text-surface-900 ">Class {data.classNumber}</h1>
		<p class="mt-1 text-sm text-surface-500">{data.totalCount} verse{data.totalCount !== 1 ? 's' : ''}</p>
	</div>

	{#if data.verses.length > 0}
		<div class="space-y-4">
			{#each data.verses as verse}
				<VerseCard
					id={verse.id}
					verse={verse.verse}
					reference={verse.reference}
					classNumber={verse.class_number}
					compact
				/>
			{/each}
		</div>

		{#if data.totalPages > 1}
			<nav class="flex items-center justify-center gap-2 pt-4" aria-label="Pagination">
				{#if data.currentPage > 1}
					<a
						href="/class/{data.classNumber}?page={data.currentPage - 1}"
						class="flex items-center gap-1 rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-surface-700 transition-all hover:bg-surface-50 active:scale-95   "
					>
						<ChevronLeft size={16} /> Prev
					</a>
				{/if}
				<span class="px-3 text-sm text-surface-500">{data.currentPage} / {data.totalPages}</span>
				{#if data.currentPage < data.totalPages}
					<a
						href="/class/{data.classNumber}?page={data.currentPage + 1}"
						class="flex items-center gap-1 rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-surface-700 transition-all hover:bg-surface-50 active:scale-95   "
					>
						Next <ChevronRight size={16} />
					</a>
				{/if}
			</nav>
		{/if}
	{:else}
		<div class="rounded-2xl bg-surface-100 p-12 text-center ">
			<BookOpen size={40} class="mx-auto mb-3 text-surface-400" />
			<p class="text-lg font-medium text-surface-600 ">No verses in this class</p>
		</div>
	{/if}
</div>

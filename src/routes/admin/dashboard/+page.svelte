<script lang="ts">
	import { BookOpen, Eye, EyeOff, Edit, Trash2, Plus, BarChart3 } from '@lucide/svelte';

	let { data } = $props();

	let stats = $derived([
		{ label: 'Total Verses', value: data.totalCount, icon: BookOpen, color: 'bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400' },
		{ label: 'Published', value: data.publishedCount, icon: Eye, color: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400' },
		{ label: 'Drafts', value: data.draftCount, icon: EyeOff, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' }
	]);
</script>

<svelte:head>
	<title>Dashboard — Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-bold text-surface-900 dark:text-surface-100">Dashboard</h1>
		<a
			href="/admin/verses/new"
			class="flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 active:scale-95"
		>
			<Plus size={16} /> Add Verse
		</a>
	</div>

	<!-- Stats grid -->
	<div class="grid grid-cols-3 gap-3">
		{#each stats as stat}
			<div class="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
				<div class="mb-2 flex h-10 w-10 items-center justify-center rounded-xl {stat.color}">
					<stat.icon size={20} />
				</div>
				<p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{stat.value}</p>
				<p class="text-xs text-surface-500">{stat.label}</p>
			</div>
		{/each}
	</div>

	<!-- Class breakdown -->
	{#if Object.keys(data.classBreakdown).length > 0}
		<section>
			<h2 class="mb-3 flex items-center gap-2 text-sm font-semibold text-surface-600 dark:text-surface-400">
				<BarChart3 size={16} />
				By Class
			</h2>
			<div class="grid grid-cols-2 gap-2">
				{#each Object.entries(data.classBreakdown).sort((a, b) => Number(a[0]) - Number(b[0])) as [classNum, count]}
					<div class="flex items-center justify-between rounded-xl border border-surface-200 bg-white px-4 py-3 dark:border-surface-800 dark:bg-surface-900">
						<span class="text-sm font-medium text-surface-700 dark:text-surface-300">Class {classNum}</span>
						<span class="rounded-lg bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">{count}</span>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Recent verses -->
	{#if data.recentVerses.length > 0}
		<section>
			<h2 class="mb-3 text-sm font-semibold text-surface-600 dark:text-surface-400">Recent Verses</h2>
			<div class="space-y-2">
				{#each data.recentVerses as verse}
					<div class="flex items-center gap-3 rounded-xl border border-surface-200 bg-white p-3 dark:border-surface-800 dark:bg-surface-900">
						<div class="flex-1 min-w-0">
							<p class="truncate text-sm font-medium text-surface-800 dark:text-surface-200">
								{verse.reference}
							</p>
							<p class="truncate text-xs text-surface-500">{verse.verse}</p>
						</div>
						<div class="flex items-center gap-1.5">
							{#if verse.is_published}
								<span class="rounded-md bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-400">Live</span>
							{:else}
								<span class="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">Draft</span>
							{/if}
							<a
								href="/admin/verses/{verse.id}/edit"
								class="rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600 dark:hover:bg-surface-800"
							>
								<Edit size={14} />
							</a>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>

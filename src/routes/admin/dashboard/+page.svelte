<script lang="ts">
	import { 
		BookOpen, Eye, EyeOff, Edit, Trash2, Plus, 
		BarChart3, Copy, Search, X, Filter 
	} from '@lucide/svelte';
	import { page } from '$app/state';

	let { data } = $props();

	let stats = $derived([
		{ 
			id: 'all',
			label: 'Total Verses', 
			value: data.totalCount, 
			icon: BookOpen, 
			color: 'bg-primary-100 text-primary-600  ',
			active: !data.activeStatus 
		},
		{ 
			id: 'published',
			label: 'Published', 
			value: data.publishedCount, 
			icon: Eye, 
			color: 'bg-green-100 text-green-600  ',
			active: data.activeStatus === 'published'
		},
		{ 
			id: 'draft',
			label: 'Drafts', 
			value: data.draftCount, 
			icon: EyeOff, 
			color: 'bg-amber-100 text-amber-600  ',
			active: data.activeStatus === 'draft'
		}
	]);

	function getStatusUrl(status: string | null) {
		const params = new URLSearchParams();
		if (status) params.set('status', status);
		if (data.searchQuery) params.set('q', data.searchQuery);
		const search = params.toString();
		return search ? `?${search}` : '/admin/dashboard';
	}
</script>

<svelte:head>
	<title>Dashboard — Admin</title>
</svelte:head>

<div class="space-y-6 pb-20">
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-bold text-surface-900 ">Manage Verses</h1>
		<a
			href="/admin/verses/new"
			class="flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 active:scale-95"
		>
			<Plus size={16} /> Add New
		</a>
	</div>

	<!-- Search Bar -->
	<form class="relative group">
		<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
			<Search size={18} class="text-surface-400 group-focus-within:text-primary-500 transition-colors" />
		</div>
		<input
			type="search"
			name="q"
			value={data.searchQuery || ''}
			placeholder="Search by text or reference..."
			class="w-full rounded-2xl border border-surface-200 bg-white py-3.5 pr-12 pl-12 text-sm text-surface-900 shadow-sm transition-all focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 focus:outline-none   "
		/>
		{#if data.searchQuery}
			<a 
				href={getStatusUrl(data.activeStatus)} 
				class="absolute inset-y-0 right-0 flex items-center pr-4 text-surface-400 hover:text-surface-600"
			>
				<X size={18} />
			</a>
		{/if}
	</form>

	<!-- Stats / Filters grid -->
	<div class="grid grid-cols-3 gap-3">
		{#each stats as stat}
			<a 
				href={getStatusUrl(stat.id === 'all' ? null : stat.id)}
				class="rounded-2xl border p-4 transition-all active:scale-[0.98] {stat.active 
					? 'border-primary-500 bg-primary-50/30  ring-1 ring-primary-500' 
					: 'border-surface-200 bg-white hover:border-surface-300  '}"
			>
				<div class="mb-2 flex h-10 w-10 items-center justify-center rounded-xl {stat.color}">
					<stat.icon size={20} />
				</div>
				<p class="text-2xl font-bold text-surface-900 ">{stat.value}</p>
				<p class="text-[10px] uppercase tracking-wider font-bold text-surface-500">{stat.label}</p>
			</a>
		{/each}
	</div>

	<!-- Main List -->
	<section>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-sm font-bold text-surface-600 ">
				{#if data.searchQuery}
					Results for "{data.searchQuery}"
				{:else if data.activeStatus}
					{data.activeStatus.charAt(0).toUpperCase() + data.activeStatus.slice(1)} Verses
				{:else}
					Recent Verses
				{/if}
			</h2>
			{#if data.activeStatus || data.searchQuery}
				<a href="/admin/dashboard" class="text-xs font-medium text-primary-600 hover:underline">Clear all</a>
			{/if}
		</div>

		<div class="space-y-3">
			{#each data.verses as verse (verse.id)}
				<div class="group relative flex flex-col gap-3 rounded-2xl border border-surface-200 bg-white p-4 shadow-sm transition-all hover:border-primary-200   ">
					<div class="flex items-start justify-between gap-4">
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2 mb-1">
								<span class="rounded-lg bg-surface-100 px-2 py-0.5 text-[10px] font-bold text-surface-600  ">
									Class {verse.class_number}
								</span>
								{#if verse.is_published}
									<span class="flex items-center gap-1 rounded-lg bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700  ">
										<div class="h-1 w-1 rounded-full bg-green-500 animate-pulse"></div>
										LIVE
									</span>
								{:else}
									<span class="flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700  ">
										DRAFT
									</span>
								{/if}
							</div>
							<p class="text-base font-bold text-surface-900  mb-1">
								{verse.reference}
							</p>
							<p class="line-clamp-2 text-sm text-surface-500 leading-relaxed">
								{verse.verse}
							</p>
						</div>
					</div>

					<div class="flex items-center justify-end gap-2 border-t border-surface-100 pt-3 ">
						<a
							href="/admin/verses/new?from={verse.id}"
							class="flex h-9 w-9 items-center justify-center rounded-xl text-surface-400 transition-colors hover:bg-primary-50 hover:text-primary-600 "
							title="Duplicate"
						>
							<Copy size={16} />
						</a>
						<a
							href="/admin/verses/{verse.id}/edit"
							class="flex h-9 items-center gap-2 rounded-xl bg-surface-100 px-4 text-sm font-bold text-surface-700 transition-colors hover:bg-primary-600 hover:text-white    "
						>
							<Edit size={16} />
							Edit
						</a>
					</div>
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-surface-200 py-16 text-center ">
					<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-50 ">
						<Filter size={32} class="text-surface-300" />
					</div>
					<h3 class="text-lg font-bold text-surface-900 ">No verses found</h3>
					<p class="mt-1 text-sm text-surface-500">Try adjusting your search or filters.</p>
					<a href="/admin/dashboard" class="mt-6 text-sm font-bold text-primary-600 hover:underline">Clear all filters</a>
				</div>
			{/each}
		</div>
	</section>

	<!-- Class breakdown -->
	{#if Object.keys(data.classBreakdown).length > 0}
		<section>
			<h2 class="mb-4 flex items-center gap-2 text-sm font-bold text-surface-600 ">
				<BarChart3 size={16} />
				By Class
			</h2>
			<div class="grid grid-cols-2 gap-2">
				{#each Object.entries(data.classBreakdown).sort((a, b) => Number(a[0]) - Number(b[0])) as [classNum, count]}
					<div class="flex items-center justify-between rounded-xl border border-surface-200 bg-white px-4 py-3  ">
						<span class="text-sm font-bold text-surface-700 ">Class {classNum}</span>
						<span class="rounded-lg bg-primary-100 px-2 py-0.5 text-xs font-black text-primary-700  ">{count}</span>
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>

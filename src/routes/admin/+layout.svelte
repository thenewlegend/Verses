<script lang="ts">
	import { page } from '$app/stores';
	import { LayoutDashboard, BookOpen, Plus, LogOut, ArrowLeft, Shield } from '@lucide/svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { data, children } = $props();
	let isLoginPage = $derived($page.url.pathname === '/admin/login');

	const adminNav = [
		{ href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/admin/verses/new', label: 'Add Verse', icon: Plus }
	];
</script>

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="-mx-4 -mt-4">
		<!-- Admin header -->
		<header class="border-b border-surface-200 bg-surface-50 px-4 py-3 dark:border-surface-800 dark:bg-surface-900">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<a href="/" class="text-surface-400 transition-colors hover:text-surface-600 dark:hover:text-surface-300">
						<ArrowLeft size={20} />
					</a>
					<div class="flex items-center gap-2">
						<Shield size={18} class="text-primary-600 dark:text-primary-400" />
						<span class="text-sm font-bold text-surface-900 dark:text-surface-100">Admin Panel</span>
					</div>
				</div>
				<div class="flex items-center gap-2">
					<ThemeToggle />
					<form method="POST" action="/admin/login?/signout">
						<button
							type="submit"
							class="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-surface-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
						>
							<LogOut size={14} />
							Sign out
						</button>
					</form>
				</div>
			</div>

			<!-- Nav tabs -->
			<div class="mt-3 flex gap-1">
				{#each adminNav as item}
					{@const isActive = $page.url.pathname.startsWith(item.href)}
					<a
						href={item.href}
						class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all {isActive
							? 'bg-primary-600 text-white'
							: 'text-surface-600 hover:bg-surface-200 dark:text-surface-400 dark:hover:bg-surface-800'}"
					>
						<item.icon size={16} />
						{item.label}
					</a>
				{/each}
			</div>
		</header>

		<!-- Admin content -->
		<div class="px-4 py-6">
			{@render children()}
		</div>
	</div>
{/if}

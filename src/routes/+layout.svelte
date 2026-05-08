<script lang="ts">
	import "../app.css";
	import { invalidate } from "$app/navigation";
	import { onMount } from "svelte";
	import BottomNav from "$lib/components/BottomNav.svelte";
	import Toast from "$lib/components/Toast.svelte";
	import InstallPrompt from "$lib/components/InstallPrompt.svelte";
	import { page, navigating } from "$app/stores";
	import { fade } from "svelte/transition";

	let { data, children } = $props();
	let { supabase, session } = $derived(data);

	// Check if we're on an admin route
	let isAdminRoute = $derived($page.url.pathname.startsWith("/admin"));

	onMount(() => {
		const { data: authData } = supabase.auth.onAuthStateChange(
			(_event, _session) => {
				if (_session?.expires_at !== session?.expires_at) {
					invalidate("supabase:auth");
				}
			},
		);

		return () => authData.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>Verses</title>
	<meta
		name="description"
		content="Browse, search, and save beautiful Bible verses. Discover your verse of the day."
	/>
	<meta
		name="theme-color"
		content="#fcfcff"
	/>
	<meta name="mobile-web-app-capable" content="yes" />
	<meta
		name="apple-mobile-web-app-status-bar-style"
		content="default"
	/>
	<link rel="apple-touch-icon" href="/icon-192.png" />
</svelte:head>

<!-- Global Loading Bar -->
{#if $navigating}
	<div 
		transition:fade={{ duration: 150 }}
		class="fixed top-0 left-0 right-0 z-[100] h-1 bg-primary-100"
	>
		<div class="h-full w-full origin-left scale-x-0 animate-progress-bar bg-primary-600"></div>
	</div>
{/if}

<div class="flex min-h-dvh flex-col">
	<!-- Top bar -->
	{#if !isAdminRoute}
		<header
			class="sticky top-0 z-40 border-b border-surface-200/60 bg-white/80 backdrop-blur-xl"
		>
			<div
				class="mx-auto flex max-w-2xl items-center justify-between px-4 py-3"
			>
				<a href="/" class="flex items-center gap-2">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-lg"
					>
						✝️
					</div>
					<span
						class="text-lg font-bold tracking-tight text-surface-900 "
					>
						{#if data.user}
							Hi, {data.user.user_metadata?.full_name ||
								data.user.email?.split("@")[0] ||
								"User"}!
						{:else}
							Hi, Jinija!
						{/if}
					</span>
				</a>
				<div class="flex items-center gap-1">
				</div>
			</div>
		</header>
	{/if}

	<!-- Main content -->
	<main
		class="mx-auto w-full max-w-2xl flex-1 px-4 pt-4 {isAdminRoute
			? ''
			: 'pb-24'}"
	>
		{@render children()}
	</main>

	<!-- Bottom nav (public only) -->
	{#if !isAdminRoute}
		<BottomNav />
	{/if}
</div>

<Toast />
<InstallPrompt />

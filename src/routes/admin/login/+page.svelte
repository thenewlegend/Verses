<script lang="ts">
	import { enhance } from '$app/forms';
	import { Shield, Mail, Lock, Loader2 } from '@lucide/svelte';

	let { form } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Admin Login — Verses</title>
</svelte:head>

<div class="flex min-h-[80dvh] items-center justify-center px-4">
	<div class="w-full max-w-sm">
		<!-- Logo area -->
		<div class="mb-8 text-center">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg">
				<Shield size={28} class="text-white" />
			</div>
			<h1 class="text-2xl font-bold text-surface-900 dark:text-surface-100">Admin Access</h1>
			<p class="mt-1 text-sm text-surface-500">Sign in to manage verses</p>
		</div>

		<!-- Login form -->
		<form
			method="POST"
			action="?/login"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
			class="space-y-4"
		>
			{#if form?.error}
				<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
					{form.error}
				</div>
			{/if}

			<div>
				<label for="email" class="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
					Email
				</label>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
						<Mail size={18} class="text-surface-400" />
					</div>
					<input
						id="email"
						name="email"
						type="email"
						value={form?.email || ''}
						required
						autocomplete="email"
						class="touch-target w-full rounded-xl border border-surface-200 bg-white py-3 pr-4 pl-11 text-base text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100 dark:focus:border-primary-600 dark:focus:ring-primary-900/40"
						placeholder="admin@example.com"
					/>
				</div>
			</div>

			<div>
				<label for="password" class="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
					Password
				</label>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
						<Lock size={18} class="text-surface-400" />
					</div>
					<input
						id="password"
						name="password"
						type="password"
						required
						autocomplete="current-password"
						class="touch-target w-full rounded-xl border border-surface-200 bg-white py-3 pr-4 pl-11 text-base text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100 dark:focus:border-primary-600 dark:focus:ring-primary-900/40"
						placeholder="••••••••"
					/>
				</div>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="touch-target flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-base font-semibold text-white transition-all hover:bg-primary-700 focus:ring-2 focus:ring-primary-300 focus:outline-none disabled:opacity-60 active:scale-[0.98]"
			>
				{#if loading}
					<Loader2 size={18} class="animate-spin" />
					Signing in...
				{:else}
					Sign In
				{/if}
			</button>
		</form>

		<p class="mt-6 text-center text-xs text-surface-400">
			<a href="/" class="transition-colors hover:text-primary-600">← Back to app</a>
		</p>
	</div>
</div>

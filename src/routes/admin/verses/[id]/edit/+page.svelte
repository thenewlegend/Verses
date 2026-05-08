<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { enhance as formEnhance } from '$app/forms';
	import { ArrowLeft, Save, Trash2, Loader2, CheckCircle, AlertTriangle } from '@lucide/svelte';

	let { data } = $props();
	let showDeleteConfirm = $state(false);

	const { form, errors, enhance, delayed, message: formMessage } = superForm(data.form, {
		resetForm: false
	});
</script>

<svelte:head>
	<title>Edit — {data.verse.reference} — Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<a
				href="/admin/dashboard"
				class="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-surface-500 transition-colors hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
			>
				<ArrowLeft size={16} />
				Back to dashboard
			</a>
			<h1 class="text-xl font-bold text-surface-900 dark:text-surface-100">Edit Verse</h1>
		</div>
		<button
			onclick={() => (showDeleteConfirm = !showDeleteConfirm)}
			class="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
		>
			<Trash2 size={16} />
			Delete
		</button>
	</div>

	<!-- Delete confirmation -->
	{#if showDeleteConfirm}
		<div class="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
			<p class="mb-3 text-sm font-medium text-red-700 dark:text-red-400">
				Are you sure you want to delete this verse? This action cannot be undone.
			</p>
			<div class="flex gap-2">
				<form method="POST" action="?/delete" use:formEnhance>
					<button
						type="submit"
						class="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 active:scale-95"
					>
						Yes, delete
					</button>
				</form>
				<button
					onclick={() => (showDeleteConfirm = false)}
					class="rounded-xl px-4 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-200 dark:text-surface-400 dark:hover:bg-surface-800"
				>
					Cancel
				</button>
			</div>
		</div>
	{/if}

	{#if $formMessage}
		<div class="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm {$formMessage.includes('successfully')
			? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400'
			: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400'}">
			{#if $formMessage.includes('successfully')}
				<CheckCircle size={16} />
			{:else}
				<AlertTriangle size={16} />
			{/if}
			{$formMessage}
		</div>
	{/if}

	<form method="POST" action="?/update" use:enhance class="space-y-5">
		<!-- Verse text -->
		<div>
			<label for="verse" class="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
				Verse Text <span class="text-red-500">*</span>
			</label>
			<textarea
				id="verse"
				name="verse"
				bind:value={$form.verse}
				rows="5"
				required
				class="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-base text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100 dark:focus:border-primary-600 dark:focus:ring-primary-900/40"
			></textarea>
			{#if $errors.verse}
				<p class="mt-1 text-xs text-red-500">{$errors.verse}</p>
			{/if}
		</div>

		<!-- Reference -->
		<div>
			<label for="reference" class="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
				Reference <span class="text-red-500">*</span>
			</label>
			<input
				id="reference"
				name="reference"
				type="text"
				bind:value={$form.reference}
				required
				class="touch-target w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-base text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100 dark:focus:border-primary-600 dark:focus:ring-primary-900/40"
			/>
			{#if $errors.reference}
				<p class="mt-1 text-xs text-red-500">{$errors.reference}</p>
			{/if}
		</div>

		<!-- Class number -->
		<div>
			<label for="class_number" class="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
				Class Number <span class="text-red-500">*</span>
			</label>
			<input
				id="class_number"
				name="class_number"
				type="number"
				bind:value={$form.class_number}
				min="1"
				required
				class="touch-target w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-base text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100 dark:focus:border-primary-600 dark:focus:ring-primary-900/40"
			/>
			{#if $errors.class_number}
				<p class="mt-1 text-xs text-red-500">{$errors.class_number}</p>
			{/if}
		</div>

		<!-- Published toggle -->
		<div class="flex items-center gap-3">
			<input
				id="is_published"
				name="is_published"
				type="checkbox"
				bind:checked={$form.is_published}
				class="h-5 w-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
			/>
			<label for="is_published" class="text-sm font-medium text-surface-700 dark:text-surface-300">
				Published
			</label>
		</div>

		<!-- Submit -->
		<button
			type="submit"
			disabled={$delayed}
			class="touch-target flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-base font-semibold text-white transition-all hover:bg-primary-700 disabled:opacity-60 active:scale-[0.98]"
		>
			{#if $delayed}
				<Loader2 size={18} class="animate-spin" />
				Saving...
			{:else}
				<Save size={18} />
				Update Verse
			{/if}
		</button>
	</form>
</div>

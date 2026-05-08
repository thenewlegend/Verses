<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { enhance as formEnhance } from '$app/forms';
	import { ArrowLeft, Save, Trash2, Loader2, CheckCircle, AlertTriangle } from '@lucide/svelte';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';

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
				class="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-surface-500 transition-colors hover:text-surface-700"
			>
				<ArrowLeft size={16} />
				Back to dashboard
			</a>
			<h1 class="text-xl font-bold text-surface-900">Edit Verse</h1>
		</div>
		<button
			onclick={() => (showDeleteConfirm = true)}
			class="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
		>
			<Trash2 size={16} />
			Delete
		</button>
	</div>

	<!-- Delete confirmation modal -->
	<ConfirmModal
		show={showDeleteConfirm}
		title="Delete Verse?"
		message="Are you sure you want to delete this verse? This action cannot be undone."
		confirmLabel="Delete Forever"
		onCancel={() => (showDeleteConfirm = false)}
		onConfirm={() => {
			const form = document.getElementById('delete-form');
			if (form instanceof HTMLFormElement) form.requestSubmit();
		}}
	/>

	<form id="delete-form" method="POST" action="?/delete" use:formEnhance class="hidden"></form>

	{#if $formMessage}
		<div class="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm {$formMessage.includes('successfully')
			? 'border-green-200 bg-green-50 text-green-700'
			: 'border-amber-200 bg-amber-50 text-amber-700'}">
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
			<label for="verse" class="mb-1.5 block text-sm font-medium text-surface-700 ">
				Verse Text <span class="text-red-500">*</span>
			</label>
			<textarea
				id="verse"
				name="verse"
				bind:value={$form.verse}
				rows="5"
				required
				class="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-base text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none     "
			></textarea>
			{#if $errors.verse}
				<p class="mt-1 text-xs text-red-500">{$errors.verse}</p>
			{/if}
		</div>

		<!-- Reference -->
		<div>
			<label for="reference" class="mb-1.5 block text-sm font-medium text-surface-700">
				Reference <span class="text-red-500">*</span>
			</label>
			<input
				id="reference"
				name="reference"
				type="text"
				bind:value={$form.reference}
				required
				class="touch-target w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-base text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
			/>
			{#if $errors.reference}
				<p class="mt-1 text-xs text-red-500">{$errors.reference}</p>
			{/if}
		</div>

		<!-- Class number -->
		<div>
			<label for="class_number" class="mb-1.5 block text-sm font-medium text-surface-700">
				Class Number <span class="text-red-500">*</span>
			</label>
			<input
				id="class_number"
				name="class_number"
				type="number"
				bind:value={$form.class_number}
				min="1"
				required
				class="touch-target w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-base text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
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
			<label for="is_published" class="text-sm font-medium text-surface-700">
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

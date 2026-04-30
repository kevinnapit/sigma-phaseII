<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Loader2, Upload, X, FileText } from 'lucide-svelte';
	import { useUploadRFQDocument } from '../hooks/useLocalPurchaseAnalysisMutations.svelte';
	import { toast } from 'svelte-sonner';

	let {
		open = $bindable(false),
		rfqId,
		onSuccess
	}: {
		open: boolean;
		rfqId: string;
		onSuccess?: () => void;
	} = $props();

	const uploadMutation = useUploadRFQDocument();
	const isUploading = $derived(uploadMutation.isPending);

	let documentType = $state('');
	let description = $state('');
	let selectedFile = $state<File | null>(null);
	let fileInputEl = $state<HTMLInputElement | null>(null);

	function handleFileChange(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		selectedFile = input.files?.[0] ?? null;
	}

	function handleRemoveFile() {
		selectedFile = null;
		if (fileInputEl) fileInputEl.value = '';
	}

	function resetForm() {
		documentType = '';
		description = '';
		selectedFile = null;
		if (fileInputEl) fileInputEl.value = '';
	}

	function handleOpenChange(value: boolean) {
		if (!value && !isUploading) {
			resetForm();
			open = false;
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!selectedFile) return;

		try {
			await uploadMutation.mutateAsync({
				rfqId,
				file: selectedFile,
				document_type: documentType || undefined,
				description: description || undefined
			});

			toast.success('Dokumen berhasil diupload');
			resetForm();
			open = false;
			onSuccess?.();
		} catch (error) {
			const msg = error instanceof Error ? error.message : 'Gagal mengupload dokumen.';
			toast.error(msg);
		}
	}

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Upload Dokumen RFQ</Dialog.Title>
			<Dialog.Description>Upload dokumen pendukung untuk RFQ ini.</Dialog.Description>
		</Dialog.Header>

		<form onsubmit={handleSubmit} class="space-y-4">
			<!-- File Upload -->
			<div class="space-y-2">
				<Label for="file">
					File <span class="text-destructive">*</span>
				</Label>
				{#if selectedFile}
					<div class="flex items-center gap-3 rounded-md border bg-muted/50 px-3 py-2">
						<FileText class="h-5 w-5 shrink-0 text-muted-foreground" />
						<div class="min-w-0 flex-1 overflow-hidden">
							<p class="truncate text-sm font-medium">{selectedFile.name}</p>
							<p class="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
						</div>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							class="h-7 w-7 shrink-0"
							onclick={handleRemoveFile}
							disabled={isUploading}
						>
							<X class="h-4 w-4" />
						</Button>
					</div>
				{:else}
					<label
						for="file"
						class="flex cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed border-muted-foreground/25 px-4 py-6 transition-colors hover:border-muted-foreground/50"
					>
						<Upload class="h-8 w-8 text-muted-foreground" />
						<span class="text-sm text-muted-foreground">Klik untuk pilih file</span>
					</label>
					<input
						id="file"
						type="file"
						class="sr-only"
						bind:this={fileInputEl}
						onchange={handleFileChange}
						disabled={isUploading}
						required
					/>
				{/if}
			</div>

			<!-- Document Type (optional) -->
			<div class="space-y-2">
				<Label for="document_type">Tipe Dokumen</Label>
				<Input
					id="document_type"
					bind:value={documentType}
					placeholder="Contoh: invoice, quotation, ..."
					disabled={isUploading}
				/>
			</div>

			<!-- Description (optional) -->
			<div class="space-y-2">
				<Label for="description">Deskripsi</Label>
				<Textarea
					id="description"
					bind:value={description}
					placeholder="Deskripsi dokumen (opsional)"
					rows={3}
					disabled={isUploading}
				/>
			</div>

			<Dialog.Footer>
				<Button
					type="button"
					variant="outline"
					onclick={() => handleOpenChange(false)}
					disabled={isUploading}
				>
					Batal
				</Button>
				<Button type="submit" disabled={!selectedFile || isUploading}>
					{#if isUploading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Mengupload...
					{:else}
						<Upload class="mr-2 h-4 w-4" />
						Upload
					{/if}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

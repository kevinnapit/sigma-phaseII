<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { PageHeader, Guard } from '$lib/components/shared';
	import { LOCAL_PURCHASE_ORDER_PERMISSIONS } from '$lib/features/material-management/inventory/transaction/local-purchase-order/constants/local-purchase-order-permissions';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { ArrowLeft, Save, Send, LoaderCircle } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import {
		useReadLPODetail,
		useUpdateLPO,
		useResubmitLPO
	} from '$lib/features/material-management/inventory/transaction/local-purchase-order/hooks/useLocalPurchaseOrderQueries.svelte';

	const lpoId = $derived(page.params.id);

	const detailQuery = useReadLPODetail(() => lpoId);
	const detail = $derived(detailQuery.data?.data);

	const updateMutation = useUpdateLPO();
	const resubmitMutation = useResubmitLPO();

	// Form state
	let formData = $state({
		lpo_date: '',
		required_by_date: '',
		credit_days: 0,
		remarks: '',
		reference_number: ''
	});

	// Initialize form when detail loads
	$effect(() => {
		if (detail) {
			formData = {
				lpo_date: detail.lpo_date?.split('T')[0] || '',
				required_by_date: detail.required_by_date?.split('T')[0] || '',
				credit_days: detail.credit_days || 0,
				remarks: detail.remarks || '',
				reference_number: detail.reference_number || ''
			};
		}
	});

	const isUpdating = $derived(updateMutation.isPending);
	const isResubmitting = $derived(resubmitMutation.isPending);
	const isRejected = $derived(detail?.approval_status === 'REJECTED');

	function handleBack() {
		goto(`/dashboard/material-management/inventory/transaction/local-purchase-order/${lpoId}`);
	}

	async function handleSave() {
		if (!lpoId) return;

		try {
			await updateMutation.mutateAsync({
				lpoId,
				params: {
					lpo_date: formData.lpo_date ? new Date(formData.lpo_date).toISOString() : undefined,
					required_by_date: formData.required_by_date
						? new Date(formData.required_by_date).toISOString()
						: undefined,
					credit_days: formData.credit_days,
					remarks: formData.remarks,
					reference_number: formData.reference_number
				}
			});

			toast.success('LPO berhasil diperbarui');
			handleBack();
		} catch (error) {
			toast.error(
				`Gagal memperbarui LPO: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	async function handleSaveAndResubmit() {
		if (!lpoId) return;

		try {
			// First update
			await updateMutation.mutateAsync({
				lpoId,
				params: {
					lpo_date: formData.lpo_date ? new Date(formData.lpo_date).toISOString() : undefined,
					required_by_date: formData.required_by_date
						? new Date(formData.required_by_date).toISOString()
						: undefined,
					credit_days: formData.credit_days,
					remarks: formData.remarks,
					reference_number: formData.reference_number
				}
			});

			// Then resubmit
			await resubmitMutation.mutateAsync(lpoId);

			toast.success('LPO berhasil diperbarui dan diajukan ulang');
			handleBack();
		} catch (error) {
			toast.error(
				`Gagal memperbarui dan mengajukan LPO: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}
</script>

<Guard permissions={LOCAL_PURCHASE_ORDER_PERMISSIONS.CREATE}>
	<div class="space-y-6">
		<!-- Header -->
		<div class="items-center justify-between sm:flex">
			<PageHeader title="Edit Order Pembelian Lokal" description="Perbarui informasi LPO" />
			<div class="mt-5 flex items-center gap-2">
				<Button variant="outline" size="sm" onclick={handleBack}>
					<ArrowLeft class="mr-2 h-4 w-4" />
					Kembali
				</Button>
			</div>
		</div>

		{#if detailQuery.isLoading}
			<div class="flex items-center justify-center py-12">
				<p class="text-muted-foreground">Memuat data...</p>
			</div>
		{:else if detailQuery.isError}
			<div class="flex items-center justify-center py-12">
				<p class="text-destructive">Gagal memuat data</p>
			</div>
		{:else if detail}
			<div class="grid gap-6 lg:grid-cols-3">
				<!-- Form (2/3) -->
				<div class="space-y-6 lg:col-span-2">
					<Card.Root>
						<Card.Header>
							<Card.Title>Informasi LPO</Card.Title>
							<p class="text-sm text-muted-foreground">
								Edit informasi dasar LPO. Perubahan akan disimpan sebagai log aktivitas.
							</p>
						</Card.Header>
						<Card.Content class="space-y-4">
							<div class="grid gap-4 md:grid-cols-2">
								<div class="space-y-2">
									<Label for="lpo_date">Tanggal LPO</Label>
									<Input
										id="lpo_date"
										type="date"
										bind:value={formData.lpo_date}
										disabled={isUpdating || isResubmitting}
									/>
								</div>

								<div class="space-y-2">
									<Label for="required_by_date">Tanggal Dibutuhkan</Label>
									<Input
										id="required_by_date"
										type="date"
										bind:value={formData.required_by_date}
										disabled={isUpdating || isResubmitting}
									/>
								</div>

								<div class="space-y-2">
									<Label for="credit_days">Hari Kredit</Label>
									<Input
										id="credit_days"
										type="number"
										bind:value={formData.credit_days}
										disabled={isUpdating || isResubmitting}
										min="0"
									/>
								</div>

								<div class="space-y-2">
									<Label for="reference_number">Nomor Referensi</Label>
									<Input
										id="reference_number"
										bind:value={formData.reference_number}
										placeholder="Masukkan nomor referensi"
										disabled={isUpdating || isResubmitting}
									/>
								</div>
							</div>

							<div class="space-y-2">
								<Label for="remarks">Catatan</Label>
								<Textarea
									id="remarks"
									bind:value={formData.remarks}
									placeholder="Masukkan catatan tambahan..."
									rows={4}
									disabled={isUpdating || isResubmitting}
								/>
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Item List (Read-only) -->
					<Card.Root>
						<Card.Header>
							<Card.Title>Detail Barang</Card.Title>
							<p class="text-sm text-muted-foreground">
								Daftar barang tidak dapat diubah saat edit.
							</p>
						</Card.Header>
						<Card.Content>
							<div class="space-y-3">
								{#each detail.items ?? [] as item}
									<div class="rounded-lg border p-4">
										<div class="grid grid-cols-2 gap-x-4 gap-y-2">
											<div>
												<p class="text-xs text-muted-foreground">Kode</p>
												<p class="text-sm font-medium">{item.item_code}</p>
											</div>
											<div>
												<p class="text-xs text-muted-foreground">Nama Barang</p>
												<p class="text-sm font-medium">{item.item_name}</p>
											</div>
											<div>
												<p class="text-xs text-muted-foreground">Qty</p>
												<p class="text-sm font-medium">{item.quantity} {item.uom_code}</p>
											</div>
											<div>
												<p class="text-xs text-muted-foreground">Total</p>
												<p class="text-sm font-medium">
													{new Intl.NumberFormat('id-ID', {
														style: 'currency',
														currency: 'IDR',
														minimumFractionDigits: 0
													}).format(item.amount)}
												</p>
											</div>
										</div>
									</div>
								{/each}
							</div>
						</Card.Content>
					</Card.Root>
				</div>

				<!-- Actions (1/3) - Sticky -->
				<div class="lg:col-span-1">
					<div class="sticky top-6">
						<Card.Root>
							<Card.Header>
								<Card.Title>Tindakan</Card.Title>
								<p class="text-sm text-muted-foreground">
									{#if isRejected}
										Setelah edit, Anda dapat menyimpan atau langsung mengajukan ulang.
									{:else}
										Simpan perubahan untuk memperbarui LPO.
									{/if}
								</p>
							</Card.Header>
							<Card.Content class="space-y-3">
								<Button
									onclick={handleSave}
									disabled={isUpdating || isResubmitting}
									class="w-full"
								>
									{#if isUpdating}
										<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
										Menyimpan...
									{:else}
										<Save class="mr-2 h-4 w-4" />
										Simpan
									{/if}
								</Button>

								{#if isRejected}
									<Button
										onclick={handleSaveAndResubmit}
										disabled={isUpdating || isResubmitting}
										variant="default"
										class="w-full"
									>
										{#if isResubmitting}
											<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
											Mengajukan...
										{:else}
											<Send class="mr-2 h-4 w-4" />
											Simpan & Ajukan
										{/if}
									</Button>
								{/if}

								<Button
									onclick={handleBack}
									variant="outline"
									disabled={isUpdating || isResubmitting}
									class="w-full"
								>
									Batal
								</Button>
							</Card.Content>
						</Card.Root>
					</div>
				</div>
			</div>
		{/if}
	</div>
</Guard>

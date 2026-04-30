<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { PageHeader } from '$lib/components/shared';
	import { ArrowLeft, Send, LoaderCircle } from 'lucide-svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { useCreatePurchaseRequest, useUpdatePurchaseRequest } from '../hooks/usePurchaseRequestMutations.svelte';
	import type { PurchaseRequestPayload } from '../types/purchase-request.types';
	import SuccessModal from './SuccessModal.svelte';
	import ConfirmSubmitModal from './ConfirmSubmitModal.svelte';

	let transactionData = $state<any>(null);
	let showSuccessModal = $state(false);
	let showConfirmModal = $state(false);
	let createdPRs = $state<Array<{ id: string; number: string }>>([]);

	const userContext = getUserContext();

	// Hardcoded request_source_id
	const REQUEST_SOURCE_ID = '412c47cd-da61-49ad-a5b3-1f4c7225ea5e';

	// Check if this is edit mode
	const isEditMode = $derived(!!transactionData?.request_id);

	// Mutation hooks
	const createMutation = useCreatePurchaseRequest();
	const updateMutation = useUpdatePurchaseRequest();
	const isSubmitting = $derived(createMutation.isPending || updateMutation.isPending);

	// Computed values for confirmation modal
	const itemCount = $derived(transactionData?.items?.length || 0);
	const hasUrgentItems = $derived(
		transactionData?.items?.some((item: any) => item.is_urgent) || false
	);

	onMount(() => {
		// Get data from sessionStorage
		const storedData = sessionStorage.getItem('purchase_request_preview');
		if (storedData) {
			transactionData = JSON.parse(storedData);
		} else {
			// Redirect back if no data
			goto('/dashboard/material-management/inventory/transaction/purchase-request/create');
		}
	});

	function clearAllSessionData() {
		sessionStorage.removeItem('purchase_request_preview');
		sessionStorage.removeItem('purchase_request_draft');
		if (transactionData?.request_id) {
			sessionStorage.removeItem(`purchase_request_edit_${transactionData.request_id}`);
		}
	}

	function handleBack() {
		if (isEditMode) {
			goto(`/dashboard/material-management/inventory/transaction/purchase-request/${transactionData.request_id}/edit`);
		} else {
			goto('/dashboard/material-management/inventory/transaction/purchase-request/create');
		}
	}

	function handleBackToList() {
		showSuccessModal = false;
		clearAllSessionData();
		goto('/dashboard/material-management/inventory/transaction/purchase-request');
	}

	function handleSubmitClick() {
		// Show confirmation modal
		showConfirmModal = true;
	}

	function handleCancelSubmit() {
		showConfirmModal = false;
	}

	async function handleConfirmSubmit() {
		showConfirmModal = false;

		if (!transactionData) return;

		// Validate user context
		if (!userContext.estate?.id) {
			alert('Estate tidak ditemukan. Silakan pilih estate terlebih dahulu.');
			return;
		}

		if (!userContext.token) {
			alert('Token autentikasi tidak ditemukan. Silakan login kembali.');
			return;
		}

		createdPRs = [];

		try {
			// If edit mode, use update mutation
			if (isEditMode) {
				const updatePayload: PurchaseRequestPayload = {
					administrative_unit_id: userContext.estate.id,
					purchase_request_type_id:
						transactionData.purchase_request_type_id || transactionData.warehouse_id,
					purchase_request_date: transactionData.target_date || new Date().toISOString().split('T')[0],
					request_source_id: transactionData.request_source_id || REQUEST_SOURCE_ID,
					is_emergency:
						transactionData.items?.some((item: any) => item.is_urgent) || false,
					requested_by: transactionData.staff_name,
					reference_number: transactionData.reference_number || undefined,
					remarks: transactionData.remarks || undefined,
					i_version: transactionData.i_version,
					items: transactionData.items.map((item: any) => ({
						item_id: item.item_id,
						uom_id: item.uom_id,
						quantity: item.quantity,
						requirement_date: item.delivery_date || undefined,
						purpose: item.purpose || item.justification,
						is_emergency: item.is_urgent || false,
						sepupu_estate_code: item.cousin_garden_code || undefined,
						purchasing_group_id: item.purchasing_group_id || undefined
					}))
				};

				await updateMutation.mutateAsync({
					id: transactionData.request_id,
					payload: updatePayload
				});

				// Clear all session data immediately after success
				clearAllSessionData();

				// Redirect to detail page
				goto(`/dashboard/material-management/inventory/transaction/purchase-request/${transactionData.request_id}`);
				return;
			}

			// Create mode - existing logic
			// Group items by: procurement_source_id + is_emergency + sepupu_estate_id/purchasing_group_id
			// This ensures separate PRs for different combinations
			const itemsByGroup = transactionData.items.reduce((acc: any, item: any) => {
				// Create composite key based on procurement source, emergency status, and destination
				let groupKey = `${item.procurement_source_id}_${item.is_urgent ? 'emergency' : 'normal'}`;

				// Add estate_id for cousin garden
				if (item.procurement_source === 'cousin_garden' && item.estate_id) {
					groupKey += `_estate_${item.estate_id}`;
				}

				// Add purchasing_group_id for head office
				if (item.procurement_source === 'head_office' && item.purchasing_group_id) {
					groupKey += `_dept_${item.purchasing_group_id}`;
				}

				if (!acc[groupKey]) {
					acc[groupKey] = [];
				}
				acc[groupKey].push(item);
				return acc;
			}, {});

			// Create request bodies for each group
			const requestBodies: PurchaseRequestPayload[] = [];

			for (const [groupKey, items] of Object.entries(itemsByGroup)) {
				const itemList = items as any[];
				const firstItem = itemList[0];

				// All items in this group have the same emergency status
				const isEmergency = firstItem.is_urgent;

				const requestBody: PurchaseRequestPayload = {
					administrative_unit_id: userContext.estate.id,
					purchase_request_type_id: firstItem.procurement_source_id,
					purchase_request_date:
						transactionData.target_date || new Date().toISOString().split('T')[0],
					request_source_id: REQUEST_SOURCE_ID,
					is_emergency: isEmergency,
					reference_number: transactionData.reference_number || undefined,
					requested_by: transactionData.staff_name,
					items: itemList.map((item: any) => ({
						item_id: item.item_id,
						uom_id: item.uom_id,
						quantity: item.quantity,
						requirement_date: item.delivery_date || undefined,
						purpose: item.justification,
						is_emergency: item.is_urgent,
						sepupu_estate_code: item.cousin_garden_code || undefined,
						purchasing_group_id: item.purchasing_group_id || undefined
					}))
				};

				// Set sepupu_estate_code at parent level if cousin garden
				if (firstItem.procurement_source === 'cousin_garden' && firstItem.cousin_garden_code) {
					requestBody.sepupu_estate_code = firstItem.cousin_garden_code;
				}

				// Set purchasing_group_id at parent level if head office
				if (firstItem.procurement_source === 'head_office' && firstItem.purchasing_group_id) {
					requestBody.purchasing_group_id = firstItem.purchasing_group_id;
				}

				requestBodies.push(requestBody);
			}

			// Submit all requests using mutation hook
			for (const requestBody of requestBodies) {
				const response = await createMutation.mutateAsync(requestBody);
				// Each response contains multiple groups (especially for cousin garden)
				for (const group of response.data.groups) {
					createdPRs.push({
						id: group.hdr_uoid,
						number: group.pr_number
					});
				}
			}

			// Clear all session data immediately after success
			clearAllSessionData();

			// Clear transaction data from state to prevent re-submission
			transactionData = null;

			// Show success modal
			showSuccessModal = true;
		} catch (error) {
			console.error('Error submitting transaction:', error);

			// Better error message
			let errorMessage = 'Gagal membuat permintaan barang. ';
			if (error instanceof Error) {
				errorMessage += error.message;
			} else {
				errorMessage += 'Silakan coba lagi.';
			}

			alert(errorMessage);
		}
	}

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	};

	const getSourceLabel = (source: string) => {
		if (source === 'cousin_garden') return 'Kebun Sepupu';
		if (source === 'local_purchase') return 'Pembelian Lokal';
		if (source === 'head_office') return 'Kantor Pusat';
		return source;
	};

	// Calculate totals
	const totalBudget = $derived(
		transactionData?.items?.reduce(
			(sum: number, item: any) => sum + (item.estimated_price || 0) * item.quantity,
			0
		) || 0
	);

	const totalCousinGardenPrice = $derived(
		transactionData?.items
			?.filter(
				(item: any) => item.procurement_source === 'cousin_garden' && item.cousin_garden_price
			)
			.reduce((sum: number, item: any) => sum + item.cousin_garden_price * item.quantity, 0) || 0
	);

	const totalHOPrice = $derived(
		transactionData?.items
			?.filter((item: any) => item.procurement_source === 'head_office' && item.ho_last_price)
			.reduce((sum: number, item: any) => sum + item.ho_last_price * item.quantity, 0) || 0
	);

	const totalLPOPrice = $derived(
		transactionData?.items
			?.filter((item: any) => item.procurement_source === 'local_purchase' && item.lpo_last_price)
			.reduce((sum: number, item: any) => sum + item.lpo_last_price * item.quantity, 0) || 0
	);
</script>

<!-- Confirmation Modal -->
<ConfirmSubmitModal
	bind:open={showConfirmModal}
	onConfirm={handleConfirmSubmit}
	onCancel={handleCancelSubmit}
	{itemCount}
	{hasUrgentItems}
/>

<!-- Success Modal -->
<SuccessModal
	bind:open={showSuccessModal}
	purchaseRequests={createdPRs}
	onBackToList={handleBackToList}
/>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<PageHeader
			title={isEditMode ? 'Pratinjau Edit Permintaan Barang' : 'Pratinjau Permintaan Barang'}
			description="Periksa kembali detail transaksi sebelum mengirim"
		/>
		<div class="flex items-center gap-2">
			<Button variant="outline" size="sm" onclick={handleBack} disabled={isSubmitting}>
				<ArrowLeft class="mr-2 h-4 w-4" />
				Kembali
			</Button>
		</div>
	</div>

	{#if transactionData}
		<div class="grid gap-6 lg:grid-cols-3">
			<!-- Main Content -->
			<div class="space-y-6 lg:col-span-2">
				<!-- Form Data Card -->
				<Card>
					<CardHeader>
						<CardTitle>Informasi Formulir</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="grid gap-4 md:grid-cols-2">
							<div class="space-y-1">
								<p class="text-sm text-muted-foreground">Gudang Saat Ini</p>
								<p class="font-medium">{transactionData.warehouse_name || '-'}</p>
							</div>
							<div class="space-y-1">
								<p class="text-sm text-muted-foreground">Nomor Referensi</p>
								<p class="font-medium">{transactionData.reference_number || '-'}</p>
							</div>
							<div class="space-y-1">
								<p class="text-sm text-muted-foreground">Tanggal Target</p>
								<p class="font-medium">{transactionData.target_date || '-'}</p>
							</div>
							<div class="space-y-1">
								<p class="text-sm text-muted-foreground">Staff Peminta</p>
								<p class="font-medium">{transactionData.staff_name || '-'}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<!-- Items List -->
				<Card>
					<CardHeader>
						<CardTitle>Daftar Item ({transactionData.items?.length || 0})</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="space-y-4">
							{#each transactionData.items || [] as item, index}
								<div class="rounded-lg border p-4">
									<!-- Item Header -->
									<div class="mb-4 flex items-start justify-between">
										<div class="flex-1">
											<div class="flex items-center gap-2">
												<Badge variant="outline">#{index + 1}</Badge>
												<p class="font-semibold">{item.item_name}</p>
												{#if item.is_urgent}
													<Badge variant="destructive" class="text-xs">Darurat</Badge>
												{/if}
											</div>
											<p class="mt-1 text-sm text-muted-foreground">{item.item_code}</p>
										</div>
									</div>

									<!-- Item Details Grid -->
									<div class="grid gap-x-10 gap-y-3 text-sm md:grid-cols-2">
										<div class="flex justify-between">
											<span class="text-muted-foreground">Jumlah:</span>
											<span class="font-medium">{item.quantity} {item.uom_name}</span>
										</div>

										<div class="flex justify-between">
											<span class="text-muted-foreground">Sumber Pengadaan:</span>
											<span class="font-medium">{getSourceLabel(item.procurement_source)}</span>
										</div>

										<div class="flex justify-between">
											<span class="text-muted-foreground">Budget Barang:</span>
											<span class="font-medium">
												{formatCurrency(item.estimated_price || 0)}
											</span>
										</div>

										<div class="flex items-center justify-between">
											<span class="text-muted-foreground">Budget Total:</span>
											<span class="font-medium">
												{formatCurrency((item.estimated_price || 0) * item.quantity)}
											</span>
										</div>

										{#if item.delivery_date}
											<div class="flex justify-between">
												<span class="text-muted-foreground">Tanggal Diperlukan:</span>
												<span class="font-medium">{item.delivery_date}</span>
											</div>
										{/if}
									</div>

									<!-- Budget Total Section -->
									<!-- <Separator class="my-3" />
									<div class="rounded-md bg-blue-50 p-3">
										<div class="flex items-center justify-between">
											<span class="text-sm font-medium text-blue-900">Budget Total:</span>
											<span class="text-lg font-bold text-blue-900">
												{formatCurrency((item.estimated_price || 0) * item.quantity)}
											</span>
										</div>
									</div> -->

									<!-- Procurement Source Details -->
									{#if item.cousin_garden_code}
										<Separator class="my-3" />
										<div class="rounded-md bg-green-50 p-3">
											<p class="mb-2 text-xs font-medium text-green-900">Detail Kebun Sepupu</p>
											<div class="grid gap-2 text-sm">
												<div class="flex justify-between">
													<span class="text-green-700">Kebun:</span>
													<span class="font-medium text-green-900">
														{item.cousin_garden_code} - {item.cousin_garden_name}
													</span>
												</div>
												{#if item.cousin_garden_price}
													<div class="flex justify-between">
														<span class="text-green-700">Harga:</span>
														<span class="font-medium text-green-900">
															{formatCurrency(item.cousin_garden_price)}
														</span>
													</div>
													<div class="flex justify-between border-t border-green-200 pt-2">
														<span class="text-green-700">Total:</span>
														<span class="font-bold text-green-900">
															{formatCurrency(item.cousin_garden_price * item.quantity)}
														</span>
													</div>
												{/if}
											</div>
										</div>
									{/if}

									{#if item.purchasing_group_name}
										<Separator class="my-3" />
										<div class="rounded-md bg-blue-50 p-3">
											<p class="mb-2 text-xs font-medium text-blue-900">Detail Kantor Pusat</p>
											<div class="grid gap-2 text-sm">
												<div class="flex justify-between">
													<span class="text-blue-700">Departemen Tujuan:</span>
													<span class="font-medium text-blue-900">{item.purchasing_group_name}</span
													>
												</div>
												{#if item.ho_last_price}
													<div class="flex justify-between">
														<span class="text-blue-700">Harga HO Terakhir:</span>
														<span class="font-medium text-blue-900">
															{formatCurrency(item.ho_last_price)}
														</span>
													</div>
													<div class="flex justify-between border-t border-blue-200 pt-2">
														<span class="text-blue-700">Total HO:</span>
														<span class="font-bold text-blue-900">
															{formatCurrency(item.ho_last_price * item.quantity)}
														</span>
													</div>
												{/if}
											</div>
										</div>
									{/if}

									{#if item.procurement_source === 'local_purchase' && item.lpo_last_price}
										<Separator class="my-3" />
										<div class="rounded-md bg-orange-50 p-3">
											<p class="mb-2 text-xs font-medium text-orange-900">Detail Pembelian Lokal</p>
											<div class="grid gap-2 text-sm">
												<div class="flex justify-between">
													<span class="text-orange-700">Harga LPO Terakhir:</span>
													<span class="font-medium text-orange-900">
														{formatCurrency(item.lpo_last_price)}
													</span>
												</div>
												<div class="flex justify-between border-t border-orange-200 pt-2">
													<span class="text-orange-700">Total LPO:</span>
													<span class="font-bold text-orange-900">
														{formatCurrency(item.lpo_last_price * item.quantity)}
													</span>
												</div>
											</div>
										</div>
									{/if}

									<!-- Justification -->
									{#if item.justification}
										<Separator class="my-3" />
										<div>
											<p class="mb-1 text-xs font-medium text-muted-foreground">
												Catatan/Justifikasi:
											</p>
											<p class="text-sm">{item.justification}</p>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</CardContent>
				</Card>
			</div>

			<!-- Sidebar Summary -->
			<div class="lg:col-span-1">
				<div class="sticky top-6 space-y-6">
					<!-- Summary Card -->
					<Card>
						<CardHeader>
							<CardTitle class="text-lg">Ringkasan</CardTitle>
						</CardHeader>
						<CardContent class="space-y-4">
							<div class="space-y-3">
								<div class="flex items-center justify-between text-sm">
									<span class="text-muted-foreground">Total Item:</span>
									<span class="font-semibold">{transactionData.items?.length || 0}</span>
								</div>
								<Separator />
								<div class="flex items-center justify-between text-sm">
									<span class="text-muted-foreground">Item Darurat:</span>
									<span class="font-semibold text-red-600">
										{transactionData.items?.filter((i: any) => i.is_urgent).length || 0}
									</span>
								</div>
								<Separator />
								<div class="flex items-center justify-between text-sm">
									<span class="text-muted-foreground">Kantor Pusat:</span>
									<span class="font-semibold">
										{transactionData.items?.filter(
											(i: any) => i.procurement_source === 'head_office'
										).length || 0}
									</span>
								</div>
								<div class="flex items-center justify-between text-sm">
									<span class="text-muted-foreground">Kebun Sepupu:</span>
									<span class="font-semibold">
										{transactionData.items?.filter(
											(i: any) => i.procurement_source === 'cousin_garden'
										).length || 0}
									</span>
								</div>
								<div class="flex items-center justify-between text-sm">
									<span class="text-muted-foreground">Pembelian Lokal:</span>
									<span class="font-semibold">
										{transactionData.items?.filter(
											(i: any) => i.procurement_source === 'local_purchase'
										).length || 0}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					<!-- Budget Summary Card -->
					<!-- <Card>
						<CardHeader>
							<CardTitle class="text-lg">Ringkasan Budget</CardTitle>
						</CardHeader>
						<CardContent class="space-y-4">
							<div class="space-y-3">
								<div class="flex items-center justify-between text-sm">
									<span class="text-muted-foreground">Total Budget:</span>
									<span class="font-bold text-blue-600">{formatCurrency(totalBudget)}</span>
								</div>

								{#if totalCousinGardenPrice > 0}
									<Separator />
									<div class="rounded-md bg-green-50 p-3">
										<div class="flex items-center justify-between text-sm">
											<span class="text-green-700">Total Kebun Sepupu:</span>
											<span class="font-bold text-green-900">
												{formatCurrency(totalCousinGardenPrice)}
											</span>
										</div>
									</div>
								{/if}

								{#if totalHOPrice > 0}
									<div class="rounded-md bg-blue-50 p-3">
										<div class="flex items-center justify-between text-sm">
											<span class="text-blue-700">Total HO Terakhir:</span>
											<span class="font-bold text-blue-900">
												{formatCurrency(totalHOPrice)}
											</span>
										</div>
									</div>
								{/if}

								{#if totalLPOPrice > 0}
									<div class="rounded-md bg-orange-50 p-3">
										<div class="flex items-center justify-between text-sm">
											<span class="text-orange-700">Total LPO Terakhir:</span>
											<span class="font-bold text-orange-900">
												{formatCurrency(totalLPOPrice)}
											</span>
										</div>
									</div>
								{/if}
							</div>
						</CardContent>
					</Card> -->

					<!-- Action Card -->
					<Card>
						<CardHeader>
							<CardTitle class="text-lg">Tindakan</CardTitle>
						</CardHeader>
						<CardContent class="space-y-3">
							<Button
								onclick={handleSubmitClick}
								disabled={isSubmitting}
								class="w-full"
								variant="default"
							>
								{#if isSubmitting}
									<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
									Memproses...
								{:else}
									<Send class="mr-2 h-4 w-4" />
									{isEditMode ? 'Simpan Perubahan' : 'Kirim Permintaan'}
								{/if}
							</Button>
							<Button onclick={handleBack} disabled={isSubmitting} class="w-full" variant="outline">
								<ArrowLeft class="mr-2 h-4 w-4" />
								Kembali ke Form
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	{:else}
		<Card>
			<CardContent class="flex flex-col items-center justify-center py-12">
				<p class="text-muted-foreground">Memuat data...</p>
			</CardContent>
		</Card>
	{/if}
</div>

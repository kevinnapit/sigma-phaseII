<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { ArrowLeft, Send } from 'lucide-svelte';
	import type { CartItem } from './BulkItemCart.svelte';

	let {
		warehouseName,
		staffName,
		referenceNumber,
		selectedDepartmentName,
		requiredDate,
		justification,
		isUrgent,
		cartItems,
		onBack,
		onSubmit
	}: {
		warehouseName: string;
		staffName: string;
		referenceNumber: string;
		selectedDepartmentName: string;
		requiredDate: string;
		justification: string;
		isUrgent: boolean;
		cartItems: CartItem[];
		onBack: () => void;
		onSubmit: () => void;
	} = $props();

	const totalItems = $derived(cartItems.length);

	const formattedDate = $derived(() => {
		if (!requiredDate) return '-';
		return new Date(requiredDate).toLocaleDateString('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		});
	});

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(value);
	}
</script>

<div class="space-y-6">
	<div class="grid gap-6 lg:grid-cols-3">
		<!-- Left: Form Info & Items -->
		<div class="space-y-6 lg:col-span-2">
			<!-- Informasi Formulir -->
			<Card>
				<CardHeader>
					<CardTitle>Informasi Formulir</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<p class="text-sm text-muted-foreground">Gudang Saat Ini</p>
							<p class="font-medium">{warehouseName}</p>
						</div>
						<div>
							<p class="text-sm text-muted-foreground">Staff Peminta</p>
							<p class="font-medium">{staffName}</p>
						</div>
						<div>
							<p class="text-sm text-muted-foreground">Nomor Referensi</p>
							<p class="font-medium">{referenceNumber || '-'}</p>
						</div>
						<div>
							<p class="text-sm text-muted-foreground">Departemen Tujuan</p>
							<p class="font-medium">{selectedDepartmentName}</p>
						</div>
						<div>
							<p class="text-sm text-muted-foreground">Sumber Pengadaan</p>
							<p class="font-medium">Kantor Pusat</p>
						</div>
						<div>
							<p class="text-sm text-muted-foreground">Tanggal Diperlukan</p>
							<p class="font-medium">{formattedDate()}</p>
						</div>
						<div>
							<p class="text-sm text-muted-foreground">Status Permintaan</p>
							<p class="font-medium">{isUrgent ? '🔴 Darurat' : '🟢 Normal'}</p>
						</div>
						<div class="col-span-2">
							<p class="text-sm text-muted-foreground">Catatan/Justifikasi</p>
							<p class="font-medium">{justification}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Daftar Item -->
			<Card>
				<CardHeader>
					<CardTitle>Daftar Item ({totalItems})</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-3">
						{#each cartItems as item, index}
							<div class="rounded-lg border p-4">
								<div class="flex items-start justify-between">
									<div class="flex items-start gap-3">
										<div
											class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium"
										>
											{index + 1}
										</div>
										<div class="flex-1">
											<p class="font-semibold">{item.item_name}</p>
											<p class="text-sm text-muted-foreground">{item.item_code}</p>
											<div class="mt-2">
												<span class="text-sm text-muted-foreground">Jumlah: </span>
												<span class="text-sm font-medium">
													{item.quantity} {item.uom}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</CardContent>
			</Card>
		</div>

		<!-- Right: Summary -->
		<div class="lg:col-span-1">
			<div class="sticky top-6">
				<Card>
					<CardHeader>
						<CardTitle>Ringkasan</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<span class="text-sm text-muted-foreground">Total Item:</span>
								<span class="text-lg font-bold">{totalItems}</span>
							</div>
							{#if isUrgent}
								<div class="flex items-center justify-between">
									<span class="text-sm text-muted-foreground">Status:</span>
									<span class="text-lg font-bold text-destructive">🔴 Darurat</span>
								</div>
							{/if}
						</div>

						<div class="pt-4 space-y-2">
							<Button onclick={onSubmit} class="w-full" size="lg">
								<Send class="mr-2 h-4 w-4" />
								Kirim Permintaan
							</Button>
							<Button variant="outline" onclick={onBack} class="w-full">
								<ArrowLeft class="mr-2 h-4 w-4" />
								Kembali ke Form
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import type { ItemComprehensiveData } from '../types/item.types';

	let { item }: { item: ItemComprehensiveData } = $props();

	const formatDate = (dateString?: string) => {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleDateString('id-ID', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	};

	const displayValue = (value?: string | number) => {
		if (value === undefined || value === null || value === '') return '-';
		return String(value);
	};

	const getBooleanText = (value?: boolean) => {
		return value ? 'Iya' : 'Tidak';
	};

	const getBooleanColor = (value?: boolean) => {
		return value ? 'bg-green-500' : 'bg-gray-400';
	};
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Detail Barang</Card.Title>
		<Card.Description>Informasi dasar dan karakteristik barang</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
			<!-- Kode -->
			<div class="space-y-2">
				<Label class="text-sm font-medium text-gray-600">Kode</Label>
				<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2">
					<p class="text-sm font-medium text-gray-900">{displayValue(item.code)}</p>
				</div>
			</div>

			<!-- Nama Singkat -->
			<div class="space-y-2">
				<Label class="text-sm font-medium text-gray-600">Nama Singkat</Label>
				<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2">
					<p class="text-sm font-medium text-gray-900">{displayValue(item.short_name)}</p>
				</div>
			</div>

			<!-- Nama -->
			<div class="space-y-2">
				<Label class="text-sm font-medium text-gray-600">Nama</Label>
				<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2">
					<p class="text-sm font-medium text-gray-900">{displayValue(item.name)}</p>
				</div>
			</div>

			<!-- Tipe Pergerakan Barang -->
			<div class="space-y-2">
				<Label class="text-sm font-medium text-gray-600">Tipe Pergerakan Barang</Label>
				<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2">
					<p class="text-sm font-medium text-gray-900">
						{displayValue(item.item_vrl?.movement_criteria?.value)}
					</p>
				</div>
			</div>

			<!-- Grup Barang -->
			<div class="space-y-2">
				<Label class="text-sm font-medium text-gray-600">Grup Barang</Label>
				<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2">
					<p class="text-sm font-medium text-gray-900">
						{item.item_class ? `${item.item_class.code} - ${item.item_class.name}` : '-'}
					</p>
				</div>
			</div>

			<!-- Satuan Dasar -->
			<div class="space-y-2">
				<Label class="text-sm font-medium text-gray-600">Satuan Dasar</Label>
				<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2">
					<p class="text-sm font-medium text-gray-900">{displayValue(item.base_uom?.code)}</p>
				</div>
			</div>

			<!-- Transaksi Terakhir -->
			<div class="space-y-2">
				<Label class="text-sm font-medium text-gray-600">Transaksi Terakhir</Label>
				<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2">
					<p class="text-sm font-medium text-gray-900">-</p>
					<!-- <p class="text-sm font-medium text-gray-900">{formatDate(item.last_modified_time)}</p> -->
				</div>
			</div>

			<!-- Durasi Transaksi -->
			<div class="space-y-2">
				<Label class="text-sm font-medium text-gray-600">Durasi Transaksi</Label>
				<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2">
					<p class="text-sm font-medium text-gray-900">-</p>
				</div>
			</div>

			<!-- Wajib Input Kedaluwarsa? -->
			<div class="space-y-2">
				<Label class="text-sm font-medium text-gray-600">Wajib Input Kedaluwarsa?</Label>
				<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2">
					<div class="flex items-center gap-2">
						<div
							class="h-2 w-2 rounded-full {getBooleanColor(item.item_vrl?.is_expiry_date_required)}"
						></div>
						<span class="text-sm font-medium text-gray-900"
							>{getBooleanText(item.item_vrl?.is_expiry_date_required)}</span
						>
					</div>
				</div>
			</div>

			<!-- Apakah Diperlukan Batch? -->
			<div class="space-y-2">
				<Label class="text-sm font-medium text-gray-600">Apakah Diperlukan Batch?</Label>
				<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2">
					<div class="flex items-center gap-2">
						<div
							class="h-2 w-2 rounded-full {getBooleanColor(item.item_vrl?.is_batch_required)}"
						></div>
						<span class="text-sm font-medium text-gray-900"
							>{getBooleanText(item.item_vrl?.is_batch_required)}</span
						>
					</div>
				</div>
			</div>

			<!-- Apakah Barang Kritikal? -->
			<div class="space-y-2">
				<Label class="text-sm font-medium text-gray-600">Apakah Barang Kritikal?</Label>
				<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2">
					<div class="flex items-center gap-2">
						<div class="h-2 w-2 rounded-full bg-gray-400"></div>
						<span class="text-sm font-medium text-gray-900">-</span>
					</div>
				</div>
			</div>
		</div>
	</Card.Content>
</Card.Root>

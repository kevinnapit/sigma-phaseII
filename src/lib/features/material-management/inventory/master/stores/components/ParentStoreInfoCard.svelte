<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import type { StoreData } from '../types/store.types';

	let { parentStore }: { parentStore: StoreData } = $props();

	// Get initials for avatar
	const initials = $derived(
		parentStore?.name
			?.split(' ')
			.map((word) => word[0])
			.join('')
			.substring(0, 2)
			.toUpperCase() || 'GD'
	);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Informasi Gudang Induk</Card.Title>
		<Card.Description>Detail informasi gudang induk</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="space-y-6">
			<!-- Detail Information Grid -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<!-- Kode Gudang -->
				<div class="space-y-2">
					<p class="text-sm font-medium text-gray-700">Kode Gudang</p>
					<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2">
						<p class="text-sm font-medium text-gray-900">{parentStore.code}</p>
					</div>
				</div>

				<!-- Nama Gudang -->
				<div class="space-y-2">
					<p class="text-sm font-medium text-gray-700">Nama Gudang</p>
					<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2">
						<p class="text-sm font-medium text-gray-900">{parentStore.name}</p>
					</div>
				</div>

				<!-- Tipe Gudang -->
				<div class="space-y-2">
					<p class="text-sm font-medium text-gray-700">Tipe Gudang</p>
					<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2">
						<p class="text-sm font-medium text-gray-900">
							{parentStore.store_type?.value || '-'}
						</p>
					</div>
				</div>

				<!-- Unit Administratif -->
				<div class="space-y-2">
					<p class="text-sm font-medium text-gray-700">Unit Administratif</p>
					<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2">
						<p class="text-sm font-medium text-gray-900">
							{parentStore.administrative_unit
								? `${parentStore.administrative_unit.name} (${parentStore.administrative_unit.code})`
								: '-'}
						</p>
					</div>
				</div>

				<!-- Status -->
				<div class="space-y-2">
					<p class="text-sm font-medium text-gray-700">Status</p>
					<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2">
						<div class="flex items-center gap-2">
							<div
								class={`h-2 w-2 rounded-full ${parentStore?.is_active ? 'bg-green-500' : 'bg-gray-400'}`}
							></div>
							<p class="text-sm font-medium text-gray-900">
								{parentStore?.is_active ? 'Aktif' : 'Tidak Aktif'}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Card.Content>
</Card.Root>

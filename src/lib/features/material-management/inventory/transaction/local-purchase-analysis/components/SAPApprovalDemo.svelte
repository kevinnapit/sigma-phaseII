<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { ArrowRight, Building2, CheckCircle, Clock } from 'lucide-svelte';
	import SubmitToSAPButton from './SubmitToSAPButton.svelte';
	import SAPApprovalResultStep from './SAPApprovalResultStep.svelte';

	let currentStep = $state<'submit' | 'waiting' | 'result'>('submit');
	let rfqData = $state({
		id: 'rfq-006',
		number: 'PH/LB/2026/0005',
		title: 'Pembelian Barang Khusus Departemen',
		itemCount: 2,
		winner: 'CV Mitra Sejahtera'
	});

	function handleSubmitted() {
		currentStep = 'waiting';
		// Auto progress to result after 3 seconds for demo
		setTimeout(() => {
			currentStep = 'result';
		}, 3000);
	}

	function resetDemo() {
		currentStep = 'submit';
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Demo: SAP Approval Flow untuk Item "Perlu Izin"</Card.Title>
			<Card.Description>
				Simulasi proses approval SAP untuk RFQ dengan item yang memerlukan persetujuan khusus
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="flex items-center gap-4">
				<Badge variant="outline">Demo Mode</Badge>
				<span class="text-sm text-muted-foreground">
					RFQ: {rfqData.number} - {rfqData.title}
				</span>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Progress Steps -->
	<Card.Root>
		<Card.Header>
			<Card.Title class="text-lg">Alur Proses</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="flex items-center gap-4">
				<!-- Step 1: Submit -->
				<div class="flex items-center gap-2">
					<div class={`flex h-8 w-8 items-center justify-center rounded-full ${
						currentStep === 'submit' ? 'bg-blue-500 text-white' : 
						currentStep === 'waiting' || currentStep === 'result' ? 'bg-green-500 text-white' : 
						'bg-gray-200 text-gray-600'
					}`}>
						{#if currentStep === 'submit'}
							1
						{:else}
							<CheckCircle class="h-4 w-4" />
						{/if}
					</div>
					<span class="text-sm font-medium">Kirim ke SAP</span>
				</div>

				<ArrowRight class="h-4 w-4 text-gray-400" />

				<!-- Step 2: Waiting -->
				<div class="flex items-center gap-2">
					<div class={`flex h-8 w-8 items-center justify-center rounded-full ${
						currentStep === 'waiting' ? 'bg-blue-500 text-white' : 
						currentStep === 'result' ? 'bg-green-500 text-white' : 
						'bg-gray-200 text-gray-600'
					}`}>
						{#if currentStep === 'waiting'}
							<Clock class="h-4 w-4 animate-spin" />
						{:else if currentStep === 'result'}
							<CheckCircle class="h-4 w-4" />
						{:else}
							2
						{/if}
					</div>
					<span class="text-sm font-medium">Menunggu SAP</span>
				</div>

				<ArrowRight class="h-4 w-4 text-gray-400" />

				<!-- Step 3: Result -->
				<div class="flex items-center gap-2">
					<div class={`flex h-8 w-8 items-center justify-center rounded-full ${
						currentStep === 'result' ? 'bg-blue-500 text-white' : 
						'bg-gray-200 text-gray-600'
					}`}>
						{#if currentStep === 'result'}
							<Building2 class="h-4 w-4" />
						{:else}
							3
						{/if}
					</div>
					<span class="text-sm font-medium">Hasil & Proses</span>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Content based on current step -->
	{#if currentStep === 'submit'}
		<!-- Step 1: Submit to SAP -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Step 1: Kirim Data Pemenang ke SAP</Card.Title>
				<Card.Description>
					RFQ telah selesai dan vendor pemenang sudah dipilih. Kirim data ke SAP untuk approval.
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="space-y-4">
					<div class="rounded-lg border p-4">
						<h4 class="font-medium">Detail RFQ</h4>
						<div class="mt-2 grid gap-2 text-sm md:grid-cols-2">
							<div><span class="text-muted-foreground">Nomor:</span> {rfqData.number}</div>
							<div><span class="text-muted-foreground">Judul:</span> {rfqData.title}</div>
							<div><span class="text-muted-foreground">Pemenang:</span> {rfqData.winner}</div>
							<div><span class="text-muted-foreground">Jumlah Item:</span> {rfqData.itemCount}</div>
						</div>
					</div>

					<div class="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
						<h4 class="font-medium text-amber-900 dark:text-amber-100">Item "Perlu Izin"</h4>
						<p class="mt-1 text-sm text-amber-800 dark:text-amber-200">
							RFQ ini mengandung item dengan status "Perlu Izin" yang memerlukan approval SAP sebelum dapat diproses lebih lanjut.
						</p>
					</div>
				</div>
			</Card.Content>
			<Card.Footer>
				<SubmitToSAPButton 
					rfqId={rfqData.id}
					rfqNumber={rfqData.number}
					itemCount={rfqData.itemCount}
					onSubmitted={handleSubmitted}
				/>
			</Card.Footer>
		</Card.Root>

	{:else if currentStep === 'waiting'}
		<!-- Step 2: Waiting for SAP -->
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<Clock class="h-5 w-5 animate-spin" />
					Step 2: Menunggu Response SAP
				</Card.Title>
				<Card.Description>
					Data telah dikirim ke SAP. Menunggu review dan approval dari KTU.
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="space-y-4">
					<div class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
						<div class="flex items-center gap-2">
							<Clock class="h-4 w-4 animate-spin text-blue-600" />
							<span class="font-medium text-blue-900 dark:text-blue-100">Sedang diproses SAP</span>
						</div>
						<p class="mt-2 text-sm text-blue-800 dark:text-blue-200">
							RFQ {rfqData.number} telah dikirim ke sistem SAP untuk review. 
							Estimasi waktu: 1-2 hari kerja.
						</p>
					</div>

					<div class="text-center">
						<div class="inline-flex items-center gap-2 text-sm text-muted-foreground">
							<div class="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
							Menunggu response dari KTU...
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

	{:else if currentStep === 'result'}
		<!-- Step 3: SAP Result -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Step 3: Hasil Approval SAP</Card.Title>
				<Card.Description>
					SAP telah memberikan response. Lihat hasil approval dan tindakan selanjutnya.
				</Card.Description>
			</Card.Header>
		</Card.Root>

		<SAPApprovalResultStep 
			rfqId={rfqData.id}
			rfqNumber={rfqData.number}
		/>

		<!-- Reset Demo -->
		<Card.Root>
			<Card.Footer>
				<Button variant="outline" onclick={resetDemo} class="w-full">
					🔄 Reset Demo
				</Button>
			</Card.Footer>
		</Card.Root>
	{/if}
</div>
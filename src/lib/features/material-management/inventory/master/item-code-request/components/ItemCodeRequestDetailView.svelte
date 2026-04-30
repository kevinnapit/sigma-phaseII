<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Guard } from '$lib/components/shared';
	import { ITEM_CODE_REQUEST_PERMISSIONS } from '../constants/item-code-request-permissions';
	import { formatDate } from '$lib/shared/utils';
	import { CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-svelte';
	import type { ItemCodeRequest } from '../types/item-code-request.types';
	import { useReviewItemCodeRequest } from '../hooks/useItemCodeRequestMutations.svelte';
	import { toast } from 'svelte-sonner';

	let {
		request,
		onReviewSuccess
	}: {
		request: ItemCodeRequest;
		onReviewSuccess?: () => void;
	} = $props();

	const reviewMutation = useReviewItemCodeRequest();

	// Review form state
	let showApproveDialog = $state(false);
	let showRejectDialog = $state(false);
	let approveFormData = $state({
		review_notes: '',
		approved_item_code: '',
		approved_item_id: ''
	});
	let rejectFormData = $state({
		rejection_reason: ''
	});

	function getStatusBadge(status: string) {
		switch (status) {
			case 'PENDING':
				return {
					variant: 'outline' as const,
					class: 'bg-yellow-50 text-yellow-700 border-yellow-300',
					text: 'Menunggu Review',
					icon: Clock
				};
			case 'IN_REVIEW':
				return {
					variant: 'outline' as const,
					class: 'bg-blue-50 text-blue-700 border-blue-300',
					text: 'Sedang Direview',
					icon: Clock
				};
			case 'APPROVED':
				return {
					variant: 'default' as const,
					class: 'bg-green-100 text-green-800 border-green-300',
					text: 'Disetujui',
					icon: CheckCircle2
				};
			case 'REJECTED':
				return {
					variant: 'destructive' as const,
					class: '',
					text: 'Ditolak',
					icon: XCircle
				};
			default:
				return {
					variant: 'outline' as const,
					class: '',
					text: status,
					icon: Clock
				};
		}
	}

	const statusBadge = $derived(getStatusBadge(request.status));
	const canReview = $derived(request.status === 'PENDING' || request.status === 'IN_REVIEW');

	async function handleApprove() {
		if (!approveFormData.approved_item_code.trim()) {
			toast.error('Kode barang wajib diisi');
			return;
		}

		try {
			await reviewMutation.mutateAsync({
				id: request.uoid,
				payload: {
					status: 'APPROVED',
					review_notes: approveFormData.review_notes,
					approved_item_code: approveFormData.approved_item_code,
					approved_item_id: approveFormData.approved_item_id || undefined
				}
			});
			showApproveDialog = false;
			onReviewSuccess?.();
		} catch (error) {
			// Error handled by mutation
		}
	}

	async function handleReject() {
		if (!rejectFormData.rejection_reason.trim()) {
			toast.error('Alasan penolakan wajib diisi');
			return;
		}

		try {
			await reviewMutation.mutateAsync({
				id: request.uoid,
				payload: {
					status: 'REJECTED',
					rejection_reason: rejectFormData.rejection_reason
				}
			});
			showRejectDialog = false;
			onReviewSuccess?.();
		} catch (error) {
			// Error handled by mutation
		}
	}
</script>

<div class="space-y-6">
	<!-- Header Card -->
	<Card.Root>
		<Card.Header>
			<div class="flex items-start justify-between">
				<div class="space-y-1">
					<Card.Title class="text-2xl">{request.request_number}</Card.Title>
					<Card.Description>Detail permintaan kode barang</Card.Description>
				</div>
				<Badge variant={statusBadge.variant} class={statusBadge.class}>
					<svelte:component this={statusBadge.icon} class="mr-1 h-3 w-3" />
					{statusBadge.text}
				</Badge>
			</div>
		</Card.Header>
	</Card.Root>

	<!-- Request Information -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Detail Barang</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-6 md:grid-cols-2">
				<div class="space-y-2">
					<Label class="text-muted-foreground">Nama Barang</Label>
					<p class="font-medium">{request.item_name}</p>
				</div>

				<div class="space-y-2">
					<Label class="text-muted-foreground">Satuan (UOM)</Label>
					<p class="font-medium">{request.uom}</p>
				</div>

				<div class="col-span-2 space-y-2">
					<Label class="text-muted-foreground">Deskripsi</Label>
					<p class="text-sm">{request.description}</p>
				</div>

				<div class="space-y-2">
					<Label class="text-muted-foreground">Diminta Oleh</Label>
					<p class="font-medium">{request.requested_by_name}</p>
				</div>

				<div class="space-y-2">
					<Label class="text-muted-foreground">Tanggal Permintaan</Label>
					<p class="font-medium">{formatDate(request.requested_at)}</p>
				</div>

				{#if request.status === 'APPROVED' && request.approved_item_code}
					<div class="space-y-2">
						<Label class="text-muted-foreground">Kode Barang</Label>
						<p class="font-medium text-green-700">{request.approved_item_code}</p>
					</div>
				{/if}

				{#if request.status === 'REJECTED' && request.rejection_reason}
					<div class="col-span-2 space-y-2">
						<Label class="text-muted-foreground">Alasan Penolakan</Label>
						<p class="text-sm text-destructive">{request.rejection_reason}</p>
					</div>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Action Buttons -->
	{#if canReview}
		<Guard permissions={ITEM_CODE_REQUEST_PERMISSIONS.REVIEW}>
			<Card.Root>
				<Card.Content class="pt-6">
					<div class="flex justify-end gap-3">
						<Button variant="destructive" onclick={() => (showRejectDialog = true)}>
							<XCircle class="mr-2 h-4 w-4" />
							Tolak Permintaan
						</Button>
						<Button onclick={() => (showApproveDialog = true)}>
							<CheckCircle2 class="mr-2 h-4 w-4" />
							Setujui Permintaan
						</Button>
					</div>
				</Card.Content>
			</Card.Root>
		</Guard>
	{/if}
</div>

<!-- Approve Dialog -->
<AlertDialog.Root bind:open={showApproveDialog}>
	<AlertDialog.Content class="sm:max-w-[500px]">
		<AlertDialog.Header>
			<AlertDialog.Title>Setujui Permintaan Kode Barang</AlertDialog.Title>
			<AlertDialog.Description>
				Masukkan kode barang yang telah dibuat untuk permintaan ini.
			</AlertDialog.Description>
		</AlertDialog.Header>

		<div class="space-y-4 py-4">
			<div class="space-y-2">
				<Label for="approved_item_code">
					Kode Barang <span class="text-destructive">*</span>
				</Label>
				<Input
					id="approved_item_code"
					bind:value={approveFormData.approved_item_code}
					placeholder="Contoh: IT-LAP-001"
					disabled={reviewMutation.isPending}
				/>
			</div>

			<div class="space-y-2">
				<Label for="approved_item_id">ID Barang (Optional)</Label>
				<Input
					id="approved_item_id"
					bind:value={approveFormData.approved_item_id}
					placeholder="ID barang di sistem"
					disabled={reviewMutation.isPending}
				/>
			</div>

			<div class="space-y-2">
				<Label for="review_notes">Catatan (Optional)</Label>
				<Textarea
					id="review_notes"
					bind:value={approveFormData.review_notes}
					placeholder="Tambahkan catatan jika diperlukan..."
					rows={3}
					disabled={reviewMutation.isPending}
				/>
			</div>
		</div>

		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={reviewMutation.isPending}>Batal</AlertDialog.Cancel>
			<Button onclick={handleApprove} disabled={reviewMutation.isPending}>
				{#if reviewMutation.isPending}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Memproses...
				{:else}
					<CheckCircle2 class="mr-2 h-4 w-4" />
					Setujui
				{/if}
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<!-- Reject Dialog -->
<AlertDialog.Root bind:open={showRejectDialog}>
	<AlertDialog.Content class="sm:max-w-[500px]">
		<AlertDialog.Header>
			<AlertDialog.Title>Tolak Permintaan Kode Barang</AlertDialog.Title>
			<AlertDialog.Description>
				Berikan alasan penolakan untuk permintaan ini.
			</AlertDialog.Description>
		</AlertDialog.Header>

		<div class="space-y-4 py-4">
			<div class="space-y-2">
				<Label for="rejection_reason">
					Alasan Penolakan <span class="text-destructive">*</span>
				</Label>
				<Textarea
					id="rejection_reason"
					bind:value={rejectFormData.rejection_reason}
					placeholder="Jelaskan alasan penolakan..."
					rows={4}
					disabled={reviewMutation.isPending}
				/>
			</div>
		</div>

		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={reviewMutation.isPending}>Batal</AlertDialog.Cancel>
			<Button
				variant="destructive"
				onclick={handleReject}
				disabled={reviewMutation.isPending}
			>
				{#if reviewMutation.isPending}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Memproses...
				{:else}
					<XCircle class="mr-2 h-4 w-4" />
					Tolak
				{/if}
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

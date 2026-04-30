<script lang="ts">
	import { Eye, Ellipsis, Send, RotateCcw } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { toast } from 'svelte-sonner';
	import Guard from '$lib/components/shared/guard.svelte';
	import {
		useRegisterVendor,
		useResendVendorRegistration
	} from '../hooks/useVendorsLocalMutations.svelte';
	import type { LocalVendorItem } from '../types/vendor-local.types';
	import { VENDOR_PERMISSIONS } from '$lib/features/material-management/inventory/master/vendor/constants/vendor-permissions';

	interface Props {
		vendor: LocalVendorItem;
		onViewDetail: (vendor: LocalVendorItem) => void;
		onDelete: (vendor: LocalVendorItem) => void;
	}

	let { vendor, onViewDetail, onDelete }: Props = $props();

	const registerVendorMutation = useRegisterVendor();
	const resendRegistrationMutation = useResendVendorRegistration();

	// Check if vendor is already registered - updated logic: if registration_status exists, show as registered
	const isRegistered = $derived(!!vendor.vendor_user?.registration_status);

	// Only vendors with this specific party category can be registered/re-registered
	const REGISTRABLE_PARTY_CATEGORY_ID = 'b66e8af8-6d0c-4092-bb3e-ef36ad10ad80';
	const canRegister = $derived(vendor.party_default_category?.id === REGISTRABLE_PARTY_CATEGORY_ID);

	function handleSendInvitation() {
		if (isRegistered) {
			// Resend registration
			if (!vendor.vendor_user?.uoid) {
				toast.error('Vendor user ID tidak ditemukan');
				return;
			}

			resendRegistrationMutation.mutate(
				{ vendor_user_id: vendor.vendor_user.uoid },
				{
					onSuccess: () => {
						toast.success('Registrasi ulang vendor berhasil dikirim');
					},
					onError: (error) => {
						toast.error(`Gagal mengirim registrasi ulang: ${error.message}`);
					}
				}
			);
		} else {
			// Initial registration
			registerVendorMutation.mutate(
				{ party_id: vendor.uoid },
				{
					onSuccess: () => {
						toast.success('Registrasi vendor berhasil dikirim');
					},
					onError: (error) => {
						toast.error(`Gagal mengirim registrasi: ${error.message}`);
					}
				}
			);
		}
	}

	function handleViewDetail() {
		onViewDetail(vendor);
	}

	const isPending = $derived(
		registerVendorMutation.isPending || resendRegistrationMutation.isPending
	);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" class="h-8 w-8 p-0">
				<span class="sr-only">Buka menu</span>
				<Ellipsis class="h-4 w-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<Guard permissions={VENDOR_PERMISSIONS.DETAIL_VIEW}>
			<DropdownMenu.Item onclick={handleViewDetail}>
				<Eye class="h-4 w-4" />
				Lihat Detail
			</DropdownMenu.Item>
		</Guard>
		<DropdownMenu.Separator />
		<Guard permissions={VENDOR_PERMISSIONS.UPDATE}>
			{#if canRegister}
				<DropdownMenu.Item onclick={handleSendInvitation} disabled={isPending}>
					{#if isPending}
						<Send class="h-4 w-4 animate-pulse" />
						Mengirim...
					{:else if isRegistered}
						<RotateCcw class="h-4 w-4" />
						Registrasi Ulang
					{:else}
						<Send class="h-4 w-4" />
						Registrasi Vendor
					{/if}
				</DropdownMenu.Item>
			{/if}
		</Guard>
	</DropdownMenu.Content>
</DropdownMenu.Root>

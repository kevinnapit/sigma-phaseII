<script lang="ts">
	import { onlineManager } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	onMount(() => {
		onlineManager.subscribe((status) => {
			if (!status) {
				toast.error('Anda sedang offline', {
					description: 'Silahkan periksa koneksi internet Anda'
				});
			} else {
				toast.success('Anda kembali online', {
					description: 'Koneksi internet Anda terdeteksi'
				});
			}
		});
	});
</script>

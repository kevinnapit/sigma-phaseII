<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import { FileQuestionMark, House, RotateCcw } from 'lucide-svelte';
	interface Props {
		status: number;
		error: unknown | App.Error;
		retry?: () => void;
	}

	let { status, error, retry }: Props = $props();

	const is404 = $derived(status === 404);
	$effect(() => {
		if (error) {
			console.error('Terjadi kesalahan', error);
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
	<div class="text-center">
		<div class="mb-8 flex justify-center">
			<div class="flex h-32 w-32 items-center justify-center rounded-full bg-gray-100">
				<FileQuestionMark class="h-16 w-16 text-[#0f4c2a]" strokeWidth={2.5} />
			</div>
		</div>

		<h1 class="mb-4 text-3xl font-bold text-[#0f4c2a]">
			{status}
		</h1>

		<h2 class="mb-3 text-2xl font-semibold text-gray-900">
			{is404 ? 'Halaman Tidak Ditemukan' : 'Terjadi Kesalahan'}
		</h2>

		<p class="mb-8 text-gray-600">
			{is404
				? 'Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.'
				: 'Maaf, terjadi kesalahan pada sistem. Silakan coba lagi nanti.'}
		</p>
		<div class="flex w-full justify-center gap-2">
			<a href={resolve('/dashboard')}>
				<Button variant="default" class="gap-2 bg-[#0f4c2a] hover:bg-[#0d4023]">
					<House class="h-4 w-4" />
					<span>Kembali ke Home</span>
				</Button>
			</a>
			{#if retry}
				<Button variant="secondary" class="gap-2" onclick={retry}>
					<RotateCcw class="h-4 w-4" />
					<span> Muat Ulang </span>
				</Button>
			{/if}
		</div>
	</div>
</div>

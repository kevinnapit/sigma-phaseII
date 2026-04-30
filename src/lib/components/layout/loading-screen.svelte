<script lang="ts">
	import Logo from '../Logo.svelte';
</script>

<main
	class="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-50 via-white to-green-50"
>
	<div class="text-center">
		<div class="relative mb-8">
			<div class="absolute inset-0 flex items-center justify-center">
				<div
					class="h-32 w-32 animate-ping rounded-full border-4 border-emerald-100 opacity-20"
				></div>
			</div>

			<div class="absolute inset-0 flex items-center justify-center">
				<div
					class="size-34 animate-spin rounded-full border-4 border-t-emerald-600 border-r-emerald-500 border-b-emerald-400 border-l-emerald-300"
				></div>
			</div>

			<div
				class="relative z-10 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-lg"
			>
				<div class="flex items-center gap-1">
					<Logo />
					<!-- <TreePalm class="h-8 w-8 animate-bounce text-emerald-600 delay-0" />
					<TreePalm class="h-7 w-7 animate-bounce text-green-500 delay-150" />
					<TreePalm class="h-6 w-6 animate-bounce text-emerald-700 delay-300" /> -->
				</div>
			</div>
		</div>

		<div class="space-y-2">
			<h1 class="text-3xl font-bold tracking-wide text-gray-800">Sigma</h1>
			<p class="text-sm font-medium tracking-widest text-gray-500 uppercase">Enterprise</p>

			<div class="pt-4">
				<div class="flex items-center justify-center gap-3">
					<div
						id="loading-dot-1"
						class="size-2.5 animate-bounce rounded-full bg-emerald-600 opacity-70 transition-all delay-0"
					></div>
					<div
						id="loading-dot-2"
						class="size-2.5 animate-bounce rounded-full bg-emerald-600 opacity-80 transition-all delay-50"
					></div>
					<div
						id="loading-dot-3"
						class="size-2.5 animate-bounce rounded-full bg-emerald-600 opacity-90 transition-all delay-100"
					></div>
					<div
						id="loading-dot-4"
						class="size-2.5 animate-bounce rounded-full bg-emerald-600 opacity-100 transition-all delay-150"
					></div>
				</div>
				<!-- <p class="mt-3 text-sm text-gray-400">Memuat laman kerja...</p> -->
			</div>
		</div>

		<!-- <div class="mt-12 border-t border-gray-100 pt-8">
			<p class="text-xs text-gray-400">Powered by Iweka</p>
		</div> -->
	</div>
</main>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Logo from '$lib/components/Logo.svelte';
	// import palmTree from '$lib/assets/palm-tree.webp';
	import { goto } from '$app/navigation';
	// import { useQueryClient } from '@tanstack/svelte-query';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte.js';
	import { resolve } from '$app/paths';
	import * as Carousel from '$lib/components/ui/carousel';
	import GuestGuard from '$lib/modules/auth/components/guest-guard.svelte';
	import { AuthConfig } from '$lib/modules/auth/config/auth-config';
	import { Eye, EyeOff, LoaderCircle } from 'lucide-svelte';
	import { loginSchema } from '$lib/modules/auth/schemas/login-schema';

	type TypeImage = {
		id: number | string;
		src: string;
		title?: string;
		description?: string;
	};

	let username = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');
	let showPassword = $state(false);

	const appVersion = import.meta.env.APP_VERSION;

	const userCtx = getUserContext();

	async function handleLogin(e: Event) {
		try {
			loading = true;
			e.preventDefault();
			const validated = loginSchema.safeParse({ user_id: username, password });
			if (!validated.success) {
				error = 'nama pengguna atau kata sandi tidak valid';
				return;
			}
			const { data: res, error: err } = await userCtx.authClient().POST('/api/auth/login', {
				body: validated.data
			});
			if (err || !res?.data) {
				error = err?.detail || err?.title || 'terjadi kesalahan saat login';
				return;
			}
			const user = res?.data?.user;
			const access_token = res?.data.access_token;
			const refresh_token = res?.data.refresh_token;
			if (user && userCtx.validateUser(user) && access_token) {
				userCtx.setUser({ user }, access_token, refresh_token ?? undefined);
				await goto(resolve(AuthConfig.AUTHENTICATED_REDIRECT));
			} else {
				error = 'Invalid user data';
			}
		} finally {
			loading = false;
		}
	}

	const images: TypeImage[] = [
		{
			id: 1,
			src: '/images/img_2.webp',
			title: '',
			description: ''
		},
		{
			id: 2,
			src: '/images/img_1.webp',
			title: 'Rubber Plantation',
			description: ''
		},
		{
			id: 3,
			src: '/images/img_3.webp',
			title: '',
			description: ''
		},
		{
			id: 4,
			src: '/images/img_4.webp',
			title: '',
			description: ''
		},
		// {
		// 	id: 5,
		// 	src: '/images/img_5.webp',
		// 	title: '',
		// 	description: ''
		// },
		// {
		// 	id: 5,
		// 	src: '/images/img_6.webp',
		// 	title: '',
		// 	description: ''
		// },
		{
			id: 5,
			src: '/images/img_7.webp',
			title: '',
			description: ''
		}
	];
</script>

<GuestGuard>
	<div class="flex min-h-screen">
		<div class="flex w-full flex-col bg-white p-8 lg:w-1/2">
			<div class="flex items-center gap-2">
				<Logo width={32} height={24} />
				<span class="text-lg font-semibold text-gray-900">Sigma</span>
			</div>

			<div class="flex flex-1 items-center justify-center">
				<div class="w-full max-w-sm">
					<div class="mb-8 flex items-center justify-center">
						<img src="/images/Logo_Socfin.png" alt="Logo" class="h-24 w-auto" />
					</div>
					<!-- <div class="mb-8 text-center">
						<h1 class="text-2xl font-bold text-gray-900">Masuk ke akun Anda</h1>
						<p class="mt-2 text-sm text-gray-600">Masukkan nama akun dan kata sandi Anda</p>
					</div> -->

					<form onsubmit={handleLogin} class="space-y-4">
						<div class="space-y-2">
							<Label for="username">Nama Akun</Label>
							<div class="flex w-full">
								<span
									class="pointer-events-none flex h-9 shrink-0 items-center rounded-l-md border border-r-0 bg-secondary px-2 text-sm text-muted-foreground"
									>socfin-id\</span
								>
								<Input
									id="username"
									type="text"
									bind:value={username}
									placeholder="Masukan nama akun Anda"
									required
									disabled={loading}
									class="rounded-l-none"
								/>
							</div>
							<!-- <Input
								id="username"
								type="text"
								bind:value={username}
								placeholder="Masukan nama akun Anda"
								required
								disabled={loading}
							/> -->
						</div>

						<div class="space-y-2">
							<Label for="password">Kata Sandi</Label>
							<div class="relative">
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									bind:value={password}
									placeholder="Masukan kata sandi Anda"
									required
									disabled={loading}
									class="pr-10"
								/>
								<button
									type="button"
									onclick={() => (showPassword = !showPassword)}
									disabled={loading}
									class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
								>
									{#if showPassword}
										<EyeOff size={16} />
									{:else}
										<Eye size={16} />
									{/if}
								</button>
							</div>
						</div>

						{#if error}
							<div class="rounded-md bg-red-50 p-3 text-sm text-red-800">
								{error}
							</div>
						{/if}

						<Button type="submit" class="w-full bg-[#0f4c2a] hover:bg-[#0d4023]" disabled={loading}>
							{#if loading}
								<LoaderCircle class="animate-spin" />
							{:else}
								Masuk
							{/if}
						</Button>
					</form>
				</div>
			</div>

			<div class="flex items-center justify-center">
				<!-- <p class="text-sm text-gray-600">© PT Socfin Indonesia</p> -->
				<p class="text-sm text-gray-500">Versi: {appVersion}</p>
			</div>
		</div>

		<!-- Old -->
		<!-- <div class="fixed top-0 right-0 hidden h-full w-1/2 lg:block">
			<img
				src={asset('/images/palm-tree.webp')}
				alt="Palm trees"
				class="h-full w-full object-cover"
			/>
		</div> -->

		<!-- With Carousel Autoplay -->
		<div class="fixed top-0 right-0 hidden h-full w-1/2 lg:block">
			<Carousel.Root
				opts={{ loop: true, active: true }}
				autoplay={true}
				autoplayInterval={5000}
				pauseOnHover={false}
				class="relative h-full w-full"
			>
				<Carousel.Content class="ms-0 h-full">
					{#each images as image (image.id)}
						<Carousel.Item class="h-screen ps-0">
							<div class="relative h-full w-full">
								<img
									src={image.src}
									alt={image.title}
									class="object-center-bottom h-full w-full object-cover"
								/>

								<!-- Optional Overlay -->
								<!-- <div class="absolute bottom-0 left-0 w-full bg-black/40 p-6 py-10 text-white">
									<div class="flex flex-col gap-2">
										<h1 class="text-3xl font-semibold">
											{image.title}
										</h1>
										{#if image.description}
											<p class="text-sm opacity-90">
												{image.description}
											</p>
										{/if}
									</div>
								</div> -->
							</div>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
			</Carousel.Root>
		</div>
	</div>
</GuestGuard>

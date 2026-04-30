<script lang="ts">
	let { data } = $props();
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-3xl font-bold text-gray-900">Home</h1>
		<p class="mt-2 text-gray-600">Welcome back, {data.auth?.user?.name}!</p>
	</div>

	<!-- <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<h3 class="text-sm font-medium text-gray-500">Total Pekerja</h3>
			<p class="mt-2 text-3xl font-bold text-gray-900">1,234</p>
		</div>

		<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<h3 class="text-sm font-medium text-gray-500">Hadir Hari Ini</h3>
			<p class="mt-2 text-3xl font-bold text-gray-900">1,180</p>
		</div>

		<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<h3 class="text-sm font-medium text-gray-500">Cuti Pending</h3>
			<p class="mt-2 text-3xl font-bold text-gray-900">12</p>
		</div>

		<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<h3 class="text-sm font-medium text-gray-500">Payroll Bulan Ini</h3>
			<p class="mt-2 text-3xl font-bold text-gray-900">Rp 2.5M</p>
		</div>
	</div> -->
</div>

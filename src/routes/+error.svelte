<script lang="ts">
	import { page } from '$app/state';
	import ErrorScreen from '$lib/components/layout/error-screen.svelte';
</script>

<ErrorScreen status={page.status} error={page.error} />

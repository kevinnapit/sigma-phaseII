<script lang="ts">
	import { getSwManager } from "$lib/hooks/use-sw-manager.svelte";
	import { createNotificationManager, setNotificationManager } from "$lib/hooks/use-notification.svelte";

    let { children } = $props();
    const swManager = getSwManager();

    const notificationManager = createNotificationManager(() => swManager.registration);
    setNotificationManager(notificationManager);
</script>

{@render children()}

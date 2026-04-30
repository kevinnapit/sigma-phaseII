/**
 * Exports all vendor-related functionality
 * Organized by vendor type: local, central, and shared
 */

// Local vendor exports
export * from './local';

// Central vendor exports
export * from './central';

// Shared exports (stats, etc.)
export * from './shared';

// Note: Components should be imported directly from their respective folders:
// Local: import ViewLocalVendors from '$lib/features/material-management/inventory/master/vendor/local/components/ViewLocalVendors.svelte';
// Central: import ViewCentralVendors from '$lib/features/material-management/inventory/master/vendor/central/components/ViewCentralVendors.svelte';

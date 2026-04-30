import { toast } from 'svelte-sonner';

export interface ApiError {
	message?: string;
	status?: number;
	errors?: Record<string, string[]>;
	detail?: string;
	title?: string;
}

export function handleApiError(error: any, defaultMessage: string = 'Terjadi kesalahan') {
	console.error('API Error:', error);

	if (error.detail) {
		toast.error(error.detail);
		return;
	}

	if (error.message?.includes('Estate not selected') || error.message?.includes('Estate')) {
		toast.error('Estate belum dipilih');
		return;
	}

	if (!navigator.onLine || error.message?.includes('Network') || error.message?.includes('fetch')) {
		toast.error('Tidak ada koneksi internet');
		return;
	}

	const finalMessage = error.message || defaultMessage;
	toast.error(finalMessage);
}

export function handleQueryError(error: any) {
	console.error('Query Error:', error);

	if (error.status === 404 || error.status === 401 || error.status === 403) {
		return;
	}

	if (error.detail) {
		toast.error(error.detail, {
			action: {
				label: 'Refresh',
				onClick: () => window.location.reload()
			}
		});
		return;
	}

	if (error.status === 500) {
		toast.error('Gagal memuat data', {
			action: {
				label: 'Refresh',
				onClick: () => window.location.reload()
			}
		});
		return;
	}

	if (!navigator.onLine) {
		toast.error('Tidak ada koneksi internet');
		return;
	}
}

export function checkIsAPIError(err: unknown): err is Schemas['ErrorModel'] {
	return (
		typeof err === 'object' &&
		err !== null &&
		'status' in err &&
		typeof (err as Record<string, unknown>).status === 'number'
	);
}

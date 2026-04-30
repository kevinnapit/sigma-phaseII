const dateFormatter = new Intl.DateTimeFormat('id-ID', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	timeZone: 'Asia/Jakarta'
});

const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	hour: '2-digit',
	minute: 'numeric',
	timeZone: 'Asia/Jakarta'
});

const _currencyFormatter = new Intl.NumberFormat('id-ID', {
	style: 'currency',
	currency: 'IDR',
	minimumFractionDigits: 0
});
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatDate = (date: Date | string): string => {
	const d = typeof date === 'string' ? new Date(date) : date;
	return dateFormatter.format(d);
};

/**
 * Format date dari ISO string dengan mengambil bagian tanggal saja (YYYY-MM-DD),
 * tanpa konversi timezone. Cocok untuk field seperti deadline_date yang
 * menggunakan waktu 23:59:59Z sebagai penanda akhir hari.
 */
export const formatDateOnly = (date: string): string => {
	const datePart = date.split('T')[0];
	const [year, month, day] = datePart.split('-').map(Number);
	return dateFormatter.format(new Date(year, month - 1, day));
};

export const formatDateTime = (date: Date | string): string => {
	const d = typeof date === 'string' ? new Date(date) : date;
	return dateTimeFormatter.format(d);
};

export const formatTimeId = (timeString: string): string => {
	if (!timeString) return '-';
	try {
		// Extract time directly from ISO string to avoid timezone conversion
		// API returns WIB time in UTC format (e.g., "2026-03-25T14:45:00Z" means 14:45 WIB)
		const match = timeString.match(/T(\d{2}):(\d{2})/);
		if (match) {
			return `${match[1]}.${match[2]} WIB`;
		}
		return timeString;
	} catch {
		return timeString;
	}
};

/**
 * Convert ISO timestamp or any time format to HH:mm (24-hour format)
 * Used for time input fields and display
 *
 * @param timeString - ISO timestamp (e.g., "2026-04-06T09:50:00Z") or HH:mm format
 * @returns Time in HH:mm format (e.g., "09:50") or "-" if empty
 *
 * @example
 * convertISOToTime("2026-04-06T09:50:00Z") // returns "09:50"
 * convertISOToTime("14:30") // returns "14:30"
 * convertISOToTime("") // returns "-"
 */
export const convertISOToTime = (timeString: string | undefined): string => {
	if (!timeString) return '-';

	try {
		// If it's an ISO timestamp (contains 'T'), parse it
		if (timeString.includes('T')) {
			const date = new Date(timeString);
			const hours = date.getUTCHours().toString().padStart(2, '0');
			const minutes = date.getUTCMinutes().toString().padStart(2, '0');
			return `${hours}:${minutes}`;
		}

		// If already in HH:mm format, return as is
		if (/^\d{2}:\d{2}$/.test(timeString)) {
			return timeString;
		}

		// Try to parse other formats
		const date = new Date(`2000-01-01T${timeString}`);
		if (!isNaN(date.getTime())) {
			const hours = date.getHours().toString().padStart(2, '0');
			const minutes = date.getMinutes().toString().padStart(2, '0');
			return `${hours}:${minutes}`;
		}

		return timeString;
	} catch {
		return timeString;
	}
};

export const getTimestamp = (): string => {
	const now = new Date();
	return (
		now.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
		' ' +
		now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
	);
};

export const formatCurrency = (amount: number, currency: string = 'IDR'): string => {
	const formatter = new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: 0
	});
	return formatter.format(amount);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => any>(
	func: T,
	wait: number
): ((...args: Parameters<T>) => void) => {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
};

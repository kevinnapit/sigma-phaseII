import { type Header } from '@tanstack/table-core';

function deepestHeader<D, V>(header: Header<D, V>): Header<D, V> | null {
	let last = header;
	while (true) {
		const next =
			last.isPlaceholder && last.colSpan === 1 && last.subHeaders.length === 1
				? last.subHeaders[0]
				: null;
		if (next) {
			last = next;
		} else {
			return last === header ? null : last;
		}
	}
}

export function tableHeaderRowSpan<D, V>(header: Header<D, V>): number | null {
	const deepest = deepestHeader(header);
	const rowSpan = (deepest ? deepest.depth - header.depth : 0) + 1;
	const above = header.depth - header.column.depth;
	if (above > 1) {
		return null;
	}
	return rowSpan;
}

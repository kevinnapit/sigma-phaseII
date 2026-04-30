import type {
	StorageRack,
	StorageCell,
	AssignedItem,
	ItemStorageAssignment,
	ItemStorageAssignmentListResponse,
	ItemStorageAssignmentDetailResponse,
	ItemStorageAssignmentCreatePayload
} from '../types/item-storage.types';

// ─── Mock Racks ──────────────────────────────────────────────────────────────
// Rack names are fixed. Cell names change based on assigned item group code2.

export const mockRacks: StorageRack[] = [
	{ id: 'rack-g',   rack_name: 'RAK INDUK G',   item_group_id: 'g1', item_group_code: 'G',   item_group_name: 'G.FUEL AND LUBRICAN OIL' },
	{ id: 'rack-aah', rack_name: 'RAK AAH',        item_group_id: 'g2', item_group_code: 'AAH', item_group_name: 'RAK.G AAH.STIMULANT' },
	{ id: 'rack-e',   rack_name: 'RAK INDUK E',    item_group_id: 'g3', item_group_code: 'E',   item_group_name: 'E.ELECTRICAL MATERIAL' },
	{ id: 'rack-b',   rack_name: 'RAK INDUK B',    item_group_id: 'g4', item_group_code: 'B',   item_group_name: 'B.FACTORY MATERIAL' },
	{ id: 'rack-jao', rack_name: 'LEMARI-4 JAO',   item_group_id: 'g5', item_group_code: 'JAO', item_group_name: 'LEMARI OBAT KE EMPAT JAO.MISCELLANEOUS' },
];

// ─── Mock Cells ───────────────────────────────────────────────────────────────
// cell_name is derived: "[GROUP_CODE2] [ROW]/[COL][LETTER]"
// Before assignment: cell_name = cell_code
// After assignment: cell_name reflects the item group code2

export const mockStorageCells: StorageCell[] = [
	// RAK INDUK G
	{ id: 'cell-g1', rack_id: 'rack-g', cell_code: 'R1C1', cell_name: 'G 1/1',   rack_name: 'RAK INDUK G', item_group_id: 'g1', item_group_code: 'G',   item_group_name: 'G.FUEL AND LUBRICAN OIL', is_occupied: true,  assigned_items: [{ id: 'ai-1', item_code: '7037104', item_name: 'MANOMETER 0-6 KG/CM2 OR BAR', assigned_at: '2026-01-10T08:00:00Z' }] },
	{ id: 'cell-g2', rack_id: 'rack-g', cell_code: 'R1C2', cell_name: 'R1C2',    rack_name: 'RAK INDUK G', item_group_id: 'g1', item_group_code: 'G',   item_group_name: 'G.FUEL AND LUBRICAN OIL', is_occupied: false, assigned_items: [] },
	{ id: 'cell-g3', rack_id: 'rack-g', cell_code: 'R2C1', cell_name: 'R2C1',    rack_name: 'RAK INDUK G', item_group_id: 'g1', item_group_code: 'G',   item_group_name: 'G.FUEL AND LUBRICAN OIL', is_occupied: false, assigned_items: [] },

	// RAK AAH
	{ id: 'cell-aah1', rack_id: 'rack-aah', cell_code: 'R2C2A', cell_name: 'AAH 2/2A', rack_name: 'RAK AAH', item_group_id: 'g2', item_group_code: 'AAH', item_group_name: 'RAK.G AAH.STIMULANT', is_occupied: true,  assigned_items: [{ id: 'ai-2', item_code: '7000000', item_name: 'AGRAL 250MG @1L/KLG', assigned_at: '2026-01-11T09:00:00Z' }] },
	{ id: 'cell-aah2', rack_id: 'rack-aah', cell_code: 'R2C2B', cell_name: 'R2C2B',    rack_name: 'RAK AAH', item_group_id: 'g2', item_group_code: 'AAH', item_group_name: 'RAK.G AAH.STIMULANT', is_occupied: false, assigned_items: [] },

	// RAK INDUK E
	{ id: 'cell-e1', rack_id: 'rack-e', cell_code: 'R1C1', cell_name: 'R1C1', rack_name: 'RAK INDUK E', item_group_id: 'g3', item_group_code: 'E', item_group_name: 'E.ELECTRICAL MATERIAL', is_occupied: false, assigned_items: [] },
	{ id: 'cell-e2', rack_id: 'rack-e', cell_code: 'R1C2', cell_name: 'R1C2', rack_name: 'RAK INDUK E', item_group_id: 'g3', item_group_code: 'E', item_group_name: 'E.ELECTRICAL MATERIAL', is_occupied: false, assigned_items: [] },

	// RAK INDUK B
	{ id: 'cell-b1', rack_id: 'rack-b', cell_code: 'R1C1', cell_name: 'B 1/1', rack_name: 'RAK INDUK B', item_group_id: 'g4', item_group_code: 'B', item_group_name: 'B.FACTORY MATERIAL', is_occupied: true,  assigned_items: [{ id: 'ai-5', item_code: '8011001', item_name: 'Pupuk NPK 50kg', assigned_at: '2026-01-14T11:00:00Z' }] },
	{ id: 'cell-b2', rack_id: 'rack-b', cell_code: 'R1C2', cell_name: 'R1C2', rack_name: 'RAK INDUK B', item_group_id: 'g4', item_group_code: 'B', item_group_name: 'B.FACTORY MATERIAL', is_occupied: false, assigned_items: [] },

	// LEMARI-4 JAO
	{ id: 'cell-jao1', rack_id: 'rack-jao', cell_code: 'R4C4A', cell_name: 'JAO 4/4A', rack_name: 'LEMARI-4 JAO', item_group_id: 'g5', item_group_code: 'JAO', item_group_name: 'LEMARI OBAT KE EMPAT JAO.MISCELLANEOUS', is_occupied: true,  assigned_items: [{ id: 'ai-3', item_code: '7011812', item_name: 'BECOM C', assigned_at: '2026-01-12T10:00:00Z' }, { id: 'ai-3b', item_code: '7011814', item_name: 'BIOSANBE', assigned_at: '2026-01-12T10:30:00Z' }] },
	{ id: 'cell-jao2', rack_id: 'rack-jao', cell_code: 'R4C4B', cell_name: 'JAO 4/4B', rack_name: 'LEMARI-4 JAO', item_group_id: 'g5', item_group_code: 'JAO', item_group_name: 'LEMARI OBAT KE EMPAT JAO.MISCELLANEOUS', is_occupied: true,  assigned_items: [{ id: 'ai-4', item_code: '7021129', item_name: 'MIRASECT TAB / EXTRO', assigned_at: '2026-01-13T10:30:00Z' }] },
	{ id: 'cell-jao3', rack_id: 'rack-jao', cell_code: 'R4C4C', cell_name: 'R4C4C', rack_name: 'LEMARI-4 JAO', item_group_id: 'g5', item_group_code: 'JAO', item_group_name: 'LEMARI OBAT KE EMPAT JAO.MISCELLANEOUS', is_occupied: false, assigned_items: [] },
	{ id: 'cell-jao4', rack_id: 'rack-jao', cell_code: 'R4C4D', cell_name: 'R4C4D', rack_name: 'LEMARI-4 JAO', item_group_id: 'g5', item_group_code: 'JAO', item_group_name: 'LEMARI OBAT KE EMPAT JAO.MISCELLANEOUS', is_occupied: false, assigned_items: [] },
	{ id: 'cell-jao5', rack_id: 'rack-jao', cell_code: 'R4C4E', cell_name: 'R4C4E', rack_name: 'LEMARI-4 JAO', item_group_id: 'g5', item_group_code: 'JAO', item_group_name: 'LEMARI OBAT KE EMPAT JAO.MISCELLANEOUS', is_occupied: false, assigned_items: [] },
	{ id: 'cell-jao6', rack_id: 'rack-jao', cell_code: 'R4C4F', cell_name: 'R4C4F', rack_name: 'LEMARI-4 JAO', item_group_id: 'g5', item_group_code: 'JAO', item_group_name: 'LEMARI OBAT KE EMPAT JAO.MISCELLANEOUS', is_occupied: false, assigned_items: [] },
	{ id: 'cell-jao7', rack_id: 'rack-jao', cell_code: 'R4C4G', cell_name: 'R4C4G', rack_name: 'LEMARI-4 JAO', item_group_id: 'g5', item_group_code: 'JAO', item_group_name: 'LEMARI OBAT KE EMPAT JAO.MISCELLANEOUS', is_occupied: false, assigned_items: [] },
	{ id: 'cell-jao8', rack_id: 'rack-jao', cell_code: 'R4C4H', cell_name: 'R4C4H', rack_name: 'LEMARI-4 JAO', item_group_id: 'g5', item_group_code: 'JAO', item_group_name: 'LEMARI OBAT KE EMPAT JAO.MISCELLANEOUS', is_occupied: false, assigned_items: [] },
];

// ─── Mock Assignments ────────────────────────────────────────────────────────

let mockAssignments: ItemStorageAssignment[] = [
	{
		id: 'isa-1',
		assignment_number: 'ISA/2026/0001',
		store_name: 'GUDANG',
		rack_id: 'rack-g',
		rack_name: 'RAK INDUK G',
		cell_id: 'cell-g1',
		cell_code: 'R1C1',
		cell_name: 'G 1/1',
		item_group_id: 'g1',
		item_group_name: 'G.FUEL AND LUBRICAN OIL',
		items: [{ id: 'ai-1', item_code: '7037104', item_name: 'MANOMETER 0-6 KG/CM2 OR BAR', assigned_at: '2026-01-10T08:00:00Z' }],
		assigned_at: '2026-01-10T08:00:00Z',
		assigned_by: 'Admin',
		notes: ''
	},
	{
		id: 'isa-2',
		assignment_number: 'ISA/2026/0002',
		store_name: 'GUDANG',
		rack_id: 'rack-aah',
		rack_name: 'RAK AAH',
		cell_id: 'cell-aah1',
		cell_code: 'R2C2A',
		cell_name: 'AAH 2/2A',
		item_group_id: 'g2',
		item_group_name: 'RAK.G AAH.STIMULANT',
		items: [{ id: 'ai-2', item_code: '7000000', item_name: 'AGRAL 250MG @1L/KLG', assigned_at: '2026-01-11T09:00:00Z' }],
		assigned_at: '2026-01-11T09:00:00Z',
		assigned_by: 'Admin',
		notes: ''
	},
	{
		id: 'isa-3',
		assignment_number: 'ISA/2026/0003',
		store_name: 'GUDANG',
		rack_id: 'rack-jao',
		rack_name: 'LEMARI-4 JAO',
		cell_id: 'cell-jao1',
		cell_code: 'R4C4A',
		cell_name: 'JAO 4/4A',
		item_group_id: 'g5',
		item_group_name: 'LEMARI OBAT KE EMPAT JAO.MISCELLANEOUS',
		items: [
			{ id: 'ai-3',  item_code: '7011812', item_name: 'BECOM C',         assigned_at: '2026-01-12T10:00:00Z' },
			{ id: 'ai-3b', item_code: '7011814', item_name: 'BIOSANBE',         assigned_at: '2026-01-12T10:30:00Z' },
		],
		assigned_at: '2026-01-12T10:00:00Z',
		assigned_by: 'Admin',
		notes: 'Obat-obatan poliklinik'
	},
	{
		id: 'isa-4',
		assignment_number: 'ISA/2026/0004',
		store_name: 'GUDANG',
		rack_id: 'rack-jao',
		rack_name: 'LEMARI-4 JAO',
		cell_id: 'cell-jao2',
		cell_code: 'R4C4B',
		cell_name: 'JAO 4/4B',
		item_group_id: 'g5',
		item_group_name: 'LEMARI OBAT KE EMPAT JAO.MISCELLANEOUS',
		items: [{ id: 'ai-4', item_code: '7021129', item_name: 'MIRASECT TAB / EXTRO', assigned_at: '2026-01-13T10:30:00Z' }],
		assigned_at: '2026-01-13T10:30:00Z',
		assigned_by: 'Admin',
		notes: ''
	},
	{
		id: 'isa-5',
		assignment_number: 'ISA/2026/0005',
		store_name: 'GUDANG',
		rack_id: 'rack-b',
		rack_name: 'RAK INDUK B',
		cell_id: 'cell-b1',
		cell_code: 'R1C1',
		cell_name: 'B 1/1',
		item_group_id: 'g4',
		item_group_name: 'B.FACTORY MATERIAL',
		items: [{ id: 'ai-5', item_code: '8011001', item_name: 'Pupuk NPK 50kg', assigned_at: '2026-01-14T11:00:00Z' }],
		assigned_at: '2026-01-14T11:00:00Z',
		assigned_by: 'Admin',
		notes: ''
	}
];

let nextNum = 6;

function generateNumber(): string {
	return `ISA/${new Date().getFullYear()}/${String(nextNum++).padStart(4, '0')}`;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Derive cell_name from rack's item_group_code2 + cell_code */
function deriveCellName(cell: StorageCell, groupCode2: string): string {
	// cell_code format: R{row}C{col}{letter?}  e.g. R1C1, R4C4A
	const match = cell.cell_code.match(/^R(\d+)C(\d+)([A-Z]?)$/);
	if (!match) return cell.cell_code;
	const row = match[1];
	const col = match[2];
	const letter = match[3];
	return `${groupCode2} ${row}/${col}${letter}`;
}

// ─── Exported functions ───────────────────────────────────────────────────────

export function getMockItemStorageAssignments(
	page: number,
	size: number,
	search?: string
): ItemStorageAssignmentListResponse {
	let filtered = [...mockAssignments];
	if (search) {
		const q = search.toLowerCase();
		filtered = filtered.filter(
			(a) =>
				a.assignment_number.toLowerCase().includes(q) ||
				a.rack_name.toLowerCase().includes(q) ||
				a.cell_name.toLowerCase().includes(q) ||
				a.item_group_name.toLowerCase().includes(q) ||
				a.items.some(
					(i) =>
						i.item_code.toLowerCase().includes(q) ||
						i.item_name.toLowerCase().includes(q)
				)
		);
	}
	const total_item = filtered.length;
	const total_page = Math.max(1, Math.ceil(total_item / size));
	const start = (page - 1) * size;
	return {
		data: filtered.slice(start, start + size),
		pagination: { page, size, total_item, total_page }
	};
}

export function getMockItemStorageAssignmentDetail(id: string): ItemStorageAssignmentDetailResponse {
	const found = mockAssignments.find((a) => a.id === id);
	if (!found) throw new Error(`Penugasan penyimpanan dengan id ${id} tidak ditemukan`);
	return { data: found };
}

export function addMockItemStorageAssignment(
	payload: ItemStorageAssignmentCreatePayload
): ItemStorageAssignment {
	const rack = mockRacks.find((r) => r.id === payload.rack_id);
	const cell = mockStorageCells.find((c) => c.id === payload.cell_id);
	if (!rack) throw new Error('Rak tidak ditemukan');
	if (!cell) throw new Error('Cell tidak ditemukan');

	// Derive cell_name from rack's item_group_code2
	const derivedCellName = deriveCellName(cell, rack.item_group_code);

	const now = new Date().toISOString();
	const newItems: AssignedItem[] = payload.items.map((item, i) => ({
		id: `ai-new-${Date.now()}-${i}`,
		item_code: item.item_code,
		item_name: item.item_name,
		assigned_at: now
	}));

	const newAssignment: ItemStorageAssignment = {
		id: `isa-${Date.now()}`,
		assignment_number: generateNumber(),
		store_name: 'GUDANG',
		rack_id: rack.id,
		rack_name: rack.rack_name,
		cell_id: cell.id,
		cell_code: cell.cell_code,
		cell_name: derivedCellName,
		item_group_id: rack.item_group_id,
		item_group_name: rack.item_group_name,
		items: newItems,
		assigned_at: now,
		assigned_by: 'Admin',
		notes: payload.notes ?? ''
	};

	mockAssignments = [newAssignment, ...mockAssignments];

	// Update cell
	const cellIdx = mockStorageCells.findIndex((c) => c.id === payload.cell_id);
	if (cellIdx !== -1) {
		mockStorageCells[cellIdx].is_occupied = true;
		mockStorageCells[cellIdx].cell_name = derivedCellName;
		mockStorageCells[cellIdx].assigned_items.push(...newItems);
	}

	return newAssignment;
}

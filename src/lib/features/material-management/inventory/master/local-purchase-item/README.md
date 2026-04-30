# Barang Pembelian Lokal (Local Purchase Item)

## Overview

Modul Barang Pembelian Lokal menampilkan daftar barang yang diizinkan untuk pembelian lokal pada purchase request. Data disinkronkan dari SAP dan bersifat read-only.

## Features

- ✅ List view dengan pagination dan search
- ✅ Detail view untuk setiap barang
- ✅ Filter berdasarkan status barang di lapangan
- ✅ Badge untuk status dan keputusan
- ✅ Mock data untuk development

## Structure

```
local-purchase-item/
├── api/
│   ├── local-purchase-item.api.ts      # API functions
│   ├── local-purchase-item.keys.ts     # Query keys
│   └── local-purchase-item.mock.ts     # Mock data
├── components/
│   ├── ViewLocalPurchaseItems.svelte              # List view
│   ├── LocalPurchaseItemActionsCells.svelte       # Table actions
│   └── LocalPurchaseItemDetailView.svelte         # Detail view
├── constants/
│   └── local-purchase-item-permissions.ts         # Permissions
├── hooks/
│   └── useLocalPurchaseItemQueries.svelte.ts      # Query hooks
├── types/
│   └── local-purchase-item.types.ts               # TypeScript types
├── index.ts                                        # Public exports
└── README.md                                       # This file
```

## Routes

- **List Page**: `/dashboard/material-management/inventory/master/local-purchase-item`
- **Detail Page**: `/dashboard/material-management/inventory/master/local-purchase-item/[uoid]`

## Permissions

- `material-management.inventaris.master.barang-pembelian-lokal.view` - View list
- `material-management.inventaris.master.barang-pembelian-lokal.detail.view` - View detail

## Data Fields

| Field | Type | Description |
|-------|------|-------------|
| code | string | Kode barang |
| name | string | Nama barang |
| short_name | string | Nama singkat barang |
| is_field_item | boolean | Apakah barang di lapangan |
| decision | string | Keputusan (Diizinkan/Tidak Diizinkan) |
| status | string | Status (Aktif/Tidak Aktif) |
| item_class | object | Kelas barang |
| base_uom | object | Satuan dasar |
| synced_at | string | Waktu sinkronisasi terakhir |

## Usage

### List View

```svelte
<script>
  import ViewLocalPurchaseItems from '$lib/features/material-management/inventory/master/local-purchase-item/components/ViewLocalPurchaseItems.svelte';
</script>

<ViewLocalPurchaseItems />
```

### Query Hook

```typescript
import { useReadAllLocalPurchaseItems } from '$lib/features/material-management/inventory/master/local-purchase-item';

const localPurchaseItemsQuery = useReadAllLocalPurchaseItems(() => ({
  page: 1,
  size: 10,
  search: 'keyword'
}));

const items = localPurchaseItemsQuery.data?.data || [];
```

## Mock Data

Module ini menggunakan mock data yang diambil dari screenshot. Data mencakup 10 barang dengan berbagai kategori:
- Tools (Kunci Tanam)
- Container (Drum Air, Tangki Air)
- Plumbing (Slide Stop, Elbow PVC)
- Machinery (Pompa Air)
- General Supplies (Corong Plastic, Vape)
- Fuel (BBM Pertalite)
- Office Supplies (Tinta Printer)

## Notes

- Data bersifat read-only (tidak ada create, update, delete)
- Data disinkronkan dari SAP
- Hanya barang dengan status "Aktif" yang ditampilkan
- Module menggunakan mock data untuk development (USE_MOCK = true)

## Future Enhancements

- [ ] Real API integration
- [ ] Export to Excel
- [ ] Advanced filtering
- [ ] Bulk operations
- [ ] History tracking

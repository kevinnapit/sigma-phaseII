import type { MenuItemUpdated, MenuItemWithState } from './menu.types';
import { getMenuIcon } from './menu-icon';
import { createContext } from 'svelte';
import { get, set, del } from 'idb-keyval';

export type ModuleNode = {
	id: number;
	parent_id?: number;
	name: string;
	slug: string;
	path_name: string;
	icon?: string;
	kind?: string;
	description?: string;
	sort_order?: number;
	children?: ModuleNode[];
};

export type FlatModuleSearch = {
	id: number;
	parent_id?: number;

	name: string;
	slug: string;
	path_name?: string;

	kind?: string;
	icon?: string;
	description?: string;
	sort_order?: number;

	/* tree context */
	depth: number;
	breadcrumb: string[];
	breadcrumbLabel: string;

	/* search */
	searchText: string;
	isLeaf: boolean;
};

export class MenuState {
	items = $state<MenuItemWithState[]>([]);

	flattedItems = $state<FlatModuleSearch[]>([]);
	readonly persistor = new PersistentMenuState();

	constructor(modules: ValidUser['modules'], currentPath: string) {
		this.items = this.buildItems(modules, currentPath);
		this.flattedItems = this.flattenAndBuildSearchIndex(modules as unknown as ModuleNode[]);
	}

	buildItems(modules: ValidUser['modules'], currentPath: string) {
		// Filter out unwanted modules
		const filteredModules = this.filterModules(modules ?? []);
		
		return [
			{
				name: 'Home',
				path_name: '/dashboard',
				slug: 'dashboard',
				kind: 'item',
				icon: getMenuIcon('layoutGrid'),
				isActive: false,
				isExpanded: false,
				children: [
					{
						name: 'Home',
						path_name: '/dashboard',
						slug: 'dashboard',
						kind: 'item',
						icon: getMenuIcon('layoutGrid'),
						isActive: false,
						isExpanded: false,
						children: null
					}
				]
			},
			...this.build(filteredModules, currentPath)
		];
	}

	private filterModules(modules: ValidUser['modules']): ValidUser['modules'] {
		// List of module slugs and names to exclude
		const excludedSlugs = [
			'people-function',
			'administrasi', 
			'agriculture-and-cultivation',
			'budidaya-dan-agronomi',
			'budidaya',
			'agronomi',
			'buku-besar',
			'persediaan',
			'utang-piutang',
			'sistem-admin',
			'pembibitan',
			'tanaman',
			'nursery',
			'cultivation',
			'agriculture'
		];

		const excludedNames = [
			'budidaya dan agronomi',
			'budidaya',
			'agronomi',
			'tanaman',
			'pembibitan',
			'people function',
			'administrasi',
			'agriculture and cultivation',
			'agriculture',
			'cultivation'
		];

		return modules
			.filter(module => {
				const slugMatch = !excludedSlugs.includes(module.slug?.toLowerCase() || '');
				const nameMatch = !excludedNames.includes(module.name?.toLowerCase() || '');
				return slugMatch && nameMatch;
			})
			.map(module => ({
				...module,
				children: module.children ? this.filterModules(module.children) : null
			}));
	}

	private build(modules: ValidUser['modules'], currentPath: string): MenuItemWithState[] {
		const buildRecursive = (items: ValidUser['modules']): MenuItemUpdated[] | null => {
			return (
				items?.map((item) => ({
					...item,
					icon: getMenuIcon(item.icon),
					children: buildRecursive(item.children ?? [])
				})) ?? null
			);
		};

		const rawItems = buildRecursive(modules);
		const processedItems = (rawItems ?? []).map((item) => this.processItem(item, currentPath));
		
		// Inject "Barang Pembelian Lokal" menu item
		return this.injectLocalPurchaseItemMenu(processedItems, currentPath);
	}

	private injectLocalPurchaseItemMenu(items: MenuItemWithState[], currentPath: string): MenuItemWithState[] {
		const injectRecursive = (menuItems: MenuItemWithState[]): MenuItemWithState[] => {
			return menuItems.map((item) => {
				// Check if this item has the path that contains "master" or "data-utama"
				if (item.path_name?.includes('/master') || item.path_name?.includes('/data-utama')) {
					// This is likely the "Data Utama" menu, inject here
					const newChildren = [...(item.children || [])];
					
					// Find index of "Kontrol Stok" item
					const stockControlIndex = newChildren.findIndex(
						(c) => c.path_name?.includes('stock-control') || c.name?.toLowerCase().includes('kontrol stok')
					);
					
					// Find index of "Vendor" item
					const vendorIndex = newChildren.findIndex(
						(c) => c.path_name?.includes('/vendor') || c.name?.toLowerCase().includes('vendor')
					);
					
					// Create Barang Pembelian Lokal menu item
					const localPurchaseItemMenu: MenuItemWithState = {
						id: 99999,
						name: 'Barang Pembelian Lokal',
						slug: 'barang-pembelian-lokal',
						path_name: '/dashboard/material-management/inventory/master/local-purchase-item',
						kind: 'item',
						icon: getMenuIcon('package'),
						isActive: currentPath === '/dashboard/material-management/inventory/master/local-purchase-item',
						isExpanded: false,
						children: []
					};
					
					// Create Substitusi Barang menu item
					const itemSubstitutionMenu: MenuItemWithState = {
						id: 99983,
						name: 'Substitusi Barang',
						slug: 'substitusi-barang',
						path_name: '/dashboard/material-management/inventory/master/item-substitution',
						kind: 'item',
						icon: getMenuIcon('arrowLeft'),
						isActive: currentPath.includes('/dashboard/material-management/inventory/master/item-substitution'),
						isExpanded: false,
						children: []
					};

					// Create Penyimpanan Barang menu item
					const itemStorageMenu: MenuItemWithState = {
						id: 99981,
						name: 'Penyimpanan Barang',
						slug: 'penyimpanan-barang',
						path_name: '/dashboard/material-management/inventory/master/item-storage',
						kind: 'item',
						icon: getMenuIcon('warehouse'),
						isActive: currentPath.includes('/dashboard/material-management/inventory/master/item-storage') && !currentPath.includes('item-storage-layout'),
						isExpanded: false,
						children: []
					};

					// Create Rak Penyimpanan Barang menu item
					const itemStorageLayoutMenu: MenuItemWithState = {
						id: 99998,
						name: 'Rak Penyimpanan',
						slug: 'rak-penyimpanan-barang',
						path_name: '/dashboard/material-management/inventory/master/item-storage-layout',
						kind: 'item',
						icon: getMenuIcon('warehouse'),
						isActive: currentPath.includes('/dashboard/material-management/inventory/master/item-storage-layout'),
						isExpanded: false,
						children: []
					};
					
					// Check if already exists
					const localPurchaseExists = newChildren.some(
						(c) => c.slug === 'barang-pembelian-lokal' || c.path_name?.includes('local-purchase-item')
					);
					
					const storageLayoutExists = newChildren.some(
						(c) => c.slug === 'rak-penyimpanan-barang' || c.path_name?.includes('item-storage-layout')
					);

					const itemSubstitutionExists = newChildren.some(
						(c) => c.slug === 'substitusi-barang' || c.path_name?.includes('item-substitution')
					);

					const itemStorageExists = newChildren.some(
						(c) => c.slug === 'penyimpanan-barang'
					);
					
					// Inject Barang Pembelian Lokal before Kontrol Stok
					if (!localPurchaseExists) {
						if (stockControlIndex !== -1) {
							newChildren.splice(stockControlIndex, 0, localPurchaseItemMenu);
						} else {
							// If no stock control found, add after "Barang" item
							const barangIndex = newChildren.findIndex(
								(c) => c.path_name?.includes('/item') && !c.path_name?.includes('item-group')
							);
							if (barangIndex !== -1) {
								newChildren.splice(barangIndex + 1, 0, localPurchaseItemMenu);
							} else {
								newChildren.push(localPurchaseItemMenu);
							}
						}
					}
					
					// Inject Rak Penyimpanan Barang after Vendor
					if (!storageLayoutExists) {
						// Always add after vendor, or at end if vendor not found
						const actualVendorIndex = newChildren.findIndex(
							(c) => c.path_name?.includes('/vendor') || c.slug?.includes('vendor')
						);
						
						if (actualVendorIndex !== -1) {
							// Insert after vendor
							newChildren.splice(actualVendorIndex + 1, 0, itemStorageLayoutMenu);
						} else {
							// Add at the end
							newChildren.push(itemStorageLayoutMenu);
						}
					}

					// Inject Substitusi Barang after Barang Pembelian Lokal
					if (!itemSubstitutionExists) {
						const localPurchaseIdx = newChildren.findIndex(
							(c) => c.slug === 'barang-pembelian-lokal' || c.path_name?.includes('local-purchase-item')
						);
						if (localPurchaseIdx !== -1) {
							newChildren.splice(localPurchaseIdx + 1, 0, itemSubstitutionMenu);
						} else {
							newChildren.push(itemSubstitutionMenu);
						}
					}

					// Inject Penyimpanan Barang after Substitusi Barang
					if (!itemStorageExists) {
						const substitusiIdx = newChildren.findIndex((c) => c.slug === 'substitusi-barang');
						if (substitusiIdx !== -1) {
							newChildren.splice(substitusiIdx + 1, 0, itemStorageMenu);
						} else {
							newChildren.push(itemStorageMenu);
						}
					}
					
					return {
						...item,
						children: newChildren
					};
				}
				
				// Check if this item is "Transaksi" menu to inject "Pengeluaran Barang" and "Permintaan Kode Barang"
				if (item.path_name?.includes('/transaction') || item.name?.toLowerCase().includes('transaksi')) {
					const newChildren = [...(item.children || [])];
					
					// Create Transfer Antar Kebun menu item
					const interEstateTransferMenu: MenuItemWithState = {
						id: 99995,
						name: 'Transfer Antar Kebun',
						slug: 'transfer-antar-kebun',
						path_name: '/dashboard/material-management/inventory/transaction/inter-estate-transfer',
						kind: 'item',
						icon: getMenuIcon('arrowLeft'),
						isActive: currentPath.includes('/dashboard/material-management/inventory/transaction/inter-estate-transfer'),
						isExpanded: false,
						children: []
					};
					
					// Create Penerimaan Barang Pembelian Lokal menu item (flat, no parent)
					const penerimaanLokalMenu: MenuItemWithState = {
						id: 99991,
						name: 'Penerimaan Barang Pembelian Lokal',
						slug: 'penerimaan-barang-pembelian-lokal',
						path_name: '/dashboard/material-management/inventory/transaction/goods-receives-notes',
						kind: 'item',
						icon: getMenuIcon('package'),
						isActive: currentPath.includes('/dashboard/material-management/inventory/transaction/goods-receives-notes'),
						isExpanded: false,
						children: []
					};

					// Create Penerimaan Barang Transfer menu item (flat, no parent)
					const penerimaanTransferMenu: MenuItemWithState = {
						id: 99990,
						name: 'Penerimaan Barang Transfer',
						slug: 'penerimaan-barang-transfer',
						path_name: '/dashboard/material-management/inventory/transaction/transfer-receipt',
						kind: 'item',
						icon: getMenuIcon('packageOpen'),
						isActive: currentPath.includes('/dashboard/material-management/inventory/transaction/transfer-receipt'),
						isExpanded: false,
						children: []
					};

					// Create Penerimaan Barang Tanpa PO menu item (flat, no parent)
					const grnWithoutPOMenu: MenuItemWithState = {
						id: 99989,
						name: 'Penerimaan Barang Tanpa PO',
						slug: 'penerimaan-barang-tanpa-po',
						path_name: '/dashboard/material-management/inventory/transaction/grn-without-po',
						kind: 'item',
						icon: getMenuIcon('package'),
						isActive: currentPath.includes('/dashboard/material-management/inventory/transaction/grn-without-po'),
						isExpanded: false,
						children: []
					};

					// Create Penerimaan Barang Re-Conditioned Stock menu item (flat, no parent)
					const grnReconditionedStockMenu: MenuItemWithState = {
						id: 99988,
						name: 'Penerimaan Re-Conditioned Stock',
						slug: 'penerimaan-barang-reconditioned-stock',
						path_name: '/dashboard/material-management/inventory/transaction/grn-reconditioned-stock',
						kind: 'item',
						icon: getMenuIcon('package'),
						isActive: currentPath.includes('/dashboard/material-management/inventory/transaction/grn-reconditioned-stock'),
						isExpanded: false,
						children: []
					};
					
					// Create Pengeluaran Barang menu item
					const goodsIssueMenu: MenuItemWithState = {
						id: 99997,
						name: 'Pengeluaran Barang',
						slug: 'pengeluaran-barang',
						path_name: '/dashboard/material-management/inventory/transaction/goods-issue',
						kind: 'item',
						icon: getMenuIcon('packageOpen'),
						isActive: currentPath.includes('/dashboard/material-management/inventory/transaction/goods-issue'),
						isExpanded: false,
						children: []
					};
					
					// Create Pengembalian Pengeluaran menu item
					const issueReturnMenu: MenuItemWithState = {
						id: 99993,
						name: 'Pengembalian Pengeluaran',
						slug: 'pengembalian-pengeluaran',
						path_name: '/dashboard/material-management/inventory/transaction/issue-return',
						kind: 'item',
						icon: getMenuIcon('undo'),
						isActive: currentPath.includes('/dashboard/material-management/inventory/transaction/issue-return'),
						isExpanded: false,
						children: []
					};

					// Create Pengembalian Pembelian menu item
					const purchaseReturnMenu: MenuItemWithState = {
						id: 99987,
						name: 'Pengembalian Pembelian',
						slug: 'pengembalian-pembelian',
						path_name: '/dashboard/material-management/inventory/transaction/purchase-return',
						kind: 'item',
						icon: getMenuIcon('undo'),
						isActive: currentPath.includes('/dashboard/material-management/inventory/transaction/purchase-return'),
						isExpanded: false,
						children: []
					};

					// Create Penyesuaian Stok menu item
					const stockAdjustmentMenu: MenuItemWithState = {
						id: 99986,
						name: 'Penyesuaian Stok',
						slug: 'penyesuaian-stok',
						path_name: '/dashboard/material-management/inventory/transaction/stock-adjustment',
						kind: 'item',
						icon: getMenuIcon('clipboardList'),
						isActive: currentPath.includes('/dashboard/material-management/inventory/transaction/stock-adjustment'),
						isExpanded: false,
						children: []
					};
					
					// Create Permintaan Transfer Stok menu item
					const stockTransferRequestMenu: MenuItemWithState = {
						id: 99994,
						name: 'Permintaan Transfer Stok',
						slug: 'permintaan-transfer-stok',
						path_name: '/dashboard/material-management/inventory/transaction/stock-transfer-request',
						kind: 'item',
						icon: getMenuIcon('packageCheck'),
						isActive: currentPath.includes('/dashboard/material-management/inventory/transaction/stock-transfer-request'),
						isExpanded: false,
						children: []
					};
					
					// Create Permintaan Kode Barang menu item
					const itemCodeRequestMenu: MenuItemWithState = {
						id: 99996,
						name: 'Permintaan Kode Barang',
						slug: 'permintaan-kode-barang',
						path_name: '/dashboard/material-management/inventory/transaction/item-code-request',
						kind: 'item',
						icon: getMenuIcon('fileText'),
						isActive: currentPath.includes('/dashboard/material-management/inventory/transaction/item-code-request'),
						isExpanded: false,
						children: []
					};
					
					// Remove existing GRN menu from API first (we inject our own items below)
					const existingGrnIndex = newChildren.findIndex(
						(c) => c.path_name?.includes('goods-receives-notes') || c.path_name?.includes('transfer-receipt')
					);
					if (existingGrnIndex !== -1) {
						newChildren.splice(existingGrnIndex, 1);
					}

					// Check if already exists (after removal above)
					const interEstateTransferExists = newChildren.some(
						(c) => c.slug === 'transfer-antar-kebun' || c.path_name?.includes('inter-estate-transfer')
					);
					const penerimaanLokalExists = newChildren.some(
						(c) => c.slug === 'penerimaan-barang-pembelian-lokal'
					);
					const penerimaanTransferExists = newChildren.some(
						(c) => c.slug === 'penerimaan-barang-transfer'
					);
					const grnWithoutPOExists = newChildren.some(
						(c) => c.slug === 'penerimaan-barang-tanpa-po'
					);

					const grnReconditionedStockExists = newChildren.some(
						(c) => c.slug === 'penerimaan-barang-reconditioned-stock'
					);
					
					const goodsIssueExists = newChildren.some(
						(c) => c.slug === 'pengeluaran-barang' || c.path_name?.includes('goods-issue')
					);
					
					const issueReturnExists = newChildren.some(
						(c) => c.slug === 'pengembalian-pengeluaran' || c.path_name?.includes('issue-return')
					);

					const purchaseReturnExists = newChildren.some(
						(c) => c.slug === 'pengembalian-pembelian' || c.path_name?.includes('purchase-return')
					);

					const stockAdjustmentExists = newChildren.some(
						(c) => c.slug === 'penyesuaian-stok' || c.path_name?.includes('stock-adjustment')
					);
					
					const stockTransferRequestExists = newChildren.some(
						(c) => c.slug === 'permintaan-transfer-stok' || c.path_name?.includes('stock-transfer-request')
					);
					
					const itemCodeRequestExists = newChildren.some(
						(c) => c.slug === 'permintaan-kode-barang' || c.path_name?.includes('item-code-request')
					);
					
					// Inject Transfer Antar Kebun before Proses Pembelian Lokal
					if (!interEstateTransferExists) {
						const localPurchaseIndex = newChildren.findIndex(
							(c) => c.path_name?.includes('local-purchase-analysis') || c.name?.toLowerCase().includes('proses pembelian')
						);
						
						if (localPurchaseIndex !== -1) {
							// Insert before Proses Pembelian Lokal
							newChildren.splice(localPurchaseIndex, 0, interEstateTransferMenu);
						} else {
							// Add after Permintaan Barang if Proses Pembelian not found
							const prIndex = newChildren.findIndex(
								(c) => c.path_name?.includes('purchase-request') || c.name?.toLowerCase().includes('permintaan')
							);
							if (prIndex !== -1) {
								newChildren.splice(prIndex + 1, 0, interEstateTransferMenu);
							} else {
								newChildren.push(interEstateTransferMenu);
							}
						}
					}
					
					// Inject Penerimaan Barang Pembelian Lokal after Transfer Antar Kebun
					if (!penerimaanLokalExists) {
						const transferIndex = newChildren.findIndex(
							(c) => c.slug === 'transfer-antar-kebun' || c.path_name?.includes('inter-estate-transfer')
						);

						if (transferIndex !== -1) {
							newChildren.splice(transferIndex + 1, 0, penerimaanLokalMenu);
						} else {
							const prIndex = newChildren.findIndex(
								(c) => c.path_name?.includes('purchase-request') || c.name?.toLowerCase().includes('permintaan')
							);
							if (prIndex !== -1) {
								newChildren.splice(prIndex + 1, 0, penerimaanLokalMenu);
							} else {
								newChildren.push(penerimaanLokalMenu);
							}
						}
					}

					// Inject Penerimaan Barang Transfer right after Penerimaan Barang Pembelian Lokal
					if (!penerimaanTransferExists) {
						const lokalIndex = newChildren.findIndex(
							(c) => c.slug === 'penerimaan-barang-pembelian-lokal' || c.path_name?.includes('goods-receives-notes')
						);

						if (lokalIndex !== -1) {
							newChildren.splice(lokalIndex + 1, 0, penerimaanTransferMenu);
						} else {
							newChildren.push(penerimaanTransferMenu);
						}
					}

					// Inject Penerimaan Barang Tanpa PO right after Penerimaan Barang Transfer
					if (!grnWithoutPOExists) {
						const transferIndex = newChildren.findIndex(
							(c) => c.slug === 'penerimaan-barang-transfer' || c.path_name?.includes('transfer-receipt')
						);

						if (transferIndex !== -1) {
							newChildren.splice(transferIndex + 1, 0, grnWithoutPOMenu);
						} else {
							newChildren.push(grnWithoutPOMenu);
						}
					}

					// Inject Penerimaan Re-Conditioned Stock right after Penerimaan Barang Tanpa PO
					if (!grnReconditionedStockExists) {
						const grnWithoutPOIndex = newChildren.findIndex(
							(c) => c.slug === 'penerimaan-barang-tanpa-po'
						);
						if (grnWithoutPOIndex !== -1) {
							newChildren.splice(grnWithoutPOIndex + 1, 0, grnReconditionedStockMenu);
						} else {
							newChildren.push(grnReconditionedStockMenu);
						}
					}
					
					// Inject Permintaan Transfer Stok before Permintaan Kode Barang
					if (!stockTransferRequestExists) {
						const itemCodeRequestIndex = newChildren.findIndex(
							(c) => c.path_name?.includes('item-code-request') || c.slug === 'permintaan-kode-barang'
						);
						
						if (itemCodeRequestIndex !== -1) {
							// Insert before Permintaan Kode Barang
							newChildren.splice(itemCodeRequestIndex, 0, stockTransferRequestMenu);
						} else {
							// Add at the end if Permintaan Kode Barang not found
							newChildren.push(stockTransferRequestMenu);
						}
					}
					
					// Inject Pengeluaran Barang after Penerimaan Barang Transfer
					if (!goodsIssueExists) {
						const penerimaanTransferIndex = newChildren.findIndex(
							(c) => c.slug === 'penerimaan-barang-transfer' || c.path_name?.includes('transfer-receipt')
						);

						if (penerimaanTransferIndex !== -1) {
							newChildren.splice(penerimaanTransferIndex + 1, 0, goodsIssueMenu);
						} else {
							newChildren.push(goodsIssueMenu);
						}
					}
					
					// Inject Pengembalian Pengeluaran after Pengeluaran Barang
					if (!issueReturnExists) {
						const goodsIssueIndex = newChildren.findIndex(
							(c) => c.path_name?.includes('goods-issue') || c.slug === 'pengeluaran-barang'
						);
						
						if (goodsIssueIndex !== -1) {
							// Insert after Pengeluaran Barang
							newChildren.splice(goodsIssueIndex + 1, 0, issueReturnMenu);
						} else {
							// Add at the end if Pengeluaran Barang not found
							newChildren.push(issueReturnMenu);
						}
					}

					// Inject Pengembalian Pembelian after Pengembalian Pengeluaran
					if (!purchaseReturnExists) {
						const issueReturnIndex = newChildren.findIndex(
							(c) => c.slug === 'pengembalian-pengeluaran' || c.path_name?.includes('issue-return')
						);
						if (issueReturnIndex !== -1) {
							newChildren.splice(issueReturnIndex + 1, 0, purchaseReturnMenu);
						} else {
							newChildren.push(purchaseReturnMenu);
						}
					}

					// Inject Penyesuaian Stok after Pengembalian Pembelian
					if (!stockAdjustmentExists) {
						const purchaseReturnIndex = newChildren.findIndex(
							(c) => c.slug === 'pengembalian-pembelian' || c.path_name?.includes('purchase-return')
						);
						if (purchaseReturnIndex !== -1) {
							newChildren.splice(purchaseReturnIndex + 1, 0, stockAdjustmentMenu);
						} else {
							newChildren.push(stockAdjustmentMenu);
						}
					}

					// Create Entri Stok Opname menu item
					const physicalStocktakeMenu: MenuItemWithState = {
						id: 99985,
						name: 'Entri Stok Opname',
						slug: 'entri-stok-opname',
						path_name: '/dashboard/material-management/inventory/transaction/physical-stocktake',
						kind: 'item',
						icon: getMenuIcon('clipboardList'),
						isActive: currentPath.includes('/dashboard/material-management/inventory/transaction/physical-stocktake'),
						isExpanded: false,
						children: []
					};

					const physicalStocktakeExists = newChildren.some((c) => c.slug === 'entri-stok-opname');

					// Inject Entri Stok Opname after Penyesuaian Stok
					if (!physicalStocktakeExists) {
						const stockAdjIndex = newChildren.findIndex((c) => c.slug === 'penyesuaian-stok');
						if (stockAdjIndex !== -1) {
							newChildren.splice(stockAdjIndex + 1, 0, physicalStocktakeMenu);
						} else {
							newChildren.push(physicalStocktakeMenu);
						}
					}

					// Create Rekonsiliasi Stok menu item
					const stockReconciliationMenu: MenuItemWithState = {
						id: 99984,
						name: 'Rekonsiliasi Stok',
						slug: 'rekonsiliasi-stok',
						path_name: '/dashboard/material-management/inventory/transaction/stock-reconciliation',
						kind: 'item',
						icon: getMenuIcon('clipboardList'),
						isActive: currentPath.includes('/dashboard/material-management/inventory/transaction/stock-reconciliation'),
						isExpanded: false,
						children: []
					};

					const stockReconciliationExists = newChildren.some((c) => c.slug === 'rekonsiliasi-stok');
					if (!stockReconciliationExists) {
						const idx = newChildren.findIndex((c) => c.slug === 'entri-stok-opname');
						if (idx !== -1) newChildren.splice(idx + 1, 0, stockReconciliationMenu);
						else newChildren.push(stockReconciliationMenu);
					}

					// Inject Permintaan Kode Barang at the end of Transaksi menu
					if (!itemCodeRequestExists) {
						newChildren.push(itemCodeRequestMenu);
					}

					// Create Posting Akun Harian menu item
					const dailyAccountPostingMenu: MenuItemWithState = {
						id: 99982,
						name: 'Posting Akun Harian',
						slug: 'posting-akun-harian',
						path_name:
							'/dashboard/material-management/inventory/transaction/daily-account-posting',
						kind: 'item',
						icon: getMenuIcon('fileText'),
						isActive: currentPath.includes(
							'/dashboard/material-management/inventory/transaction/daily-account-posting'
						),
						isExpanded: false,
						children: []
					};
					const dailyAccountPostingExists = newChildren.some(
						(c) => c.slug === 'posting-akun-harian'
					);
					if (!dailyAccountPostingExists) {
						newChildren.push(dailyAccountPostingMenu);
					}

					return {
						...item,
						children: newChildren
					};
				}
				
				// Recursively process children
				if (item.children && item.children.length > 0) {
					return {
						...item,
						children: injectRecursive(item.children)
					};
				}
				
				return item;
			});
		};
		
		return injectRecursive(items);
	}

	private processItem(item: MenuItemUpdated, currentPath: string): MenuItemWithState {
		const isActive = this.isMenuActive(item, currentPath);
		const hasActiveChild = this.hasActiveDescendant(item, currentPath);

		// Recursively process children
		const children = item.children?.map((child) => this.processItem(child, currentPath)) ?? null;

		return {
			...item,
			isActive,
			kind: item.kind ?? (item.children?.length ? 'module' : 'item'),
			// isExpanded: isActive || hasActiveChild, // Initial expansion state
			isExpanded: hasActiveChild, // Initial expansion state
			children: children ?? []
		};
	}

	private isMenuActive(item: MenuItemUpdated, pathname: string): boolean {
		if (item.kind === 'item') {
			return item.path_name === pathname;
		}
		// logic for group/module/category
		return pathname.startsWith(item.path_name ?? '');
	}

	private hasActiveDescendant(item: MenuItemUpdated, pathname: string): boolean {
		if (this.isMenuActive(item, pathname)) return true;
		return item.children?.some((child) => this.hasActiveDescendant(child, pathname)) ?? false;
	}

	public syncPath(pathname: string) {
		const updateRecursive = (items: MenuItemWithState[]) => {
			for (const item of items) {
				const isActive = this.isMenuActive(item, pathname);
				const hasActiveChild = this.hasActiveDescendant(item, pathname);

				item.isActive = isActive;

				// Only auto-expand if active or has active child.
				// Do NOT collapse if it was already open and now is not active (user might want it open).
				// However, the requirement says "reactive so we can change the value when the user click a menu and navigate away"
				// which implies persistence.
				// But we definitely want to OPEN it if it becomes active.
				if (isActive || hasActiveChild) {
					item.isExpanded = true;
				}

				if (item.children) {
					updateRecursive(item.children);
				}
			}
		};

		updateRecursive(this.items);
	}

	flattenAndBuildSearchIndex(
		nodes: ModuleNode[],
		options?: {
			parentBreadcrumb?: string[];
			depth?: number;
		}
	): FlatModuleSearch[] {
		const { parentBreadcrumb = [], depth = 0 } = options ?? {};

		const result: FlatModuleSearch[] = [];

		for (const node of nodes) {
			const breadcrumb = [...parentBreadcrumb, node.name];
			const isLeaf = !node.children || node.children.length === 0;

			result.push({
				id: node.id,
				parent_id: node.parent_id,

				name: node.name,
				slug: node.slug,
				path_name: node.path_name,

				kind: node.kind,
				icon: node.icon,
				description: node.description,
				sort_order: node.sort_order,

				depth,
				breadcrumb,
				breadcrumbLabel: breadcrumb.join(' → '),

				isLeaf,

				searchText: [node.name, node.slug, node.description, node.path_name, ...breadcrumb]
					.filter(Boolean)
					.join(' ')
					.toLowerCase()
			});

			if (node.children?.length) {
				result.push(
					...this.flattenAndBuildSearchIndex(node.children, {
						parentBreadcrumb: breadcrumb,
						depth: depth + 1
					})
				);
			}
		}

		return result;
	}

	searchModules(query: string) {
		const q = query.toLowerCase();

		return this.flattedItems
			.filter((item) => item.isLeaf && item.path_name)
			.filter((item) => item.searchText.includes(q));
	}
}

export class PersistentMenuState {
	private key = 'menuState';
	private maxItems = 5;

	safeParse<T>(data: string): T | null {
		try {
			return JSON.parse(data);
		} catch {
			return null;
		}
	}

	safeStringify<T>(data: T): string {
		try {
			return JSON.stringify(data);
		} catch {
			return '';
		}
	}

	async getFromRecent(): Promise<FlatModuleSearch[]> {
		const state = await get(this.key);
		if (state) {
			const items = this.safeParse(state) as FlatModuleSearch[];
			return items.slice(0, this.maxItems);
		}
		return [];
	}

	async saveToRecent(item: FlatModuleSearch, next?: (updated: FlatModuleSearch[]) => void) {
		const existing = await this.getFromRecent();
		const filtered = existing.filter((i) => i.id !== item.id);
		const updated = [item, ...filtered].slice(0, this.maxItems);
		await set(this.key, this.safeStringify(updated));
		next?.(updated);
	}

	// removeFromRecent(k: string) {
	// 	del(this.key);
	// }

	async clearRecent() {
		await del(this.key);
	}
}
export const [getMenuContext, setMenuContext] = createContext<() => MenuState>();

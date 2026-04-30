/**
 * Query keys for functional-admin module
 * All keys are stable, namespaced, and array-based
 * Parameter types are derived from OpenAPI spec
 */
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

export const functionalAdminKeys = {
	all: ['functional-admin'] as const,

	// Administrative Units
	administrativeUnits: () => [...functionalAdminKeys.all, 'administrative-units'] as const,
	administrativeUnitList: (
		params?: operations['list-administrative-units']['parameters']['query']
	) => [...functionalAdminKeys.administrativeUnits(), 'list', params] as const,

	// Divisions
	divisions: () => [...functionalAdminKeys.all, 'divisions'] as const,
	divisionList: (params?: operations['list-divisions']['parameters']['query']) =>
		[...functionalAdminKeys.divisions(), 'list', params] as const,

	// Estates
	estates: () => [...functionalAdminKeys.all, 'estates'] as const,
	estateList: (params?: operations['list-estates']['parameters']['query']) =>
		[...functionalAdminKeys.estates(), 'list', params] as const,
	estateDetail: (id: operations['get-estate']['parameters']['path']['id']) =>
		[...functionalAdminKeys.estates(), 'detail', id] as const,
	estateByCode: (code: operations['get-estate-by-code']['parameters']['path']['code']) =>
		[...functionalAdminKeys.estates(), 'by-code', code] as const,

	// Factories
	factories: () => [...functionalAdminKeys.all, 'factories'] as const,
	factoryList: (params?: operations['list-factories']['parameters']['query']) =>
		[...functionalAdminKeys.factories(), 'list', params] as const,
	factoryDetail: (id: operations['get-factory']['parameters']['path']['id']) =>
		[...functionalAdminKeys.factories(), 'detail', id] as const,

	// Alokasi Umum
	alokasiUmum: () => [...functionalAdminKeys.all, 'alokasi-umum'] as const,
	alokasiUmumList: (params?: operations['list-alokasi-umums']['parameters']['query']) =>
		[...functionalAdminKeys.alokasiUmum(), 'list', params] as const,
	alokasiUmumDetail: (id: operations['get-alokasi-umum']['parameters']['path']['id']) =>
		[...functionalAdminKeys.alokasiUmum(), 'detail', id] as const,

	// Alokasi Heading
	alokasiHeading: () => [...functionalAdminKeys.all, 'alokasi-heading'] as const,
	alokasiHeadingList: (params?: operations['list-alokasi-headings']['parameters']['query']) =>
		[...functionalAdminKeys.alokasiHeading(), 'list', params] as const,
	alokasiHeadingDetail: (id: operations['get-alokasi-heading']['parameters']['path']['id']) =>
		[...functionalAdminKeys.alokasiHeading(), 'detail', id] as const,

	// General Allocation Settings
	allocationSettings: () => [...functionalAdminKeys.all, 'allocation-settings'] as const,
	allocationSettingList: (
		params?: operations['list-general-allocation-settings']['parameters']['query']
	) => [...functionalAdminKeys.allocationSettings(), 'list', params] as const,
	allocationSettingDetail: (
		id: operations['get-general-allocation-setting']['parameters']['path']['id']
	) => [...functionalAdminKeys.allocationSettings(), 'detail', id] as const,

	// Area Compositions
	areaCompositions: () => [...functionalAdminKeys.all, 'area-compositions'] as const,
	areaCompositionList: (params?: operations['list-area-compositions']['parameters']['query']) =>
		[...functionalAdminKeys.areaCompositions(), 'list', params] as const,
	areaCompositionDetail: (id: operations['get-area-composition']['parameters']['path']['id']) =>
		[...functionalAdminKeys.areaCompositions(), 'detail', id] as const,

	// Companies
	companies: () => [...functionalAdminKeys.all, 'companies'] as const,
	companyList: (params?: operations['list-companies']['parameters']['query']) =>
		[...functionalAdminKeys.companies(), 'list', params] as const,
	companyDetail: (id: operations['get-company']['parameters']['path']['id']) =>
		[...functionalAdminKeys.companies(), 'detail', id] as const,

	// Commodities
	commodities: () => [...functionalAdminKeys.all, 'commodities'] as const,
	commodityList: (params?: operations['list-commodities']['parameters']['query']) =>
		[...functionalAdminKeys.commodities(), 'list', params] as const,
	commodityDetail: (id: operations['get-commodity']['parameters']['path']['id']) =>
		[...functionalAdminKeys.commodities(), 'detail', id] as const,

	// Clones
	clones: () => [...functionalAdminKeys.all, 'clones'] as const,
	cloneList: (params?: operations['list-clones']['parameters']['query']) =>
		[...functionalAdminKeys.clones(), 'list', params] as const,
	cloneDetail: (id: operations['get-clone']['parameters']['path']['id']) =>
		[...functionalAdminKeys.clones(), 'detail', id] as const,

	// Kebangsaan (Nationalities)
	kebangsaan: () => [...functionalAdminKeys.all, 'kebangsaan'] as const,
	kebangsaanList: (params?: operations['list-kebangsaans']['parameters']['query']) =>
		[...functionalAdminKeys.kebangsaan(), 'list', params] as const,
	kebangsaanDetail: (id: operations['get-kebangsaan']['parameters']['path']['id']) =>
		[...functionalAdminKeys.kebangsaan(), 'detail', id] as const,

	// Master Types
	masterTypes: () => [...functionalAdminKeys.all, 'master-types'] as const,
	masterTypeList: (params?: operations['list-master-types']['parameters']['query']) =>
		[...functionalAdminKeys.masterTypes(), 'list', params] as const,
	masterTypeDetail: (id: operations['get-master-type']['parameters']['path']['id']) =>
		[...functionalAdminKeys.masterTypes(), 'detail', id] as const,
	masterTypeByName: (name: operations['get-master-type-by-name']['parameters']['query']['name']) =>
		[...functionalAdminKeys.masterTypes(), 'by-name', name] as const,

	// Master Values
	masterValues: () => [...functionalAdminKeys.all, 'master-values'] as const,
	masterValueList: (params?: operations['list-master-values']['parameters']['query']) =>
		[...functionalAdminKeys.masterValues(), 'list', params] as const,
	masterValuesByType: (
		masterTypeId: operations['list-master-values-by-type']['parameters']['path']['master_type_id']
	) => [...functionalAdminKeys.masterValues(), 'by-type', masterTypeId] as const,
	masterValueDetail: (id: operations['get-master-value']['parameters']['path']['id']) =>
		[...functionalAdminKeys.masterValues(), 'detail', id] as const,

	// Musim (Seasons)
	seasons: () => [...functionalAdminKeys.all, 'seasons'] as const,
	seasonList: (params?: operations['list-seasons']['parameters']['query']) =>
		[...functionalAdminKeys.seasons(), 'list', params] as const,
	seasonDetail: (id: operations['get-season']['parameters']['path']['id']) =>
		[...functionalAdminKeys.seasons(), 'detail', id] as const,
	seasonDetails: (seasonId: operations['list-season-details']['parameters']['path']['season_id']) =>
		[...functionalAdminKeys.seasons(), 'details', seasonId] as const,

	// Geographical Units
	geographicalUnits: () => [...functionalAdminKeys.all, 'geographical-units'] as const,
	geographicalUnitList: (params?: operations['list-geographical-units']['parameters']['query']) =>
		[...functionalAdminKeys.geographicalUnits(), 'list', params] as const,
	geographicalUnitDetail: (id: operations['get-geographical-unit']['parameters']['path']['id']) =>
		[...functionalAdminKeys.geographicalUnits(), 'detail', id] as const,

	// Groups
	groups: () => [...functionalAdminKeys.all, 'groups'] as const,
	groupList: (params?: operations['list-groups']['parameters']['query']) =>
		[...functionalAdminKeys.groups(), 'list', params] as const,
	groupDetail: (id: operations['get-group']['parameters']['path']['id']) =>
		[...functionalAdminKeys.groups(), 'detail', id] as const,

	// Projects
	projects: () => [...functionalAdminKeys.all, 'projects'] as const,
	projectList: (params?: operations['list-projects']['parameters']['query']) =>
		[...functionalAdminKeys.projects(), 'list', params] as const,
	projectDetail: (id: operations['get-project']['parameters']['path']['id']) =>
		[...functionalAdminKeys.projects(), 'detail', id] as const,

	// UOM (Satuan Ukuran)
	uom: () => [...functionalAdminKeys.all, 'uom'] as const,
	uomList: (params?: operations['list-uoms']['parameters']['query']) =>
		[...functionalAdminKeys.uom(), 'list', params] as const,
	uomDetail: (id: operations['get-uom']['parameters']['path']['id']) =>
		[...functionalAdminKeys.uom(), 'detail', id] as const,
	uomByCode: (code: operations['get-uom-by-code']['parameters']['path']['code']) =>
		[...functionalAdminKeys.uom(), 'by-code', code] as const,

	// UOM Conversions
	uomConversions: () => [...functionalAdminKeys.all, 'uom-conversions'] as const,
	uomConversionList: (params?: operations['list-uom-conversions']['parameters']['query']) =>
		[...functionalAdminKeys.uomConversions(), 'list', params] as const,
	uomConversionDetail: (id: operations['get-uom-conversion']['parameters']['path']['id']) =>
		[...functionalAdminKeys.uomConversions(), 'detail', id] as const,

	// Work Places
	workPlaces: () => [...functionalAdminKeys.all, 'work-places'] as const,
	workPlaceList: (params?: operations['list-work-places']['parameters']['query']) =>
		[...functionalAdminKeys.workPlaces(), 'list', params] as const,
	workPlaceDetail: (id: operations['get-work-place']['parameters']['path']['id']) =>
		[...functionalAdminKeys.workPlaces(), 'detail', id] as const,

	// Crop (Panenan)
	crops: () => [...functionalAdminKeys.all, 'crops'] as const,
	cropList: (params?: operations['list-crops']['parameters']['query']) =>
		[...functionalAdminKeys.crops(), 'list', params] as const,
};

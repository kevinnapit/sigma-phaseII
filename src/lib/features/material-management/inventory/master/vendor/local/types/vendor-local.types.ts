/**
 * Local Vendor types
 */

// Base types
export interface AddressLink {
	address_type: string;
	fk_address_id: string;
	i_version: number;
	uoid: string;
}

export interface PartyDetail {
	credit_period_in_days: number;
	fk_master_value_party_type_id: string;
	i_version: number;
	payee: string;
	uoid: string;
}

export interface BusinessLocation {
	code: string;
	is_active: boolean;
	is_factory: boolean;
	name: string;
	parent?: any;
	parent_administrative_unit_id: string;
	stores?: StoreItem[];
	uoid: string;
}

export interface StoreItem {
	administrative_unit?: any;
	administrative_unit_id: string;
	child_stores?: any[];
	code: string;
	i_version: number;
	is_active: boolean;
	last_modified_time: number;
	name: string;
	parent_store?: any;
	parent_store_id: string;
	store_type?: {
		code: number;
		id: string;
		value: string;
	};
	store_type_id: string;
	uoid: string;
}

export interface DefaultAccount {
	code: string;
	name: string;
	uoid: string;
}

export interface PartyDefaultCategory {
	code: number;
	id: string;
	value: string;
}

export interface VendorUser {
	uoid: string;
	registration_status: string;
}

export interface LocalVendorItem {
	address_links?: AddressLink[];
	addresses?: AddressItem[];
	b_arch?: boolean;
	b_locked?: boolean;
	business_location?: BusinessLocation;
	business_location_id?: string;
	c_action?: string;
	code: string;
	company_name: string;
	d_last_modified_time?: string;
	default_account?: DefaultAccount;
	default_account_name?: string;
	fk_business_location_id?: string;
	fk_default_account_id: string;
	fk_party_default_category_id: string;
	party_default_category?: PartyDefaultCategory;
	party_default_category_value?: string;
	i_version: number;
	is_active: boolean;
	last_modified_time?: string;
	license_registration_number?: string;
	name: string;
	notes?: string;
	party_details?: PartyDetail[];
	short_name: string;
	u_context_id?: string;
	u_session_id?: string;
	uoid: string;
	v_user_id?: string;
	vendor_user?: VendorUser;
}

// Address types
export interface CommunicationType {
	id: string;
	value: string;
}

export interface AddressItem {
	address: string;
	address_id: string;
	address_type: string;
	city: string;
	communication_type_ids?: string[];
	communication_types?: CommunicationType[];
	contact_person: string;
	country_id: string;
	country_value?: string;
	designation: string;
	email: string;
	email_alt: string;
	fax: string;
	i_version: number;
	link_id: string;
	mobile: string;
	remarks: string;
	state: string;
	tel: string;
	uoid: string;
	url: string;
	zip: string;
}

// Party Type (Category) types
export interface PartyTypeItem {
	credit_period_in_days: number;
	id?: string;
	uoid?: string;
	i_version?: number;
	party_type_id: string;
	party_type_value?: string;
	payee: string;
}

// Bank types
export interface BankItem {
	account_number: string;
	bank_id?: string;
	bank_name?: string;
	branch_id: string;
	branch_name?: string;
	i_version?: number;
	party_bank_id?: string;
}

// Other Info types
export interface OtherInfoItem {
	date: string;
	i_version?: number;
	remarks: string;
	uoid?: string;
}

// Tax Registration types
export interface TaxRegistrationItem {
	additional_charge_discount_code?: string;
	additional_charge_discount_id: string;
	date: string;
	expiry_date: string;
	id?: string;
	uoid?: string;
	number: string;
	i_version?: number;
}

// Transaction Type (Category Account) types
export interface TransactionTypeItem {
	account_id: string;
	account_name: string;
	id?: string;
	uoid?: string;
	i_version?: number;
	party_type_id: string;
	party_type_value: string;
	transaction_type_id: string;
	transaction_type_value: string;
}

// Custom Property types
export interface CustomPropertyItem {
	custom_property_id: string;
	custom_property_value?: string;
	id?: string;
	uoid?: string;
	i_version?: number;
	value: string;
}

// API Request types
export interface CreateLocalVendorRequest {
	code: string;
	company_name: string;
	name: string;
	short_name: string;
	license_registration_number?: string;
	notes?: string;
	is_active: boolean;
	fk_party_default_category_id: string;
	fk_default_account_id: string;
}

export interface UpdateLocalVendorRequest {
	code: string;
	company_name: string;
	name: string;
	short_name: string;
	license_registration_number?: string;
	notes?: string;
	is_active: boolean;
	fk_party_default_category_id?: string;
	fk_default_account_id?: string;
}

export interface RegisterVendorRequest {
	party_id: string;
}

export interface ResendVendorRegistrationRequest {
	vendor_user_id: string;
}

export interface RegisterVendorResponse {
	success: boolean;
	message?: string;
}

// API Response types
export interface Pagination {
	current_page: number;
	page_size: number;
	total_items: number;
	total_pages: number;
}

export interface WebResponse<T> {
	$schema?: string;
	data: T;
	errors?: string;
	pagination?: Pagination;
}

export interface LocalVendorListResponse extends WebResponse<LocalVendorItem[]> {}

export interface LocalVendorDetailResponse {
	$schema?: string;
	business_location?: BusinessLocation;
	code: string;
	company_name: string;
	d_last_modified_time?: string;
	default_account?: DefaultAccount;
	fk_business_location_id?: string;
	fk_default_account_id: string;
	fk_party_default_category_id: string;
	i_version: number;
	is_active: boolean;
	license_registration_number?: string;
	name: string;
	notes?: string;
	party_default_category?: PartyDefaultCategory;
	short_name: string;
	uoid: string;
	v_user_id?: string;
	vendor_user?: VendorUser;
}

export interface LocalVendorAddressListResponse extends WebResponse<AddressItem[]> {}

export interface LocalVendorPartyTypesResponse extends WebResponse<PartyTypeItem[]> {}

export interface LocalVendorBankListResponse extends WebResponse<BankItem[]> {}

export interface LocalVendorOtherInfoListResponse extends WebResponse<OtherInfoItem[]> {}

export interface LocalVendorTaxRegistrationListResponse extends WebResponse<
	TaxRegistrationItem[]
> {}

export interface LocalVendorTransactionTypeListResponse extends WebResponse<
	TransactionTypeItem[]
> {}

export interface LocalVendorCustomPropertyListResponse extends WebResponse<CustomPropertyItem[]> {}

// Query parameters
export interface LocalVendorListParams {
	page: number;
	limit: number;
	search?: string;
	has_vendor_user?: boolean;
	is_active?: boolean;
	party_type_id?: string;
	vendor_registration_status?: 'active' | 'pending' | 'sent' | 'suspended' | 'expired';
	order_by?: 'code' | 'name';
	order_direction?: 'asc' | 'desc';
}

// Stats types
export interface LocalVendorStats {
	localVendors: number;
	activeLocal: number;
	pendingInvitations: number;
}

export interface LocalVendorStatsResponse extends WebResponse<LocalVendorStats> {}

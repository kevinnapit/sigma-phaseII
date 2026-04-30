import { z } from "zod";

// AccountAllocation
export const AccountAllocationSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// AccountDetail
export const AccountDetailSchema = z
  .object({
    account_type: z
      .object({
        code: z.string(),
        description: z.string().optional(),
        id: z.string(),
        name: z.string(),
      })
      .strict(),
    alternate_group: z
      .object({
        code: z.string(),
        id: z.string(),
        level: z.number().int(),
        name: z.string(),
      })
      .strict()
      .optional(),
    code: z.string(),
    group: z
      .object({
        code: z.string(),
        id: z.string(),
        level: z.number().int(),
        name: z.string(),
      })
      .strict(),
    id: z.string(),
    is_active: z.boolean(),
    is_reconciliation_account: z.boolean(),
    last_modified_time: z.string().datetime({ offset: true }),
    name: z.string(),
    parent_group: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    short_name: z.string().optional(),
    version: z.number().int(),
  })
  .strict();

// AccountGroupDetail
export const AccountGroupDetailSchema = z
  .object({
    account_type: z
      .object({
        code: z.string(),
        description: z.string().optional(),
        id: z.string(),
        name: z.string(),
      })
      .strict(),
    code: z.string(),
    id: z.string(),
    is_active: z.boolean(),
    last_modified_time: z.string().datetime({ offset: true }),
    level: z.number().int(),
    name: z.string(),
    parent_account_group: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    short_name: z.string().optional(),
    version: z.number().int(),
  })
  .strict();

// AccountGroupListItem
export const AccountGroupListItemSchema = z
  .object({
    account_type: z
      .object({
        code: z.string(),
        description: z.string().optional(),
        id: z.string(),
        name: z.string(),
      })
      .strict(),
    code: z.string(),
    id: z.string(),
    is_active: z.boolean(),
    level: z.number().int(),
    name: z.string(),
    short_name: z.string().optional(),
  })
  .strict();

// AccountGroupSummary
export const AccountGroupSummarySchema = z
  .object({
    code: z.string(),
    id: z.string(),
    level: z.number().int(),
    name: z.string(),
  })
  .strict();

// AccountListItem
export const AccountListItemSchema = z
  .object({
    account_type: z
      .object({
        code: z.string(),
        description: z.string().optional(),
        id: z.string(),
        name: z.string(),
      })
      .strict(),
    allocation_settings: z
      .union([
        z.array(
          z
            .object({
              analysis_type_id: z.string(),
              analysis_type_name: z.string(),
              is_module_specific: z.boolean(),
            })
            .strict(),
        ),
        z.null(),
      ])
      .optional(),
    code: z.string(),
    group: z
      .object({
        code: z.string(),
        id: z.string(),
        level: z.number().int(),
        name: z.string(),
      })
      .strict(),
    id: z.string(),
    is_active: z.boolean(),
    is_reconciliation_account: z.boolean(),
    name: z.string(),
    short_name: z.string().optional(),
  })
  .strict();

// AccountRef
export const AccountRefSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// AccountTree
export const AccountTreeSchema = z
  .object({
    account_type: z
      .object({
        code: z.string(),
        description: z.string().optional(),
        id: z.string(),
        name: z.string(),
      })
      .strict(),
    children: z.union([z.array(z.any()), z.null()]).optional(),
    code: z.string(),
    depth: z.number().int(),
    full_path: z.string(),
    id: z.string(),
    is_active: z.boolean(),
    level: z.number().int(),
    name: z.string(),
    path: z.union([z.array(z.string()), z.null()]),
    short_name: z.string().optional(),
  })
  .strict();

// AccountType
export const AccountTypeSchema = z
  .object({
    code: z.string(),
    description: z.string().optional(),
    id: z.string(),
    name: z.string(),
  })
  .strict();

// AccountingFiscalPeriodDTLResponse
export const AccountingFiscalPeriodDTLResponseSchema = z
  .object({
    BusinessLocationID: z.string().optional(),
    FK_FiscalPeriodID: z.string().optional(),
    FK_MasterValueAccountingPeriodType: z.string().optional(),
    FromDate: z.string().datetime({ offset: true }).optional(),
    Name: z.string(),
    ToDate: z.string().datetime({ offset: true }).optional(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// AccountingUnitDtlItem
export const AccountingUnitDtlItemSchema = z
  .object({
    BusinessLocationID: z.string().optional(),
    EffectiveDate: z.string().optional(),
    FK_AccountingUnitHDRID: z.string().optional(),
    FK_AdministrativeUnitHDRID: z.string().optional(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// AccountingUnitResponse
export const AccountingUnitResponseSchema = z
  .object({
    BusinessLocationID: z.string().optional(),
    IsActive: z.boolean(),
    Name: z.string(),
    details: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string().optional(),
            EffectiveDate: z.string().optional(),
            FK_AccountingUnitHDRID: z.string().optional(),
            FK_AdministrativeUnitHDRID: z.string().optional(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// ActivityAllocation
export const ActivityAllocationSchema = z
  .object({
    allocation: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict(),
    is_recovery_allocation: z.boolean(),
  })
  .strict();

// AdditionalChargeDiscountItem
export const AdditionalChargeDiscountItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    account: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    additional_charge_discount_type: z
      .object({ code: z.number().int(), id: z.string(), value: z.string() })
      .strict()
      .optional(),
    amount: z.string().optional(),
    charge_calculation_type: z
      .object({ code: z.number().int(), id: z.string(), value: z.string() })
      .strict()
      .optional(),
    code: z.string(),
    fk_account_id: z.string(),
    fk_master_value_additional_charge_discount_type_id: z.string(),
    fk_master_value_charge_calculation_type_id: z.string(),
    fk_tax_type_id: z.string().optional(),
    id: z.string(),
    name: z.string(),
    percentage: z.string().optional(),
    tax_type: z
      .object({ code: z.number().int(), id: z.string(), value: z.string() })
      .strict()
      .optional(),
  })
  .strict();

// AddressItem
export const AddressItemSchema = z
  .object({
    address: z.string().optional(),
    city: z.string().optional(),
    contact_person: z.string().optional(),
    country: z.string().optional(),
    designation: z.string().optional(),
    email: z.string().optional(),
    fax: z.string().optional(),
    mobile: z.string().optional(),
    remarks: z.string().optional(),
    state: z.string().optional(),
    tel: z.string().optional(),
    url: z.string().optional(),
    zip: z.string().optional(),
  })
  .strict();

// AdminUnitDivisionTypeItem
export const AdminUnitDivisionTypeItemSchema = z
  .object({ id: z.string(), name: z.string() })
  .strict();

// AdminUnitGroupItem
export const AdminUnitGroupItemSchema = z
  .object({ group_id: z.string(), group_name: z.string() })
  .strict();

// AdminUnitParentItem
export const AdminUnitParentItemSchema = z
  .object({ id: z.string(), name: z.string() })
  .strict();

// AdminUnitSettingItem
export const AdminUnitSettingItemSchema = z
  .object({ name: z.string() })
  .strict();

// AdministrativeUnitDTO
export const AdministrativeUnitDTOSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// AdministrativeUnitItem
export const AdministrativeUnitItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    address: z
      .object({
        address: z.string().optional(),
        city: z.string().optional(),
        contact_person: z.string().optional(),
        country: z.string().optional(),
        designation: z.string().optional(),
        email: z.string().optional(),
        fax: z.string().optional(),
        mobile: z.string().optional(),
        remarks: z.string().optional(),
        state: z.string().optional(),
        tel: z.string().optional(),
        url: z.string().optional(),
        zip: z.string().optional(),
      })
      .strict()
      .optional(),
    code: z.string(),
    division_type: z
      .object({ id: z.string(), name: z.string() })
      .strict()
      .optional(),
    division_type_name: z.string().optional(),
    group: z
      .object({ group_id: z.string(), group_name: z.string() })
      .strict()
      .optional(),
    id: z.string(),
    is_active: z.boolean(),
    master_value_factory_name: z.string().optional(),
    name: z.string(),
    parent: z.object({ id: z.string(), name: z.string() }).strict().optional(),
    setting: z.object({ name: z.string() }).strict().optional(),
    short_name: z.string().optional(),
  })
  .strict();

// AllocationSetting
export const AllocationSettingSchema = z
  .object({
    analysis_type_id: z.string(),
    analysis_type_name: z.string(),
    is_module_specific: z.boolean(),
  })
  .strict();

// AlokasiHeadingItem
export const AlokasiHeadingItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    allocations: z
      .union([
        z.array(
          z
            .object({
              $schema: z
                .string()
                .url()
                .describe("A URL to the JSON Schema for this object.")
                .readonly()
                .optional(),
              account: z
                .object({
                  code: z.string().optional(),
                  id: z.string(),
                  name: z.string().optional(),
                })
                .strict()
                .optional(),
              account_id: z.string(),
              code: z.string(),
              heading_id: z.string(),
              heading_name: z.string().optional(),
              id: z.string(),
              machinery_output: z
                .object({
                  code: z.number().int().optional(),
                  id: z.string(),
                  value: z.string().optional(),
                })
                .strict()
                .optional(),
              name: z.string(),
              settings: z
                .union([
                  z.array(
                    z
                      .object({
                        details: z
                          .union([
                            z.array(
                              z
                                .object({
                                  $schema: z
                                    .string()
                                    .url()
                                    .describe(
                                      "A URL to the JSON Schema for this object.",
                                    )
                                    .readonly()
                                    .optional(),
                                  analysis_code: z
                                    .object({
                                      code: z.string().optional(),
                                      id: z.string(),
                                      name: z.string().optional(),
                                    })
                                    .strict()
                                    .optional(),
                                  analysis_code_id: z.string().optional(),
                                  analysis_type: z
                                    .object({
                                      code: z.string().optional(),
                                      id: z.string(),
                                      name: z.string().optional(),
                                    })
                                    .strict()
                                    .optional(),
                                  analysis_type_id: z.string(),
                                  id: z.string(),
                                  is_module_specific: z.boolean().optional(),
                                  master_value: z
                                    .object({
                                      code: z.number().int().optional(),
                                      id: z.string(),
                                      value: z.string().optional(),
                                    })
                                    .strict()
                                    .optional(),
                                  type_id: z.string().optional(),
                                })
                                .strict(),
                            ),
                            z.null(),
                          ])
                          .optional(),
                        from_age: z.number().int().optional(),
                        id: z.string(),
                        to_age: z.number().int().optional(),
                      })
                      .strict(),
                  ),
                  z.null(),
                ])
                .optional(),
            })
            .strict(),
        ),
        z.null(),
      ])
      .optional(),
    code: z.string(),
    id: z.string(),
    name: z.string(),
  })
  .strict();

// AlokasiUmumAccountItem
export const AlokasiUmumAccountItemSchema = z
  .object({
    code: z.string().optional(),
    id: z.string(),
    name: z.string().optional(),
  })
  .strict();

// AlokasiUmumItem
export const AlokasiUmumItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    account: z
      .object({
        code: z.string().optional(),
        id: z.string(),
        name: z.string().optional(),
      })
      .strict()
      .optional(),
    account_id: z.string(),
    code: z.string(),
    heading_id: z.string(),
    heading_name: z.string().optional(),
    id: z.string(),
    machinery_output: z
      .object({
        code: z.number().int().optional(),
        id: z.string(),
        value: z.string().optional(),
      })
      .strict()
      .optional(),
    name: z.string(),
    settings: z
      .union([
        z.array(
          z
            .object({
              details: z
                .union([
                  z.array(
                    z
                      .object({
                        $schema: z
                          .string()
                          .url()
                          .describe("A URL to the JSON Schema for this object.")
                          .readonly()
                          .optional(),
                        analysis_code: z
                          .object({
                            code: z.string().optional(),
                            id: z.string(),
                            name: z.string().optional(),
                          })
                          .strict()
                          .optional(),
                        analysis_code_id: z.string().optional(),
                        analysis_type: z
                          .object({
                            code: z.string().optional(),
                            id: z.string(),
                            name: z.string().optional(),
                          })
                          .strict()
                          .optional(),
                        analysis_type_id: z.string(),
                        id: z.string(),
                        is_module_specific: z.boolean().optional(),
                        master_value: z
                          .object({
                            code: z.number().int().optional(),
                            id: z.string(),
                            value: z.string().optional(),
                          })
                          .strict()
                          .optional(),
                        type_id: z.string().optional(),
                      })
                      .strict(),
                  ),
                  z.null(),
                ])
                .optional(),
              from_age: z.number().int().optional(),
              id: z.string(),
              to_age: z.number().int().optional(),
            })
            .strict(),
        ),
        z.null(),
      ])
      .optional(),
  })
  .strict();

// AlokasiUmumMasterValueItem
export const AlokasiUmumMasterValueItemSchema = z
  .object({
    code: z.number().int().optional(),
    id: z.string(),
    value: z.string().optional(),
  })
  .strict();

// AnalysisCodeBrief
export const AnalysisCodeBriefSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// AnalysisCodeDetail
export const AnalysisCodeDetailSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    analysis_type: z
      .object({
        analysis_code_source: z
          .object({
            data_field: z.string(),
            display_field: z.string(),
            id: z.string(),
            name: z.string(),
          })
          .strict()
          .optional(),
        code: z.string(),
        id: z.string(),
        name: z.string(),
      })
      .strict()
      .optional(),
    code: z.string(),
    id: z.string(),
    name: z.string(),
    parent_analysis_code: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    settings: z.union([
      z.array(
        z
          .object({
            analysis_type: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            id: z.string(),
            master_value: z
              .object({
                code: z.number().int(),
                id: z.string(),
                value: z.string(),
              })
              .strict()
              .optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// AnalysisCodeListItem
export const AnalysisCodeListItemSchema = z
  .object({
    analysis_type: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    code: z.string(),
    id: z.string(),
    name: z.string(),
  })
  .strict();

// AnalysisCodeSettingHierarchyItem
export const AnalysisCodeSettingHierarchyItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    analysis_code: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    analysis_type: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    id: z.string(),
    master_value: z
      .object({ code: z.number().int(), id: z.string(), value: z.string() })
      .strict()
      .optional(),
  })
  .strict();

// AnalysisCodeSettingItem
export const AnalysisCodeSettingItemSchema = z
  .object({
    analysis_type: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    id: z.string(),
    master_value: z
      .object({ code: z.number().int(), id: z.string(), value: z.string() })
      .strict()
      .optional(),
  })
  .strict();

// AnalysisCodeSettingMasterValue
export const AnalysisCodeSettingMasterValueSchema = z
  .object({ code: z.number().int(), id: z.string(), value: z.string() })
  .strict();

// AnalysisCodeSourceItem
export const AnalysisCodeSourceItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data_field: z.string(),
    display_field: z.string(),
    id: z.string(),
    name: z.string(),
  })
  .strict();

// AnalysisCodeSourceSummary
export const AnalysisCodeSourceSummarySchema = z
  .object({
    data_field: z.string(),
    display_field: z.string(),
    id: z.string(),
    name: z.string(),
  })
  .strict();

// AnalysisTypeDetail
export const AnalysisTypeDetailSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    analysis_code_source: z
      .object({
        data_field: z.string(),
        display_field: z.string(),
        id: z.string(),
        name: z.string(),
      })
      .strict()
      .optional(),
    code: z.string(),
    filter_expression_sql: z.string().optional(),
    id: z.string(),
    name: z.string(),
    settings: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            analysis_type: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            id: z.string(),
            master_value: z
              .object({
                code: z.number().int(),
                id: z.string(),
                value: z.string(),
              })
              .strict()
              .optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// AnalysisTypeDetailSummary
export const AnalysisTypeDetailSummarySchema = z
  .object({
    analysis_code_source: z
      .object({
        data_field: z.string(),
        display_field: z.string(),
        id: z.string(),
        name: z.string(),
      })
      .strict()
      .optional(),
    code: z.string(),
    id: z.string(),
    name: z.string(),
  })
  .strict();

// AnalysisTypeItem
export const AnalysisTypeItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    analysis_code_source: z
      .object({
        data_field: z.string(),
        display_field: z.string(),
        id: z.string(),
        name: z.string(),
      })
      .strict()
      .optional(),
    code: z.string(),
    filter_expression_sql: z.string().optional(),
    id: z.string(),
    name: z.string(),
  })
  .strict();

// AnalysisTypeSettingItem
export const AnalysisTypeSettingItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    analysis_type: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    id: z.string(),
    master_value: z
      .object({ code: z.number().int(), id: z.string(), value: z.string() })
      .strict()
      .optional(),
  })
  .strict();

// AnalysisTypeSummary
export const AnalysisTypeSummarySchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// AreaCompositionAccountItem
export const AreaCompositionAccountItemSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// AreaCompositionAreaTypeItem
export const AreaCompositionAreaTypeItemSchema = z
  .object({
    id: z.string(),
    master_value_id: z.string().optional(),
    value: z.string(),
  })
  .strict();

// AreaCompositionItem
export const AreaCompositionItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    account: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict(),
    area_types: z
      .union([
        z.array(
          z
            .object({
              id: z.string(),
              master_value_id: z.string().optional(),
              value: z.string(),
            })
            .strict(),
        ),
        z.null(),
      ])
      .optional(),
    from_age: z.number().int(),
    id: z.string(),
    planting_types: z
      .union([
        z.array(
          z
            .object({
              id: z.string(),
              master_value_id: z.string().optional(),
              value: z.string(),
            })
            .strict(),
        ),
        z.null(),
      ])
      .optional(),
    title: z.string(),
    to_age: z.number().int(),
  })
  .strict();

// AreaCompositionPlantingTypeItem
export const AreaCompositionPlantingTypeItemSchema = z
  .object({
    id: z.string(),
    master_value_id: z.string().optional(),
    value: z.string(),
  })
  .strict();

// AreaUOMDTO
export const AreaUOMDTOSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// ArrivalSourceType
export const ArrivalSourceTypeSchema = z
  .object({ code: z.number().int(), id: z.string(), value: z.string() })
  .strict();

// AssetAccountSummary
export const AssetAccountSummarySchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// AssetCategoryDetail
export const AssetCategoryDetailSchema = z
  .object({
    account: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    account_id: z.string().optional(),
    code: z.string(),
    id: z.string(),
    last_modified_time: z.string().datetime({ offset: true }),
    name: z.string(),
    parent_category: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    version: z.number().int(),
  })
  .strict();

// AssetCategoryListItem
export const AssetCategoryListItemSchema = z
  .object({
    account_id: z.string().optional(),
    code: z.string(),
    id: z.string(),
    name: z.string(),
  })
  .strict();

// AssetCategorySummary
export const AssetCategorySummarySchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// AssetCategoryTree
export const AssetCategoryTreeSchema = z
  .object({
    account_id: z.string().optional(),
    children: z.union([z.array(z.any()), z.null()]),
    code: z.string(),
    id: z.string(),
    name: z.string(),
  })
  .strict();

// AssetDetail
export const AssetDetailSchema = z
  .object({
    account: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    account_maintenance_exp: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    account_running_exp: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    account_wip: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    category: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    code: z.string(),
    contract_amount: z.number().optional(),
    contract_from: z.string().datetime({ offset: true }).optional(),
    contract_terms_and_conditions: z.string().optional(),
    contract_to: z.string().datetime({ offset: true }).optional(),
    contractor: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    id: z.string(),
    is_active: z.boolean(),
    last_modified_time: z.string().datetime({ offset: true }),
    make: z.string().optional(),
    manufacturer: z.string().optional(),
    model: z.string().optional(),
    name: z.string(),
    ownership: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    purchase_date: z.string().datetime({ offset: true }).optional(),
    reg_no: z.string().optional(),
    remarks: z.string().optional(),
    supplier: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    tare_weight: z.number().optional(),
    tare_weight_uom: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    version: z.number().int(),
  })
  .strict();

// AssetListItem
export const AssetListItemSchema = z
  .object({
    account: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    category: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    code: z.string(),
    id: z.string(),
    is_active: z.boolean(),
    make: z.string().optional(),
    manufacturer: z.string().optional(),
    model: z.string().optional(),
    name: z.string(),
    ownership: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    purchase_date: z.string().datetime({ offset: true }).optional(),
    reg_no: z.string().optional(),
    tare_weight: z.number().optional(),
    tare_weight_uom: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
  })
  .strict();

// AssetOwnership
export const AssetOwnershipSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// AssetParty
export const AssetPartySchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// AssetUOM
export const AssetUOMSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// AttachRoleRequest
export const AttachRoleRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    role_id: z.number().int().describe("Role ID to attach to the user"),
    user_id: z.string().describe("User ID to attach the role to"),
  })
  .strict();

// AttachRoleResponse
export const AttachRoleResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string().describe("Success message"),
    role_id: z.number().int().describe("Attached role ID"),
    user_id: z.string().describe("User ID"),
  })
  .strict();

// BankDetail
export const BankDetailSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    branches: z.union([
      z.array(
        z
          .object({
            address: z
              .object({
                address: z.string().optional(),
                city: z.string().optional(),
                country_id: z.string().optional(),
                id: z.string(),
                state: z.string().optional(),
                zip_code: z.string().optional(),
              })
              .strict()
              .optional(),
            address_id: z.string(),
            code: z.string(),
            id: z.string(),
            name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    code: z.string(),
    id: z.string(),
    name: z.string(),
  })
  .strict();

// BankItem
export const BankItemSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// BatchMasterResponse
export const BatchMasterResponseSchema = z
  .object({
    BusinessLocationID: z.string().optional(),
    Code: z.string(),
    FK_NurseryID: z.string().optional(),
    Name: z.string(),
    ProgramNumber: z.string().optional(),
    StartDate: z.string().datetime({ offset: true }).optional(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// BatchResponse
export const BatchResponseSchema = z
  .object({
    code: z.string(),
    id: z.string(),
    name: z.string(),
    nursery_id: z.string(),
    program_number: z.string().optional(),
    start_date: z.string(),
  })
  .strict();

// BranchAddress
export const BranchAddressSchema = z
  .object({
    address: z.string().optional(),
    city: z.string().optional(),
    country_id: z.string().optional(),
    id: z.string(),
    state: z.string().optional(),
    zip_code: z.string().optional(),
  })
  .strict();

// BranchItem
export const BranchItemSchema = z
  .object({
    address: z
      .object({
        address: z.string().optional(),
        city: z.string().optional(),
        country_id: z.string().optional(),
        id: z.string(),
        state: z.string().optional(),
        zip_code: z.string().optional(),
      })
      .strict()
      .optional(),
    address_id: z.string(),
    code: z.string(),
    id: z.string(),
    name: z.string(),
  })
  .strict();

// BulkCreateModulesOutputBody
export const BulkCreateModulesOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string().describe("Success message"),
    modules: z
      .union([
        z
          .array(
            z
              .object({
                children: z
                  .union([
                    z.array(z.any()).describe("Child modules"),
                    z.null().describe("Child modules"),
                  ])
                  .describe("Child modules"),
                context_id: z.string().describe("Module Context ID").optional(),
                description: z
                  .string()
                  .describe("Module description")
                  .optional(),
                icon: z.string().describe("Module icon"),
                id: z.number().int().describe("Module ID"),
                is_active: z.boolean().describe("Is module active").optional(),
                kind: z
                  .string()
                  .describe("Module kind (group, module, category, item)"),
                name: z.string().describe("Module name"),
                parent_id: z
                  .number()
                  .int()
                  .describe("Parent Module ID")
                  .optional(),
                path_name: z.string().describe("Module pathname"),
                slug: z
                  .string()
                  .describe("Module slug (URL-friendly identifier)"),
                sort_order: z
                  .number()
                  .int()
                  .describe("Sort order within parent"),
              })
              .strict(),
          )
          .describe("Created modules"),
        z.null().describe("Created modules"),
      ])
      .describe("Created modules"),
  })
  .strict();

// BulkReplantingPlanItem
export const BulkReplantingPlanItemSchema = z
  .object({
    block_id: z.string().uuid(),
    clones: z.union([
      z
        .array(
          z
            .object({
              area_hectare: z
                .string()
                .regex(new RegExp("^[0-9]+(\\.[0-9]+)?$")),
              clone_setting_id: z.string().uuid(),
              hcv_area_hectare: z
                .string()
                .regex(new RegExp("^[0-9]+(\\.[0-9]+)?$")),
              is_apm: z.boolean(),
              plants_per_hectare: z.number().int().gte(1),
              remaining_seedlings: z.number().int().gt(0),
              seedling_delivery_quantity: z.number().int().gt(0),
              seedling_requirement: z.number().int().gt(0),
            })
            .strict(),
        )
        .min(1),
      z.null(),
    ]),
    division_id: z.string().uuid(),
    estate_id: z.string().uuid(),
    status: z.union([z.literal(0), z.literal(1)]),
  })
  .strict();

// BulkUpsertDeliveryWeeklyItem
export const BulkUpsertDeliveryWeeklyItemSchema = z
  .object({
    actual_qty: z.number().int().gt(0),
    clone_dtl_id: z.string().uuid().describe("CloneDTL ID"),
    month: z.number().int().gte(1).lte(12),
    planned_qty: z.number().int().gt(0),
    week_no: z.number().int().gte(1).lte(4),
  })
  .strict();

// BulkUpsertDeliveryWeeklyResponse
export const BulkUpsertDeliveryWeeklyResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    items: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            actual_qty: z.number().int(),
            clone_dtl_id: z.string(),
            id: z.string(),
            month: z.number().int(),
            planned_qty: z.number().int(),
            week_no: z.number().int(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    upserted_count: z.number().int(),
  })
  .strict();

// CloneByEstateResponse
export const CloneByEstateResponseSchema = z
  .object({
    area_hectare: z.number().optional(),
    block_id: z.string(),
    block_name: z.string().optional(),
    clone_dtl_id: z.string(),
    clone_name: z.string().optional(),
    clone_setting_id: z.string(),
    division_id: z.string(),
    division_name: z.string().optional(),
    effective_area_hectare: z.number().optional(),
    estate_id: z.string(),
    estate_name: z.string().optional(),
    gap: z.number().int(),
    seedling_delivery_qty: z.number().int().optional(),
    seedling_requirement: z.number().int().optional(),
    total_actual_qty: z.number().int(),
    total_planned_qty: z.number().int(),
  })
  .strict();

// CloneCommodity
export const CloneCommoditySchema = z
  .object({ code: z.string(), name: z.string() })
  .strict();

// CloneDetailRequest
export const CloneDetailRequestSchema = z
  .object({
    area_hectare: z.string().regex(new RegExp("^[0-9]+(\\.[0-9]+)?$")),
    clone_setting_id: z.string().uuid(),
    hcv_area_hectare: z.string().regex(new RegExp("^[0-9]+(\\.[0-9]+)?$")),
    is_apm: z.boolean(),
    plants_per_hectare: z.number().int().gte(1),
    remaining_seedlings: z.number().int().gt(0),
    seedling_delivery_quantity: z.number().int().gt(0),
    seedling_requirement: z.number().int().gt(0),
  })
  .strict();

// CloneGawaiResponse
export const CloneGawaiResponseSchema = z
  .object({
    BusinessLocationID: z.string().optional(),
    FK_CommodityID: z.string().optional(),
    Name: z.string(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// CloneItem
export const CloneItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    commodity: z.object({ code: z.string(), name: z.string() }).strict(),
    id: z.string(),
    name: z.string(),
  })
  .strict();

// CloneSettingCommodity
export const CloneSettingCommoditySchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// CloneSettingItem
export const CloneSettingItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    clone_id: z.string(),
    clone_name: z.string(),
    commodity: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    created_at: z.string().optional(),
    id: z.string(),
    planting_pattern: z.number().int(),
    seedling_per_hectare: z.number().int(),
    updated_at: z.string().optional(),
  })
  .strict();

// CommodityDTO
export const CommodityDTOSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// CommodityDetail
export const CommodityDetailSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string(),
    crop_reference_code: z.string(),
    id: z.string(),
    is_major: z.boolean(),
    name: z.string(),
    parent_crop: z
      .object({ code: z.number().int(), value: z.string() })
      .strict(),
  })
  .strict();

// CommodityGawaiResponse
export const CommodityGawaiResponseSchema = z
  .object({
    BusinessLocationID: z.string().optional(),
    Code: z.string(),
    CropReferenceCode: z.string().optional(),
    FK_MasterValueParentCropID: z.string().optional(),
    IsMajor: z.boolean(),
    Name: z.string(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// CommodityItem
export const CommodityItemSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// CommodityParentCrop
export const CommodityParentCropSchema = z
  .object({ code: z.number().int(), value: z.string() })
  .strict();

// CompanyItem
export const CompanyItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    address: z
      .object({
        address: z.string().optional(),
        city: z.string().optional(),
        contact_person: z.string().optional(),
        country: z.string().optional(),
        designation: z.string().optional(),
        email: z.string().optional(),
        fax: z.string().optional(),
        mobile: z.string().optional(),
        remarks: z.string().optional(),
        state: z.string().optional(),
        tel: z.string().optional(),
        url: z.string().optional(),
        zip: z.string().optional(),
      })
      .strict()
      .optional(),
    code: z.string(),
    id: z.string(),
    is_external: z.boolean(),
    name: z.string(),
  })
  .strict();

// ContextDto
export const ContextDtoSchema = z
  .object({
    description: z.string().describe("Context Name").optional(),
    id: z.string().describe("Context ID").optional(),
  })
  .strict();

// ContextResponse
export const ContextResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    description: z.union([z.string(), z.null()]),
    id: z.string(),
  })
  .strict();

// CreateAdditionalChargeDiscountRequest
export const CreateAdditionalChargeDiscountRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    amount: z.string().describe("Amount").optional(),
    code: z.string().min(1).describe("Code"),
    fk_account_id: z.string().uuid(),
    fk_master_value_additional_charge_discount_type_id: z.string().uuid(),
    fk_master_value_charge_calculation_type_id: z.string().uuid(),
    fk_tax_type_id: z.string().uuid().optional(),
    name: z.string().min(1).describe("Name"),
    percentage: z.string().describe("Percentage").optional(),
  })
  .strict();

// CreateAlokasiHeadingRequest
export const CreateAlokasiHeadingRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1).max(20),
    name: z.string().min(1).max(200),
  })
  .strict();

// CreateAlokasiUmumRequest
export const CreateAlokasiUmumRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    account_id: z.string().uuid(),
    code: z.string().min(1).max(20),
    heading_id: z.string().uuid(),
    is_derive_account_code_from_block: z.boolean().optional(),
    is_derive_account_code_from_crop: z.boolean().optional(),
    machinery_output_id: z.string().uuid().optional(),
    name: z.string().min(1).max(200),
  })
  .strict();

// CreateAnalysisCodeRequest
export const CreateAnalysisCodeRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    analysis_type_id: z.string().uuid(),
    code: z.string().min(1),
    name: z.string().min(1),
    parent_analysis_code_id: z.string().uuid().optional(),
  })
  .strict();

// CreateAnalysisCodeSettingRequest
export const CreateAnalysisCodeSettingRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    analysis_code_id: z.string().uuid(),
    analysis_type_id: z.string().uuid(),
    master_value_id: z.string().uuid(),
  })
  .strict();

// CreateAnalysisCodeSourceRequest
export const CreateAnalysisCodeSourceRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data_field: z.string().min(1),
    display_field: z.string().min(1),
    name: z.string().min(1),
  })
  .strict();

// CreateAnalysisTypeRequest
export const CreateAnalysisTypeRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    analysis_code_source_id: z.string().uuid().optional(),
    code: z.string().min(1),
    filter_expression_sql: z.string().optional(),
    name: z.string().min(1),
  })
  .strict();

// CreateAnalysisTypeSettingRequest
export const CreateAnalysisTypeSettingRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    analysis_type_id: z.string().uuid(),
    master_value_id: z.string().uuid(),
  })
  .strict();

// CreateBatchRequest
export const CreateBatchRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1),
    name: z.string().min(1),
    nursery_id: z.string().uuid(),
    program_number: z.string(),
    start_date: z.string().date(),
  })
  .strict();

// CreateBatchResponseBody
export const CreateBatchResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({
        code: z.string(),
        id: z.string(),
        name: z.string(),
        nursery_id: z.string(),
        program_number: z.string().optional(),
        start_date: z.string(),
      })
      .strict(),
  })
  .strict();

// CreateBulkReplantingPlansRequest
export const CreateBulkReplantingPlansRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    plan_header_id: z.string().uuid().optional(),
    plans: z.union([
      z
        .array(
          z
            .object({
              block_id: z.string().uuid(),
              clones: z.union([
                z
                  .array(
                    z
                      .object({
                        area_hectare: z
                          .string()
                          .regex(new RegExp("^[0-9]+(\\.[0-9]+)?$")),
                        clone_setting_id: z.string().uuid(),
                        hcv_area_hectare: z
                          .string()
                          .regex(new RegExp("^[0-9]+(\\.[0-9]+)?$")),
                        is_apm: z.boolean(),
                        plants_per_hectare: z.number().int().gte(1),
                        remaining_seedlings: z.number().int().gt(0),
                        seedling_delivery_quantity: z.number().int().gt(0),
                        seedling_requirement: z.number().int().gt(0),
                      })
                      .strict(),
                  )
                  .min(1),
                z.null(),
              ]),
              division_id: z.string().uuid(),
              estate_id: z.string().uuid(),
              status: z.union([z.literal(0), z.literal(1)]),
            })
            .strict(),
        )
        .min(1)
        .max(100),
      z.null(),
    ]),
    program_name: z
      .string()
      .min(1)
      .describe("Required when plan_header_id is omitted")
      .optional(),
    program_year: z
      .number()
      .int()
      .gte(2000)
      .describe("Required when plan_header_id is omitted")
      .optional(),
  })
  .strict();

// CreateBulkReplantingPlansResponse
export const CreateBulkReplantingPlansResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    created: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            block: z
              .object({
                code: z.string(),
                id: z.string(),
                name: z.string(),
                year_of_planting: z.number().int().optional(),
              })
              .strict(),
            clones: z.union([
              z.array(
                z
                  .object({
                    area_hectare: z.string(),
                    clone_setting: z
                      .object({
                        clone_name: z.string(),
                        id: z.string(),
                        planting_pattern: z.number().int(),
                        seedling_per_hectare: z.number().int(),
                      })
                      .strict(),
                    effective_area_hectare: z.string(),
                    hcv_area_hectare: z.string(),
                    id: z.string(),
                    is_apm: z.boolean(),
                    plants_per_hectare: z.number().int(),
                    remaining_seedlings: z.number().int(),
                    seedling_delivery_quantity: z.number().int(),
                    seedling_requirement: z.number().int(),
                  })
                  .strict(),
              ),
              z.null(),
            ]),
            division: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict(),
            estate: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict(),
            id: z.string(),
            plan_header_id: z.string(),
            program_name: z.string(),
            program_year: z.number().int(),
            status: z.number().int(),
            user_id: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    plan_header_id: z.string(),
    total: z.number().int(),
  })
  .strict();

// CreateCloneRequest
export const CreateCloneRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    commodity_id: z.string().uuid(),
    name: z.string().min(1),
  })
  .strict();

// CreateCloneSettingRequest
export const CreateCloneSettingRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    clone_id: z.string().uuid(),
    planting_pattern: z.number().int().gte(1),
    seedling_per_hectare: z.number().int().gte(1),
  })
  .strict();

// CreateCommodityRequest
export const CreateCommodityRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1),
    crop_reference_code: z.string().optional(),
    is_major: z.boolean(),
    name: z.string().min(1),
    parent_crop_id: z.string().uuid().optional(),
  })
  .strict();

// CreateCompanyRequest
export const CreateCompanyRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1).describe("Company code"),
    is_external: z.boolean().describe("Whether the company is external"),
    name: z.string().min(1).describe("Company name"),
  })
  .strict();

// CreateCropRequest
export const CreateCropRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.number().int(),
    value: z.string().min(1),
  })
  .strict();

// CreateCurrencyDenominationTitleRequest
export const CreateCurrencyDenominationTitleRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1),
    currency_id: z.string().uuid(),
    name: z.string().min(1),
  })
  .strict();

// CreateCurrencyRequest
export const CreateCurrencyRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1),
    coin_factor: z.number().optional(),
    coin_name: z.string().optional(),
    country_id: z.string().uuid().optional(),
    currency_in_word_id: z.string().uuid().optional(),
    format: z.string().optional(),
    is_active: z.boolean().optional(),
    is_home_currency: z.boolean().optional(),
    is_symbol_prefix: z.boolean().optional(),
    name: z.string().min(1),
    symbol: z.string().optional(),
  })
  .strict();

// CreateDenominationRequest
export const CreateDenominationRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    configurations: z
      .union([
        z.array(z.object({ title_id: z.string().uuid() }).strict()),
        z.null(),
      ])
      .optional(),
    factor: z.number().optional(),
    name: z.string().min(1),
  })
  .strict();

// CreateGeneralAllocationSettingDetailRequest
export const CreateGeneralAllocationSettingDetailRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    analysis_code_id: z.string().uuid().optional(),
    analysis_type_id: z.string().uuid(),
    is_module_specific: z.boolean().optional(),
    setting_id: z.string().uuid(),
    type_id: z.string().uuid().optional(),
  })
  .strict();

// CreateGeneralAllocationSettingRequest
export const CreateGeneralAllocationSettingRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    allocation_id: z.string().uuid(),
    from_age: z.number().int().optional(),
    to_age: z.number().int().optional(),
  })
  .strict();

// CreateGroupRequest
export const CreateGroupRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1).describe("Group code"),
    company_id: z.string().uuid().describe("Company ID"),
    name: z.string().min(1).describe("Group name"),
  })
  .strict();

// CreateGrowthStageResponseBody
export const CreateGrowthStageResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({
        code: z.string(),
        commodity: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict(),
        growth_stage_period: z
          .object({ from: z.number().int(), to: z.number().int() })
          .strict(),
        id: z.string(),
        is_arrival_allowed: z.boolean(),
        is_batch_transfer_allowed: z.boolean(),
        is_nursery_issue_allowed: z.boolean(),
        master_value_period_id: z.string(),
        name: z.string(),
        parent_growth_stage_id: z.string().optional(),
        period: z.string(),
      })
      .strict(),
  })
  .strict();

// CreateHolidayDTLRequest
export const CreateHolidayDTLRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    fk_holiday_id: z.string().uuid(),
    holiday_date: z.string().date(),
  })
  .strict();

// CreateHolidayHDRRequest
export const CreateHolidayHDRRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    fk_master_value_holiday_eligibility_base_id: z.string().uuid(),
    fk_master_value_type: z.string().uuid(),
    name: z.string().min(1),
  })
  .strict();

// CreateKebangsaanRequest
export const CreateKebangsaanRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    country_id: z.string().uuid().describe("Country ID"),
    name: z.string().min(1).describe("Nationality name"),
  })
  .strict();

// CreateMasterValueRequest
export const CreateMasterValueRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.number().int().describe("Master value code"),
    master_type_id: z.string().uuid().describe("Master type ID"),
    value: z.string().min(1).describe("Master value"),
  })
  .strict();

// CreateModuleRequest
export const CreateModuleRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    children: z
      .union([
        z
          .array(z.any())
          .describe("List of child modules to create recursively"),
        z.null().describe("List of child modules to create recursively"),
      ])
      .describe("List of child modules to create recursively")
      .optional(),
    context_id: z.string().describe("Module Context ID").optional(),
    description: z.string().describe("Module description").optional(),
    icon: z.string().describe("Module icon"),
    is_active: z.boolean().describe("Is module active").default(true),
    kind: z
      .enum(["group", "module", "category", "item"])
      .describe("Module kind"),
    name: z.string().min(3).describe("Module name"),
    parent_id: z.number().int().describe("Parent module ID").optional(),
    path_name: z.string().describe("Module pathname (URL-friendly identifier)"),
    permissions: z
      .union([
        z
          .array(
            z
              .object({
                action_kind: z
                  .number()
                  .int()
                  .describe("Action Kind: 1=View, 2=Create, 3=Update, 4=Delete")
                  .optional(),
                description: z
                  .string()
                  .describe("Permission description")
                  .optional(),
                entity_id: z.string().describe("Entity ID").optional(),
                name: z.string().min(3).describe("Permission name"),
                slug: z
                  .string()
                  .min(3)
                  .describe("Permission slug (URL-friendly identifier)"),
              })
              .strict(),
          )
          .describe("List of permissions to create with the module"),
        z.null().describe("List of permissions to create with the module"),
      ])
      .describe("List of permissions to create with the module")
      .optional(),
    slug: z.string().min(3).describe("Module slug (URL-friendly identifier)"),
    sort_order: z
      .number()
      .int()
      .describe("Sort order within parent")
      .optional(),
  })
  .strict();

// CreateNurseryArrivalDetailRequest
export const CreateNurseryArrivalDetailRequestSchema = z
  .object({
    clone_id: z.string().uuid(),
    rejected_quantity: z.number().int().gt(0),
    total_quantity: z.number().int().gt(0),
  })
  .strict();

// CreateNurseryArrivalRequest
export const CreateNurseryArrivalRequestSchema = z
  .object({
    administrative_unit_id: z.string().uuid().min(1).optional(),
    arrival_number: z.string().min(1),
    arrival_reference_no: z.string().min(1).max(100).optional(),
    batch_id: z.string().uuid(),
    cross_parents: z.string().min(1).max(100).optional(),
    date: z.string().date().min(1),
    delivery_note_number: z.string().min(1).max(100).optional(),
    family_number: z.string().min(1).max(100).optional(),
    growthstage_id: z.string().uuid(),
    master_value_arrival_type_id: z.string().uuid(),
    master_value_source_type_id: z.string().uuid(),
    nursery_id: z.string().uuid(),
    party_id: z.string().uuid().min(1).optional(),
    pollination_number: z.string().min(1).max(100).optional(),
    production_number: z.string().min(1).max(100).optional(),
    remarks: z.string().min(1).max(500).optional(),
    saction_number: z.string().min(1).max(100).optional(),
  })
  .strict();

// CreateNurseryBedRequest
export const CreateNurseryBedRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    breadth: z.number(),
    breadth_uom_id: z.string(),
    length: z.number(),
    length_uom_id: z.string(),
    name: z.string().min(1),
    nursery_id: z.string().uuid(),
    short_name: z.string().min(1),
  })
  .strict();

// CreateNurseryBedResponseBody
export const CreateNurseryBedResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({
        breadth: z.number(),
        breadth_uom: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict(),
        date_of_creation: z.string(),
        id: z.string(),
        is_active: z.boolean(),
        length: z.number(),
        length_uom: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict(),
        name: z.string(),
        nursery_id: z.string(),
        short_name: z.string(),
      })
      .strict(),
  })
  .strict();

// CreateNurseryOutputBody
export const CreateNurseryOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    id: z.string(),
  })
  .strict();

// CreateNurseryRequest
export const CreateNurseryRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    area: z.number().gt(0),
    area_uom_id: z.string().uuid(),
    budget_rate: z.number().optional(),
    code: z.string().min(1).max(20),
    commodity_id: z.string().uuid(),
    division_id: z.string().uuid(),
    name: z.string().min(1).max(100),
    nursery_type_id: z.string().uuid(),
    project_id: z.string().uuid(),
    start_date: z.string().date(),
  })
  .strict();

// CreateNurseryWithProjectRequest
export const CreateNurseryWithProjectRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    area: z.number().gt(0),
    area_uom_id: z.string().uuid(),
    budget_rate: z.number(),
    code: z.string().min(1).max(20),
    commodity_id: z.string().uuid(),
    division_id: z.string().uuid(),
    end_date: z.string().date(),
    name: z.string().min(1).max(100),
    nursery_type_id: z.string().uuid(),
    project_type_id: z.string().uuid(),
    start_date: z.string().date(),
  })
  .strict();

// CreatePermissionRequest
export const CreatePermissionRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    action_kind: z
      .number()
      .int()
      .describe("Action Kind: 1=View, 2=Create, 3=Update, 4=Delete")
      .optional(),
    description: z.string().describe("Permission description").optional(),
    entity_id: z.string().describe("Associated entity ID").optional(),
    module_id: z
      .number()
      .int()
      .describe("Module ID this permission belongs to"),
    name: z.string().min(3).max(50).describe("Permission name"),
    slug: z
      .string()
      .min(3)
      .max(100)
      .describe("Permission slug (URL-friendly identifier)"),
  })
  .strict();

// CreateProductRequest
export const CreateProductRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1),
    commodity_id: z.string().uuid(),
    is_organic: z.boolean(),
    name: z.string().min(1),
    product_type_id: z.string().uuid(),
    short_name: z.string().optional(),
    uom_id: z.string().uuid(),
  })
  .strict();

// CreateProductSettingRequest
export const CreateProductSettingRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    product_description_type_id: z.string().uuid(),
    product_id: z.string().uuid(),
  })
  .strict();

// CreateProjectRequest
export const CreateProjectRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    admin_unit_id: z.string().uuid(),
    code: z.string().min(1),
    end_date: z.string().date(),
    name: z.string().min(1),
    project_type_id: z.string().uuid(),
    start_date: z.string().date(),
  })
  .strict();

// CreatePsrProgramOutputBody
export const CreatePsrProgramOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({
        $schema: z
          .string()
          .url()
          .describe("A URL to the JSON Schema for this object.")
          .readonly()
          .optional(),
        created_at: z.string().optional(),
        id: z.string(),
        name: z.string(),
        seedling_quantity: z.number().int(),
        updated_at: z.string().optional(),
        user_id: z.string().optional(),
      })
      .strict(),
  })
  .strict();

// CreatePsrProgramRequest
export const CreatePsrProgramRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    name: z.string().min(3).max(100),
    seedling_quantity: z.number().int().gte(1),
  })
  .strict();

// CreateQualityGradeRequest
export const CreateQualityGradeRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1),
    is_penalty: z.boolean(),
    is_rejected: z.boolean(),
    name: z.string().min(1),
    product_id: z.string().uuid(),
    short_name: z.string().optional(),
  })
  .strict();

// CreateReasonOutputBody
export const CreateReasonOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({ code: z.string(), id: z.string(), reason: z.string() })
      .strict(),
  })
  .strict();

// CreateReasonRequest
export const CreateReasonRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1).max(20),
    reason: z.string().min(1).max(100),
  })
  .strict();

// CreateReplantingProgramRequest
export const CreateReplantingProgramRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    name: z.string().min(1),
    year: z.number().int().gte(2000),
  })
  .strict();

// CreateRoleRequest
export const CreateRoleRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    description: z.string().describe("Role description").optional(),
    name: z.string().min(3).describe("Role name"),
    parent_id: z.number().int().describe("Parent role ID").optional(),
  })
  .strict();

// CreateRoleResponse
export const CreateRoleResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string().describe("Success message"),
    role: z
      .object({
        description: z.string().describe("Role description").optional(),
        id: z.number().int().describe("Role ID"),
        name: z.string().describe("Role name").optional(),
      })
      .strict(),
  })
  .strict();

// CreateRoundingRequest
export const CreateRoundingRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    factor: z.number(),
    name: z.string().min(1),
    rounding_account_id: z.string().uuid(),
    rounding_type_id: z.string().uuid(),
  })
  .strict();

// CreateSeedlingReqPlanRequest
export const CreateSeedlingReqPlanRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    block_id: z.string().uuid(),
    clones: z.union([
      z
        .array(
          z
            .object({
              area_hectare: z
                .string()
                .regex(new RegExp("^[0-9]+(\\.[0-9]+)?$")),
              clone_setting_id: z.string().uuid(),
              hcv_area_hectare: z
                .string()
                .regex(new RegExp("^[0-9]+(\\.[0-9]+)?$")),
              is_apm: z.boolean(),
              plants_per_hectare: z.number().int().gte(1),
              remaining_seedlings: z.number().int().gt(0),
              seedling_delivery_quantity: z.number().int().gt(0),
              seedling_requirement: z.number().int().gt(0),
            })
            .strict(),
        )
        .min(1),
      z.null(),
    ]),
    division_id: z.string().uuid(),
    estate_id: z.string().uuid(),
    plan_header_id: z.string().uuid().optional(),
    program_name: z
      .string()
      .min(1)
      .describe("Required when plan_header_id is omitted")
      .optional(),
    program_year: z
      .number()
      .int()
      .gte(2000)
      .describe("Required when plan_header_id is omitted")
      .optional(),
    status: z.union([z.literal(0), z.literal(1)]),
  })
  .strict();

// CreateShiftCategoryRequest
export const CreateShiftCategoryRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    name: z.string().min(1),
  })
  .strict();

// CreateStandardOperatingProcedureRequest
export const CreateStandardOperatingProcedureRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().describe("Optional procedure code").optional(),
    procedure: z.string().min(1).describe("Procedure text"),
  })
  .strict();

// CreateTermsAndConditionsDTLRequest
export const CreateTermsAndConditionsDTLRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    fk_module_id: z.string().uuid(),
    fk_terms_and_conditions_hdr_id: z.string().uuid(),
  })
  .strict();

// CreateTermsAndConditionsHDRRequest
export const CreateTermsAndConditionsHDRRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    description: z.string().min(1),
    name: z.string().min(1),
    parent_terms_and_conditions: z.string().uuid().optional(),
  })
  .strict();

// CreateUOMBody
export const CreateUOMBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1).max(20).describe("UOM Code"),
    name: z.string().min(1).max(100).describe("UOM Name"),
  })
  .strict();

// CreateUserRequest
export const CreateUserRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    name: z.string().describe("User display name").optional(),
    role_id: z
      .number()
      .int()
      .describe("Role ID assigned to the user")
      .optional(),
    user_id: z.string().min(1).describe("Unique user ID"),
  })
  .strict();

// CreateUserResponse
export const CreateUserResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string().describe("Success message"),
    user: z
      .object({
        id: z.string().describe("User ID"),
        name: z.string().describe("User name").optional(),
        role: z
          .object({
            id: z.number().int().describe("Role ID"),
            name: z.string().describe("Role name"),
          })
          .strict()
          .optional(),
      })
      .strict(),
  })
  .strict();

// CropItem
export const CropItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.number().int(),
    id: z.string(),
    master_type_id: z.string(),
    value: z.string(),
  })
  .strict();

// CurrencyDenominationTitleItem
export const CurrencyDenominationTitleItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string(),
    currency_id: z.string(),
    id: z.string(),
    name: z.string(),
  })
  .strict();

// CurrencyItem
export const CurrencyItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string(),
    coin_factor: z.number().optional(),
    coin_name: z.string().optional(),
    country: z
      .object({ id: z.string(), value: z.string() })
      .strict()
      .optional(),
    currency_in_word: z
      .object({ id: z.string(), value: z.string() })
      .strict()
      .optional(),
    format: z.string().optional(),
    id: z.string(),
    is_home_currency: z.boolean().optional(),
    is_symbol_prefix: z.boolean().optional(),
    name: z.string(),
    symbol: z.union([z.string(), z.null()]),
  })
  .strict();

// CurrencyMasterValue
export const CurrencyMasterValueSchema = z
  .object({ id: z.string(), value: z.string() })
  .strict();

// DeleteCloneResponse
export const DeleteCloneResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// DeleteCommodityResponse
export const DeleteCommodityResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// DeleteCurrencyDenominationTitleResponse
export const DeleteCurrencyDenominationTitleResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// DeleteCurrencyResponse
export const DeleteCurrencyResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// DeleteDenominationResponse
export const DeleteDenominationResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// DeleteProductSettingResponse
export const DeleteProductSettingResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// DeleteProductResponse
export const DeleteProductResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// DeleteQualityGradeResponse
export const DeleteQualityGradeResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// DeleteRoundingResponse
export const DeleteRoundingResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// DeleteAnalysisCodeResponseBody
export const DeleteAnalysisCodeResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// DeleteAnalysisCodeSettingResponseBody
export const DeleteAnalysisCodeSettingResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// DeleteAnalysisCodeSourceResponseBody
export const DeleteAnalysisCodeSourceResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// DeleteAnalysisTypeResponseBody
export const DeleteAnalysisTypeResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// DeleteAnalysisTypeSettingResponseBody
export const DeleteAnalysisTypeSettingResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// DeleteBatchResponseBody
export const DeleteBatchResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// DeleteCloneSettingResponseBody
export const DeleteCloneSettingResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// DeleteGrowthStageOutputBody
export const DeleteGrowthStageOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// DeleteMasterValueOutputBody
export const DeleteMasterValueOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// DeleteModuleOutputBody
export const DeleteModuleOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string().describe("Success message"),
  })
  .strict();

// DeleteNurseryBedResponseBody
export const DeleteNurseryBedResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// DeleteNurseryOutputBody
export const DeleteNurseryOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({
        administrative_unit: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        area: z.number(),
        area_uom: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict(),
        budget_rate: z.number().optional(),
        code: z.string(),
        commodity: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict(),
        id: z.string(),
        name: z.string(),
        nursery_type: z
          .object({ code: z.number().int(), id: z.string(), name: z.string() })
          .strict(),
        process_date: z.string().datetime({ offset: true }).optional(),
        project: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict(),
        start_date: z.string().datetime({ offset: true }),
      })
      .strict(),
  })
  .strict();

// DeletePermissionOutputBody
export const DeletePermissionOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string().describe("Success message"),
  })
  .strict();

// DeleteProjectOutputBody
export const DeleteProjectOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// DeleteReasonOutputBody
export const DeleteReasonOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string().describe("Success message"),
  })
  .strict();

// DeleteUserResponse
export const DeleteUserResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string().describe("Success message"),
    session_ids: z
      .union([
        z.array(z.string()).describe("Deleted session IDs"),
        z.null().describe("Deleted session IDs"),
      ])
      .describe("Deleted session IDs"),
    user_id: z.string().describe("Deleted user ID"),
  })
  .strict();

// DeliverySummaryResponse
export const DeliverySummaryResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    gap: z.number().int(),
    total_actual_qty: z.number().int(),
    total_planned_qty: z.number().int(),
    total_seedling_delivery_qty: z.number().int(),
  })
  .strict();

// DeliveryWeeklyResponse
export const DeliveryWeeklyResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    actual_qty: z.number().int(),
    clone_dtl_id: z.string(),
    id: z.string(),
    month: z.number().int(),
    planned_qty: z.number().int(),
    week_no: z.number().int(),
  })
  .strict();

// DenominationConfigurationInput
export const DenominationConfigurationInputSchema = z
  .object({ title_id: z.string().uuid() })
  .strict();

// DenominationConfigurationItem
export const DenominationConfigurationItemSchema = z
  .object({
    id: z.string(),
    title_code: z.string(),
    title_id: z.string(),
    title_name: z.string(),
  })
  .strict();

// DenominationItem
export const DenominationItemSchema = z
  .object({
    factor: z.union([z.number(), z.null()]),
    id: z.string(),
    name: z.string(),
  })
  .strict();

// DivisionResponse
export const DivisionResponseSchema = z
  .object({
    BusinessLocationID: z.string(),
    Code: z.string(),
    FK_AddressID: z.string().optional(),
    FK_AdministrativeUnitSettingID: z.string(),
    FK_GroupID: z.string(),
    FK_ParentAdministrativeUnitID: z.string(),
    IsActive: z.boolean(),
    IsFactory: z.boolean(),
    IsLoginAdministrativeUnit: z.boolean(),
    Name: z.string(),
    ShortName: z.string().optional(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// EmployeeResponse
export const EmployeeResponseSchema = z
  .object({
    BusinessLocationID: z.string(),
    Category: z.union([z.string(), z.null()]),
    DepartmentName: z.union([z.string(), z.null()]),
    Designation: z.union([z.string(), z.null()]),
    DivisionID: z.string(),
    DivisionName: z.union([z.string(), z.null()]),
    EmployeeName: z.string(),
    EmployeeNumber: z.string(),
    Grade: z.union([z.string(), z.null()]),
    Level: z.union([z.string(), z.null()]),
    RoleName: z.string(),
    Uoid: z.string(),
    WindowsLogin: z.union([z.string(), z.null()]),
  })
  .strict();

// EmptyBatchResponse
export const EmptyBatchResponseSchema = z
  .object({
    code: z.string(),
    id: z.string(),
    name: z.string(),
    nursery_id: z.string(),
    program_number: z.string().optional(),
    start_date: z.string(),
  })
  .strict();

// EntityResponse
export const EntityResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    description: z.union([z.string(), z.null()]),
    entity_name: z.union([z.string(), z.null()]),
    id: z.string(),
    is_primary: z.union([z.boolean(), z.null()]),
    locked: z.union([z.boolean(), z.null()]),
    object_security_type: z.union([z.string(), z.null()]),
    sync: z.union([z.boolean(), z.null()]),
  })
  .strict();

// ErrorDetail
export const ErrorDetailSchema = z
  .object({
    location: z
      .string()
      .describe(
        "Where the error occurred, e.g. 'body.items[3].tags' or 'path.thing-id'",
      )
      .optional(),
    message: z.string().describe("Error message text").optional(),
    value: z.any().describe("The value at the given location").optional(),
  })
  .strict();

// ErrorModel
export const ErrorModelSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    detail: z
      .string()
      .describe(
        "A human-readable explanation specific to this occurrence of the problem.",
      )
      .optional(),
    errors: z
      .union([
        z
          .array(
            z
              .object({
                location: z
                  .string()
                  .describe(
                    "Where the error occurred, e.g. 'body.items[3].tags' or 'path.thing-id'",
                  )
                  .optional(),
                message: z.string().describe("Error message text").optional(),
                value: z
                  .any()
                  .describe("The value at the given location")
                  .optional(),
              })
              .strict(),
          )
          .describe("Optional list of individual error details"),
        z.null().describe("Optional list of individual error details"),
      ])
      .describe("Optional list of individual error details")
      .optional(),
    instance: z
      .string()
      .url()
      .describe(
        "A URI reference that identifies the specific occurrence of the problem.",
      )
      .optional(),
    status: z.number().int().describe("HTTP status code").optional(),
    title: z
      .string()
      .describe(
        "A short, human-readable summary of the problem type. This value should not change between occurrences of the error.",
      )
      .optional(),
    type: z
      .string()
      .url()
      .describe(
        "A URI reference to human-readable documentation for the error.",
      )
      .default("about:blank"),
  })
  .strict();

// EstateInProgramResponse
export const EstateInProgramResponseSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// EstateResponse
export const EstateResponseSchema = z
  .object({
    BusinessLocationID: z.string().optional(),
    Code: z.string(),
    FK_AddressID: z.string().optional(),
    FK_AdministrativeUnitSettingID: z.string().optional(),
    FK_DivisionType: z.string().optional(),
    FK_GroupID: z.string().optional(),
    FK_MasterValueFactoryName: z.string().optional(),
    FK_ParentAdministrativeUnitID: z.string().optional(),
    IsActive: z.boolean().optional(),
    IsFactory: z.boolean().optional(),
    IsLoginAdministrativeUnit: z.boolean().optional(),
    Name: z.string(),
    ShortName: z.string().optional(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// GeneralAllocationResponse
export const GeneralAllocationResponseSchema = z
  .object({
    BusinessLocationID: z.string().optional(),
    Code: z.string(),
    FK_AccountID: z.string().optional(),
    FK_GeneralAllocationGroupID: z.string().optional(),
    FK_MastervalueMachineryOutput: z.string().optional(),
    IsDeriveAccountCodeFromBlock: z.boolean(),
    IsDeriveAccountCodeFromCrop: z.boolean(),
    Name: z.string(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// GeneralAllocationSettingAnalysisCode
export const GeneralAllocationSettingAnalysisCodeSchema = z
  .object({
    code: z.string().optional(),
    id: z.string(),
    name: z.string().optional(),
  })
  .strict();

// GeneralAllocationSettingAnalysisType
export const GeneralAllocationSettingAnalysisTypeSchema = z
  .object({
    code: z.string().optional(),
    id: z.string(),
    name: z.string().optional(),
  })
  .strict();

// GeneralAllocationSettingDtl
export const GeneralAllocationSettingDtlSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    analysis_code: z
      .object({
        code: z.string().optional(),
        id: z.string(),
        name: z.string().optional(),
      })
      .strict()
      .optional(),
    analysis_code_id: z.string().optional(),
    analysis_type: z
      .object({
        code: z.string().optional(),
        id: z.string(),
        name: z.string().optional(),
      })
      .strict()
      .optional(),
    analysis_type_id: z.string(),
    id: z.string(),
    is_module_specific: z.boolean().optional(),
    master_value: z
      .object({
        code: z.number().int().optional(),
        id: z.string(),
        value: z.string().optional(),
      })
      .strict()
      .optional(),
    type_id: z.string().optional(),
  })
  .strict();

// GeneralAllocationSettingHdr
export const GeneralAllocationSettingHdrSchema = z
  .object({
    details: z
      .union([
        z.array(
          z
            .object({
              $schema: z
                .string()
                .url()
                .describe("A URL to the JSON Schema for this object.")
                .readonly()
                .optional(),
              analysis_code: z
                .object({
                  code: z.string().optional(),
                  id: z.string(),
                  name: z.string().optional(),
                })
                .strict()
                .optional(),
              analysis_code_id: z.string().optional(),
              analysis_type: z
                .object({
                  code: z.string().optional(),
                  id: z.string(),
                  name: z.string().optional(),
                })
                .strict()
                .optional(),
              analysis_type_id: z.string(),
              id: z.string(),
              is_module_specific: z.boolean().optional(),
              master_value: z
                .object({
                  code: z.number().int().optional(),
                  id: z.string(),
                  value: z.string().optional(),
                })
                .strict()
                .optional(),
              type_id: z.string().optional(),
            })
            .strict(),
        ),
        z.null(),
      ])
      .optional(),
    from_age: z.number().int().optional(),
    id: z.string(),
    to_age: z.number().int().optional(),
  })
  .strict();

// GeneralAllocationSettingItem
export const GeneralAllocationSettingItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    allocation_code: z.string().optional(),
    allocation_id: z.string(),
    allocation_name: z.string().optional(),
    from_age: z.number().int().optional(),
    id: z.string(),
    to_age: z.number().int().optional(),
  })
  .strict();

// GeneralAllocationSettingMasterValue
export const GeneralAllocationSettingMasterValueSchema = z
  .object({
    code: z.number().int().optional(),
    id: z.string(),
    value: z.string().optional(),
  })
  .strict();

// GeoUnitAdminItem
export const GeoUnitAdminItemSchema = z
  .object({ id: z.string(), name: z.string() })
  .strict();

// GeoUnitAreaCommodityDetailItem
export const GeoUnitAreaCommodityDetailItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    area: z.union([z.number(), z.null()]),
    area_description: z
      .object({ id: z.string(), value: z.string() })
      .strict()
      .optional(),
    area_type: z
      .object({ id: z.string(), value: z.string() })
      .strict()
      .optional(),
    clone: z.object({ id: z.string(), name: z.string() }).strict().optional(),
    commodity: z
      .object({ id: z.string(), name: z.string() })
      .strict()
      .optional(),
    geographical_unit: z
      .object({ id: z.string(), name: z.string() })
      .strict()
      .optional(),
    id: z.string(),
    number_of_plants: z.union([z.number().int(), z.null()]),
    planting_date: z.union([z.string(), z.null()]),
    planting_type: z
      .object({ id: z.string(), value: z.string() })
      .strict()
      .optional(),
    soil_type: z
      .object({ id: z.string(), value: z.string() })
      .strict()
      .optional(),
    uom: z.object({ id: z.string(), name: z.string() }).strict().optional(),
    year_of_planting: z.union([z.number().int(), z.null()]),
  })
  .strict();

// GeoUnitDetailsShortItem
export const GeoUnitDetailsShortItemSchema = z
  .object({ id: z.string(), name: z.string() })
  .strict();

// GeoUnitMasterValueItem
export const GeoUnitMasterValueItemSchema = z
  .object({ id: z.string(), value: z.string() })
  .strict();

// GeoUnitParentItem
export const GeoUnitParentItemSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// GeoUnitSettingItem
export const GeoUnitSettingItemSchema = z
  .object({ id: z.string(), name: z.string() })
  .strict();

// GeoUnitTerrainItem
export const GeoUnitTerrainItemSchema = z
  .object({ id: z.string(), value: z.string() })
  .strict();

// GeographicalUnitAreaCommodityResponse
export const GeographicalUnitAreaCommodityResponseSchema = z
  .object({
    Area: z.number().optional(),
    BusinessLocationID: z.string().optional(),
    FK_CloneID: z.string().optional(),
    FK_CommoidityID: z.string().optional(),
    FK_GeographicalUnitID: z.string().optional(),
    FK_MasterValueAreaDescriptionID: z.string().optional(),
    FK_MasterValueAreaTypeID: z.string().optional(),
    FK_MasterValuePlantingTypeID: z.string().optional(),
    FK_PlantingDate: z.string().datetime({ offset: true }).optional(),
    FK_SoilTypeID: z.string().optional(),
    FK_UomID: z.string().optional(),
    NumberOfPlants: z.number().int().optional(),
    YearOfPlanting: z.number().int().optional(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// GeographicalUnitItem
export const GeographicalUnitItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    administrative_unit: z
      .object({ id: z.string(), name: z.string() })
      .strict()
      .optional(),
    area: z.number().optional(),
    code: z.string(),
    first_harvesting_date: z.string().optional(),
    id: z.string(),
    immature_area: z.number().optional(),
    in_activation_date: z.string().optional(),
    matured_area: z.number().optional(),
    maturity_age: z.number().optional(),
    name: z.string(),
    number_of_plants: z.number().int().optional(),
    other_area: z.number().optional(),
    parent: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    setting: z.object({ id: z.string(), name: z.string() }).strict().optional(),
    terrain_type: z
      .object({ id: z.string(), value: z.string() })
      .strict()
      .optional(),
    year_of_planting: z.number().int().optional(),
  })
  .strict();

// GeographicalUnitResponse
export const GeographicalUnitResponseSchema = z
  .object({
    AGRUpdateFlag: z.number().int().optional(),
    BusinessLocationID: z.string().optional(),
    Code: z.string(),
    EffectiveFromDateofMaturity: z
      .string()
      .datetime({ offset: true })
      .optional(),
    FK_AdministrativeUnitID: z.string().optional(),
    FK_GeographicalUnitStngID: z.string().optional(),
    FK_MasterValueTerrainType: z.string().optional(),
    FK_ParentGeographicalUnitID: z.string().optional(),
    FirstHarvestingDate: z.string().datetime({ offset: true }).optional(),
    ImmatureArea: z.number().optional(),
    InActivationDate: z.string().datetime({ offset: true }).optional(),
    MaturedArea: z.number().optional(),
    MaturityAge: z.number().optional(),
    Name: z.string(),
    OtherArea: z.number().optional(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// GeographicalUnitSettingResponse
export const GeographicalUnitSettingResponseSchema = z
  .object({
    BusinessLocationID: z.string().optional(),
    Level: z.number().int(),
    Name: z.string(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// GetAccountByGroupIdResponse
export const GetAccountByGroupIdResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            account_type: z
              .object({
                code: z.string(),
                description: z.string().optional(),
                id: z.string(),
                name: z.string(),
              })
              .strict(),
            allocation_settings: z
              .union([
                z.array(
                  z
                    .object({
                      analysis_type_id: z.string(),
                      analysis_type_name: z.string(),
                      is_module_specific: z.boolean(),
                    })
                    .strict(),
                ),
                z.null(),
              ])
              .optional(),
            code: z.string(),
            group: z
              .object({
                code: z.string(),
                id: z.string(),
                level: z.number().int(),
                name: z.string(),
              })
              .strict(),
            id: z.string(),
            is_active: z.boolean(),
            is_reconciliation_account: z.boolean(),
            name: z.string(),
            short_name: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// GetAccountByGroupNameResponse
export const GetAccountByGroupNameResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            account_type: z
              .object({
                code: z.string(),
                description: z.string().optional(),
                id: z.string(),
                name: z.string(),
              })
              .strict(),
            allocation_settings: z
              .union([
                z.array(
                  z
                    .object({
                      analysis_type_id: z.string(),
                      analysis_type_name: z.string(),
                      is_module_specific: z.boolean(),
                    })
                    .strict(),
                ),
                z.null(),
              ])
              .optional(),
            code: z.string(),
            group: z
              .object({
                code: z.string(),
                id: z.string(),
                level: z.number().int(),
                name: z.string(),
              })
              .strict(),
            id: z.string(),
            is_active: z.boolean(),
            is_reconciliation_account: z.boolean(),
            name: z.string(),
            short_name: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// GetAccountByIdResponse
export const GetAccountByIdResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({
        account_type: z
          .object({
            code: z.string(),
            description: z.string().optional(),
            id: z.string(),
            name: z.string(),
          })
          .strict(),
        alternate_group: z
          .object({
            code: z.string(),
            id: z.string(),
            level: z.number().int(),
            name: z.string(),
          })
          .strict()
          .optional(),
        code: z.string(),
        group: z
          .object({
            code: z.string(),
            id: z.string(),
            level: z.number().int(),
            name: z.string(),
          })
          .strict(),
        id: z.string(),
        is_active: z.boolean(),
        is_reconciliation_account: z.boolean(),
        last_modified_time: z.string().datetime({ offset: true }),
        name: z.string(),
        parent_group: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        short_name: z.string().optional(),
        version: z.number().int(),
      })
      .strict(),
  })
  .strict();

// GetAccountGroupByIdResponse
export const GetAccountGroupByIdResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({
        account_type: z
          .object({
            code: z.string(),
            description: z.string().optional(),
            id: z.string(),
            name: z.string(),
          })
          .strict(),
        code: z.string(),
        id: z.string(),
        is_active: z.boolean(),
        last_modified_time: z.string().datetime({ offset: true }),
        level: z.number().int(),
        name: z.string(),
        parent_account_group: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        short_name: z.string().optional(),
        version: z.number().int(),
      })
      .strict(),
  })
  .strict();

// GetAccountGroupTreeResponse
export const GetAccountGroupTreeResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            account_type: z
              .object({
                code: z.string(),
                description: z.string().optional(),
                id: z.string(),
                name: z.string(),
              })
              .strict(),
            children: z.union([z.array(z.any()), z.null()]).optional(),
            code: z.string(),
            depth: z.number().int(),
            full_path: z.string(),
            id: z.string(),
            is_active: z.boolean(),
            level: z.number().int(),
            name: z.string(),
            path: z.union([z.array(z.string()), z.null()]),
            short_name: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// GetAccountGroupsByParentResponse
export const GetAccountGroupsByParentResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            account_type: z
              .object({
                code: z.string(),
                description: z.string().optional(),
                id: z.string(),
                name: z.string(),
              })
              .strict(),
            code: z.string(),
            id: z.string(),
            is_active: z.boolean(),
            level: z.number().int(),
            name: z.string(),
            short_name: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// GetAssetByCodeResponse
export const GetAssetByCodeResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({
        account: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        account_maintenance_exp: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        account_running_exp: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        account_wip: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        category: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        code: z.string(),
        contract_amount: z.number().optional(),
        contract_from: z.string().datetime({ offset: true }).optional(),
        contract_terms_and_conditions: z.string().optional(),
        contract_to: z.string().datetime({ offset: true }).optional(),
        contractor: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        id: z.string(),
        is_active: z.boolean(),
        last_modified_time: z.string().datetime({ offset: true }),
        make: z.string().optional(),
        manufacturer: z.string().optional(),
        model: z.string().optional(),
        name: z.string(),
        ownership: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        purchase_date: z.string().datetime({ offset: true }).optional(),
        reg_no: z.string().optional(),
        remarks: z.string().optional(),
        supplier: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        tare_weight: z.number().optional(),
        tare_weight_uom: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        version: z.number().int(),
      })
      .strict(),
  })
  .strict();

// GetAssetByIdResponse
export const GetAssetByIdResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({
        account: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        account_maintenance_exp: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        account_running_exp: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        account_wip: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        category: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        code: z.string(),
        contract_amount: z.number().optional(),
        contract_from: z.string().datetime({ offset: true }).optional(),
        contract_terms_and_conditions: z.string().optional(),
        contract_to: z.string().datetime({ offset: true }).optional(),
        contractor: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        id: z.string(),
        is_active: z.boolean(),
        last_modified_time: z.string().datetime({ offset: true }),
        make: z.string().optional(),
        manufacturer: z.string().optional(),
        model: z.string().optional(),
        name: z.string(),
        ownership: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        purchase_date: z.string().datetime({ offset: true }).optional(),
        reg_no: z.string().optional(),
        remarks: z.string().optional(),
        supplier: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        tare_weight: z.number().optional(),
        tare_weight_uom: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        version: z.number().int(),
      })
      .strict(),
  })
  .strict();

// GetAssetCategoryByIdResponse
export const GetAssetCategoryByIdResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({
        account: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        account_id: z.string().optional(),
        code: z.string(),
        id: z.string(),
        last_modified_time: z.string().datetime({ offset: true }),
        name: z.string(),
        parent_category: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        version: z.number().int(),
      })
      .strict(),
  })
  .strict();

// GetAssetCategoryTreeResponse
export const GetAssetCategoryTreeResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            account_id: z.string().optional(),
            children: z.union([z.array(z.any()), z.null()]),
            code: z.string(),
            id: z.string(),
            name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// GetAssetsByCategoryIdResponse
export const GetAssetsByCategoryIdResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            account: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            category: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            code: z.string(),
            id: z.string(),
            is_active: z.boolean(),
            make: z.string().optional(),
            manufacturer: z.string().optional(),
            model: z.string().optional(),
            name: z.string(),
            ownership: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            purchase_date: z.string().datetime({ offset: true }).optional(),
            reg_no: z.string().optional(),
            tare_weight: z.number().optional(),
            tare_weight_uom: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// GetAssetsByCategoryNameResponse
export const GetAssetsByCategoryNameResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            account: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            category: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            code: z.string(),
            id: z.string(),
            is_active: z.boolean(),
            make: z.string().optional(),
            manufacturer: z.string().optional(),
            model: z.string().optional(),
            name: z.string(),
            ownership: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            purchase_date: z.string().datetime({ offset: true }).optional(),
            reg_no: z.string().optional(),
            tare_weight: z.number().optional(),
            tare_weight_uom: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// GetMachineryByCodeResponse
export const GetMachineryByCodeResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({
        account: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        account_id: z.string().optional(),
        code: z.string(),
        id: z.string(),
        is_active: z.boolean(),
        last_modified_time: z.string().datetime({ offset: true }),
        name: z.string(),
        version: z.number().int(),
      })
      .strict(),
  })
  .strict();

// GetMachineryByIdResponse
export const GetMachineryByIdResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({
        account: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        account_id: z.string().optional(),
        code: z.string(),
        id: z.string(),
        is_active: z.boolean(),
        last_modified_time: z.string().datetime({ offset: true }),
        name: z.string(),
        version: z.number().int(),
      })
      .strict(),
  })
  .strict();

// GetAccessRightsByRoleIdData
export const GetAccessRightsByRoleIdDataSchema = z
  .object({
    can_add: z.boolean().describe("Has add access"),
    can_delete: z.boolean().describe("Has delete access"),
    can_edit: z.boolean().describe("Has edit access"),
    can_view: z.boolean().describe("Has view access"),
    context: z
      .object({
        description: z.string().describe("Context description").optional(),
        id: z.string().describe("Context ID"),
      })
      .strict(),
    entity: z
      .object({
        id: z.string().describe("Entity ID"),
        name: z.string().describe("Entity name"),
      })
      .strict(),
  })
  .strict();

// GetAccessRightsByRoleIdDataContextStruct
export const GetAccessRightsByRoleIdDataContextStructSchema = z
  .object({
    description: z.string().describe("Context description").optional(),
    id: z.string().describe("Context ID"),
  })
  .strict();

// GetAccessRightsByRoleIdDataEntityStruct
export const GetAccessRightsByRoleIdDataEntityStructSchema = z
  .object({
    id: z.string().describe("Entity ID"),
    name: z.string().describe("Entity name"),
  })
  .strict();

// GetAccessRightsByRoleIdResponseBody
export const GetAccessRightsByRoleIdResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .union([
        z
          .array(
            z
              .object({
                can_add: z.boolean().describe("Has add access"),
                can_delete: z.boolean().describe("Has delete access"),
                can_edit: z.boolean().describe("Has edit access"),
                can_view: z.boolean().describe("Has view access"),
                context: z
                  .object({
                    description: z
                      .string()
                      .describe("Context description")
                      .optional(),
                    id: z.string().describe("Context ID"),
                  })
                  .strict(),
                entity: z
                  .object({
                    id: z.string().describe("Entity ID"),
                    name: z.string().describe("Entity name"),
                  })
                  .strict(),
              })
              .strict(),
          )
          .describe("List of access rights"),
        z.null().describe("List of access rights"),
      ])
      .describe("List of access rights"),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// GetAccountByModuleNameBody
export const GetAccountByModuleNameBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            account_type: z
              .object({
                code: z.string(),
                description: z.string().optional(),
                id: z.string(),
                name: z.string(),
              })
              .strict(),
            allocation_settings: z
              .union([
                z.array(
                  z
                    .object({
                      analysis_type_id: z.string(),
                      analysis_type_name: z.string(),
                      is_module_specific: z.boolean(),
                    })
                    .strict(),
                ),
                z.null(),
              ])
              .optional(),
            code: z.string(),
            group: z
              .object({
                code: z.string(),
                id: z.string(),
                level: z.number().int(),
                name: z.string(),
              })
              .strict(),
            id: z.string(),
            is_active: z.boolean(),
            is_reconciliation_account: z.boolean(),
            name: z.string(),
            short_name: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    pagination: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// GetAccountsResponse
export const GetAccountsResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            account_type: z
              .object({
                code: z.string(),
                description: z.string().optional(),
                id: z.string(),
                name: z.string(),
              })
              .strict(),
            allocation_settings: z
              .union([
                z.array(
                  z
                    .object({
                      analysis_type_id: z.string(),
                      analysis_type_name: z.string(),
                      is_module_specific: z.boolean(),
                    })
                    .strict(),
                ),
                z.null(),
              ])
              .optional(),
            code: z.string(),
            group: z
              .object({
                code: z.string(),
                id: z.string(),
                level: z.number().int(),
                name: z.string(),
              })
              .strict(),
            id: z.string(),
            is_active: z.boolean(),
            is_reconciliation_account: z.boolean(),
            name: z.string(),
            short_name: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    pagination: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// GetBatchByCodeResponseBody
export const GetBatchByCodeResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({
        code: z.string(),
        id: z.string(),
        name: z.string(),
        nursery_id: z.string(),
        program_number: z.string().optional(),
        start_date: z.string(),
      })
      .strict(),
  })
  .strict();

// GetBatchByIDResponseBody
export const GetBatchByIDResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({
        code: z.string(),
        id: z.string(),
        name: z.string(),
        nursery_id: z.string(),
        program_number: z.string().optional(),
        start_date: z.string(),
      })
      .strict(),
  })
  .strict();

// GetContextListsResponse
export const GetContextListsResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            description: z.union([z.string(), z.null()]),
            id: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// GetDenominationResponseBody
export const GetDenominationResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    configurations: z.union([
      z.array(
        z
          .object({
            id: z.string(),
            title_code: z.string(),
            title_id: z.string(),
            title_name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    factor: z.union([z.number(), z.null()]),
    id: z.string(),
    name: z.string(),
  })
  .strict();

// GetDivisionSubBlocksResponseBody
export const GetDivisionSubBlocksResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            administrative_unit: z
              .object({ id: z.string(), name: z.string() })
              .strict()
              .optional(),
            area: z.number().optional(),
            code: z.string(),
            first_harvesting_date: z.string().optional(),
            id: z.string(),
            immature_area: z.number().optional(),
            in_activation_date: z.string().optional(),
            matured_area: z.number().optional(),
            maturity_age: z.number().optional(),
            name: z.string(),
            number_of_plants: z.number().int().optional(),
            other_area: z.number().optional(),
            parent: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            setting: z
              .object({ id: z.string(), name: z.string() })
              .strict()
              .optional(),
            terrain_type: z
              .object({ id: z.string(), value: z.string() })
              .strict()
              .optional(),
            year_of_planting: z.number().int().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// GetEntityListsResponse
export const GetEntityListsResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            description: z.union([z.string(), z.null()]),
            entity_name: z.union([z.string(), z.null()]),
            id: z.string(),
            is_primary: z.union([z.boolean(), z.null()]),
            locked: z.union([z.boolean(), z.null()]),
            object_security_type: z.union([z.string(), z.null()]),
            sync: z.union([z.boolean(), z.null()]),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// GetGrowthStageOutputBody
export const GetGrowthStageOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({
        code: z.string(),
        commodity: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict(),
        growth_stage_period: z
          .object({ from: z.number().int(), to: z.number().int() })
          .strict(),
        id: z.string(),
        is_arrival_allowed: z.boolean(),
        is_batch_transfer_allowed: z.boolean(),
        is_nursery_issue_allowed: z.boolean(),
        master_value_period_id: z.string(),
        name: z.string(),
        parent_growth_stage_id: z.string().optional(),
        period: z.string(),
      })
      .strict(),
  })
  .strict();

// GetNurseryArrivalByIdOutputBody
export const GetNurseryArrivalByIdOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({
        administrative_unit: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict(),
        arrival_number: z.string(),
        arrival_reference_no: z.string(),
        arrival_type: z
          .object({ code: z.number().int(), id: z.string(), value: z.string() })
          .strict(),
        batch: z
          .object({
            code: z.string(),
            id: z.string(),
            name: z.string(),
            program_number: z.string(),
            start_date: z.string().datetime({ offset: true }),
          })
          .strict(),
        commodity: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict(),
        cross_parents: z.string(),
        date: z.string().datetime({ offset: true }),
        delivery_note_number: z.string(),
        family_number: z.string(),
        id: z.string(),
        nursery: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict(),
        pollination_number: z.string(),
        production_number: z.string(),
        remarks: z.string(),
        saction_number: z.string(),
        source_type: z
          .object({ code: z.number().int(), id: z.string(), value: z.string() })
          .strict(),
      })
      .strict(),
  })
  .strict();

// GetNurseryBedResponseBody
export const GetNurseryBedResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({
        breadth: z.number(),
        breadth_uom: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict(),
        date_of_creation: z.string(),
        id: z.string(),
        is_active: z.boolean(),
        length: z.number(),
        length_uom: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict(),
        name: z.string(),
        nursery_id: z.string(),
        short_name: z.string(),
      })
      .strict(),
  })
  .strict();

// GetNurseryOutputBody
export const GetNurseryOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({
        administrative_unit: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict()
          .optional(),
        area: z.number(),
        area_uom: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict(),
        budget_rate: z.number().optional(),
        code: z.string(),
        commodity: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict(),
        id: z.string(),
        name: z.string(),
        nursery_type: z
          .object({ code: z.number().int(), id: z.string(), name: z.string() })
          .strict(),
        process_date: z.string().datetime({ offset: true }).optional(),
        project: z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict(),
        start_date: z.string().datetime({ offset: true }),
      })
      .strict(),
  })
  .strict();

// GetReasonResponseBody
export const GetReasonResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({ code: z.string(), id: z.string(), reason: z.string() })
      .strict(),
  })
  .strict();

// GetRoleOutputBody
export const GetRoleOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    role: z
      .object({
        description: z.string().describe("Role description").optional(),
        id: z.number().int().describe("Role ID"),
        modules: z
          .union([
            z
              .array(
                z
                  .object({
                    children: z
                      .union([
                        z.array(z.any()).describe("Child modules"),
                        z.null().describe("Child modules"),
                      ])
                      .describe("Child modules"),
                    context_id: z
                      .string()
                      .describe("Module Context ID")
                      .optional(),
                    description: z
                      .string()
                      .describe("Module description")
                      .optional(),
                    icon: z.string().describe("Module icon"),
                    id: z.number().int().describe("Module ID"),
                    is_active: z
                      .boolean()
                      .describe("Is module active")
                      .optional(),
                    kind: z
                      .string()
                      .describe("Module kind (group, module, category, item)"),
                    name: z.string().describe("Module name"),
                    parent_id: z
                      .number()
                      .int()
                      .describe("Parent Module ID")
                      .optional(),
                    path_name: z.string().describe("Module pathname"),
                    slug: z
                      .string()
                      .describe("Module slug (URL-friendly identifier)"),
                    sort_order: z
                      .number()
                      .int()
                      .describe("Sort order within parent"),
                  })
                  .strict(),
              )
              .describe("List of assigned modules as a tree structure"),
            z.null().describe("List of assigned modules as a tree structure"),
          ])
          .describe("List of assigned modules as a tree structure"),
        name: z.string().describe("Role name").optional(),
        permissions: z
          .union([
            z
              .array(
                z
                  .object({
                    action_kind: z
                      .number()
                      .int()
                      .describe("Action kind")
                      .optional(),
                    description: z
                      .string()
                      .describe("Permission description")
                      .optional(),
                    entity_id: z
                      .string()
                      .describe("Associated entity ID")
                      .optional(),
                    id: z.number().int().describe("Permission ID"),
                    is_assigned: z
                      .boolean()
                      .describe("Is permission assigned to role"),
                    module_id: z
                      .number()
                      .int()
                      .describe("Module ID this permission belongs to"),
                    name: z.string().describe("Permission name"),
                    slug: z.string().describe("Permission slug"),
                  })
                  .strict(),
              )
              .describe("List of permissions assigned to this role"),
            z.null().describe("List of permissions assigned to this role"),
          ])
          .describe("List of permissions assigned to this role"),
      })
      .strict(),
  })
  .strict();

// GroupCompanyItem
export const GroupCompanyItemSchema = z
  .object({ id: z.string(), name: z.string() })
  .strict();

// GroupItem
export const GroupItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string(),
    company: z.object({ id: z.string(), name: z.string() }).strict(),
    id: z.string(),
    name: z.string(),
  })
  .strict();

// GrowthStage
export const GrowthStageSchema = z
  .object({ code: z.string(), name: z.string() })
  .strict();

// GrowthStageAccount
export const GrowthStageAccountSchema = z
  .object({
    bt_brought_forward_allocation: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    bt_transferred_out_allocation: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    growth_stage: z.object({ code: z.string(), name: z.string() }).strict(),
    gst_brought_forward_allocation: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    gst_transferred_out_allocation: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    id: z.string(),
  })
  .strict();

// GrowthStageCommodityItem
export const GrowthStageCommodityItemSchema = z
  .object({ Code: z.string(), Name: z.string(), uoid: z.string() })
  .strict();

// GrowthStageIssueRecoveryItem
export const GrowthStageIssueRecoveryItemSchema = z
  .object({
    BusinessLocationID: z.string().optional(),
    FK_AllocationCodeID: z.string().optional(),
    FK_NurseryGrowthStageDTLID: z.string().optional(),
    FK_PurposeOfIssueID: z.string().optional(),
    FK_RequisitionTypeID: z.string().optional(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// GrowthStagePeriod
export const GrowthStagePeriodSchema = z
  .object({ from: z.number().int(), to: z.number().int() })
  .strict();

// GrowthStagePeriodDtlItem
export const GrowthStagePeriodDtlItemSchema = z
  .object({
    BusinessLocationID: z.string().optional(),
    From: z.number().int().optional(),
    To: z.number().int().optional(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// GrowthStageRequest
export const GrowthStageRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1).describe("Code of the growth stage"),
    commodity_id: z.string().describe("Commodity ID"),
    is_arrival_allowed: z
      .union([
        z.boolean().describe("Whether arrival is allowed"),
        z.null().describe("Whether arrival is allowed"),
      ])
      .describe("Whether arrival is allowed"),
    is_batch_transfer_allowed: z
      .union([
        z.boolean().describe("Whether batch transfer is allowed"),
        z.null().describe("Whether batch transfer is allowed"),
      ])
      .describe("Whether batch transfer is allowed"),
    is_nursery_issue_allowed: z
      .union([
        z.boolean().describe("Whether nursery issue is allowed"),
        z.null().describe("Whether nursery issue is allowed"),
      ])
      .describe("Whether nursery issue is allowed"),
    master_value_period_id: z
      .string()
      .describe("Master value ID for period")
      .optional(),
    name: z.string().min(1).describe("Name of the growth stage"),
    parent_growth_stage_id: z
      .string()
      .describe("Optional parent growth stage ID")
      .optional(),
    period: z.number().int().describe("Period for the growth stage").optional(),
  })
  .strict();

// GrowthStageResponse
export const GrowthStageResponseSchema = z
  .object({
    code: z.string(),
    commodity: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict(),
    growth_stage_period: z
      .object({ from: z.number().int(), to: z.number().int() })
      .strict(),
    id: z.string(),
    is_arrival_allowed: z.boolean(),
    is_batch_transfer_allowed: z.boolean(),
    is_nursery_issue_allowed: z.boolean(),
    master_value_period_id: z.string(),
    name: z.string(),
    parent_growth_stage_id: z.string().optional(),
    period: z.string(),
  })
  .strict();

// HealthOutputBody
export const HealthOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    db: z.string().describe("Database connection status"),
    status: z.string().describe("Server status"),
  })
  .strict();

// HolidayDTLItem
export const HolidayDTLItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    fk_holiday_id: z.string(),
    holiday_date: z.string().datetime({ offset: true }),
    id: z.string(),
  })
  .strict();

// HolidayHDRItem
export const HolidayHDRItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    details: z
      .union([
        z.array(
          z
            .object({
              $schema: z
                .string()
                .url()
                .describe("A URL to the JSON Schema for this object.")
                .readonly()
                .optional(),
              fk_holiday_id: z.string(),
              holiday_date: z.string().datetime({ offset: true }),
              id: z.string(),
            })
            .strict(),
        ),
        z.null(),
      ])
      .optional(),
    eligibility_base: z
      .object({ code: z.number().int(), id: z.string(), value: z.string() })
      .strict()
      .optional(),
    id: z.string(),
    name: z.string(),
    type: z
      .object({ code: z.number().int(), id: z.string(), value: z.string() })
      .strict()
      .optional(),
  })
  .strict();

// KebangsaanItem
export const KebangsaanItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    country_id: z.string(),
    country_name: z.string().optional(),
    id: z.string(),
    name: z.string(),
  })
  .strict();

// ListAccountingFiscalPeriodDTLsOutputBody
export const ListAccountingFiscalPeriodDTLsOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string().optional(),
            FK_FiscalPeriodID: z.string().optional(),
            FK_MasterValueAccountingPeriodType: z.string().optional(),
            FromDate: z.string().datetime({ offset: true }).optional(),
            Name: z.string(),
            ToDate: z.string().datetime({ offset: true }).optional(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListAccountingUnitsOutputBody
export const ListAccountingUnitsOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string().optional(),
            IsActive: z.boolean(),
            Name: z.string(),
            details: z.union([
              z.array(
                z
                  .object({
                    BusinessLocationID: z.string().optional(),
                    EffectiveDate: z.string().optional(),
                    FK_AccountingUnitHDRID: z.string().optional(),
                    FK_AdministrativeUnitHDRID: z.string().optional(),
                    uoid: z.string(),
                    vuserid: z.string().optional(),
                  })
                  .strict(),
              ),
              z.null(),
            ]),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListAllDeliverySummariesResponseBody
export const ListAllDeliverySummariesResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            gap: z.number().int(),
            program_id: z.string(),
            program_name: z.string(),
            program_year: z.number().int(),
            total_actual_qty: z.number().int(),
            total_planned_qty: z.number().int(),
            total_seedling_delivery_qty: z.number().int(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListBatchesOutputBody
export const ListBatchesOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string().optional(),
            Code: z.string(),
            FK_NurseryID: z.string().optional(),
            Name: z.string(),
            ProgramNumber: z.string().optional(),
            StartDate: z.string().datetime({ offset: true }).optional(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListBatchesResponseBody
export const ListBatchesResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            code: z.string(),
            id: z.string(),
            name: z.string(),
            nursery_id: z.string(),
            program_number: z.string().optional(),
            start_date: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// ListCloneSettingsResponseBody
export const ListCloneSettingsResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            clone_id: z.string(),
            clone_name: z.string(),
            commodity: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            created_at: z.string().optional(),
            id: z.string(),
            planting_pattern: z.number().int(),
            seedling_per_hectare: z.number().int(),
            updated_at: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// ListClonesByEstateInProgramResponseBody
export const ListClonesByEstateInProgramResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            area_hectare: z.number().optional(),
            block_id: z.string(),
            block_name: z.string().optional(),
            clone_dtl_id: z.string(),
            clone_name: z.string().optional(),
            clone_setting_id: z.string(),
            division_id: z.string(),
            division_name: z.string().optional(),
            effective_area_hectare: z.number().optional(),
            estate_id: z.string(),
            estate_name: z.string().optional(),
            gap: z.number().int(),
            seedling_delivery_qty: z.number().int().optional(),
            seedling_requirement: z.number().int().optional(),
            total_actual_qty: z.number().int(),
            total_planned_qty: z.number().int(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListClonesOutputBody
export const ListClonesOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string().optional(),
            FK_CommodityID: z.string().optional(),
            Name: z.string(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListCommoditiesOutputBody
export const ListCommoditiesOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string().optional(),
            Code: z.string(),
            CropReferenceCode: z.string().optional(),
            FK_MasterValueParentCropID: z.string().optional(),
            IsMajor: z.boolean(),
            Name: z.string(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListCropsResponseBody
export const ListCropsResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            code: z.number().int(),
            id: z.string(),
            master_type_id: z.string(),
            value: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListDenominationResponseBody
export const ListDenominationResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            factor: z.union([z.number(), z.null()]),
            id: z.string(),
            name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// ListDivisionsOutputBody
export const ListDivisionsOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string(),
            Code: z.string(),
            FK_AddressID: z.string().optional(),
            FK_AdministrativeUnitSettingID: z.string(),
            FK_GroupID: z.string(),
            FK_ParentAdministrativeUnitID: z.string(),
            IsActive: z.boolean(),
            IsFactory: z.boolean(),
            IsLoginAdministrativeUnit: z.boolean(),
            Name: z.string(),
            ShortName: z.string().optional(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListEmployeesOutputBody
export const ListEmployeesOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string(),
            Category: z.union([z.string(), z.null()]),
            DepartmentName: z.union([z.string(), z.null()]),
            Designation: z.union([z.string(), z.null()]),
            DivisionID: z.string(),
            DivisionName: z.union([z.string(), z.null()]),
            EmployeeName: z.string(),
            EmployeeNumber: z.string(),
            Grade: z.union([z.string(), z.null()]),
            Level: z.union([z.string(), z.null()]),
            RoleName: z.string(),
            Uoid: z.string(),
            WindowsLogin: z.union([z.string(), z.null()]),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListEmptyBatchesResponseBody
export const ListEmptyBatchesResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            code: z.string(),
            id: z.string(),
            name: z.string(),
            nursery_id: z.string(),
            program_number: z.string().optional(),
            start_date: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// ListEntitiesByContextIDBody
export const ListEntitiesByContextIDBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    context_description: z.string(),
    context_id: z.string(),
    entities: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            description: z.union([z.string(), z.null()]),
            entity_name: z.union([z.string(), z.null()]),
            id: z.string(),
            is_primary: z.union([z.boolean(), z.null()]),
            locked: z.union([z.boolean(), z.null()]),
            object_security_type: z.union([z.string(), z.null()]),
            sync: z.union([z.boolean(), z.null()]),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListEstatesInProgramResponseBody
export const ListEstatesInProgramResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListEstatesOutputBody
export const ListEstatesOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string().optional(),
            Code: z.string(),
            FK_AddressID: z.string().optional(),
            FK_AdministrativeUnitSettingID: z.string().optional(),
            FK_DivisionType: z.string().optional(),
            FK_GroupID: z.string().optional(),
            FK_MasterValueFactoryName: z.string().optional(),
            FK_ParentAdministrativeUnitID: z.string().optional(),
            IsActive: z.boolean().optional(),
            IsFactory: z.boolean().optional(),
            IsLoginAdministrativeUnit: z.boolean().optional(),
            Name: z.string(),
            ShortName: z.string().optional(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListGeneralAllocationsOutputBody
export const ListGeneralAllocationsOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string().optional(),
            Code: z.string(),
            FK_AccountID: z.string().optional(),
            FK_GeneralAllocationGroupID: z.string().optional(),
            FK_MastervalueMachineryOutput: z.string().optional(),
            IsDeriveAccountCodeFromBlock: z.boolean(),
            IsDeriveAccountCodeFromCrop: z.boolean(),
            Name: z.string(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListGeographicalUnitAreaCommoditiesOutputBody
export const ListGeographicalUnitAreaCommoditiesOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            Area: z.number().optional(),
            BusinessLocationID: z.string().optional(),
            FK_CloneID: z.string().optional(),
            FK_CommoidityID: z.string().optional(),
            FK_GeographicalUnitID: z.string().optional(),
            FK_MasterValueAreaDescriptionID: z.string().optional(),
            FK_MasterValueAreaTypeID: z.string().optional(),
            FK_MasterValuePlantingTypeID: z.string().optional(),
            FK_PlantingDate: z.string().datetime({ offset: true }).optional(),
            FK_SoilTypeID: z.string().optional(),
            FK_UomID: z.string().optional(),
            NumberOfPlants: z.number().int().optional(),
            YearOfPlanting: z.number().int().optional(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListGeographicalUnitParentsOutputBody
export const ListGeographicalUnitParentsOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            AGRUpdateFlag: z.number().int().optional(),
            BusinessLocationID: z.string().optional(),
            Code: z.string(),
            EffectiveFromDateofMaturity: z
              .string()
              .datetime({ offset: true })
              .optional(),
            FK_AdministrativeUnitID: z.string().optional(),
            FK_GeographicalUnitStngID: z.string().optional(),
            FK_MasterValueTerrainType: z.string().optional(),
            FK_ParentGeographicalUnitID: z.string().optional(),
            FirstHarvestingDate: z
              .string()
              .datetime({ offset: true })
              .optional(),
            ImmatureArea: z.number().optional(),
            InActivationDate: z.string().datetime({ offset: true }).optional(),
            MaturedArea: z.number().optional(),
            MaturityAge: z.number().optional(),
            Name: z.string(),
            OtherArea: z.number().optional(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListGeographicalUnitSettingsOutputBody
export const ListGeographicalUnitSettingsOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string().optional(),
            Level: z.number().int(),
            Name: z.string(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListGeographicalUnitSubsOutputBody
export const ListGeographicalUnitSubsOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            AGRUpdateFlag: z.number().int().optional(),
            BusinessLocationID: z.string().optional(),
            Code: z.string(),
            EffectiveFromDateofMaturity: z
              .string()
              .datetime({ offset: true })
              .optional(),
            FK_AdministrativeUnitID: z.string().optional(),
            FK_GeographicalUnitStngID: z.string().optional(),
            FK_MasterValueTerrainType: z.string().optional(),
            FK_ParentGeographicalUnitID: z.string().optional(),
            FirstHarvestingDate: z
              .string()
              .datetime({ offset: true })
              .optional(),
            ImmatureArea: z.number().optional(),
            InActivationDate: z.string().datetime({ offset: true }).optional(),
            MaturedArea: z.number().optional(),
            MaturityAge: z.number().optional(),
            Name: z.string(),
            OtherArea: z.number().optional(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListGeographicalUnitsResponseBody
export const ListGeographicalUnitsResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            administrative_unit: z
              .object({ id: z.string(), name: z.string() })
              .strict()
              .optional(),
            area: z.number().optional(),
            code: z.string(),
            first_harvesting_date: z.string().optional(),
            id: z.string(),
            immature_area: z.number().optional(),
            in_activation_date: z.string().optional(),
            matured_area: z.number().optional(),
            maturity_age: z.number().optional(),
            name: z.string(),
            number_of_plants: z.number().int().optional(),
            other_area: z.number().optional(),
            parent: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            setting: z
              .object({ id: z.string(), name: z.string() })
              .strict()
              .optional(),
            terrain_type: z
              .object({ id: z.string(), value: z.string() })
              .strict()
              .optional(),
            year_of_planting: z.number().int().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// ListGrowthStagesOutputBody
export const ListGrowthStagesOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            code: z.string(),
            commodity: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict(),
            growth_stage_period: z
              .object({ from: z.number().int(), to: z.number().int() })
              .strict(),
            id: z.string(),
            is_arrival_allowed: z.boolean(),
            is_batch_transfer_allowed: z.boolean(),
            is_nursery_issue_allowed: z.boolean(),
            master_value_period_id: z.string(),
            name: z.string(),
            parent_growth_stage_id: z.string().optional(),
            period: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListMasterTypesOutputBody
export const ListMasterTypesOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string(),
            Name: z.string(),
            StartingCode: z.string(),
            uoid: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListMasterValueNurseriesOutputBody
export const ListMasterValueNurseriesOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string(),
            MasterTypeAllowableActions: z.union([z.string(), z.null()]),
            MasterTypeID: z.string(),
            MasterTypeName: z.union([z.string(), z.null()]),
            MasterTypeStartingCode: z.union([z.string(), z.null()]),
            MasterValue: z.union([z.string(), z.null()]),
            MasterValueCode: z.union([z.number().int(), z.null()]),
            uoid: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListNurseriesOutputBody
export const ListNurseriesOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            Area: z.number().optional(),
            BudgetRate: z.number().optional(),
            BusinessLocationID: z.string().optional(),
            Code: z.string(),
            FK_AdministrativeUnitID: z.string().optional(),
            FK_AnalysisCodeIDProject: z.string().optional(),
            FK_AreaUOMID: z.string().optional(),
            FK_CommodityID: z.string().optional(),
            FK_NurseryTypeID: z.string().optional(),
            Name: z.string(),
            ProcessDate: z.string().datetime({ offset: true }).optional(),
            StartDate: z.string().datetime({ offset: true }).optional(),
            StatusChangedBy: z.string().optional(),
            StatusChangedDate: z.string().datetime({ offset: true }).optional(),
            StatusChangedRemarks: z.string().optional(),
            cState: z.string().optional(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListNurseriesResponse
export const ListNurseriesResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            administrative_unit: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            area: z.number(),
            area_uom: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict(),
            budget_rate: z.number().optional(),
            code: z.string(),
            commodity: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict(),
            id: z.string(),
            name: z.string(),
            nursery_type: z
              .object({
                code: z.number().int(),
                id: z.string(),
                name: z.string(),
              })
              .strict(),
            process_date: z.string().datetime({ offset: true }).optional(),
            project: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict(),
            start_date: z.string().datetime({ offset: true }),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// ListNurseryArrivalResponse
export const ListNurseryArrivalResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            administrative_unit: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict(),
            arrival_number: z.string(),
            arrival_reference_no: z.string(),
            arrival_type: z
              .object({
                code: z.number().int(),
                id: z.string(),
                value: z.string(),
              })
              .strict(),
            batch: z
              .object({
                code: z.string(),
                id: z.string(),
                name: z.string(),
                program_number: z.string(),
                start_date: z.string().datetime({ offset: true }),
              })
              .strict(),
            commodity: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict(),
            cross_parents: z.string(),
            date: z.string().datetime({ offset: true }),
            delivery_note_number: z.string(),
            family_number: z.string(),
            id: z.string(),
            nursery: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict(),
            pollination_number: z.string(),
            production_number: z.string(),
            remarks: z.string(),
            saction_number: z.string(),
            source_type: z
              .object({
                code: z.number().int(),
                id: z.string(),
                value: z.string(),
              })
              .strict(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// ListNurseryBedsOutputBody
export const ListNurseryBedsOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            Breadth: z.number().optional(),
            BusinessLocationID: z.string().optional(),
            DateOfCreation: z.string().datetime({ offset: true }).optional(),
            FK_BreadthUOMID: z.string().optional(),
            FK_LengthUOMID: z.string().optional(),
            FK_NurseryID: z.string().optional(),
            IsActive: z.boolean(),
            Length: z.number().optional(),
            Name: z.string(),
            ShortName: z.string().optional(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListNurseryBedsResponseBody
export const ListNurseryBedsResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            breadth: z.number(),
            breadth_uom: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict(),
            date_of_creation: z.string(),
            id: z.string(),
            is_active: z.boolean(),
            length: z.number(),
            length_uom: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict(),
            name: z.string(),
            nursery_id: z.string(),
            short_name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// ListNurseryGrowthStageDetailsOutputBody
export const ListNurseryGrowthStageDetailsOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string().optional(),
            Code: z.string(),
            Commodity: z
              .object({ Code: z.string(), Name: z.string(), uoid: z.string() })
              .strict()
              .optional(),
            FK_CommodityID: z.string().optional(),
            FK_MasterValuePeriodID: z.string().optional(),
            FK_ParentGrowthStageID: z.string().optional(),
            IsArrivalAllowed: z.boolean(),
            IsBatchTransferAllowed: z.boolean(),
            IsNurseryIssueAllowed: z.boolean(),
            Name: z.string(),
            Period: z.number().int().optional(),
            PeriodDetails: z.union([
              z.array(
                z
                  .object({
                    BusinessLocationID: z.string().optional(),
                    From: z.number().int().optional(),
                    To: z.number().int().optional(),
                    uoid: z.string(),
                    vuserid: z.string().optional(),
                  })
                  .strict(),
              ),
              z.null(),
            ]),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListNurseryGrowthStagesOutputBody
export const ListNurseryGrowthStagesOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string().optional(),
            Details: z.union([
              z.array(
                z
                  .object({
                    Activities: z.union([
                      z.array(
                        z
                          .object({
                            Allocations: z.union([
                              z.array(
                                z
                                  .object({
                                    BusinessLocationID: z.string().optional(),
                                    FK_GeneralAllocationHDRID: z
                                      .string()
                                      .optional(),
                                    FK_NurseryGrowthStageActivityDTLID: z
                                      .string()
                                      .optional(),
                                    IsRecoveryAllocation: z.boolean(),
                                    uoid: z.string(),
                                    vuserid: z.string().optional(),
                                  })
                                  .strict(),
                              ),
                              z.null(),
                            ]),
                            BusinessLocationID: z.string().optional(),
                            FK_MasterValueNurseryActivityID: z
                              .string()
                              .optional(),
                            FK_NurseryGrowthStageDTLID: z.string().optional(),
                            MasterValueNurseryActivityCode: z.number().int(),
                            MasterValueNurseryActivityValue: z.string(),
                            uoid: z.string(),
                            vuserid: z.string().optional(),
                          })
                          .strict(),
                      ),
                      z.null(),
                    ]),
                    BusinessLocationID: z.string().optional(),
                    FK_BTBroughtForwardAllocation: z.string().optional(),
                    FK_BTTransferredOutAllocation: z.string().optional(),
                    FK_GSTBroughtForwardAllocation: z.string().optional(),
                    FK_GSTTransferredOutAllocation: z.string().optional(),
                    FK_GrowthStageHDRID: z.string().optional(),
                    FK_NurseryGrowthStageHDRID: z.string().optional(),
                    IssueRecoveries: z.union([
                      z.array(
                        z
                          .object({
                            BusinessLocationID: z.string().optional(),
                            FK_AllocationCodeID: z.string().optional(),
                            FK_NurseryGrowthStageDTLID: z.string().optional(),
                            FK_PurposeOfIssueID: z.string().optional(),
                            FK_RequisitionTypeID: z.string().optional(),
                            uoid: z.string(),
                            vuserid: z.string().optional(),
                          })
                          .strict(),
                      ),
                      z.null(),
                    ]),
                    uoid: z.string(),
                    vuserid: z.string().optional(),
                  })
                  .strict(),
              ),
              z.null(),
            ]),
            FK_NurseryTypeID: z.string().optional(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListNurseryReasonsOutputBody
export const ListNurseryReasonsOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string().optional(),
            Code: z.string(),
            Reason: z.string(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListNurserySettingsOutputBody
export const ListNurserySettingsOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            BackProcessAllowedDays: z.number().int(),
            BusinessLocationID: z.string().optional(),
            FK_BudgetIssueDifferentialAccount: z.string().optional(),
            FK_CostElementAnalysisCodeID: z.string().optional(),
            FK_DocumentCategoryID: z.string().optional(),
            FK_ExpenseTypeAnalysisCodeID: z.string().optional(),
            FK_GLDocumentAllocation: z.string().optional(),
            FK_GLStockBalanceWriteOffAccount: z.string().optional(),
            FK_GLStockBalanceWriteOffAllocation: z.string().optional(),
            FK_GeneralAllocationHDRIDNurseryClearing: z.string().optional(),
            FK_GeneralAllocationHDRIDNurseryCostOfSale: z.string().optional(),
            FK_GeneralAllocationHDRIDNurserySale: z.string().optional(),
            FK_reasonID: z.string().optional(),
            IsAccountPostingAtMonthEnd: z.boolean(),
            IsGenerateIrrigationNo: z.boolean(),
            IsGenerateOtherActivityNo: z.boolean(),
            IsGeneratePlantingNo: z.boolean(),
            IsGenereteArrivalNo: z.boolean(),
            IsGenereteBatchCode: z.boolean(),
            IsGenereteBatchTransferNo: z.boolean(),
            IsGenereteCullingNumber: z.boolean(),
            IsGenereteGrowthStageCode: z.boolean(),
            IsGenereteIssueNo: z.boolean(),
            IsGenereteNIRNo: z.boolean(),
            IsGenereteNurseryCode: z.boolean(),
            IsGenereteStageTransitionNo: z.boolean(),
            IsNIRSanctioningRequired: z.boolean(),
            IsSalesJournalRequired: z.boolean(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListPermissionsByModuleIdBody
export const ListPermissionsByModuleIdBodySchema = z
  .object({
    module_id: z.number().int(),
    permissions: z.union([
      z.array(
        z
          .object({
            action_kind: z.number().int().describe("Action kind").optional(),
            description: z
              .string()
              .describe("Permission description")
              .optional(),
            entity_id: z.string().describe("Associated entity ID").optional(),
            id: z.number().int().describe("Permission ID"),
            is_assigned: z.boolean().describe("Is permission assigned to role"),
            module_id: z
              .number()
              .int()
              .describe("Module ID this permission belongs to"),
            name: z.string().describe("Permission name"),
            slug: z.string().describe("Permission slug"),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListPermissionsByModuleIdResponse
export const ListPermissionsByModuleIdResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({
        module_id: z.number().int(),
        permissions: z.union([
          z.array(
            z
              .object({
                action_kind: z
                  .number()
                  .int()
                  .describe("Action kind")
                  .optional(),
                description: z
                  .string()
                  .describe("Permission description")
                  .optional(),
                entity_id: z
                  .string()
                  .describe("Associated entity ID")
                  .optional(),
                id: z.number().int().describe("Permission ID"),
                is_assigned: z
                  .boolean()
                  .describe("Is permission assigned to role"),
                module_id: z
                  .number()
                  .int()
                  .describe("Module ID this permission belongs to"),
                name: z.string().describe("Permission name"),
                slug: z.string().describe("Permission slug"),
              })
              .strict(),
          ),
          z.null(),
        ]),
      })
      .strict(),
  })
  .strict();

// ListPermissionsResponse
export const ListPermissionsResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            action_kind: z.number().int().describe("Action kind").optional(),
            description: z
              .string()
              .describe("Permission description")
              .optional(),
            entity_id: z.string().describe("Associated entity ID").optional(),
            id: z.number().int().describe("Permission ID"),
            is_assigned: z.boolean().describe("Is permission assigned to role"),
            module_id: z
              .number()
              .int()
              .describe("Module ID this permission belongs to"),
            name: z.string().describe("Permission name"),
            slug: z.string().describe("Permission slug"),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// ListPermissionsUnpaginatedWithEntityResponse
export const ListPermissionsUnpaginatedWithEntityResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            action_kind: z.number().int().describe("Action kind").optional(),
            description: z
              .string()
              .describe("Permission description")
              .optional(),
            entity: z
              .object({
                description: z.string().optional(),
                id: z.string(),
                name: z.string(),
              })
              .strict()
              .optional(),
            entity_id: z.string().describe("Associated entity ID").optional(),
            id: z.number().int().describe("Permission ID"),
            module_id: z
              .number()
              .int()
              .describe("Module ID this permission belongs to"),
            name: z.string().describe("Permission name"),
            slug: z.string().describe("Permission slug"),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListProductsResponseBody
export const ListProductsResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            business_location_id: z.string(),
            code: z.string(),
            commodity: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            id: z.string(),
            is_organic: z.boolean(),
            name: z.string(),
            product_settings: z.union([
              z.array(
                z
                  .object({
                    $schema: z
                      .string()
                      .url()
                      .describe("A URL to the JSON Schema for this object.")
                      .readonly()
                      .optional(),
                    business_location_id: z.string(),
                    id: z.string(),
                    product: z
                      .object({
                        code: z.string(),
                        id: z.string(),
                        name: z.string(),
                      })
                      .strict()
                      .optional(),
                    product_description_type: z
                      .object({ id: z.string(), value: z.string() })
                      .strict()
                      .optional(),
                  })
                  .strict(),
              ),
              z.null(),
            ]),
            product_type: z
              .object({ id: z.string(), value: z.string() })
              .strict()
              .optional(),
            quality_grades: z.union([
              z.array(
                z
                  .object({
                    $schema: z
                      .string()
                      .url()
                      .describe("A URL to the JSON Schema for this object.")
                      .readonly()
                      .optional(),
                    business_location_id: z.string(),
                    code: z.string(),
                    id: z.string(),
                    is_penalty: z.boolean(),
                    is_rejected: z.boolean(),
                    name: z.string(),
                    product: z
                      .object({
                        code: z.string(),
                        id: z.string(),
                        name: z.string(),
                      })
                      .strict()
                      .optional(),
                    short_name: z.string(),
                  })
                  .strict(),
              ),
              z.null(),
            ]),
            short_name: z.union([z.string(), z.null()]),
            uom: z
              .object({
                $schema: z
                  .string()
                  .url()
                  .describe("A URL to the JSON Schema for this object.")
                  .readonly()
                  .optional(),
                code: z.string(),
                id: z.string(),
                name: z.string(),
              })
              .strict()
              .optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// ListProjectsOutputBody
export const ListProjectsOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            AdministrativeUnitName: z.string().optional(),
            BusinessLocationID: z.string().optional(),
            Code: z.string(),
            EndDate: z.string().datetime({ offset: true }).optional(),
            FK_AdministrativeUnitHDRID: z.string().optional(),
            FK_MasterValueProjectType: z.string().optional(),
            IsActive: z.boolean(),
            Name: z.string(),
            ProjectTypeName: z.string().optional(),
            StartDate: z.string().datetime({ offset: true }).optional(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListProjectsResponseBody
export const ListProjectsResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            administrative_unit: z
              .object({ id: z.string(), name: z.string() })
              .strict()
              .optional(),
            code: z.string(),
            end_date: z.string().optional(),
            id: z.string(),
            is_active: z.boolean(),
            name: z.string(),
            project_type: z
              .object({ id: z.string(), value: z.string() })
              .strict()
              .optional(),
            start_date: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// ListPsrProgramsResponseBody
export const ListPsrProgramsResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            created_at: z.string().optional(),
            id: z.string(),
            name: z.string(),
            seedling_quantity: z.number().int(),
            updated_at: z.string().optional(),
            user_id: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// ListReasonsResponseBody
export const ListReasonsResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({ code: z.string(), id: z.string(), reason: z.string() })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// ListReplantingPlansResponseBody
export const ListReplantingPlansResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            area_hectare: z.string(),
            block: z
              .object({
                code: z.string(),
                id: z.string(),
                name: z.string(),
                year_of_planting: z.number().int().optional(),
              })
              .strict()
              .optional(),
            clone_setting: z
              .object({
                clone_name: z.string(),
                id: z.string(),
                planting_pattern: z.number().int(),
                seedling_per_hectare: z.number().int(),
              })
              .strict()
              .optional(),
            created_at: z.string().optional(),
            division: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            effective_area_hectare: z.string(),
            estate: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            hcv_area_hectare: z.string(),
            id: z.string(),
            is_apm: z.boolean(),
            plan_detail_id: z.string(),
            plan_header_id: z.string(),
            plants_per_hectare: z.number().int(),
            program_name: z.string(),
            program_year: z.number().int(),
            remaining_seedlings: z.number().int(),
            seedling_delivery_quantity: z.number().int(),
            seedling_requirement: z.number().int(),
            status: z.number().int(),
            updated_at: z.string().optional(),
            user_id: z.string().optional(),
            user_name: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// ListReplantingProgramsResponseBody
export const ListReplantingProgramsResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            id: z.string(),
            name: z.string(),
            year: z.number().int(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// ListRolesResponse
export const ListRolesResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    roles: z
      .union([
        z
          .array(
            z
              .object({
                description: z.string().describe("Role description").optional(),
                id: z.number().int().describe("Role ID"),
                name: z.string().describe("Role name").optional(),
              })
              .strict(),
          )
          .describe("List of all roles"),
        z.null().describe("List of all roles"),
      ])
      .describe("List of all roles"),
  })
  .strict();

// ListUomsOutputBody
export const ListUomsOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string().optional(),
            Code: z.string(),
            Name: z.string(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListUsersResponse
export const ListUsersResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            id: z.string().describe("User ID"),
            name: z.string().describe("User name").optional(),
            role: z
              .object({
                id: z.number().int().describe("Role ID"),
                name: z.string().describe("Role name"),
              })
              .strict()
              .optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// ListWeeklyDeliveriesResponseBody
export const ListWeeklyDeliveriesResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            actual_qty: z.number().int(),
            clone_dtl_id: z.string(),
            id: z.string(),
            month: z.number().int(),
            planned_qty: z.number().int(),
            week_no: z.number().int(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ListWorkPlacesOutputBody
export const ListWorkPlacesOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string().optional(),
            Code: z.string(),
            FK_GeographicalUnitID: z.string().optional(),
            FK_MasterValueSectionID: z.string().optional(),
            IsActive: z.boolean(),
            Name: z.string(),
            PK_MasterValueWorkPlaceID: z.string().optional(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// MachineryDetail
export const MachineryDetailSchema = z
  .object({
    account: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    account_id: z.string().optional(),
    code: z.string(),
    id: z.string(),
    is_active: z.boolean(),
    last_modified_time: z.string().datetime({ offset: true }),
    name: z.string(),
    version: z.number().int(),
  })
  .strict();

// MachineryListItem
export const MachineryListItemSchema = z
  .object({
    account_id: z.string().optional(),
    code: z.string(),
    id: z.string(),
    is_active: z.boolean(),
    name: z.string(),
  })
  .strict();

// MasterTypeItem
export const MasterTypeItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    allowable_actions: z.string(),
    id: z.string(),
    name: z.string(),
    starting_code: z.number().int(),
    values: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            code: z.number().int(),
            id: z.string(),
            master_type: z.string(),
            master_type_id: z.string(),
            value: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// MasterTypeResponse
export const MasterTypeResponseSchema = z
  .object({
    BusinessLocationID: z.string(),
    Name: z.string(),
    StartingCode: z.string(),
    uoid: z.string(),
  })
  .strict();

// MasterValueItem
export const MasterValueItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.number().int(),
    id: z.string(),
    master_type: z.string(),
    master_type_id: z.string(),
    value: z.string(),
  })
  .strict();

// MasterValueNurseryResponse
export const MasterValueNurseryResponseSchema = z
  .object({
    BusinessLocationID: z.string(),
    MasterTypeAllowableActions: z.union([z.string(), z.null()]),
    MasterTypeID: z.string(),
    MasterTypeName: z.union([z.string(), z.null()]),
    MasterTypeStartingCode: z.union([z.string(), z.null()]),
    MasterValue: z.union([z.string(), z.null()]),
    MasterValueCode: z.union([z.number().int(), z.null()]),
    uoid: z.string(),
  })
  .strict();

// MasterValueRef
export const MasterValueRefSchema = z
  .object({ code: z.number().int(), id: z.string(), value: z.string() })
  .strict();

// ModuleGroupingRef
export const ModuleGroupingRefSchema = z
  .object({ id: z.string(), name: z.string() })
  .strict();

// ModuleNode
export const ModuleNodeSchema = z
  .object({
    children: z
      .union([
        z.array(z.any()).describe("Child modules"),
        z.null().describe("Child modules"),
      ])
      .describe("Child modules"),
    context_id: z.string().describe("Module Context ID").optional(),
    description: z.string().describe("Module description").optional(),
    icon: z.string().describe("Module icon"),
    id: z.number().int().describe("Module ID"),
    is_active: z.boolean().describe("Is module active").optional(),
    kind: z.string().describe("Module kind (group, module, category, item)"),
    name: z.string().describe("Module name"),
    parent_id: z.number().int().describe("Parent Module ID").optional(),
    path_name: z.string().describe("Module pathname"),
    slug: z.string().describe("Module slug (URL-friendly identifier)"),
    sort_order: z.number().int().describe("Sort order within parent"),
  })
  .strict();

// ModuleNodeWithContext
export const ModuleNodeWithContextSchema = z
  .object({
    children: z
      .union([
        z.array(z.any()).describe("Child modules"),
        z.null().describe("Child modules"),
      ])
      .describe("Child modules"),
    context: z
      .object({
        description: z.string().describe("Context Name").optional(),
        id: z.string().describe("Context ID").optional(),
      })
      .strict()
      .optional(),
    context_id: z.string().describe("Module Context ID").optional(),
    description: z.string().describe("Module description").optional(),
    icon: z.string().describe("Module icon"),
    id: z.number().int().describe("Module ID"),
    is_active: z.boolean().describe("Is module active"),
    kind: z.string().describe("Module kind (group, module, category, item)"),
    name: z.string().describe("Module name"),
    parent_id: z.number().int().describe("Parent Module ID").optional(),
    path_name: z.string().describe("Module pathname"),
    slug: z.string().describe("Module slug (URL-friendly identifier)"),
    sort_order: z.number().int().describe("Sort order within parent"),
  })
  .strict();

// ModulePermissionInput
export const ModulePermissionInputSchema = z
  .object({
    action_kind: z
      .number()
      .int()
      .describe("Action Kind: 1=View, 2=Create, 3=Update, 4=Delete")
      .optional(),
    description: z.string().describe("Permission description").optional(),
    entity_id: z.string().describe("Entity ID").optional(),
    name: z.string().min(3).describe("Permission name"),
    slug: z
      .string()
      .min(3)
      .describe("Permission slug (URL-friendly identifier)"),
  })
  .strict();

// ModuleResponse
export const ModuleResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string().describe("Success message"),
    module: z
      .object({
        children: z
          .union([
            z.array(z.any()).describe("Child modules"),
            z.null().describe("Child modules"),
          ])
          .describe("Child modules"),
        context_id: z.string().describe("Module Context ID").optional(),
        description: z.string().describe("Module description").optional(),
        icon: z.string().describe("Module icon"),
        id: z.number().int().describe("Module ID"),
        is_active: z.boolean().describe("Is module active").optional(),
        kind: z
          .string()
          .describe("Module kind (group, module, category, item)"),
        name: z.string().describe("Module name"),
        parent_id: z.number().int().describe("Parent Module ID").optional(),
        path_name: z.string().describe("Module pathname"),
        slug: z.string().describe("Module slug (URL-friendly identifier)"),
        sort_order: z.number().int().describe("Sort order within parent"),
      })
      .strict(),
  })
  .strict();

// ModuleToggleResult
export const ModuleToggleResultSchema = z
  .object({
    attached: z.boolean().describe("True if attached, false if detached"),
    message: z.string().describe("Result message"),
    module_id: z.number().int().describe("Module ID"),
  })
  .strict();

// ModuleTreeOutputBody
export const ModuleTreeOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    modules: z
      .union([
        z
          .array(
            z
              .object({
                children: z
                  .union([
                    z.array(z.any()).describe("Child modules"),
                    z.null().describe("Child modules"),
                  ])
                  .describe("Child modules"),
                context: z
                  .object({
                    description: z.string().describe("Context Name").optional(),
                    id: z.string().describe("Context ID").optional(),
                  })
                  .strict()
                  .optional(),
                context_id: z.string().describe("Module Context ID").optional(),
                description: z
                  .string()
                  .describe("Module description")
                  .optional(),
                icon: z.string().describe("Module icon"),
                id: z.number().int().describe("Module ID"),
                is_active: z.boolean().describe("Is module active"),
                kind: z
                  .string()
                  .describe("Module kind (group, module, category, item)"),
                name: z.string().describe("Module name"),
                parent_id: z
                  .number()
                  .int()
                  .describe("Parent Module ID")
                  .optional(),
                path_name: z.string().describe("Module pathname"),
                slug: z
                  .string()
                  .describe("Module slug (URL-friendly identifier)"),
                sort_order: z
                  .number()
                  .int()
                  .describe("Sort order within parent"),
              })
              .strict(),
          )
          .describe("List of root modules with nested children"),
        z.null().describe("List of root modules with nested children"),
      ])
      .describe("List of root modules with nested children"),
  })
  .strict();

// MusimDetailItem
export const MusimDetailItemSchema = z
  .object({
    from_period: z.string().optional(),
    id: z.string(),
    name: z.string(),
    season_id: z.string(),
    to_period: z.string().optional(),
  })
  .strict();

// MusimItem
export const MusimItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    id: z.string(),
    season_type_id: z.string(),
    season_type_name: z.string().optional(),
    title: z.string(),
  })
  .strict();

// NurseryActivity
export const NurseryActivitySchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// NurseryActivityDTO
export const NurseryActivityDTOSchema = z
  .object({
    activity: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict(),
    allocations: z.union([
      z.array(
        z
          .object({
            allocation: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict(),
            is_recovery_allocation: z.boolean(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// NurseryArrivalAdministrativeUnitDTO
export const NurseryArrivalAdministrativeUnitDTOSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// NurseryArrivalBatchDTO
export const NurseryArrivalBatchDTOSchema = z
  .object({
    code: z.string(),
    id: z.string(),
    name: z.string(),
    program_number: z.string(),
    start_date: z.string().datetime({ offset: true }),
  })
  .strict();

// NurseryArrivalDTO
export const NurseryArrivalDTOSchema = z
  .object({
    administrative_unit: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict(),
    arrival_number: z.string(),
    arrival_reference_no: z.string(),
    arrival_type: z
      .object({ code: z.number().int(), id: z.string(), value: z.string() })
      .strict(),
    batch: z
      .object({
        code: z.string(),
        id: z.string(),
        name: z.string(),
        program_number: z.string(),
        start_date: z.string().datetime({ offset: true }),
      })
      .strict(),
    commodity: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict(),
    cross_parents: z.string(),
    date: z.string().datetime({ offset: true }),
    delivery_note_number: z.string(),
    family_number: z.string(),
    id: z.string(),
    nursery: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict(),
    pollination_number: z.string(),
    production_number: z.string(),
    remarks: z.string(),
    saction_number: z.string(),
    source_type: z
      .object({ code: z.number().int(), id: z.string(), value: z.string() })
      .strict(),
  })
  .strict();

// NurseryArrivalInput
export const NurseryArrivalInputSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    nursery_arrival: z
      .object({
        administrative_unit_id: z.string().uuid().min(1).optional(),
        arrival_number: z.string().min(1),
        arrival_reference_no: z.string().min(1).max(100).optional(),
        batch_id: z.string().uuid(),
        cross_parents: z.string().min(1).max(100).optional(),
        date: z.string().date().min(1),
        delivery_note_number: z.string().min(1).max(100).optional(),
        family_number: z.string().min(1).max(100).optional(),
        growthstage_id: z.string().uuid(),
        master_value_arrival_type_id: z.string().uuid(),
        master_value_source_type_id: z.string().uuid(),
        nursery_id: z.string().uuid(),
        party_id: z.string().uuid().min(1).optional(),
        pollination_number: z.string().min(1).max(100).optional(),
        production_number: z.string().min(1).max(100).optional(),
        remarks: z.string().min(1).max(500).optional(),
        saction_number: z.string().min(1).max(100).optional(),
      })
      .strict(),
    nursery_arrival_detail: z
      .object({
        clone_id: z.string().uuid(),
        rejected_quantity: z.number().int().gt(0),
        total_quantity: z.number().int().gt(0),
      })
      .strict(),
  })
  .strict();

// NurseryArrivalNurseryDTO
export const NurseryArrivalNurseryDTOSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// NurseryArrivalTypeDTO
export const NurseryArrivalTypeDTOSchema = z
  .object({ code: z.number().int(), id: z.string(), value: z.string() })
  .strict();

// NurseryBedGawaiResponse
export const NurseryBedGawaiResponseSchema = z
  .object({
    Breadth: z.number().optional(),
    BusinessLocationID: z.string().optional(),
    DateOfCreation: z.string().datetime({ offset: true }).optional(),
    FK_BreadthUOMID: z.string().optional(),
    FK_LengthUOMID: z.string().optional(),
    FK_NurseryID: z.string().optional(),
    IsActive: z.boolean(),
    Length: z.number().optional(),
    Name: z.string(),
    ShortName: z.string().optional(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// NurseryBedResponse
export const NurseryBedResponseSchema = z
  .object({
    breadth: z.number(),
    breadth_uom: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict(),
    date_of_creation: z.string(),
    id: z.string(),
    is_active: z.boolean(),
    length: z.number(),
    length_uom: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict(),
    name: z.string(),
    nursery_id: z.string(),
    short_name: z.string(),
  })
  .strict();

// NurseryBedUOM
export const NurseryBedUOMSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// NurseryDTO
export const NurseryDTOSchema = z
  .object({
    administrative_unit: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    area: z.number(),
    area_uom: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict(),
    budget_rate: z.number().optional(),
    code: z.string(),
    commodity: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict(),
    id: z.string(),
    name: z.string(),
    nursery_type: z
      .object({ code: z.number().int(), id: z.string(), name: z.string() })
      .strict(),
    process_date: z.string().datetime({ offset: true }).optional(),
    project: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict(),
    start_date: z.string().datetime({ offset: true }),
  })
  .strict();

// NurseryGrowthStageActivityAllocationItem
export const NurseryGrowthStageActivityAllocationItemSchema = z
  .object({
    BusinessLocationID: z.string().optional(),
    FK_GeneralAllocationHDRID: z.string().optional(),
    FK_NurseryGrowthStageActivityDTLID: z.string().optional(),
    IsRecoveryAllocation: z.boolean(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// NurseryGrowthStageActivityItem
export const NurseryGrowthStageActivityItemSchema = z
  .object({
    Allocations: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string().optional(),
            FK_GeneralAllocationHDRID: z.string().optional(),
            FK_NurseryGrowthStageActivityDTLID: z.string().optional(),
            IsRecoveryAllocation: z.boolean(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    BusinessLocationID: z.string().optional(),
    FK_MasterValueNurseryActivityID: z.string().optional(),
    FK_NurseryGrowthStageDTLID: z.string().optional(),
    MasterValueNurseryActivityCode: z.number().int(),
    MasterValueNurseryActivityValue: z.string(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// NurseryGrowthStageAllocationResponse
export const NurseryGrowthStageAllocationResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    accounts: z.union([
      z.array(
        z
          .object({
            bt_brought_forward_allocation: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            bt_transferred_out_allocation: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            growth_stage: z
              .object({ code: z.string(), name: z.string() })
              .strict(),
            gst_brought_forward_allocation: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            gst_transferred_out_allocation: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            id: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    activities: z.union([
      z.array(
        z
          .object({
            activity: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict(),
            allocations: z.union([
              z.array(
                z
                  .object({
                    allocation: z
                      .object({
                        code: z.string(),
                        id: z.string(),
                        name: z.string(),
                      })
                      .strict(),
                    is_recovery_allocation: z.boolean(),
                  })
                  .strict(),
              ),
              z.null(),
            ]),
          })
          .strict(),
      ),
      z.null(),
    ]),
    id: z.string(),
    nursery_type: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict(),
  })
  .strict();

// NurseryGrowthStageDetailResponse
export const NurseryGrowthStageDetailResponseSchema = z
  .object({
    BusinessLocationID: z.string().optional(),
    Code: z.string(),
    Commodity: z
      .object({ Code: z.string(), Name: z.string(), uoid: z.string() })
      .strict()
      .optional(),
    FK_CommodityID: z.string().optional(),
    FK_MasterValuePeriodID: z.string().optional(),
    FK_ParentGrowthStageID: z.string().optional(),
    IsArrivalAllowed: z.boolean(),
    IsBatchTransferAllowed: z.boolean(),
    IsNurseryIssueAllowed: z.boolean(),
    Name: z.string(),
    Period: z.number().int().optional(),
    PeriodDetails: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string().optional(),
            From: z.number().int().optional(),
            To: z.number().int().optional(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// NurseryGrowthStageDtlItem
export const NurseryGrowthStageDtlItemSchema = z
  .object({
    Activities: z.union([
      z.array(
        z
          .object({
            Allocations: z.union([
              z.array(
                z
                  .object({
                    BusinessLocationID: z.string().optional(),
                    FK_GeneralAllocationHDRID: z.string().optional(),
                    FK_NurseryGrowthStageActivityDTLID: z.string().optional(),
                    IsRecoveryAllocation: z.boolean(),
                    uoid: z.string(),
                    vuserid: z.string().optional(),
                  })
                  .strict(),
              ),
              z.null(),
            ]),
            BusinessLocationID: z.string().optional(),
            FK_MasterValueNurseryActivityID: z.string().optional(),
            FK_NurseryGrowthStageDTLID: z.string().optional(),
            MasterValueNurseryActivityCode: z.number().int(),
            MasterValueNurseryActivityValue: z.string(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    BusinessLocationID: z.string().optional(),
    FK_BTBroughtForwardAllocation: z.string().optional(),
    FK_BTTransferredOutAllocation: z.string().optional(),
    FK_GSTBroughtForwardAllocation: z.string().optional(),
    FK_GSTTransferredOutAllocation: z.string().optional(),
    FK_GrowthStageHDRID: z.string().optional(),
    FK_NurseryGrowthStageHDRID: z.string().optional(),
    IssueRecoveries: z.union([
      z.array(
        z
          .object({
            BusinessLocationID: z.string().optional(),
            FK_AllocationCodeID: z.string().optional(),
            FK_NurseryGrowthStageDTLID: z.string().optional(),
            FK_PurposeOfIssueID: z.string().optional(),
            FK_RequisitionTypeID: z.string().optional(),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// NurseryGrowthStageResponse
export const NurseryGrowthStageResponseSchema = z
  .object({
    BusinessLocationID: z.string().optional(),
    Details: z.union([
      z.array(
        z
          .object({
            Activities: z.union([
              z.array(
                z
                  .object({
                    Allocations: z.union([
                      z.array(
                        z
                          .object({
                            BusinessLocationID: z.string().optional(),
                            FK_GeneralAllocationHDRID: z.string().optional(),
                            FK_NurseryGrowthStageActivityDTLID: z
                              .string()
                              .optional(),
                            IsRecoveryAllocation: z.boolean(),
                            uoid: z.string(),
                            vuserid: z.string().optional(),
                          })
                          .strict(),
                      ),
                      z.null(),
                    ]),
                    BusinessLocationID: z.string().optional(),
                    FK_MasterValueNurseryActivityID: z.string().optional(),
                    FK_NurseryGrowthStageDTLID: z.string().optional(),
                    MasterValueNurseryActivityCode: z.number().int(),
                    MasterValueNurseryActivityValue: z.string(),
                    uoid: z.string(),
                    vuserid: z.string().optional(),
                  })
                  .strict(),
              ),
              z.null(),
            ]),
            BusinessLocationID: z.string().optional(),
            FK_BTBroughtForwardAllocation: z.string().optional(),
            FK_BTTransferredOutAllocation: z.string().optional(),
            FK_GSTBroughtForwardAllocation: z.string().optional(),
            FK_GSTTransferredOutAllocation: z.string().optional(),
            FK_GrowthStageHDRID: z.string().optional(),
            FK_NurseryGrowthStageHDRID: z.string().optional(),
            IssueRecoveries: z.union([
              z.array(
                z
                  .object({
                    BusinessLocationID: z.string().optional(),
                    FK_AllocationCodeID: z.string().optional(),
                    FK_NurseryGrowthStageDTLID: z.string().optional(),
                    FK_PurposeOfIssueID: z.string().optional(),
                    FK_RequisitionTypeID: z.string().optional(),
                    uoid: z.string(),
                    vuserid: z.string().optional(),
                  })
                  .strict(),
              ),
              z.null(),
            ]),
            uoid: z.string(),
            vuserid: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    FK_NurseryTypeID: z.string().optional(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// NurseryReasonResponse
export const NurseryReasonResponseSchema = z
  .object({
    BusinessLocationID: z.string().optional(),
    Code: z.string(),
    Reason: z.string(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// NurseryResponse
export const NurseryResponseSchema = z
  .object({
    Area: z.number().optional(),
    BudgetRate: z.number().optional(),
    BusinessLocationID: z.string().optional(),
    Code: z.string(),
    FK_AdministrativeUnitID: z.string().optional(),
    FK_AnalysisCodeIDProject: z.string().optional(),
    FK_AreaUOMID: z.string().optional(),
    FK_CommodityID: z.string().optional(),
    FK_NurseryTypeID: z.string().optional(),
    Name: z.string(),
    ProcessDate: z.string().datetime({ offset: true }).optional(),
    StartDate: z.string().datetime({ offset: true }).optional(),
    StatusChangedBy: z.string().optional(),
    StatusChangedDate: z.string().datetime({ offset: true }).optional(),
    StatusChangedRemarks: z.string().optional(),
    cState: z.string().optional(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// NurserySettingsResponse
export const NurserySettingsResponseSchema = z
  .object({
    BackProcessAllowedDays: z.number().int(),
    BusinessLocationID: z.string().optional(),
    FK_BudgetIssueDifferentialAccount: z.string().optional(),
    FK_CostElementAnalysisCodeID: z.string().optional(),
    FK_DocumentCategoryID: z.string().optional(),
    FK_ExpenseTypeAnalysisCodeID: z.string().optional(),
    FK_GLDocumentAllocation: z.string().optional(),
    FK_GLStockBalanceWriteOffAccount: z.string().optional(),
    FK_GLStockBalanceWriteOffAllocation: z.string().optional(),
    FK_GeneralAllocationHDRIDNurseryClearing: z.string().optional(),
    FK_GeneralAllocationHDRIDNurseryCostOfSale: z.string().optional(),
    FK_GeneralAllocationHDRIDNurserySale: z.string().optional(),
    FK_reasonID: z.string().optional(),
    IsAccountPostingAtMonthEnd: z.boolean(),
    IsGenerateIrrigationNo: z.boolean(),
    IsGenerateOtherActivityNo: z.boolean(),
    IsGeneratePlantingNo: z.boolean(),
    IsGenereteArrivalNo: z.boolean(),
    IsGenereteBatchCode: z.boolean(),
    IsGenereteBatchTransferNo: z.boolean(),
    IsGenereteCullingNumber: z.boolean(),
    IsGenereteGrowthStageCode: z.boolean(),
    IsGenereteIssueNo: z.boolean(),
    IsGenereteNIRNo: z.boolean(),
    IsGenereteNurseryCode: z.boolean(),
    IsGenereteStageTransitionNo: z.boolean(),
    IsNIRSanctioningRequired: z.boolean(),
    IsSalesJournalRequired: z.boolean(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// NurseryType
export const NurseryTypeSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// NurseryTypeDTO
export const NurseryTypeDTOSchema = z
  .object({ code: z.number().int(), id: z.string(), name: z.string() })
  .strict();

// PaginatedAdditionalChargeDiscountResponse
export const PaginatedAdditionalChargeDiscountResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            account: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            additional_charge_discount_type: z
              .object({
                code: z.number().int(),
                id: z.string(),
                value: z.string(),
              })
              .strict()
              .optional(),
            amount: z.string().optional(),
            charge_calculation_type: z
              .object({
                code: z.number().int(),
                id: z.string(),
                value: z.string(),
              })
              .strict()
              .optional(),
            code: z.string(),
            fk_account_id: z.string(),
            fk_master_value_additional_charge_discount_type_id: z.string(),
            fk_master_value_charge_calculation_type_id: z.string(),
            fk_tax_type_id: z.string().optional(),
            id: z.string(),
            name: z.string(),
            percentage: z.string().optional(),
            tax_type: z
              .object({
                code: z.number().int(),
                id: z.string(),
                value: z.string(),
              })
              .strict()
              .optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedAdministrativeUnitResponse
export const PaginatedAdministrativeUnitResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            address: z
              .object({
                address: z.string().optional(),
                city: z.string().optional(),
                contact_person: z.string().optional(),
                country: z.string().optional(),
                designation: z.string().optional(),
                email: z.string().optional(),
                fax: z.string().optional(),
                mobile: z.string().optional(),
                remarks: z.string().optional(),
                state: z.string().optional(),
                tel: z.string().optional(),
                url: z.string().optional(),
                zip: z.string().optional(),
              })
              .strict()
              .optional(),
            code: z.string(),
            division_type: z
              .object({ id: z.string(), name: z.string() })
              .strict()
              .optional(),
            division_type_name: z.string().optional(),
            group: z
              .object({ group_id: z.string(), group_name: z.string() })
              .strict()
              .optional(),
            id: z.string(),
            is_active: z.boolean(),
            master_value_factory_name: z.string().optional(),
            name: z.string(),
            parent: z
              .object({ id: z.string(), name: z.string() })
              .strict()
              .optional(),
            setting: z.object({ name: z.string() }).strict().optional(),
            short_name: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedAlokasiHeadingResponse
export const PaginatedAlokasiHeadingResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            allocations: z
              .union([
                z.array(
                  z
                    .object({
                      $schema: z
                        .string()
                        .url()
                        .describe("A URL to the JSON Schema for this object.")
                        .readonly()
                        .optional(),
                      account: z
                        .object({
                          code: z.string().optional(),
                          id: z.string(),
                          name: z.string().optional(),
                        })
                        .strict()
                        .optional(),
                      account_id: z.string(),
                      code: z.string(),
                      heading_id: z.string(),
                      heading_name: z.string().optional(),
                      id: z.string(),
                      machinery_output: z
                        .object({
                          code: z.number().int().optional(),
                          id: z.string(),
                          value: z.string().optional(),
                        })
                        .strict()
                        .optional(),
                      name: z.string(),
                      settings: z
                        .union([
                          z.array(
                            z
                              .object({
                                details: z
                                  .union([
                                    z.array(
                                      z
                                        .object({
                                          $schema: z
                                            .string()
                                            .url()
                                            .describe(
                                              "A URL to the JSON Schema for this object.",
                                            )
                                            .readonly()
                                            .optional(),
                                          analysis_code: z
                                            .object({
                                              code: z.string().optional(),
                                              id: z.string(),
                                              name: z.string().optional(),
                                            })
                                            .strict()
                                            .optional(),
                                          analysis_code_id: z
                                            .string()
                                            .optional(),
                                          analysis_type: z
                                            .object({
                                              code: z.string().optional(),
                                              id: z.string(),
                                              name: z.string().optional(),
                                            })
                                            .strict()
                                            .optional(),
                                          analysis_type_id: z.string(),
                                          id: z.string(),
                                          is_module_specific: z
                                            .boolean()
                                            .optional(),
                                          master_value: z
                                            .object({
                                              code: z.number().int().optional(),
                                              id: z.string(),
                                              value: z.string().optional(),
                                            })
                                            .strict()
                                            .optional(),
                                          type_id: z.string().optional(),
                                        })
                                        .strict(),
                                    ),
                                    z.null(),
                                  ])
                                  .optional(),
                                from_age: z.number().int().optional(),
                                id: z.string(),
                                to_age: z.number().int().optional(),
                              })
                              .strict(),
                          ),
                          z.null(),
                        ])
                        .optional(),
                    })
                    .strict(),
                ),
                z.null(),
              ])
              .optional(),
            code: z.string(),
            id: z.string(),
            name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedAlokasiUmumResponse
export const PaginatedAlokasiUmumResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            account: z
              .object({
                code: z.string().optional(),
                id: z.string(),
                name: z.string().optional(),
              })
              .strict()
              .optional(),
            account_id: z.string(),
            code: z.string(),
            heading_id: z.string(),
            heading_name: z.string().optional(),
            id: z.string(),
            machinery_output: z
              .object({
                code: z.number().int().optional(),
                id: z.string(),
                value: z.string().optional(),
              })
              .strict()
              .optional(),
            name: z.string(),
            settings: z
              .union([
                z.array(
                  z
                    .object({
                      details: z
                        .union([
                          z.array(
                            z
                              .object({
                                $schema: z
                                  .string()
                                  .url()
                                  .describe(
                                    "A URL to the JSON Schema for this object.",
                                  )
                                  .readonly()
                                  .optional(),
                                analysis_code: z
                                  .object({
                                    code: z.string().optional(),
                                    id: z.string(),
                                    name: z.string().optional(),
                                  })
                                  .strict()
                                  .optional(),
                                analysis_code_id: z.string().optional(),
                                analysis_type: z
                                  .object({
                                    code: z.string().optional(),
                                    id: z.string(),
                                    name: z.string().optional(),
                                  })
                                  .strict()
                                  .optional(),
                                analysis_type_id: z.string(),
                                id: z.string(),
                                is_module_specific: z.boolean().optional(),
                                master_value: z
                                  .object({
                                    code: z.number().int().optional(),
                                    id: z.string(),
                                    value: z.string().optional(),
                                  })
                                  .strict()
                                  .optional(),
                                type_id: z.string().optional(),
                              })
                              .strict(),
                          ),
                          z.null(),
                        ])
                        .optional(),
                      from_age: z.number().int().optional(),
                      id: z.string(),
                      to_age: z.number().int().optional(),
                    })
                    .strict(),
                ),
                z.null(),
              ])
              .optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedAnalysisCodeResponse
export const PaginatedAnalysisCodeResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            analysis_type: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            code: z.string(),
            id: z.string(),
            name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedAnalysisCodeSettingHierarchyResponse
export const PaginatedAnalysisCodeSettingHierarchyResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            analysis_code: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            analysis_type: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            id: z.string(),
            master_value: z
              .object({
                code: z.number().int(),
                id: z.string(),
                value: z.string(),
              })
              .strict()
              .optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedAnalysisCodeSourceResponse
export const PaginatedAnalysisCodeSourceResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            data_field: z.string(),
            display_field: z.string(),
            id: z.string(),
            name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedAnalysisTypeResponse
export const PaginatedAnalysisTypeResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            analysis_code_source: z
              .object({
                data_field: z.string(),
                display_field: z.string(),
                id: z.string(),
                name: z.string(),
              })
              .strict()
              .optional(),
            code: z.string(),
            filter_expression_sql: z.string().optional(),
            id: z.string(),
            name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedAnalysisTypeSettingResponse
export const PaginatedAnalysisTypeSettingResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            analysis_type: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            id: z.string(),
            master_value: z
              .object({
                code: z.number().int(),
                id: z.string(),
                value: z.string(),
              })
              .strict()
              .optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedAreaCompositionResponse
export const PaginatedAreaCompositionResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            account: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict(),
            area_types: z
              .union([
                z.array(
                  z
                    .object({
                      id: z.string(),
                      master_value_id: z.string().optional(),
                      value: z.string(),
                    })
                    .strict(),
                ),
                z.null(),
              ])
              .optional(),
            from_age: z.number().int(),
            id: z.string(),
            planting_types: z
              .union([
                z.array(
                  z
                    .object({
                      id: z.string(),
                      master_value_id: z.string().optional(),
                      value: z.string(),
                    })
                    .strict(),
                ),
                z.null(),
              ])
              .optional(),
            title: z.string(),
            to_age: z.number().int(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedAssetCategoryResponse
export const PaginatedAssetCategoryResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            account_id: z.string().optional(),
            code: z.string(),
            id: z.string(),
            name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedAssetResponse
export const PaginatedAssetResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            account: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            category: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            code: z.string(),
            id: z.string(),
            is_active: z.boolean(),
            make: z.string().optional(),
            manufacturer: z.string().optional(),
            model: z.string().optional(),
            name: z.string(),
            ownership: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            purchase_date: z.string().datetime({ offset: true }).optional(),
            reg_no: z.string().optional(),
            tare_weight: z.number().optional(),
            tare_weight_uom: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedBankResponse
export const PaginatedBankResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({ code: z.string(), id: z.string(), name: z.string() })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedCloneResponse
export const PaginatedCloneResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            commodity: z
              .object({ code: z.string(), name: z.string() })
              .strict(),
            id: z.string(),
            name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedCommodityResponse
export const PaginatedCommodityResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            code: z.string(),
            crop_reference_code: z.string(),
            id: z.string(),
            is_major: z.boolean(),
            name: z.string(),
            parent_crop: z
              .object({ code: z.number().int(), value: z.string() })
              .strict(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedCompanyResponse
export const PaginatedCompanyResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            address: z
              .object({
                address: z.string().optional(),
                city: z.string().optional(),
                contact_person: z.string().optional(),
                country: z.string().optional(),
                designation: z.string().optional(),
                email: z.string().optional(),
                fax: z.string().optional(),
                mobile: z.string().optional(),
                remarks: z.string().optional(),
                state: z.string().optional(),
                tel: z.string().optional(),
                url: z.string().optional(),
                zip: z.string().optional(),
              })
              .strict()
              .optional(),
            code: z.string(),
            id: z.string(),
            is_external: z.boolean(),
            name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedCurrencyDenominationTitleResponse
export const PaginatedCurrencyDenominationTitleResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            code: z.string(),
            currency_id: z.string(),
            id: z.string(),
            name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedCurrencyResponse
export const PaginatedCurrencyResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            code: z.string(),
            coin_factor: z.number().optional(),
            coin_name: z.string().optional(),
            country: z
              .object({ id: z.string(), value: z.string() })
              .strict()
              .optional(),
            currency_in_word: z
              .object({ id: z.string(), value: z.string() })
              .strict()
              .optional(),
            format: z.string().optional(),
            id: z.string(),
            is_home_currency: z.boolean().optional(),
            is_symbol_prefix: z.boolean().optional(),
            name: z.string(),
            symbol: z.union([z.string(), z.null()]),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedDivisionBody
export const PaginatedDivisionBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    items: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            address: z
              .object({
                address: z.string().optional(),
                city: z.string().optional(),
                contact_person: z.string().optional(),
                country: z.string().optional(),
                designation: z.string().optional(),
                email: z.string().optional(),
                fax: z.string().optional(),
                mobile: z.string().optional(),
                remarks: z.string().optional(),
                state: z.string().optional(),
                tel: z.string().optional(),
                url: z.string().optional(),
                zip: z.string().optional(),
              })
              .strict()
              .optional(),
            code: z.string(),
            division_type: z
              .object({ id: z.string(), name: z.string() })
              .strict()
              .optional(),
            division_type_name: z.string().optional(),
            group: z
              .object({ group_id: z.string(), group_name: z.string() })
              .strict()
              .optional(),
            id: z.string(),
            is_active: z.boolean(),
            master_value_factory_name: z.string().optional(),
            name: z.string(),
            parent: z
              .object({ id: z.string(), name: z.string() })
              .strict()
              .optional(),
            setting: z.object({ name: z.string() }).strict().optional(),
            short_name: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    pagination_meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedEstateResponse
export const PaginatedEstateResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            address: z
              .object({
                address: z.string().optional(),
                city: z.string().optional(),
                contact_person: z.string().optional(),
                country: z.string().optional(),
                designation: z.string().optional(),
                email: z.string().optional(),
                fax: z.string().optional(),
                mobile: z.string().optional(),
                remarks: z.string().optional(),
                state: z.string().optional(),
                tel: z.string().optional(),
                url: z.string().optional(),
                zip: z.string().optional(),
              })
              .strict()
              .optional(),
            code: z.string(),
            division_type: z
              .object({ id: z.string(), name: z.string() })
              .strict()
              .optional(),
            division_type_name: z.string().optional(),
            group: z
              .object({ group_id: z.string(), group_name: z.string() })
              .strict()
              .optional(),
            id: z.string(),
            is_active: z.boolean(),
            master_value_factory_name: z.string().optional(),
            name: z.string(),
            parent: z
              .object({ id: z.string(), name: z.string() })
              .strict()
              .optional(),
            setting: z.object({ name: z.string() }).strict().optional(),
            short_name: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedFactoryResponse
export const PaginatedFactoryResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            address: z
              .object({
                address: z.string().optional(),
                city: z.string().optional(),
                contact_person: z.string().optional(),
                country: z.string().optional(),
                designation: z.string().optional(),
                email: z.string().optional(),
                fax: z.string().optional(),
                mobile: z.string().optional(),
                remarks: z.string().optional(),
                state: z.string().optional(),
                tel: z.string().optional(),
                url: z.string().optional(),
                zip: z.string().optional(),
              })
              .strict()
              .optional(),
            code: z.string(),
            division_type: z
              .object({ id: z.string(), name: z.string() })
              .strict()
              .optional(),
            division_type_name: z.string().optional(),
            group: z
              .object({ group_id: z.string(), group_name: z.string() })
              .strict()
              .optional(),
            id: z.string(),
            is_active: z.boolean(),
            master_value_factory_name: z.string().optional(),
            name: z.string(),
            parent: z
              .object({ id: z.string(), name: z.string() })
              .strict()
              .optional(),
            setting: z.object({ name: z.string() }).strict().optional(),
            short_name: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedGeneralAllocationSettingResponse
export const PaginatedGeneralAllocationSettingResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            allocation_code: z.string().optional(),
            allocation_id: z.string(),
            allocation_name: z.string().optional(),
            from_age: z.number().int().optional(),
            id: z.string(),
            to_age: z.number().int().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedGroupResponse
export const PaginatedGroupResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            code: z.string(),
            company: z.object({ id: z.string(), name: z.string() }).strict(),
            id: z.string(),
            name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedHolidayDTLResponse
export const PaginatedHolidayDTLResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            fk_holiday_id: z.string(),
            holiday_date: z.string().datetime({ offset: true }),
            id: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedHolidayHDRResponse
export const PaginatedHolidayHDRResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            details: z
              .union([
                z.array(
                  z
                    .object({
                      $schema: z
                        .string()
                        .url()
                        .describe("A URL to the JSON Schema for this object.")
                        .readonly()
                        .optional(),
                      fk_holiday_id: z.string(),
                      holiday_date: z.string().datetime({ offset: true }),
                      id: z.string(),
                    })
                    .strict(),
                ),
                z.null(),
              ])
              .optional(),
            eligibility_base: z
              .object({
                code: z.number().int(),
                id: z.string(),
                value: z.string(),
              })
              .strict()
              .optional(),
            id: z.string(),
            name: z.string(),
            type: z
              .object({
                code: z.number().int(),
                id: z.string(),
                value: z.string(),
              })
              .strict()
              .optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedKebangsaanResponse
export const PaginatedKebangsaanResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            country_id: z.string(),
            country_name: z.string().optional(),
            id: z.string(),
            name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedMachineryResponse
export const PaginatedMachineryResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            account_id: z.string().optional(),
            code: z.string(),
            id: z.string(),
            is_active: z.boolean(),
            name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedMasterTypeResponse
export const PaginatedMasterTypeResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            allowable_actions: z.string(),
            id: z.string(),
            name: z.string(),
            starting_code: z.number().int(),
            values: z.union([
              z.array(
                z
                  .object({
                    $schema: z
                      .string()
                      .url()
                      .describe("A URL to the JSON Schema for this object.")
                      .readonly()
                      .optional(),
                    code: z.number().int(),
                    id: z.string(),
                    master_type: z.string(),
                    master_type_id: z.string(),
                    value: z.string(),
                  })
                  .strict(),
              ),
              z.null(),
            ]),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedMasterValueResponse
export const PaginatedMasterValueResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            code: z.number().int(),
            id: z.string(),
            master_type: z.string(),
            master_type_id: z.string(),
            value: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedPartyResponse
export const PaginatedPartyResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            accounts: z
              .union([
                z.array(
                  z
                    .object({
                      account_code: z.string(),
                      account_id: z.string(),
                      account_name: z.string(),
                      id: z.string(),
                      transaction_type_id: z.string(),
                      transaction_type_name: z.string(),
                    })
                    .strict(),
                ),
                z.null(),
              ])
              .optional(),
            addresses: z
              .union([
                z.array(
                  z
                    .object({
                      address1: z.union([z.string(), z.null()]),
                      address2: z.union([z.string(), z.null()]),
                      address3: z.union([z.string(), z.null()]),
                      address_id: z.string(),
                      address_type: z.string(),
                      city: z.union([z.string(), z.null()]),
                      communication_type_id: z.union([z.string(), z.null()]),
                      communication_type_name: z.union([z.string(), z.null()]),
                      country: z.union([z.string(), z.null()]),
                      email: z.union([z.string(), z.null()]),
                      fax: z.union([z.string(), z.null()]),
                      id: z.string(),
                      phone1: z.union([z.string(), z.null()]),
                      phone2: z.union([z.string(), z.null()]),
                      state: z.union([z.string(), z.null()]),
                      website: z.union([z.string(), z.null()]),
                      zip_code: z.union([z.string(), z.null()]),
                    })
                    .strict(),
                ),
                z.null(),
              ])
              .optional(),
            banks: z
              .union([
                z.array(
                  z
                    .object({
                      account_number: z.string(),
                      branch_id: z.string(),
                      id: z.string(),
                    })
                    .strict(),
                ),
                z.null(),
              ])
              .optional(),
            code: z.string(),
            company_name: z.union([z.string(), z.null()]),
            default_category: z
              .object({ id: z.string(), name: z.string() })
              .strict(),
            detail: z
              .object({
                credit_period_in_days: z.number().int(),
                id: z.string(),
                party_type_id: z.string(),
                party_type_name: z.string(),
                payee: z.union([z.string(), z.null()]),
              })
              .strict(),
            id: z.string(),
            is_active: z.boolean(),
            license_registration_number: z.union([z.string(), z.null()]),
            name: z.string(),
            notes: z.union([z.string(), z.null()]),
            short_name: z.union([z.string(), z.null()]),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedProductSettingResponse
export const PaginatedProductSettingResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            business_location_id: z.string(),
            id: z.string(),
            product: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            product_description_type: z
              .object({ id: z.string(), value: z.string() })
              .strict()
              .optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedQualityGradeResponse
export const PaginatedQualityGradeResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            business_location_id: z.string(),
            code: z.string(),
            id: z.string(),
            is_penalty: z.boolean(),
            is_rejected: z.boolean(),
            name: z.string(),
            product: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            short_name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedRoundingResponse
export const PaginatedRoundingResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            factor: z.union([z.number(), z.null()]),
            id: z.string(),
            name: z.string(),
            rounding_account_id: z.string(),
            rounding_type: z
              .object({ id: z.string(), value: z.string() })
              .strict()
              .optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedShiftCategoryResponse
export const PaginatedShiftCategoryResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            id: z.string(),
            name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedShiftResponse
export const PaginatedShiftResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            category: z
              .object({
                $schema: z
                  .string()
                  .url()
                  .describe("A URL to the JSON Schema for this object.")
                  .readonly()
                  .optional(),
                id: z.string(),
                name: z.string(),
              })
              .strict()
              .optional(),
            id: z.string(),
            is_overlapping_allowed: z.boolean(),
            name: z.string().optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedShiftTransactionResponse
export const PaginatedShiftTransactionResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            date: z.string().datetime({ offset: true }),
            details: z
              .union([
                z.array(
                  z
                    .object({
                      id: z.string(),
                      time_from: z.string().datetime({ offset: true }),
                      time_to: z.string().datetime({ offset: true }),
                      week_day: z
                        .object({
                          $schema: z
                            .string()
                            .url()
                            .describe(
                              "A URL to the JSON Schema for this object.",
                            )
                            .readonly()
                            .optional(),
                          code: z.number().int(),
                          id: z.string(),
                          master_type: z.string(),
                          master_type_id: z.string(),
                          value: z.string(),
                        })
                        .strict(),
                      working_hours: z.string(),
                    })
                    .strict(),
                ),
                z.null(),
              ])
              .optional(),
            id: z.string(),
            shift: z
              .object({
                $schema: z
                  .string()
                  .url()
                  .describe("A URL to the JSON Schema for this object.")
                  .readonly()
                  .optional(),
                category: z
                  .object({
                    $schema: z
                      .string()
                      .url()
                      .describe("A URL to the JSON Schema for this object.")
                      .readonly()
                      .optional(),
                    id: z.string(),
                    name: z.string(),
                  })
                  .strict()
                  .optional(),
                id: z.string(),
                is_overlapping_allowed: z.boolean(),
                name: z.string().optional(),
              })
              .strict(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedStandardOperatingProcedureResponse
export const PaginatedStandardOperatingProcedureResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            code: z.string().optional(),
            id: z.string(),
            procedure: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedTermsAndConditionsDTLResponse
export const PaginatedTermsAndConditionsDTLResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            fk_module_id: z.string(),
            fk_terms_and_conditions_hdr_id: z.string(),
            id: z.string(),
            module_grouping: z
              .object({ id: z.string(), name: z.string() })
              .strict()
              .optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedTermsAndConditionsHDRResponse
export const PaginatedTermsAndConditionsHDRResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            description: z.string(),
            details: z
              .union([
                z.array(
                  z
                    .object({
                      $schema: z
                        .string()
                        .url()
                        .describe("A URL to the JSON Schema for this object.")
                        .readonly()
                        .optional(),
                      fk_module_id: z.string(),
                      fk_terms_and_conditions_hdr_id: z.string(),
                      id: z.string(),
                      module_grouping: z
                        .object({ id: z.string(), name: z.string() })
                        .strict()
                        .optional(),
                    })
                    .strict(),
                ),
                z.null(),
              ])
              .optional(),
            id: z.string(),
            name: z.string(),
            parent_terms_and_conditions: z.string().optional(),
            parent_terms_and_conditions_ref: z
              .object({
                description: z.string(),
                id: z.string(),
                name: z.string(),
              })
              .strict()
              .optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedUOMConversionResponse
export const PaginatedUOMConversionResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            factor: z.number().optional(),
            from_uom_id: z.string(),
            from_uom_name: z.string(),
            id: z.string(),
            to_uom_id: z.string(),
            to_uom_name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedUOMResponse
export const PaginatedUOMResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            code: z.string(),
            id: z.string(),
            name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginatedWorkPlaceResponse
export const PaginatedWorkPlaceResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            code: z.string(),
            geographical_unit: z
              .object({ id: z.string(), name: z.string() })
              .strict()
              .optional(),
            id: z.string(),
            is_active: z.boolean().optional(),
            latitude: z.number().optional(),
            longitude: z.number().optional(),
            name: z.string(),
            work_place_type: z
              .object({ id: z.string(), value: z.string() })
              .strict()
              .optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    meta: z
      .object({
        current_page: z.number().int(),
        page_size: z.number().int(),
        total_items: z.number().int(),
        total_pages: z.number().int(),
      })
      .strict(),
  })
  .strict();

// PaginationMeta
export const PaginationMetaSchema = z
  .object({
    current_page: z.number().int(),
    page_size: z.number().int(),
    total_items: z.number().int(),
    total_pages: z.number().int(),
  })
  .strict();

// ParentAccountGroup
export const ParentAccountGroupSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// ParentAnalysisCodeSummary
export const ParentAnalysisCodeSummarySchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// PartyAccount
export const PartyAccountSchema = z
  .object({
    account_code: z.string(),
    account_id: z.string(),
    account_name: z.string(),
    id: z.string(),
    transaction_type_id: z.string(),
    transaction_type_name: z.string(),
  })
  .strict();

// PartyAddress
export const PartyAddressSchema = z
  .object({
    address1: z.union([z.string(), z.null()]),
    address2: z.union([z.string(), z.null()]),
    address3: z.union([z.string(), z.null()]),
    address_id: z.string(),
    address_type: z.string(),
    city: z.union([z.string(), z.null()]),
    communication_type_id: z.union([z.string(), z.null()]),
    communication_type_name: z.union([z.string(), z.null()]),
    country: z.union([z.string(), z.null()]),
    email: z.union([z.string(), z.null()]),
    fax: z.union([z.string(), z.null()]),
    id: z.string(),
    phone1: z.union([z.string(), z.null()]),
    phone2: z.union([z.string(), z.null()]),
    state: z.union([z.string(), z.null()]),
    website: z.union([z.string(), z.null()]),
    zip_code: z.union([z.string(), z.null()]),
  })
  .strict();

// PartyBank
export const PartyBankSchema = z
  .object({ account_number: z.string(), branch_id: z.string(), id: z.string() })
  .strict();

// PartyDefaultCategory
export const PartyDefaultCategorySchema = z
  .object({ id: z.string(), name: z.string() })
  .strict();

// PartyDetail
export const PartyDetailSchema = z
  .object({
    credit_period_in_days: z.number().int(),
    id: z.string(),
    party_type_id: z.string(),
    party_type_name: z.string(),
    payee: z.union([z.string(), z.null()]),
  })
  .strict();

// PartyItem
export const PartyItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    accounts: z
      .union([
        z.array(
          z
            .object({
              account_code: z.string(),
              account_id: z.string(),
              account_name: z.string(),
              id: z.string(),
              transaction_type_id: z.string(),
              transaction_type_name: z.string(),
            })
            .strict(),
        ),
        z.null(),
      ])
      .optional(),
    addresses: z
      .union([
        z.array(
          z
            .object({
              address1: z.union([z.string(), z.null()]),
              address2: z.union([z.string(), z.null()]),
              address3: z.union([z.string(), z.null()]),
              address_id: z.string(),
              address_type: z.string(),
              city: z.union([z.string(), z.null()]),
              communication_type_id: z.union([z.string(), z.null()]),
              communication_type_name: z.union([z.string(), z.null()]),
              country: z.union([z.string(), z.null()]),
              email: z.union([z.string(), z.null()]),
              fax: z.union([z.string(), z.null()]),
              id: z.string(),
              phone1: z.union([z.string(), z.null()]),
              phone2: z.union([z.string(), z.null()]),
              state: z.union([z.string(), z.null()]),
              website: z.union([z.string(), z.null()]),
              zip_code: z.union([z.string(), z.null()]),
            })
            .strict(),
        ),
        z.null(),
      ])
      .optional(),
    banks: z
      .union([
        z.array(
          z
            .object({
              account_number: z.string(),
              branch_id: z.string(),
              id: z.string(),
            })
            .strict(),
        ),
        z.null(),
      ])
      .optional(),
    code: z.string(),
    company_name: z.union([z.string(), z.null()]),
    default_category: z.object({ id: z.string(), name: z.string() }).strict(),
    detail: z
      .object({
        credit_period_in_days: z.number().int(),
        id: z.string(),
        party_type_id: z.string(),
        party_type_name: z.string(),
        payee: z.union([z.string(), z.null()]),
      })
      .strict(),
    id: z.string(),
    is_active: z.boolean(),
    license_registration_number: z.union([z.string(), z.null()]),
    name: z.string(),
    notes: z.union([z.string(), z.null()]),
    short_name: z.union([z.string(), z.null()]),
  })
  .strict();

// PermissionData
export const PermissionDataSchema = z
  .object({
    action_kind: z.number().int().describe("Action kind").optional(),
    description: z.string().describe("Permission description").optional(),
    entity_id: z.string().describe("Associated entity ID").optional(),
    id: z.number().int().describe("Permission ID"),
    is_assigned: z.boolean().describe("Is permission assigned to role"),
    module_id: z
      .number()
      .int()
      .describe("Module ID this permission belongs to"),
    name: z.string().describe("Permission name"),
    slug: z.string().describe("Permission slug"),
  })
  .strict();

// PermissionDataWithEntity
export const PermissionDataWithEntitySchema = z
  .object({
    action_kind: z.number().int().describe("Action kind").optional(),
    description: z.string().describe("Permission description").optional(),
    entity: z
      .object({
        description: z.string().optional(),
        id: z.string(),
        name: z.string(),
      })
      .strict()
      .optional(),
    entity_id: z.string().describe("Associated entity ID").optional(),
    id: z.number().int().describe("Permission ID"),
    module_id: z
      .number()
      .int()
      .describe("Module ID this permission belongs to"),
    name: z.string().describe("Permission name"),
    slug: z.string().describe("Permission slug"),
  })
  .strict();

// PermissionEntity
export const PermissionEntitySchema = z
  .object({
    description: z.string().optional(),
    id: z.string(),
    name: z.string(),
  })
  .strict();

// PermissionResponse
export const PermissionResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string().describe("Success message"),
    permission: z
      .object({
        action_kind: z.number().int().describe("Action kind").optional(),
        description: z.string().describe("Permission description").optional(),
        entity_id: z.string().describe("Associated entity ID").optional(),
        id: z.number().int().describe("Permission ID"),
        is_assigned: z.boolean().describe("Is permission assigned to role"),
        module_id: z
          .number()
          .int()
          .describe("Module ID this permission belongs to"),
        name: z.string().describe("Permission name"),
        slug: z.string().describe("Permission slug"),
      })
      .strict(),
  })
  .strict();

// ProductDescriptionTypeItem
export const ProductDescriptionTypeItemSchema = z
  .object({ id: z.string(), value: z.string() })
  .strict();

// ProductItem
export const ProductItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    business_location_id: z.string(),
    code: z.string(),
    commodity: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    id: z.string(),
    is_organic: z.boolean(),
    name: z.string(),
    product_settings: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            business_location_id: z.string(),
            id: z.string(),
            product: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            product_description_type: z
              .object({ id: z.string(), value: z.string() })
              .strict()
              .optional(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    product_type: z
      .object({ id: z.string(), value: z.string() })
      .strict()
      .optional(),
    quality_grades: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            business_location_id: z.string(),
            code: z.string(),
            id: z.string(),
            is_penalty: z.boolean(),
            is_rejected: z.boolean(),
            name: z.string(),
            product: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict()
              .optional(),
            short_name: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    short_name: z.union([z.string(), z.null()]),
    uom: z
      .object({
        $schema: z
          .string()
          .url()
          .describe("A URL to the JSON Schema for this object.")
          .readonly()
          .optional(),
        code: z.string(),
        id: z.string(),
        name: z.string(),
      })
      .strict()
      .optional(),
  })
  .strict();

// ProductSettingItem
export const ProductSettingItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    business_location_id: z.string(),
    id: z.string(),
    product: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    product_description_type: z
      .object({ id: z.string(), value: z.string() })
      .strict()
      .optional(),
  })
  .strict();

// ProductSettingProductItem
export const ProductSettingProductItemSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// ProductTypeItem
export const ProductTypeItemSchema = z
  .object({ id: z.string(), value: z.string() })
  .strict();

// ProgramDeliveryCloneEntry
export const ProgramDeliveryCloneEntrySchema = z
  .object({
    block_id: z.string(),
    block_name: z.string().optional(),
    clone_dtl_id: z.string(),
    clone_name: z.string().optional(),
    clone_setting_id: z.string(),
    deliveries: z.union([
      z.array(
        z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            actual_qty: z.number().int(),
            clone_dtl_id: z.string(),
            id: z.string(),
            month: z.number().int(),
            planned_qty: z.number().int(),
            week_no: z.number().int(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    division_id: z.string(),
    division_name: z.string().optional(),
    estate_id: z.string(),
    estate_name: z.string().optional(),
    gap: z.number().int(),
    seedling_delivery_qty: z.number().int(),
    seedling_requirement: z.number().int(),
    total_actual_qty: z.number().int(),
    total_planned_qty: z.number().int(),
  })
  .strict();

// ProgramDeliverySummaryResponse
export const ProgramDeliverySummaryResponseSchema = z
  .object({
    gap: z.number().int(),
    program_id: z.string(),
    program_name: z.string(),
    program_year: z.number().int(),
    total_actual_qty: z.number().int(),
    total_planned_qty: z.number().int(),
    total_seedling_delivery_qty: z.number().int(),
  })
  .strict();

// ProgramDeliveryWeeklyResponseBody
export const ProgramDeliveryWeeklyResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.union([
      z.array(
        z
          .object({
            block_id: z.string(),
            block_name: z.string().optional(),
            clone_dtl_id: z.string(),
            clone_name: z.string().optional(),
            clone_setting_id: z.string(),
            deliveries: z.union([
              z.array(
                z
                  .object({
                    $schema: z
                      .string()
                      .url()
                      .describe("A URL to the JSON Schema for this object.")
                      .readonly()
                      .optional(),
                    actual_qty: z.number().int(),
                    clone_dtl_id: z.string(),
                    id: z.string(),
                    month: z.number().int(),
                    planned_qty: z.number().int(),
                    week_no: z.number().int(),
                  })
                  .strict(),
              ),
              z.null(),
            ]),
            division_id: z.string(),
            division_name: z.string().optional(),
            estate_id: z.string(),
            estate_name: z.string().optional(),
            gap: z.number().int(),
            seedling_delivery_qty: z.number().int(),
            seedling_requirement: z.number().int(),
            total_actual_qty: z.number().int(),
            total_planned_qty: z.number().int(),
          })
          .strict(),
      ),
      z.null(),
    ]),
  })
  .strict();

// ProjectAdminUnitItem
export const ProjectAdminUnitItemSchema = z
  .object({ id: z.string(), name: z.string() })
  .strict();

// ProjectDTO
export const ProjectDTOSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// ProjectItem
export const ProjectItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    administrative_unit: z
      .object({ id: z.string(), name: z.string() })
      .strict()
      .optional(),
    code: z.string(),
    end_date: z.string().optional(),
    id: z.string(),
    is_active: z.boolean(),
    name: z.string(),
    project_type: z
      .object({ id: z.string(), value: z.string() })
      .strict()
      .optional(),
    start_date: z.string().optional(),
  })
  .strict();

// ProjectResponse
export const ProjectResponseSchema = z
  .object({
    AdministrativeUnitName: z.string().optional(),
    BusinessLocationID: z.string().optional(),
    Code: z.string(),
    EndDate: z.string().datetime({ offset: true }).optional(),
    FK_AdministrativeUnitHDRID: z.string().optional(),
    FK_MasterValueProjectType: z.string().optional(),
    IsActive: z.boolean(),
    Name: z.string(),
    ProjectTypeName: z.string().optional(),
    StartDate: z.string().datetime({ offset: true }).optional(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// ProjectTypeItem
export const ProjectTypeItemSchema = z
  .object({ id: z.string(), value: z.string() })
  .strict();

// PsrProgramItem
export const PsrProgramItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    created_at: z.string().optional(),
    id: z.string(),
    name: z.string(),
    seedling_quantity: z.number().int(),
    updated_at: z.string().optional(),
    user_id: z.string().optional(),
  })
  .strict();

// QualityGradeItem
export const QualityGradeItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    business_location_id: z.string(),
    code: z.string(),
    id: z.string(),
    is_penalty: z.boolean(),
    is_rejected: z.boolean(),
    name: z.string(),
    product: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    short_name: z.string(),
  })
  .strict();

// QualityGradeProductItem
export const QualityGradeProductItemSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// ReasonResponse
export const ReasonResponseSchema = z
  .object({ code: z.string(), id: z.string(), reason: z.string() })
  .strict();

// ReplantingAdministrativeUnit
export const ReplantingAdministrativeUnitSchema = z
  .object({ code: z.string(), id: z.string(), name: z.string() })
  .strict();

// ReplantingAdministrativeUnitDetails
export const ReplantingAdministrativeUnitDetailsSchema = z
  .object({
    block: z
      .object({
        code: z.string(),
        id: z.string(),
        name: z.string(),
        year_of_planting: z.number().int().optional(),
      })
      .strict(),
    clone: z
      .object({
        area_hectare: z.string(),
        clone_setting: z
          .object({
            clone_name: z.string(),
            id: z.string(),
            planting_pattern: z.number().int(),
            seedling_per_hectare: z.number().int(),
          })
          .strict(),
        effective_area_hectare: z.string(),
        hcv_area_hectare: z.string(),
        id: z.string(),
        is_apm: z.boolean(),
        plants_per_hectare: z.number().int(),
        remaining_seedlings: z.number().int(),
        seedling_delivery_quantity: z.number().int(),
        seedling_requirement: z.number().int(),
      })
      .strict()
      .optional(),
    division: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict(),
    status: z.number().int(),
  })
  .strict();

// ReplantingBlock
export const ReplantingBlockSchema = z
  .object({
    code: z.string(),
    id: z.string(),
    name: z.string(),
    year_of_planting: z.number().int().optional(),
  })
  .strict();

// ReplantingCloneSetting
export const ReplantingCloneSettingSchema = z
  .object({
    clone_name: z.string(),
    id: z.string(),
    planting_pattern: z.number().int(),
    seedling_per_hectare: z.number().int(),
  })
  .strict();

// ReplantingPlanDetailItem
export const ReplantingPlanDetailItemSchema = z
  .object({
    block: z
      .object({
        code: z.string(),
        id: z.string(),
        name: z.string(),
        year_of_planting: z.number().int().optional(),
      })
      .strict(),
    clone: z
      .object({
        area_hectare: z.string(),
        clone_setting: z
          .object({
            clone_name: z.string(),
            id: z.string(),
            planting_pattern: z.number().int(),
            seedling_per_hectare: z.number().int(),
          })
          .strict(),
        effective_area_hectare: z.string(),
        hcv_area_hectare: z.string(),
        id: z.string(),
        is_apm: z.boolean(),
        plants_per_hectare: z.number().int(),
        remaining_seedlings: z.number().int(),
        seedling_delivery_quantity: z.number().int(),
        seedling_requirement: z.number().int(),
      })
      .strict()
      .optional(),
    division: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict(),
    estate: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict(),
    id: z.string(),
    status: z.number().int(),
  })
  .strict();

// ReplantingPlanDetailItemv2
export const ReplantingPlanDetailItemv2Schema = z
  .object({
    details: z
      .union([
        z
          .array(
            z
              .object({
                block: z
                  .object({
                    code: z.string(),
                    id: z.string(),
                    name: z.string(),
                    year_of_planting: z.number().int().optional(),
                  })
                  .strict(),
                clone: z
                  .object({
                    area_hectare: z.string(),
                    clone_setting: z
                      .object({
                        clone_name: z.string(),
                        id: z.string(),
                        planting_pattern: z.number().int(),
                        seedling_per_hectare: z.number().int(),
                      })
                      .strict(),
                    effective_area_hectare: z.string(),
                    hcv_area_hectare: z.string(),
                    id: z.string(),
                    is_apm: z.boolean(),
                    plants_per_hectare: z.number().int(),
                    remaining_seedlings: z.number().int(),
                    seedling_delivery_quantity: z.number().int(),
                    seedling_requirement: z.number().int(),
                  })
                  .strict()
                  .optional(),
                division: z
                  .object({
                    code: z.string(),
                    id: z.string(),
                    name: z.string(),
                  })
                  .strict(),
                status: z.number().int(),
              })
              .strict(),
          )
          .describe("estate details"),
        z.null().describe("estate details"),
      ])
      .describe("estate details"),
    estate_code: z.string().describe("estate code"),
    estate_id: z.string().describe("estate id"),
    estate_name: z.string().describe("estate name"),
    stat: z
      .object({
        total_effective_area_hectare: z.string(),
        total_remaining_seedlings: z.number().int(),
        total_seedling_delivery_quantity: z.number().int(),
        total_seedling_requirement: z.number().int(),
      })
      .strict(),
  })
  .strict();

// ReplantingPlanEstateStat
export const ReplantingPlanEstateStatSchema = z
  .object({
    total_effective_area_hectare: z.string(),
    total_remaining_seedlings: z.number().int(),
    total_seedling_delivery_quantity: z.number().int(),
    total_seedling_requirement: z.number().int(),
  })
  .strict();

// ReplantingPlanFullDetailsResponse
export const ReplantingPlanFullDetailsResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    details: z.union([
      z.array(
        z
          .object({
            block: z
              .object({
                code: z.string(),
                id: z.string(),
                name: z.string(),
                year_of_planting: z.number().int().optional(),
              })
              .strict(),
            clone: z
              .object({
                area_hectare: z.string(),
                clone_setting: z
                  .object({
                    clone_name: z.string(),
                    id: z.string(),
                    planting_pattern: z.number().int(),
                    seedling_per_hectare: z.number().int(),
                  })
                  .strict(),
                effective_area_hectare: z.string(),
                hcv_area_hectare: z.string(),
                id: z.string(),
                is_apm: z.boolean(),
                plants_per_hectare: z.number().int(),
                remaining_seedlings: z.number().int(),
                seedling_delivery_quantity: z.number().int(),
                seedling_requirement: z.number().int(),
              })
              .strict()
              .optional(),
            division: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict(),
            estate: z
              .object({ code: z.string(), id: z.string(), name: z.string() })
              .strict(),
            id: z.string(),
            status: z.number().int(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    id: z.string(),
    program_name: z.string(),
    program_year: z.number().int(),
  })
  .strict();

// ReplantingPlanFullDetailsResponseV2
export const ReplantingPlanFullDetailsResponseV2Schema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    estates: z.union([
      z.array(
        z
          .object({
            details: z
              .union([
                z
                  .array(
                    z
                      .object({
                        block: z
                          .object({
                            code: z.string(),
                            id: z.string(),
                            name: z.string(),
                            year_of_planting: z.number().int().optional(),
                          })
                          .strict(),
                        clone: z
                          .object({
                            area_hectare: z.string(),
                            clone_setting: z
                              .object({
                                clone_name: z.string(),
                                id: z.string(),
                                planting_pattern: z.number().int(),
                                seedling_per_hectare: z.number().int(),
                              })
                              .strict(),
                            effective_area_hectare: z.string(),
                            hcv_area_hectare: z.string(),
                            id: z.string(),
                            is_apm: z.boolean(),
                            plants_per_hectare: z.number().int(),
                            remaining_seedlings: z.number().int(),
                            seedling_delivery_quantity: z.number().int(),
                            seedling_requirement: z.number().int(),
                          })
                          .strict()
                          .optional(),
                        division: z
                          .object({
                            code: z.string(),
                            id: z.string(),
                            name: z.string(),
                          })
                          .strict(),
                        status: z.number().int(),
                      })
                      .strict(),
                  )
                  .describe("estate details"),
                z.null().describe("estate details"),
              ])
              .describe("estate details"),
            estate_code: z.string().describe("estate code"),
            estate_id: z.string().describe("estate id"),
            estate_name: z.string().describe("estate name"),
            stat: z
              .object({
                total_effective_area_hectare: z.string(),
                total_remaining_seedlings: z.number().int(),
                total_seedling_delivery_quantity: z.number().int(),
                total_seedling_requirement: z.number().int(),
              })
              .strict(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    id: z.string(),
    program_name: z.string(),
    program_year: z.number().int(),
    stats: z
      .object({
        total_blocks: z.number().int(),
        total_clone: z.number().int(),
        total_division: z.number().int(),
        total_estate: z.number().int(),
        total_seedling: z.number().int(),
      })
      .strict(),
  })
  .strict();

// ReplantingPlanStats
export const ReplantingPlanStatsSchema = z
  .object({
    total_blocks: z.number().int(),
    total_clone: z.number().int(),
    total_division: z.number().int(),
    total_estate: z.number().int(),
    total_seedling: z.number().int(),
  })
  .strict();

// ReplantingProgramResponse
export const ReplantingProgramResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    id: z.string(),
    name: z.string(),
    year: z.number().int(),
  })
  .strict();

// RoleData
export const RoleDataSchema = z
  .object({
    id: z.number().int().describe("Role ID"),
    name: z.string().describe("Role name"),
  })
  .strict();

// RoleDetailsResponse
export const RoleDetailsResponseSchema = z
  .object({
    description: z.string().describe("Role description").optional(),
    id: z.number().int().describe("Role ID"),
    modules: z
      .union([
        z
          .array(
            z
              .object({
                children: z
                  .union([
                    z.array(z.any()).describe("Child modules"),
                    z.null().describe("Child modules"),
                  ])
                  .describe("Child modules"),
                context_id: z.string().describe("Module Context ID").optional(),
                description: z
                  .string()
                  .describe("Module description")
                  .optional(),
                icon: z.string().describe("Module icon"),
                id: z.number().int().describe("Module ID"),
                is_active: z.boolean().describe("Is module active").optional(),
                kind: z
                  .string()
                  .describe("Module kind (group, module, category, item)"),
                name: z.string().describe("Module name"),
                parent_id: z
                  .number()
                  .int()
                  .describe("Parent Module ID")
                  .optional(),
                path_name: z.string().describe("Module pathname"),
                slug: z
                  .string()
                  .describe("Module slug (URL-friendly identifier)"),
                sort_order: z
                  .number()
                  .int()
                  .describe("Sort order within parent"),
              })
              .strict(),
          )
          .describe("List of assigned modules as a tree structure"),
        z.null().describe("List of assigned modules as a tree structure"),
      ])
      .describe("List of assigned modules as a tree structure"),
    name: z.string().describe("Role name").optional(),
    permissions: z
      .union([
        z
          .array(
            z
              .object({
                action_kind: z
                  .number()
                  .int()
                  .describe("Action kind")
                  .optional(),
                description: z
                  .string()
                  .describe("Permission description")
                  .optional(),
                entity_id: z
                  .string()
                  .describe("Associated entity ID")
                  .optional(),
                id: z.number().int().describe("Permission ID"),
                is_assigned: z
                  .boolean()
                  .describe("Is permission assigned to role"),
                module_id: z
                  .number()
                  .int()
                  .describe("Module ID this permission belongs to"),
                name: z.string().describe("Permission name"),
                slug: z.string().describe("Permission slug"),
              })
              .strict(),
          )
          .describe("List of permissions assigned to this role"),
        z.null().describe("List of permissions assigned to this role"),
      ])
      .describe("List of permissions assigned to this role"),
  })
  .strict();

// RoleResponse
export const RoleResponseSchema = z
  .object({
    description: z.string().describe("Role description").optional(),
    id: z.number().int().describe("Role ID"),
    name: z.string().describe("Role name").optional(),
  })
  .strict();

// RoundingItem
export const RoundingItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    factor: z.union([z.number(), z.null()]),
    id: z.string(),
    name: z.string(),
    rounding_account_id: z.string(),
    rounding_type: z
      .object({ id: z.string(), value: z.string() })
      .strict()
      .optional(),
  })
  .strict();

// RoundingTypeItem
export const RoundingTypeItemSchema = z
  .object({ id: z.string(), value: z.string() })
  .strict();

// SeedlingReqPlanCloneResponse
export const SeedlingReqPlanCloneResponseSchema = z
  .object({
    area_hectare: z.string(),
    clone_setting: z
      .object({
        clone_name: z.string(),
        id: z.string(),
        planting_pattern: z.number().int(),
        seedling_per_hectare: z.number().int(),
      })
      .strict(),
    effective_area_hectare: z.string(),
    hcv_area_hectare: z.string(),
    id: z.string(),
    is_apm: z.boolean(),
    plants_per_hectare: z.number().int(),
    remaining_seedlings: z.number().int(),
    seedling_delivery_quantity: z.number().int(),
    seedling_requirement: z.number().int(),
  })
  .strict();

// SeedlingReqPlanDetailResponse
export const SeedlingReqPlanDetailResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    block: z
      .object({
        code: z.string(),
        id: z.string(),
        name: z.string(),
        year_of_planting: z.number().int().optional(),
      })
      .strict(),
    clones: z.union([
      z.array(
        z
          .object({
            area_hectare: z.string(),
            clone_setting: z
              .object({
                clone_name: z.string(),
                id: z.string(),
                planting_pattern: z.number().int(),
                seedling_per_hectare: z.number().int(),
              })
              .strict(),
            effective_area_hectare: z.string(),
            hcv_area_hectare: z.string(),
            id: z.string(),
            is_apm: z.boolean(),
            plants_per_hectare: z.number().int(),
            remaining_seedlings: z.number().int(),
            seedling_delivery_quantity: z.number().int(),
            seedling_requirement: z.number().int(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    division: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict(),
    estate: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict(),
    id: z.string(),
    plan_header_id: z.string(),
    program_name: z.string(),
    program_year: z.number().int(),
    status: z.number().int(),
    user_id: z.string().optional(),
  })
  .strict();

// SeedlingRequirementPlanItem
export const SeedlingRequirementPlanItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    area_hectare: z.string(),
    block: z
      .object({
        code: z.string(),
        id: z.string(),
        name: z.string(),
        year_of_planting: z.number().int().optional(),
      })
      .strict()
      .optional(),
    clone_setting: z
      .object({
        clone_name: z.string(),
        id: z.string(),
        planting_pattern: z.number().int(),
        seedling_per_hectare: z.number().int(),
      })
      .strict()
      .optional(),
    created_at: z.string().optional(),
    division: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    effective_area_hectare: z.string(),
    estate: z
      .object({ code: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
    hcv_area_hectare: z.string(),
    id: z.string(),
    is_apm: z.boolean(),
    plan_detail_id: z.string(),
    plan_header_id: z.string(),
    plants_per_hectare: z.number().int(),
    program_name: z.string(),
    program_year: z.number().int(),
    remaining_seedlings: z.number().int(),
    seedling_delivery_quantity: z.number().int(),
    seedling_requirement: z.number().int(),
    status: z.number().int(),
    updated_at: z.string().optional(),
    user_id: z.string().optional(),
    user_name: z.string().optional(),
  })
  .strict();

// ShiftCategoryItem
export const ShiftCategoryItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    id: z.string(),
    name: z.string(),
  })
  .strict();

// ShiftItem
export const ShiftItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    category: z
      .object({
        $schema: z
          .string()
          .url()
          .describe("A URL to the JSON Schema for this object.")
          .readonly()
          .optional(),
        id: z.string(),
        name: z.string(),
      })
      .strict()
      .optional(),
    id: z.string(),
    is_overlapping_allowed: z.boolean(),
    name: z.string().optional(),
  })
  .strict();

// ShiftTransactionDetailItem
export const ShiftTransactionDetailItemSchema = z
  .object({
    id: z.string(),
    time_from: z.string().datetime({ offset: true }),
    time_to: z.string().datetime({ offset: true }),
    week_day: z
      .object({
        $schema: z
          .string()
          .url()
          .describe("A URL to the JSON Schema for this object.")
          .readonly()
          .optional(),
        code: z.number().int(),
        id: z.string(),
        master_type: z.string(),
        master_type_id: z.string(),
        value: z.string(),
      })
      .strict(),
    working_hours: z.string(),
  })
  .strict();

// ShiftTransactionItem
export const ShiftTransactionItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    date: z.string().datetime({ offset: true }),
    details: z
      .union([
        z.array(
          z
            .object({
              id: z.string(),
              time_from: z.string().datetime({ offset: true }),
              time_to: z.string().datetime({ offset: true }),
              week_day: z
                .object({
                  $schema: z
                    .string()
                    .url()
                    .describe("A URL to the JSON Schema for this object.")
                    .readonly()
                    .optional(),
                  code: z.number().int(),
                  id: z.string(),
                  master_type: z.string(),
                  master_type_id: z.string(),
                  value: z.string(),
                })
                .strict(),
              working_hours: z.string(),
            })
            .strict(),
        ),
        z.null(),
      ])
      .optional(),
    id: z.string(),
    shift: z
      .object({
        $schema: z
          .string()
          .url()
          .describe("A URL to the JSON Schema for this object.")
          .readonly()
          .optional(),
        category: z
          .object({
            $schema: z
              .string()
              .url()
              .describe("A URL to the JSON Schema for this object.")
              .readonly()
              .optional(),
            id: z.string(),
            name: z.string(),
          })
          .strict()
          .optional(),
        id: z.string(),
        is_overlapping_allowed: z.boolean(),
        name: z.string().optional(),
      })
      .strict(),
  })
  .strict();

// StandardOperatingProcedureItem
export const StandardOperatingProcedureItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().optional(),
    id: z.string(),
    procedure: z.string(),
  })
  .strict();

// TermsAndConditionsDTLItem
export const TermsAndConditionsDTLItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    fk_module_id: z.string(),
    fk_terms_and_conditions_hdr_id: z.string(),
    id: z.string(),
    module_grouping: z
      .object({ id: z.string(), name: z.string() })
      .strict()
      .optional(),
  })
  .strict();

// TermsAndConditionsHDRItem
export const TermsAndConditionsHDRItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    description: z.string(),
    details: z
      .union([
        z.array(
          z
            .object({
              $schema: z
                .string()
                .url()
                .describe("A URL to the JSON Schema for this object.")
                .readonly()
                .optional(),
              fk_module_id: z.string(),
              fk_terms_and_conditions_hdr_id: z.string(),
              id: z.string(),
              module_grouping: z
                .object({ id: z.string(), name: z.string() })
                .strict()
                .optional(),
            })
            .strict(),
        ),
        z.null(),
      ])
      .optional(),
    id: z.string(),
    name: z.string(),
    parent_terms_and_conditions: z.string().optional(),
    parent_terms_and_conditions_ref: z
      .object({ description: z.string(), id: z.string(), name: z.string() })
      .strict()
      .optional(),
  })
  .strict();

// TermsAndConditionsHDRRef
export const TermsAndConditionsHDRRefSchema = z
  .object({ description: z.string(), id: z.string(), name: z.string() })
  .strict();

// ToggleRoleModulesRequest
export const ToggleRoleModulesRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    module_ids: z
      .union([
        z.array(z.number().int()).describe("List of module IDs to toggle"),
        z.null().describe("List of module IDs to toggle"),
      ])
      .describe("List of module IDs to toggle"),
    role_id: z.number().int().describe("Role ID"),
  })
  .strict();

// ToggleRoleModulesResponse
export const ToggleRoleModulesResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    results: z
      .union([
        z
          .array(
            z
              .object({
                attached: z
                  .boolean()
                  .describe("True if attached, false if detached"),
                message: z.string().describe("Result message"),
                module_id: z.number().int().describe("Module ID"),
              })
              .strict(),
          )
          .describe("Results for each module"),
        z.null().describe("Results for each module"),
      ])
      .describe("Results for each module"),
    role_id: z.number().int().describe("Role ID"),
  })
  .strict();

// ToggleRolePermissionRequest
export const ToggleRolePermissionRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    permission_ids: z
      .union([
        z.array(z.number().int()).describe("List of Permission IDs to toggle"),
        z.null().describe("List of Permission IDs to toggle"),
      ])
      .describe("List of Permission IDs to toggle")
      .optional(),
    role_id: z.number().int().describe("Role ID"),
  })
  .strict();

// ToggleRolePermissionResponse
export const ToggleRolePermissionResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    attached: z
      .boolean()
      .describe("True if permission was attached, false if detached"),
    message: z.string().describe("Result message"),
    role_id: z.number().int().describe("Role ID"),
  })
  .strict();

// UOMConversionItem
export const UOMConversionItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    factor: z.number().optional(),
    from_uom_id: z.string(),
    from_uom_name: z.string(),
    id: z.string(),
    to_uom_id: z.string(),
    to_uom_name: z.string(),
  })
  .strict();

// UOMItem
export const UOMItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string(),
    id: z.string(),
    name: z.string(),
  })
  .strict();

// UomResponse
export const UomResponseSchema = z
  .object({
    BusinessLocationID: z.string().optional(),
    Code: z.string(),
    Name: z.string(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// UpdateAdditionalChargeDiscountRequest
export const UpdateAdditionalChargeDiscountRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    amount: z.string().describe("Amount").optional(),
    code: z.string().min(1).describe("Code"),
    fk_account_id: z.string().uuid(),
    fk_master_value_additional_charge_discount_type_id: z.string().uuid(),
    fk_master_value_charge_calculation_type_id: z.string().uuid(),
    fk_tax_type_id: z.string().uuid().optional(),
    name: z.string().min(1).describe("Name"),
    percentage: z.string().describe("Percentage").optional(),
  })
  .strict();

// UpdateAlokasiHeadingRequest
export const UpdateAlokasiHeadingRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1).max(20),
    name: z.string().min(1).max(200),
  })
  .strict();

// UpdateAlokasiUmumRequest
export const UpdateAlokasiUmumRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    account_id: z.string().uuid(),
    code: z.string().min(1).max(20),
    heading_id: z.string().uuid(),
    is_derive_account_code_from_block: z.boolean().optional(),
    is_derive_account_code_from_crop: z.boolean().optional(),
    machinery_output_id: z.string().uuid().optional(),
    name: z.string().min(1).max(200),
  })
  .strict();

// UpdateAnalysisCodeRequest
export const UpdateAnalysisCodeRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    analysis_type_id: z.string().uuid(),
    code: z.string().min(1),
    name: z.string().min(1),
    parent_analysis_code_id: z.string().uuid().optional(),
  })
  .strict();

// UpdateAnalysisCodeSettingRequest
export const UpdateAnalysisCodeSettingRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    analysis_code_id: z.string().uuid(),
    analysis_type_id: z.string().uuid(),
    master_value_id: z.string().uuid(),
  })
  .strict();

// UpdateAnalysisCodeSourceRequest
export const UpdateAnalysisCodeSourceRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data_field: z.string().min(1),
    display_field: z.string().min(1),
    name: z.string().min(1),
  })
  .strict();

// UpdateAnalysisTypeRequest
export const UpdateAnalysisTypeRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    analysis_code_source_id: z.string().uuid().optional(),
    code: z.string().min(1),
    filter_expression_sql: z.string().optional(),
    name: z.string().min(1),
  })
  .strict();

// UpdateAnalysisTypeSettingRequest
export const UpdateAnalysisTypeSettingRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    analysis_type_id: z.string().uuid(),
    master_value_id: z.string().uuid(),
  })
  .strict();

// UpdateBatchRequest
export const UpdateBatchRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1),
    name: z.string().min(1),
    nursery_id: z.string().uuid(),
    program_number: z.string(),
    start_date: z.string().date(),
  })
  .strict();

// UpdateCloneRequest
export const UpdateCloneRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    commodity_id: z.string().uuid(),
    name: z.string().min(1),
  })
  .strict();

// UpdateCloneSettingRequest
export const UpdateCloneSettingRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    clone_id: z.string().uuid(),
    planting_pattern: z.number().int().gte(1),
    seedling_per_hectare: z.number().int().gte(1),
  })
  .strict();

// UpdateCommodityRequest
export const UpdateCommodityRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1),
    crop_reference_code: z.string().optional(),
    is_major: z.boolean(),
    name: z.string().min(1),
    parent_crop_id: z.string().uuid().optional(),
  })
  .strict();

// UpdateCompanyRequest
export const UpdateCompanyRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1).describe("Company code"),
    is_external: z.boolean().describe("Whether the company is external"),
    name: z.string().min(1).describe("Company name"),
  })
  .strict();

// UpdateCropRequest
export const UpdateCropRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.number().int(),
    value: z.string().min(1),
  })
  .strict();

// UpdateCurrencyDenominationTitleRequest
export const UpdateCurrencyDenominationTitleRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1),
    currency_id: z.string().uuid(),
    name: z.string().min(1),
  })
  .strict();

// UpdateCurrencyRequest
export const UpdateCurrencyRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1),
    coin_factor: z.number().optional(),
    coin_name: z.string().optional(),
    country_id: z.string().uuid().optional(),
    currency_in_word_id: z.string().uuid().optional(),
    format: z.string().optional(),
    is_active: z.boolean().optional(),
    is_home_currency: z.boolean().optional(),
    is_symbol_prefix: z.boolean().optional(),
    name: z.string().min(1),
    symbol: z.string().optional(),
  })
  .strict();

// UpdateDenominationRequest
export const UpdateDenominationRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    configurations: z
      .union([
        z.array(z.object({ title_id: z.string().uuid() }).strict()),
        z.null(),
      ])
      .optional(),
    factor: z.number().optional(),
    name: z.string().min(1),
  })
  .strict();

// UpdateGeneralAllocationSettingDetailRequest
export const UpdateGeneralAllocationSettingDetailRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    analysis_code_id: z.string().uuid().optional(),
    analysis_type_id: z.string().uuid(),
    is_module_specific: z.boolean().optional(),
    setting_id: z.string().uuid(),
    type_id: z.string().uuid().optional(),
  })
  .strict();

// UpdateGeneralAllocationSettingRequest
export const UpdateGeneralAllocationSettingRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    allocation_id: z.string().uuid(),
    from_age: z.number().int().optional(),
    to_age: z.number().int().optional(),
  })
  .strict();

// UpdateGroupRequest
export const UpdateGroupRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1).describe("Group code"),
    company_id: z.string().uuid().describe("Company ID"),
    name: z.string().min(1).describe("Group name"),
  })
  .strict();

// UpdateGrowthStageOutputBody
export const UpdateGrowthStageOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
  })
  .strict();

// UpdateHolidayDTLRequest
export const UpdateHolidayDTLRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    fk_holiday_id: z.string().uuid(),
    holiday_date: z.string().date(),
  })
  .strict();

// UpdateHolidayHDRRequest
export const UpdateHolidayHDRRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    fk_master_value_holiday_eligibility_base_id: z.string().uuid(),
    fk_master_value_type: z.string().uuid(),
    name: z.string().min(1),
  })
  .strict();

// UpdateKebangsaanRequest
export const UpdateKebangsaanRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    country_id: z.string().uuid().describe("Country ID"),
    name: z.string().min(1).describe("Nationality name"),
  })
  .strict();

// UpdateMasterValueRequest
export const UpdateMasterValueRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.number().int().describe("Master value code"),
    value: z.string().min(1).describe("Master value"),
  })
  .strict();

// UpdateModuleRequest
export const UpdateModuleRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    context_id: z.string().describe("Module Context ID").optional(),
    description: z.string().describe("Module description").optional(),
    icon: z.string().describe("Module icon").optional(),
    is_active: z.boolean().describe("Is module active").optional(),
    kind: z
      .enum(["group", "module", "category", "item"])
      .describe("Module kind")
      .optional(),
    name: z.string().min(3).describe("Module name").optional(),
    parent_id: z.number().int().describe("Parent module ID").optional(),
    path_name: z
      .string()
      .describe("Module pathname (URL-friendly identifier)")
      .optional(),
    slug: z
      .string()
      .min(3)
      .describe("Module slug (URL-friendly identifier)")
      .optional(),
    sort_order: z
      .number()
      .int()
      .describe("Sort order within parent")
      .optional(),
  })
  .strict();

// UpdateNurseryBedRequest
export const UpdateNurseryBedRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    breadth: z.number(),
    breadth_uom_id: z.string(),
    is_active: z.boolean(),
    length: z.number(),
    length_uom_id: z.string(),
    name: z.string().min(1),
    short_name: z.string().min(1),
  })
  .strict();

// UpdateNurseryOutputBody
export const UpdateNurseryOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    id: z.string(),
  })
  .strict();

// UpdateNurseryRequest
export const UpdateNurseryRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    area: z.number().gt(0),
    area_uom_id: z.string().uuid(),
    budget_rate: z.number(),
    commodity_id: z.string().uuid(),
    division_id: z.string().uuid(),
    name: z.string().min(1).max(100),
    nursery_type_id: z.string().uuid(),
    project_id: z.string().uuid(),
    start_date: z.string().date(),
  })
  .strict();

// UpdateProductRequest
export const UpdateProductRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1),
    commodity_id: z.string().uuid(),
    is_organic: z.boolean(),
    name: z.string().min(1),
    product_type_id: z.string().uuid(),
    short_name: z.string().optional(),
    uom_id: z.string().uuid(),
  })
  .strict();

// UpdateProductSettingRequest
export const UpdateProductSettingRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    product_description_type_id: z.string().uuid(),
    product_id: z.string().uuid(),
  })
  .strict();

// UpdateProjectRequest
export const UpdateProjectRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    admin_unit_id: z.string().uuid(),
    code: z.string().min(1),
    end_date: z.string().date(),
    name: z.string().min(1),
    project_type_id: z.string().uuid(),
    start_date: z.string().date(),
  })
  .strict();

// UpdatePsrProgramBody
export const UpdatePsrProgramBodySchema = z
  .object({ psr_id: z.union([z.number().int(), z.null()]) })
  .strict();

// UpdatePsrProgramRequest
export const UpdatePsrProgramRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    name: z.string().min(3).max(100),
    seedling_quantity: z.number().int().gte(1),
  })
  .strict();

// UpdatePsrProgramResponseBody
export const UpdatePsrProgramResponseBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z.object({ psr_id: z.union([z.number().int(), z.null()]) }).strict(),
  })
  .strict();

// UpdateQualityGradeRequest
export const UpdateQualityGradeRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1),
    is_penalty: z.boolean(),
    is_rejected: z.boolean(),
    name: z.string().min(1),
    product_id: z.string().uuid(),
    short_name: z.string().optional(),
  })
  .strict();

// UpdateReasonRequest
export const UpdateReasonRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().min(1).max(20),
    reason: z.string().min(1).max(100),
  })
  .strict();

// UpdateReplantingProgramRequest
export const UpdateReplantingProgramRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    name: z.string().min(1),
    year: z.number().int().gte(2000),
  })
  .strict();

// UpdateRoleModuleAccessRequest
export const UpdateRoleModuleAccessRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    mode: z
      .enum(["attach", "detach"])
      .describe("Access mode: attach or detach"),
    module_id: z.number().int().describe("Target Module ID"),
    recursive: z
      .boolean()
      .describe("If true, applies to all descendant modules and permissions"),
    role_id: z.number().int().describe("Role ID"),
  })
  .strict();

// UpdateRoleModuleAccessResponse
export const UpdateRoleModuleAccessResponseSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string().describe("Result message"),
    role_id: z.number().int().describe("Role ID"),
  })
  .strict();

// UpdateRoundingRequest
export const UpdateRoundingRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    factor: z.number(),
    name: z.string().min(1),
    rounding_account_id: z.string().uuid(),
    rounding_type_id: z.string().uuid(),
  })
  .strict();

// UpdateSeedlingReqPlanRequest
export const UpdateSeedlingReqPlanRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    clones: z.union([
      z
        .array(
          z
            .object({
              area_hectare: z
                .string()
                .regex(new RegExp("^[0-9]+(\\.[0-9]+)?$")),
              clone_setting_id: z.string().uuid(),
              hcv_area_hectare: z
                .string()
                .regex(new RegExp("^[0-9]+(\\.[0-9]+)?$")),
              is_apm: z.boolean(),
              plants_per_hectare: z.number().int().gte(1),
              remaining_seedlings: z.number().int().gt(0),
              seedling_delivery_quantity: z.number().int().gt(0),
              seedling_requirement: z.number().int().gt(0),
            })
            .strict(),
        )
        .min(1),
      z.null(),
    ]),
    status: z.union([z.literal(0), z.literal(1)]),
  })
  .strict();

// UpdateShiftCategoryRequest
export const UpdateShiftCategoryRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    name: z.string().min(1),
  })
  .strict();

// UpdateStandardOperatingProcedureRequest
export const UpdateStandardOperatingProcedureRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string().describe("Optional procedure code").optional(),
    procedure: z.string().min(1).describe("Procedure text"),
  })
  .strict();

// UpdateTermsAndConditionsDTLRequest
export const UpdateTermsAndConditionsDTLRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    fk_module_id: z.string().uuid(),
    fk_terms_and_conditions_hdr_id: z.string().uuid(),
  })
  .strict();

// UpdateTermsAndConditionsHDRRequest
export const UpdateTermsAndConditionsHDRRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    description: z.string().min(1),
    name: z.string().min(1),
    parent_terms_and_conditions: z.string().uuid().optional(),
  })
  .strict();

// UpsertDeliveryWeeklyRequest
export const UpsertDeliveryWeeklyRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    actual_qty: z.number().int().gt(0),
    month: z.number().int().gte(1).lte(12),
    planned_qty: z.number().int().gt(0),
    week_no: z.number().int().gte(1).lte(5),
  })
  .strict();

// UserData
export const UserDataSchema = z
  .object({
    id: z.string().describe("User ID"),
    name: z.string().describe("User name").optional(),
    role: z
      .object({
        id: z.number().int().describe("Role ID"),
        name: z.string().describe("Role name"),
      })
      .strict()
      .optional(),
  })
  .strict();

// UserDetailsBody
export const UserDetailsBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    id: z.string().describe("User ID"),
    modules: z
      .union([
        z
          .array(
            z
              .object({
                children: z
                  .union([
                    z.array(z.any()).describe("Child modules"),
                    z.null().describe("Child modules"),
                  ])
                  .describe("Child modules"),
                context_id: z.string().describe("Module Context ID").optional(),
                description: z
                  .string()
                  .describe("Module description")
                  .optional(),
                icon: z.string().describe("Module icon"),
                id: z.number().int().describe("Module ID"),
                is_active: z.boolean().describe("Is module active").optional(),
                kind: z
                  .string()
                  .describe("Module kind (group, module, category, item)"),
                name: z.string().describe("Module name"),
                parent_id: z
                  .number()
                  .int()
                  .describe("Parent Module ID")
                  .optional(),
                path_name: z.string().describe("Module pathname"),
                slug: z
                  .string()
                  .describe("Module slug (URL-friendly identifier)"),
                sort_order: z
                  .number()
                  .int()
                  .describe("Sort order within parent"),
              })
              .strict(),
          )
          .describe("User's accessible modules as a tree"),
        z.null().describe("User's accessible modules as a tree"),
      ])
      .describe("User's accessible modules as a tree"),
    name: z.string().describe("User name").optional(),
    permissions: z
      .union([
        z.array(z.string()).describe("User's permissions"),
        z.null().describe("User's permissions"),
      ])
      .describe("User's permissions"),
    role: z
      .object({
        id: z.number().int().describe("Role ID"),
        name: z.string().describe("Role name"),
      })
      .strict()
      .optional(),
  })
  .strict();

// WorkPlaceGeoUnitItem
export const WorkPlaceGeoUnitItemSchema = z
  .object({ id: z.string(), name: z.string() })
  .strict();

// WorkPlaceItem
export const WorkPlaceItemSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    code: z.string(),
    geographical_unit: z
      .object({ id: z.string(), name: z.string() })
      .strict()
      .optional(),
    id: z.string(),
    is_active: z.boolean().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    name: z.string(),
    work_place_type: z
      .object({ id: z.string(), value: z.string() })
      .strict()
      .optional(),
  })
  .strict();

// WorkPlaceResponse
export const WorkPlaceResponseSchema = z
  .object({
    BusinessLocationID: z.string().optional(),
    Code: z.string(),
    FK_GeographicalUnitID: z.string().optional(),
    FK_MasterValueSectionID: z.string().optional(),
    IsActive: z.boolean(),
    Name: z.string(),
    PK_MasterValueWorkPlaceID: z.string().optional(),
    uoid: z.string(),
    vuserid: z.string().optional(),
  })
  .strict();

// WorkPlaceTypeItem
export const WorkPlaceTypeItemSchema = z
  .object({ id: z.string(), value: z.string() })
  .strict();

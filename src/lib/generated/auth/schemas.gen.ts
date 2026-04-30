import { z } from "zod";

// CheckOutput
export const CheckOutputSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    role_id: z.number().int().optional(),
    role_name: z.string().optional(),
    session_id: z.string(),
  })
  .strict();

// EmployeeDetail
export const EmployeeDetailSchema = z
  .object({
    administrative_code: z.union([z.string(), z.null()]),
    administrative_name: z.union([z.string(), z.null()]),
    administrative_unit_id: z.union([z.string(), z.null()]),
    business_location_id: z.union([z.string(), z.null()]),
    employee_id: z.string(),
    employee_number: z.string(),
    first_name: z.string(),
    last_name: z.union([z.string(), z.null()]),
    middle_name: z.union([z.string(), z.null()]),
    windows_login: z.union([z.string(), z.null()]),
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

// GetInfoBody
export const GetInfoBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string().describe("Response message"),
    status: z.number().int().describe("HTTP status code"),
    user: z
      .object({
        employee: z
          .object({
            administrative_code: z.union([z.string(), z.null()]),
            administrative_name: z.union([z.string(), z.null()]),
            administrative_unit_id: z.union([z.string(), z.null()]),
            business_location_id: z.union([z.string(), z.null()]),
            employee_id: z.string(),
            employee_number: z.string(),
            first_name: z.string(),
            last_name: z.union([z.string(), z.null()]),
            middle_name: z.union([z.string(), z.null()]),
            windows_login: z.union([z.string(), z.null()]),
          })
          .strict()
          .optional(),
        id: z.string(),
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
                    description: z
                      .string()
                      .describe("Module description")
                      .optional(),
                    icon: z.string().describe("Module icon"),
                    id: z.number().int().describe("Module ID"),
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
          .describe("User's accessible modules as a tree")
          .optional(),
        name: z.string().describe("User name"),
        permissions: z
          .union([
            z.array(z.string()).describe("User's permissions"),
            z.null().describe("User's permissions"),
          ])
          .describe("User's permissions")
          .optional(),
        role: z
          .object({
            description: z.string(),
            id: z.number().int(),
            name: z.string(),
          })
          .strict()
          .optional(),
      })
      .strict(),
  })
  .strict();

// HealthBody
export const HealthBodySchema = z.object({ db: z.boolean() }).strict();

// LoginRequest
export const LoginRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    password: z
      .string()
      .min(1)
      .max(255)
      .describe("User password (optional for demo)")
      .optional(),
    user_id: z.string().min(1).max(255).describe("User ID to authenticate"),
  })
  .strict();

// LoginResponseData
export const LoginResponseDataSchema = z
  .object({
    access_token: z.string().describe("JWT access token"),
    expires_at: z
      .string()
      .datetime({ offset: true })
      .describe("Session expiration timestamp"),
    expires_in: z
      .number()
      .int()
      .describe("Access token expiration time in seconds"),
    refresh_token: z.string().describe("JWT refresh token"),
    session_id: z.string().describe("Session identifier"),
    token_type: z.string().describe("Token type"),
    user: z
      .object({
        employee: z
          .object({
            administrative_code: z.union([z.string(), z.null()]),
            administrative_name: z.union([z.string(), z.null()]),
            administrative_unit_id: z.union([z.string(), z.null()]),
            business_location_id: z.union([z.string(), z.null()]),
            employee_id: z.string(),
            employee_number: z.string(),
            first_name: z.string(),
            last_name: z.union([z.string(), z.null()]),
            middle_name: z.union([z.string(), z.null()]),
            windows_login: z.union([z.string(), z.null()]),
          })
          .strict()
          .optional(),
        id: z.string(),
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
                    description: z
                      .string()
                      .describe("Module description")
                      .optional(),
                    icon: z.string().describe("Module icon"),
                    id: z.number().int().describe("Module ID"),
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
          .describe("User's accessible modules as a tree")
          .optional(),
        name: z.string().describe("User name"),
        permissions: z
          .union([
            z.array(z.string()).describe("User's permissions"),
            z.null().describe("User's permissions"),
          ])
          .describe("User's permissions")
          .optional(),
        role: z
          .object({
            description: z.string(),
            id: z.number().int(),
            name: z.string(),
          })
          .strict()
          .optional(),
      })
      .strict(),
  })
  .strict();

// Module
export const ModuleSchema = z
  .object({
    children: z
      .union([
        z.array(z.any()).describe("Child modules"),
        z.null().describe("Child modules"),
      ])
      .describe("Child modules"),
    description: z.string().describe("Module description").optional(),
    icon: z.string().describe("Module icon"),
    id: z.number().int().describe("Module ID"),
    kind: z.string().describe("Module kind (group, module, category, item)"),
    name: z.string().describe("Module name"),
    parent_id: z.number().int().describe("Parent Module ID").optional(),
    path_name: z.string().describe("Module pathname"),
    slug: z.string().describe("Module slug (URL-friendly identifier)"),
    sort_order: z.number().int().describe("Sort order within parent"),
  })
  .strict();

// RefreshResponseData
export const RefreshResponseDataSchema = z
  .object({
    access_token: z.string().describe("New JWT access token"),
    expires_in: z
      .number()
      .int()
      .describe("Access token expiration time in seconds"),
    refresh_token: z.string().describe("New JWT refresh token"),
    token_type: z.string().describe("Token type"),
  })
  .strict();

// RevokeSessionsData
export const RevokeSessionsDataSchema = z
  .object({
    revoked_count: z
      .number()
      .int()
      .describe("Number of sessions successfully revoked"),
  })
  .strict();

// RevokeSessionsRequest
export const RevokeSessionsRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    session_ids: z
      .union([
        z.array(z.string()).min(1).describe("Array of session IDs to revoke"),
        z.null().describe("Array of session IDs to revoke"),
      ])
      .describe("Array of session IDs to revoke"),
  })
  .strict();

// Role
export const RoleSchema = z
  .object({ description: z.string(), id: z.number().int(), name: z.string() })
  .strict();

// SelectableEstateAndCommodity
export const SelectableEstateAndCommoditySchema = z
  .object({
    code: z.string(),
    id: z.string(),
    name: z.string(),
    short_name: z.string(),
  })
  .strict();

// SessionInfo
export const SessionInfoSchema = z
  .object({
    created_at: z.string().datetime({ offset: true }),
    expires_at: z.string().datetime({ offset: true }),
    ip_address: z.string().optional(),
    is_active: z.boolean(),
    is_current: z.boolean(),
    session_id: z.string(),
    status: z.number().int(),
    user_agent: z.string().optional(),
  })
  .strict();

// User
export const UserSchema = z
  .object({
    employee: z
      .object({
        administrative_code: z.union([z.string(), z.null()]),
        administrative_name: z.union([z.string(), z.null()]),
        administrative_unit_id: z.union([z.string(), z.null()]),
        business_location_id: z.union([z.string(), z.null()]),
        employee_id: z.string(),
        employee_number: z.string(),
        first_name: z.string(),
        last_name: z.union([z.string(), z.null()]),
        middle_name: z.union([z.string(), z.null()]),
        windows_login: z.union([z.string(), z.null()]),
      })
      .strict()
      .optional(),
    id: z.string(),
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
                description: z
                  .string()
                  .describe("Module description")
                  .optional(),
                icon: z.string().describe("Module icon"),
                id: z.number().int().describe("Module ID"),
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
      .describe("User's accessible modules as a tree")
      .optional(),
    name: z.string().describe("User name"),
    permissions: z
      .union([
        z.array(z.string()).describe("User's permissions"),
        z.null().describe("User's permissions"),
      ])
      .describe("User's permissions")
      .optional(),
    role: z
      .object({
        description: z.string(),
        id: z.number().int(),
        name: z.string(),
      })
      .strict()
      .optional(),
  })
  .strict();

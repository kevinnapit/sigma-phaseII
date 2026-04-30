import { z } from "zod";

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

// GetHistoryOutputBody
export const GetHistoryOutputBodySchema = z
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
            action_url: z.string().optional(),
            badge_url: z.string().optional(),
            body: z.string(),
            campaign_id: z.string().optional(),
            clicked_at: z.string().datetime({ offset: true }).optional(),
            created_at: z.string().datetime({ offset: true }).optional(),
            delivered_at: z.string().datetime({ offset: true }).optional(),
            dismissed_at: z.string().datetime({ offset: true }).optional(),
            icon_url: z.string().optional(),
            id: z.number().int(),
            image_url: z.string().optional(),
            notification_type: z.string(),
            sent_at: z.string().datetime({ offset: true }).optional(),
            status: z.string(),
            subscription_id: z.string(),
            title: z.string(),
            user_id: z.string(),
          })
          .strict(),
      ),
      z.null(),
    ]),
    success: z.boolean(),
  })
  .strict();

// NotificationHistoryItem
export const NotificationHistoryItemSchema = z
  .object({
    action_url: z.string().optional(),
    badge_url: z.string().optional(),
    body: z.string(),
    campaign_id: z.string().optional(),
    clicked_at: z.string().datetime({ offset: true }).optional(),
    created_at: z.string().datetime({ offset: true }).optional(),
    delivered_at: z.string().datetime({ offset: true }).optional(),
    dismissed_at: z.string().datetime({ offset: true }).optional(),
    icon_url: z.string().optional(),
    id: z.number().int(),
    image_url: z.string().optional(),
    notification_type: z.string(),
    sent_at: z.string().datetime({ offset: true }).optional(),
    status: z.string(),
    subscription_id: z.string(),
    title: z.string(),
    user_id: z.string(),
  })
  .strict();

// PushPayload
export const PushPayloadSchema = z
  .object({
    action_url: z.string().optional(),
    badge: z.string().optional(),
    body: z.string(),
    campaign: z.string().optional(),
    data: z.record(z.any()).optional(),
    icon: z.string().optional(),
    image: z.string().optional(),
    title: z.string(),
    type: z.string(),
  })
  .strict();

// SubscribeOutputBody
export const SubscribeOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    data: z
      .object({
        created_at: z.string().datetime({ offset: true }),
        endpoint: z.string(),
        id: z.string(),
        message: z.string(),
      })
      .strict()
      .optional(),
    message: z.string(),
    success: z.boolean(),
  })
  .strict();

// SubscribeRequest
export const SubscribeRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    auth_secret: z.string(),
    browser: z.string().optional(),
    browser_version: z.string().optional(),
    device_type: z.string().optional(),
    endpoint: z.string(),
    metadata: z.record(z.any()).optional(),
    os: z.string().optional(),
    os_version: z.string().optional(),
    p256dh_key: z.string(),
    tags: z.union([z.array(z.string()), z.null()]).optional(),
    timezone: z.string().optional(),
    user_agent: z.string().optional(),
  })
  .strict();

// SubscribeResponse
export const SubscribeResponseSchema = z
  .object({
    created_at: z.string().datetime({ offset: true }),
    endpoint: z.string(),
    id: z.string(),
    message: z.string(),
  })
  .strict();

// TriggerByRoleIDsOutputBody
export const TriggerByRoleIDsOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
    success: z.boolean(),
  })
  .strict();

// TriggerByRoleIDsRequest
export const TriggerByRoleIDsRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    payload: z
      .object({
        action_url: z.string().optional(),
        badge: z.string().optional(),
        body: z.string(),
        campaign: z.string().optional(),
        data: z.record(z.any()).optional(),
        icon: z.string().optional(),
        image: z.string().optional(),
        title: z.string(),
        type: z.string(),
      })
      .strict(),
    role_ids: z.union([z.array(z.number().int()), z.null()]),
  })
  .strict();

// TriggerByUserIDsOutputBody
export const TriggerByUserIDsOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
    success: z.boolean(),
  })
  .strict();

// TriggerByUserIDsRequest
export const TriggerByUserIDsRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    payload: z
      .object({
        action_url: z.string().optional(),
        badge: z.string().optional(),
        body: z.string(),
        campaign: z.string().optional(),
        data: z.record(z.any()).optional(),
        icon: z.string().optional(),
        image: z.string().optional(),
        title: z.string(),
        type: z.string(),
      })
      .strict(),
    user_ids: z.union([z.array(z.string()), z.null()]),
  })
  .strict();

// UnsubscribeOutputBody
export const UnsubscribeOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
    success: z.boolean(),
  })
  .strict();

// UnsubscribeRequest
export const UnsubscribeRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    endpoint: z.string().optional(),
    subscription_id: z.string().optional(),
  })
  .strict();

// UpdateHistoryStatusOutputBody
export const UpdateHistoryStatusOutputBodySchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    message: z.string(),
    success: z.boolean(),
  })
  .strict();

// UpdateHistoryStatusRequest
export const UpdateHistoryStatusRequestSchema = z
  .object({
    $schema: z
      .string()
      .url()
      .describe("A URL to the JSON Schema for this object.")
      .readonly()
      .optional(),
    status: z.string(),
  })
  .strict();

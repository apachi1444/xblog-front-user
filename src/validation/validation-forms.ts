import { z } from 'zod';

// ==============================
// Store Integration Schemas
// ==============================

// Base store schema with common fields
const baseStoreSchema = z.object({
  platform: z.string().min(1, 'Please select a platform'),
  name: z.string().min(1, 'Website name is required').min(3, 'Name must be at least 3 characters'),
  domain: z
    .string()
    .min(1, 'Domain name is required')
    .regex(
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      'Please enter a valid domain'
    ),
  businessType: z.string().min(1, 'Business type is required'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

// WordPress specific schema
export const wordpressStoreSchema = baseStoreSchema.extend({
  store_url: z.string().min(1, 'Store URL is required'),
  store_username: z.string().min(1, 'Store username is required'),
  store_password: z.string().min(1, 'Store password is required'),
});

// Shopify specific schema
export const shopifyStoreSchema = baseStoreSchema.extend({
  shopifyStore: z.string().min(1, 'Shopify store name is required'),
  appId: z.string().min(1, 'App ID is required'),
  appPassword: z.string().min(1, 'App Password is required'),
});

// Wix specific schema
export const wixStoreSchema = baseStoreSchema.extend({
  adminUrl: z.string().min(1, 'Admin URL is required'),
  consumerKey: z.string().min(1, 'Consumer Key is required'),
  consumerSecret: z.string().min(1, 'Consumer Secret is required'),
});

// Combined store schema with conditional validation
export const storeSchema = z.discriminatedUnion('platform', [
  z.object({ platform: z.literal('wordpress') }).merge(wordpressStoreSchema),
  z.object({ platform: z.literal('shopify') }).merge(shopifyStoreSchema),
  z.object({ platform: z.literal('wix') }).merge(wixStoreSchema),
  z.object({ platform: z.literal('') }).merge(baseStoreSchema.partial()),
]);

export type StoreFormData = z.infer<typeof storeSchema>;

// ==============================
// Book Demo Schemas
// ==============================

export const bookDemoBasicInfoSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  company: z.string().min(1, 'Company is required'),
  teamSize: z.string().min(1, 'Team Size is required'),
});

export const bookDemoTimeSchema = z.object({
  dateTime: z.date({
    required_error: 'Date and Time is required',
    invalid_type_error: 'Invalid date format',
  }),
  message: z.string().optional(),
});

export const bookDemoSchema = bookDemoBasicInfoSchema.merge(bookDemoTimeSchema);

export type BookDemoFormData = z.infer<typeof bookDemoSchema>;

// ==============================
// Article Generation Schemas
// ==============================

// Step 1: Content Setup
export const contentSetupSchema = z.object({
  contentDescription: z.string().min(1, 'Content description is required'),
  primaryKeyword: z.string().min(1, 'Primary keyword is required'),
  secondaryKeywords: z
    .array(z.string())
    .min(1, 'At least one secondary keyword is required'),
  title: z.string().optional(),
  metaDescription: z.string().optional(),
});

export type ContentSetupFormData = z.infer<typeof contentSetupSchema>;

// Step 2: Article Settings
export const articleSettingsSchema = z.object({
  articleType: z.string().min(1, 'Article type is required'),
  articleSize: z.string().min(1, 'Article size is required'),
  toneOfVoice: z.string().min(1, 'Tone of voice is required'),
  pointOfView: z.string().min(1, 'Point of view is required'),
  aiContentCleaning: z.string().min(1, 'AI content cleaning setting is required'),
  imageQuality: z.string().min(1, 'Image quality is required'),
  imagePlacement: z.string().min(1, 'Image placement is required'),
  imageStyle: z.string().min(1, 'Image style is required'),
  numberOfImages: z.string().min(1, 'Number of images is required'),
  internalLinking: z.string().min(1, 'Internal linking setting is required'),
  externalLinking: z.string().min(1, 'External linking setting is required'),
});

export type ArticleSettingsFormData = z.infer<typeof articleSettingsSchema>;

// Combined article generation schema
export const articleGenerationSchema = contentSetupSchema.merge(articleSettingsSchema);

export type ArticleGenerationFormData = z.infer<typeof articleGenerationSchema>;

// ==============================
// Profile Schemas
// ==============================

export const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  company: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  birthday: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

// ==============================
// Security Schemas
// ==============================

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(1, 'New password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

// ==============================
// Helper Functions
// ==============================

/**
 * Converts Zod validation errors to a format compatible with form error states
 */
export function zodErrorsToFormErrors<T>(errors: z.ZodError<T>): Record<string, string> {
  const formattedErrors: Record<string, string> = {};
  
  errors.errors.forEach((error) => {
    const path = error.path.join('.');
    formattedErrors[path] = error.message;
  });
  
  return formattedErrors;
}

/**
 * Validates form data against a schema and returns formatted errors
 */
export function validateFormData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: zodErrorsToFormErrors(error) };
    }
    throw error;
  }
}
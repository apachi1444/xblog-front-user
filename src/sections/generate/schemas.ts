import { z } from 'zod';

// Step 1: Content Setup Schema
export const step1Schema = z.object({
  contentDescription: z.string().min(1, 'Content description is required'),
  primaryKeyword: z.string().min(1, 'Primary keyword is required'),
  secondaryKeywords: z.array(z.string()).min(1, 'At least one secondary keyword is required'),
  language: z.string().min(1, 'Language is required'),
  targetCountry: z.string().min(1, 'Target country is required'),
  title: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  urlSlug: z.string().optional(),
});

// Step 2: Article Settings Schema
export const step2Schema = z.object({
  articleType: z.string().min(1, 'Article type is required'),
  articleSize: z.string().min(1, 'Article size is required'),
  toneOfVoice: z.string().min(1, 'Tone of voice is required'),
  pointOfView: z.string().min(1, 'Point of view is required'),
  aiContentCleaning: z.string().min(1, 'AI content cleaning is required'),
  imageSettings: z.object({
    quality: z.string().min(1, 'Image quality is required'),
    placement: z.string().min(1, 'Image placement is required'),
    style: z.string().min(1, 'Image style is required'),
    count: z.number().min(1, 'Number of images is required'),
  }),
  linking: z.object({
    internal: z.string().min(1, 'Internal linking is required'),
    external: z.string().min(1, 'External linking is required'),
  }),
});

// Step 3: Content Structure Schema
export const step3Schema = z.object({
  sections: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, 'Section title is required'),
    content: z.string().min(1, 'Section content is required'),
    status: z.string(),
    subsections: z.array(z.object({
      id: z.string(),
      title: z.string().min(1, 'Subsection title is required'),
      content: z.string().min(1, 'Subsection content is required'),
      status: z.string(),
    })).optional(),
  })).min(1, 'At least one section is required'),
});

// Step 4: Publishing Schema
export const step4Schema = z.object({
  publishDate: z.date().optional(),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published']),
});

// Combined schema for the entire form
export const generateArticleSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  step4: step4Schema,
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type Step4FormData = z.infer<typeof step4Schema>;
export type GenerateArticleFormData = z.infer<typeof generateArticleSchema>;
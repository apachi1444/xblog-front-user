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

// Link management schemas
export const linkSchema = z.object({
  id: z.string(),
  url: z.string().url('Please enter a valid URL'),
  anchorText: z.string().min(1, 'Anchor text is required'),
});

// Step 2: Article Settings Schema
export const step2Schema = z.object({
  articleType: z.string().min(1, 'Article type is required'),
  articleSize: z.string().min(1, 'Article size is required'),
  toneOfVoice: z.string().min(1, 'Tone of voice is required'),
  pointOfView: z.string().min(1, 'Point of view is required'),
  plagiaRemoval: z.boolean().default(false),
  // Simplified media settings
  includeImages: z.boolean().default(true),
  includeVideos: z.boolean().default(false),

  internalLinks: z.array(linkSchema).default([]),
  externalLinks: z.array(linkSchema).default([]),
});

// Section content type schemas
export const sectionLinkSchema = z.object({
  text: z.string(),
  url: z.string(),
});

export const sectionImageSchema = z.object({
  url: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

export const sectionFaqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const sectionTableDataSchema = z.object({
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
});

// Enhanced section schema
export const sectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Section title is required'),
  content: z.string().min(1, 'Section content is required'),
  status: z.string(),
  // Additional properties from step four
  type: z.enum(['introduction', 'regular', 'conclusion', 'faq']).optional(),
  contentType: z.enum(['paragraph', 'bullet-list', 'table', 'faq', 'image-gallery']).optional(),
  bulletPoints: z.array(z.string()).optional(),
  internalLinks: z.array(sectionLinkSchema).optional(),
  externalLinks: z.array(sectionLinkSchema).optional(),
  tableData: sectionTableDataSchema.optional(),
  faqItems: z.array(sectionFaqItemSchema).optional(),
  images: z.array(sectionImageSchema).optional(),
  // Keep subsections for backward compatibility
  subsections: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, 'Subsection title is required'),
    content: z.string().min(1, 'Subsection content is required'),
    status: z.string(),
  })).optional(),
});

// Step 3: Content Structure Schema
export const step3Schema = z.object({
  sections: z.array(sectionSchema).min(1, 'At least one section is required'),
});


// Image schema for article-level images
export const articleImageSchema = z.object({
  img_text: z.string(),
  img_url: z.string(),
});

// FAQ schema for article-level FAQs
export const articleFaqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

// Table of Contents schema for article-level TOC
export const articleTocSchema = z.object({
  heading: z.string(),
  subheadings: z.array(z.string()),
});

// Combined schema for the entire form
export const generateArticleSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  images: z.array(articleImageSchema).optional(),
  faq: z.array(articleFaqSchema).optional(),
  toc: z.array(articleTocSchema).optional(),
  generatedHtml: z.string().optional(),
});

// Export types for link management
export type Link = z.infer<typeof linkSchema>;

// Export types for section content
export type SectionLink = z.infer<typeof sectionLinkSchema>;
export type SectionImage = z.infer<typeof sectionImageSchema>;
export type SectionFaqItem = z.infer<typeof sectionFaqItemSchema>;
export type SectionTableData = z.infer<typeof sectionTableDataSchema>;
export type ArticleSection = z.infer<typeof sectionSchema>;

// Export types for article-level content
export type ArticleImage = z.infer<typeof articleImageSchema>;
export type ArticleFaq = z.infer<typeof articleFaqSchema>;
export type ArticleToc = z.infer<typeof articleTocSchema>;

// Export form data types
export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type GenerateArticleFormData = z.infer<typeof generateArticleSchema>;
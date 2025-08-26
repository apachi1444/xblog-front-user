import type { UpdateArticleRequest } from 'src/services/apis/articlesApi';
import type { GenerateArticleFormData } from 'src/sections/generate/schemas';

/**
 * Convert form data to API request format for article updates
 * This utility function extracts the conversion logic from useAutoSaveDraft
 * to be reused across different components
 */
export function convertFormDataToApiRequest(formData: GenerateArticleFormData): UpdateArticleRequest {
  const { step1, step2, status } = formData;

  return {
    // Step 1 fields
    article_title: step1.title || undefined,
    content__description: step1.contentDescription || undefined,
    meta_title: step1.metaTitle || undefined,
    meta_description: step1.metaDescription || undefined,
    url_slug: step1.urlSlug || undefined,
    primary_keyword: step1.primaryKeyword || undefined,
    secondary_keywords: step1.secondaryKeywords?.length ? step1.secondaryKeywords.join(',') : undefined,
    target_country: step1.targetCountry || undefined,
    language: step1.language || undefined,

    // Step 2 fields
    article_type: step2.articleType || undefined,
    article_size: step2.articleSize || undefined,
    tone_of_voice: step2.toneOfVoice || undefined,
    point_of_view: step2.pointOfView || undefined,
    plagiat_removal: step2.plagiaRemoval,
    include_cta: step2.includeCta,
    include_images: step2.includeImages,
    include_videos: step2.includeVideos,
    internal_links: step2.internalLinks?.length ? JSON.stringify(step2.internalLinks) : null,
    external_links: step2.externalLinks?.length ? JSON.stringify(step2.externalLinks) : null,

    // Article status
    status: status || 'draft',
  };
}

/**
 * Create a complete article update request with all form data and specified status
 * This ensures we always update the complete article data, not just individual fields
 */
export function createArticleUpdateRequest(
  formData: GenerateArticleFormData,
  overrideStatus?: 'draft' | 'published' | 'scheduled'
): UpdateArticleRequest {
  const baseRequest = convertFormDataToApiRequest(formData);
  
  // Override status if provided
  if (overrideStatus) {
    baseRequest.status = overrideStatus;
  }
  
  return baseRequest;
}

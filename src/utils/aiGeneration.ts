import axios from 'axios';

// API key for Gemini API
const API_KEY = 'AIzaSyBsP8gk4n7fEhqNdtSQ7B2laq0Rb5r9dE4';

// Base URL for Gemini API
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Interface for Gemini API request
 */
interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
}

/**
 * Interface for Gemini API response
 */
interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
      role?: string;
    };
    finishReason?: string;
    avgLogprobs?: number;
  }[];
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
    promptTokensDetails: {
      modality: string;
      tokenCount: number;
    }[];
    candidatesTokensDetails: {
      modality: string;
      tokenCount: number;
    }[];
  };
  modelVersion?: string;
}

/**
 * Generate a title using Gemini API
 * @param primaryKeyword - The primary keyword for the article
 * @param targetCountry - The target country for the article
 * @param targetLanguage - The target language for the article
 * @returns The generated title
 */
export const generateTitle = async (
  primaryKeyword: string,
  targetCountry: string,
  targetLanguage: string
): Promise<string> => {
  try {
    const prompt = `You are given:
- A primary keyword: ${primaryKeyword}
- A target country: ${targetCountry}
- A target language: ${targetLanguage}

Generate one compelling, SEO-optimized article title based on the primary keyword.

The title must:
- Include the primary keyword
- Be 5–12 words long
- Use power words to increase engagement
- Avoid clickbait and quotation marks
- Be written in the target language
- Be relevant to readers in the specified country

Return only one title as a plain string, without any additional text or formatting.`;

    const requestData: GeminiRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    const response = await axios.post<GeminiResponse>(
      `${GEMINI_API_URL}?key=${API_KEY}`,
      requestData
    );

    // Log the response for debugging (remove in production)
    console.log('Gemini API response:', JSON.stringify(response.data, null, 2));

    // Extract the generated title from the response
    const generatedTitle = response.data.candidates[0]?.content.parts[0]?.text.trim();

    if (!generatedTitle) {
      throw new Error('No title was generated');
    }

    // Remove any trailing newlines that might be in the response
    return generatedTitle.replace(/\n+$/, '');
  } catch (error) {
    console.error('Error generating title:', error);
    throw error;
  }
};

/**
 * Generate meta information using Gemini API
 * @param primaryKeyword - The primary keyword for the article
 * @param targetCountry - The target country for the article
 * @param targetLanguage - The target language for the article
 * @param contentDescription - The content description
 * @returns The generated meta information (title, description, slug)
 */
export const generateMeta = async (
  primaryKeyword: string,
  targetCountry: string,
  targetLanguage: string,
  contentDescription: string
): Promise<{ metaTitle: string; metaDescription: string; urlSlug: string }> => {
  try {
    const prompt = `You are given:
- A primary keyword: ${primaryKeyword}
- A target country: ${targetCountry}
- A target language: ${targetLanguage}
- A content description: ${contentDescription}

Generate SEO-optimized meta information for an article:

1. Meta Title:
   - Include the primary keyword
   - 50-60 characters long
   - Compelling and descriptive
   - Written in the target language

2. Meta Description:
   - Include the primary keyword
   - 120-160 characters long
   - Summarize the content and entice clicks
   - Written in the target language

3. URL Slug:
   - Include the primary keyword
   - Use hyphens to separate words
   - Keep it short and descriptive
   - Use only lowercase letters, numbers, and hyphens

Return the results in this exact format:
META_TITLE: [your generated meta title]
META_DESCRIPTION: [your generated meta description]
URL_SLUG: [your generated URL slug]`;

    const requestData: GeminiRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    const response = await axios.post<GeminiResponse>(
      `${GEMINI_API_URL}?key=${API_KEY}`,
      requestData
    );

    // Log the response for debugging (remove in production)
    console.log('Gemini API response (meta):', JSON.stringify(response.data, null, 2));

    // Extract the generated meta information from the response
    const generatedText = response.data.candidates[0]?.content.parts[0]?.text.trim();

    if (!generatedText) {
      throw new Error('No meta information was generated');
    }

    // Parse the response to extract meta title, description, and slug
    const metaTitleMatch = generatedText.match(/META_TITLE:\s*(.*)/i);
    const metaDescriptionMatch = generatedText.match(/META_DESCRIPTION:\s*(.*)/i);
    const urlSlugMatch = generatedText.match(/URL_SLUG:\s*(.*)/i);

    const metaTitle = metaTitleMatch?.[1]?.trim() || `${primaryKeyword} - Complete Guide ${new Date().getFullYear()}`;
    const metaDescription = metaDescriptionMatch?.[1]?.trim() ||
      `Learn everything about ${primaryKeyword}. Comprehensive guide with tips, examples, and best practices for ${targetCountry}.`;
    const urlSlug = urlSlugMatch?.[1]?.trim() || primaryKeyword.toLowerCase().replace(/\s+/g, '-');

    return {
      metaTitle,
      metaDescription,
      urlSlug
    };
  } catch (error) {
    console.error('Error generating meta information:', error);
    throw error;
  }
};

/**
 * Generate secondary keywords using Gemini API
 * @param primaryKeyword - The primary keyword for the article
 * @param targetCountry - The target country for the article
 * @param targetLanguage - The target language for the article
 * @returns Array of generated secondary keywords
 */
export const generateSecondaryKeywords = async (
  primaryKeyword: string,
  targetCountry: string,
  targetLanguage: string
): Promise<string[]> => {
  try {
    const prompt = `You are given:
- A primary keyword: ${primaryKeyword}
- A target country: ${targetCountry}
- A target language: ${targetLanguage}

Generate 8-10 SEO-optimized secondary keywords related to the primary keyword.

The secondary keywords must:
- Be relevant to the primary keyword
- Be commonly searched terms
- Be specific to the target country and language
- Include a mix of short-tail and long-tail keywords
- Not repeat the primary keyword exactly

Return only the keywords as a comma-separated list, without any additional text, numbering, or formatting.`;

    const requestData: GeminiRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    const response = await axios.post<GeminiResponse>(
      `${GEMINI_API_URL}?key=${API_KEY}`,
      requestData
    );

    // Log the response for debugging (remove in production)
    console.log('Gemini API response (keywords):', JSON.stringify(response.data, null, 2));

    // Extract the generated keywords from the response
    const generatedText = response.data.candidates[0]?.content.parts[0]?.text.trim();

    if (!generatedText) {
      throw new Error('No secondary keywords were generated');
    }

    // Split the comma-separated list into an array of keywords
    const keywords = generatedText
      .split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);

    if (keywords.length === 0) {
      throw new Error('No valid secondary keywords were generated');
    }

    return keywords;
  } catch (error) {
    console.error('Error generating secondary keywords:', error);
    throw error;
  }
};

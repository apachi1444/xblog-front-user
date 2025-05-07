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

/**
 * Interface for a generated section
 */
interface GeneratedSection {
  id: string;
  title: string;
  content?: string;
  contentType?: string;
  bulletPoints?: string[];
  internalLinks?: { text: string; url: string }[];
  externalLinks?: { text: string; url: string }[];
  tableData?: { headers: string[]; rows: string[][] };
  faqItems?: { question: string; answer: string }[];
  images?: { url: string; alt: string; caption?: string }[];
  subsections?: GeneratedSection[];
  type?: 'introduction' | 'regular' | 'conclusion' | 'faq';
}

/**
 * Interface for the response from the section generation
 */
interface GenerateSectionsResponse {
  sections: GeneratedSection[];
  score?: number;
  timestamp: string;
  sectionTitles: string[];
}

/**
 * Generate article sections using Gemini API
 * @param title - The title of the article
 * @param primaryKeyword - The primary keyword for the article
 * @param secondaryKeywords - Optional array of secondary keywords
 * @param targetLanguage - The target language for the article
 * @param contentType - Optional content type (e.g., 'blog', 'guide', 'tutorial')
 * @param articleSize - Optional article size (e.g., 'small', 'medium', 'large')
 * @param toneOfVoice - Optional tone of voice (e.g., 'professional', 'casual', 'authoritative')
 * @param targetCountry - Optional target country for localization
 * @returns Promise with generated sections
 */
export const generateSections = async (
  title: string,
  primaryKeyword: string,
  secondaryKeywords: string[] = [],
  targetLanguage: string = 'en',
  contentType: string = 'blog',
  articleSize: string = 'medium',
  toneOfVoice: string = 'professional',
  targetCountry: string = 'United States'
): Promise<GenerateSectionsResponse> => {
  try {
    // Format secondary keywords for the prompt
    const secondaryKeywordsText = secondaryKeywords.length > 0
      ? `- Secondary keywords: ${secondaryKeywords.join(', ')}`
      : '';

    const prompt = `You are given:
- Article title: ${title}
- Primary keyword: ${primaryKeyword}
${secondaryKeywordsText}
- Target language: ${targetLanguage}
- Target country: ${targetCountry}
- Content type: ${contentType}
- Article size: ${articleSize}
- Tone of voice: ${toneOfVoice}

Generate a Table of Contents (TOC) for a well-structured, SEO-optimized article.

🔸 The TOC must be hierarchical, clear, and keyword-focused, with each section designed to support the article's semantic SEO structure.

🔸 Each section in the TOC should be accompanied by a specified content type, selected from the following:
- H2 + Paragraph
- H2 + Bullet/Numbered List
- H2 + Table
- H2 + Internal Link(s)
- H2 + External Link(s)
- H2 + Image (via image URL)
- H2 + FAQ Block
- H2 + Backlink Context
- H2 + Introduction/Conclusion

🔹 Ensure:
- Section order follows a logical, progressive flow
- Each section builds on the previous one
- TOC includes 6–10 well-distributed, valuable sections

🔸 Mark content types explicitly in the JSON response for each section.

The article MUST follow these SEO best practices:
- Start with an engaging introduction that hooks the reader and includes the primary keyword in the first paragraph
- Include a section addressing common questions or pain points related to the topic
- Incorporate a section with practical tips, examples, or case studies
- End with a strong conclusion that summarizes key points and includes a call to action
- Follow a logical structure with proper hierarchy (H1 for title, H2 for main sections)
- Include the primary keyword in at least 2-3 section titles naturally
- Distribute secondary keywords strategically across different sections
- Ensure section titles are compelling and click-worthy while remaining informative
- Keep section titles under 60 characters for better readability
- Include at least one section that addresses current trends or future outlook
- Ensure the content structure supports featured snippet optimization

The article should also:
- Follow a logical flow that guides the reader through the topic
- Balance informational and actionable content
- Be written in the target language with appropriate localization for the target country
- Be appropriate for the specified content type and size
- Support easy scanning with clear, descriptive section titles
- Use the specified tone of voice consistently throughout

Return the results in this JSON format:
{
  "sections": [
    {
      "id": "section-1",
      "title": "Introduction to [Topic]",
      "type": "introduction",
      "contentType": "H2 + Introduction/Conclusion",
      "content": "Detailed introduction content with primary keyword naturally included...",
      "internalLinks": [
        {"text": "anchor text", "url": "/internal-page-1"}
      ],
      "externalLinks": [
        {"text": "source name", "url": "https://example.com/source"}
      ],
      "images": [
        {"url": "https://example.com/sample-image.jpg", "alt": "Descriptive alt text", "caption": "Optional image caption"}
      ]
    },
    {
      "id": "section-2",
      "title": "Main Section Title",
      "type": "regular",
      "contentType": "H2 + Bullet/Numbered List",
      "content": "Detailed section content...",
      "bulletPoints": [
        "First important point with keyword",
        "Second important point with another keyword",
        "Third important point with supporting information"
      ]
    },
    {
      "id": "section-3",
      "title": "Comparison Section",
      "type": "regular",
      "contentType": "H2 + Table",
      "content": "Introductory content for the comparison...",
      "tableData": {
        "headers": ["Feature", "Option A", "Option B", "Option C"],
        "rows": [
          ["Price", "$10", "$20", "$30"],
          ["Quality", "Good", "Better", "Best"],
          ["Support", "Limited", "Standard", "Premium"]
        ]
      }
    },
    {
      "id": "section-4",
      "title": "Frequently Asked Questions",
      "type": "faq",
      "contentType": "H2 + FAQ Block",
      "content": "Introduction to the FAQ section...",
      "faqItems": [
        {"question": "What is [primary keyword]?", "answer": "Detailed answer to the question..."},
        {"question": "How does [primary keyword] work?", "answer": "Explanation of how it works..."},
        {"question": "Why is [primary keyword] important?", "answer": "Explanation of importance..."}
      ]
    },
    {
      "id": "section-5",
      "title": "Conclusion",
      "type": "conclusion",
      "contentType": "H2 + Introduction/Conclusion",
      "content": "Summary of key points and call to action..."
    }
  ],
  "timestamp": "${new Date().toISOString()}",
  "sectionTitles": ["Introduction to [Topic] (Type: H2 + Introduction/Conclusion)", "Main Section Title (Type: H2 + Bullet/Numbered List)", "Comparison Section (Type: H2 + Table)", "Frequently Asked Questions (Type: H2 + FAQ Block)", "Conclusion (Type: H2 + Introduction/Conclusion)"]
}

Ensure the JSON is valid and properly formatted. Include at least 5-7 sections for a comprehensive article.`;

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
    console.log('Gemini API response (sections):', JSON.stringify(response.data, null, 2));

    // Extract the generated sections from the response
    const generatedText = response.data.candidates[0]?.content.parts[0]?.text.trim();

    if (!generatedText) {
      throw new Error('No sections were generated');
    }

    // Extract the JSON part from the response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Could not extract valid JSON from the response');
    }

    const jsonText = jsonMatch[0];

    // Parse the JSON
    const parsedData = JSON.parse(jsonText);

    // Validate the structure
    if (!parsedData.sections || !Array.isArray(parsedData.sections)) {
      throw new Error('Invalid sections data structure');
    }

    // Ensure each section has an id, title, and content
    const validatedSections = parsedData.sections.map((section: any, index: number) => ({
      id: section.id || `section-${index + 1}`,
      title: section.title || `Section ${index + 1}`,
      content: section.content || `Content for section ${index + 1}`
    }));

    // Calculate a more balanced score based on the number of sections and keywords included
    // Base score calculation
    const baseScore = 50; // Start with a lower base score

    // Section count score (max 20 points)
    const sectionCountScore = Math.min(20, validatedSections.length * 2);

    // Primary keyword usage score (max 15 points)
    const keywordCount = validatedSections.filter(
      (s: GeneratedSection) => s.title.toLowerCase().includes(primaryKeyword.toLowerCase())
    ).length;
    const keywordScore = Math.min(15, keywordCount * 5);

    // Content type diversity score (max 15 points)
    const uniqueContentTypes = new Set(
      validatedSections
        .filter((s: GeneratedSection) => s.contentType)
        .map((s: GeneratedSection) => s.contentType)
    ).size;
    const contentTypeDiversityScore = Math.min(15, uniqueContentTypes * 3);

    // Calculate total score and ensure it never exceeds 100
    const score = Math.min(
      100,
      baseScore + sectionCountScore + keywordScore + contentTypeDiversityScore
    );

    // Extract section titles for easy reference
    const sectionTitles = validatedSections.map((section: GeneratedSection) => section.title);

    // Generate timestamp
    const timestamp = new Date().toISOString();

    return {
      sections: validatedSections,
      score,
      timestamp,
      sectionTitles
    };
  } catch (error) {
    console.error('Error generating sections:', error);

    // Return a fallback response with basic sections
    const fallbackSections = [
      {
        id: 'section-1',
        title: `Introduction to ${primaryKeyword}`,
        content: `This section provides an overview of ${primaryKeyword} and why it's important.`
      },
      {
        id: 'section-2',
        title: `Understanding ${primaryKeyword} Fundamentals`,
        content: `Learn the core concepts and principles behind ${primaryKeyword}.`
      },
      {
        id: 'section-3',
        title: `Benefits of ${primaryKeyword}`,
        content: `Discover the key advantages and benefits of implementing ${primaryKeyword} in your strategy.`
      },
      {
        id: 'section-4',
        title: `Best Practices for ${primaryKeyword}`,
        content: `Follow these industry-proven best practices to maximize your success with ${primaryKeyword}.`
      },
      {
        id: 'section-5',
        title: `Conclusion: Next Steps with ${primaryKeyword}`,
        content: `Summarize key points and provide next steps for advancing your ${primaryKeyword} implementation.`
      }
    ];

    // Extract section titles for fallback
    const fallbackSectionTitles = fallbackSections.map((section: any) => section.title);

    // Generate timestamp
    const timestamp = new Date().toISOString();

    // Calculate a consistent fallback score using the same logic as the main score
    const baseScore = 50;
    const sectionCountScore = Math.min(20, fallbackSections.length * 2);
    const keywordCount = fallbackSections.filter(
      (s: any) => s.title.toLowerCase().includes(primaryKeyword.toLowerCase())
    ).length;
    const keywordScore = Math.min(15, keywordCount * 5);

    // Assume some content type diversity in fallback
    const contentTypeDiversityScore = 10;

    // Calculate total fallback score and ensure it never exceeds 100
    const fallbackScore = Math.min(
      100,
      baseScore + sectionCountScore + keywordScore + contentTypeDiversityScore
    );

    return {
      sections: fallbackSections,
      score: fallbackScore,
      timestamp,
      sectionTitles: fallbackSectionTitles
    };
  }
};

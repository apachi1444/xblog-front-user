import type { ArticleFaq, ArticleImage } from "src/sections/generate/schemas";

export interface KeywordData {
    primary: string;
    secondary?: string[]; // Optional secondary keywords
  }
  
  export interface MetaData {
    title: string;
    description: string;
    url: string;
  }
  
  export interface SectionContent {
    text?: string;
    description?: string;
    header?: string;
    title?: string;
    images?: string[];
    videos?: string[];
    links?: { label: string; url: string }[];
  }
  
  export interface TableOfContentsItem {
    title: string;
    sections: SectionContent[];
  }
  
  // Real API structure for articles - Updated to match new API response
  export interface Article {
    id: number;
    target_country?: string;
    language?: string;
    primary_keyword?: string;
    secondary_keywords?: string;
    content_description?: string;
    article_title?: string;
    meta_title?: string;
    meta_description?: string;
    url_slug?: string;
    article_type?: string;
    article_size?: string;
    tone_of_voice?: string;
    point_of_view?: string;
    plagiat_removal?: boolean;
    include_images?: boolean;
    include_videos?: boolean;
    internal_links?: string;
    external_links?: string;
    content?: string;
    sections?: string; // JSON string containing ArticleSection[]
    toc?: string | null; // JSON string containing table of contents array
    images?: string | null; // JSON string containing images array
    faq?: string | null; // JSON string containing FAQ array
    featured_media?: string;
    status: 'draft' | 'published' | 'scheduled';
    platform?: string;
    scheduled_publish_date?: string;
    created_at: string;
    updated_at?: string;
    template_name?: string;
    // Legacy fields for backward compatibility
    title?: string; // Maps to article_title
  }
  
  export interface ArticleContent {
    contextDescription: string;
    tableOfContents: TableOfContentsItem[];
    images: string[];
    videos: string | null;
    generatingSection: string | null;
  }
  
  export interface ArticleData {
    title: string;
    contextDescription: string;
    keywords: KeywordData;
    meta: MetaData;
    tableOfContents: TableOfContentsItem[];
    images: string[];
    videos: string | null;
    generatingSection: string | null;
  }

  // Helper types for array data conversion
  export interface ArticleArrayData {
    toc: TableOfContentsItem[];
    images: ArticleImage[];
    faq: ArticleFaq[];
  }
  
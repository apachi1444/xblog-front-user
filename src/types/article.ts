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
  
  // Real API structure for articles
  export interface Article {
    id: number;
    title: string;
    featured_media: string;
    created_at: string;
    status: 'draft' | 'published' | 'scheduled';
    platform: string;
    content: string;
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
  
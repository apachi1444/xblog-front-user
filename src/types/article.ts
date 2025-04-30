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
  
  // New  interface for overview information
  export interface Article {
    id: string;
    title: string;
    description: string;
    slug: string;
    coverImage?: string;
    author?: {
      id: string;
      name: string;
      avatar?: string;
    };
    storeId?: string;
    status: 'draft' | 'published' | 'scheduled';
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    scheduledAt?: string;
    keywords?: KeywordData;
    meta?: MetaData;
    content?: ArticleContent;
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
  
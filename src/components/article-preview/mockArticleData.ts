import type { ArticleInfo, ArticleSection } from './ArticlePreviewModal';

/**
 * Mock article data with various section types for preview demonstration
 */

export const mockArticleInfo: ArticleInfo = {
  title: 'The Complete Guide to Modern Web Development in 2023',
  metaTitle: 'Modern Web Development Guide 2023: Frameworks, Tools & Best Practices',
  metaDescription: 'Discover the latest frameworks, tools, and best practices for modern web development in 2023. Learn about React, Vue, Next.js, and more!',
  primaryKeyword: 'modern web development',
  secondaryKeywords: ['frontend frameworks', 'javascript', 'react', 'vue', 'next.js', 'web performance', 'responsive design'],
  language: 'en-US',
  targetCountry: 'US',
  createdAt: new Date().toISOString(),
  featuredImage: {
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    alt: 'Modern web development workspace with laptop showing code',
    caption: 'The modern web developer\'s toolkit continues to evolve with new frameworks and tools'
  }
};

export const mockArticleSections: ArticleSection[] = [];

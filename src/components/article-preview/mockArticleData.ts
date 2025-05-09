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

export const mockArticleSections: ArticleSection[] = [
  // Table of Contents Section
  {
    id: 'toc-section',
    title: 'Table of Contents',
    type: 'toc',
    contentType: 'toc',
    content: 'Navigate through this comprehensive guide using the table of contents below.',
    bulletPoints: [
      'Introduction to Modern Web Development',
      'Frontend Frameworks in 2023',
      'Backend Technologies and APIs',
      'Performance Optimization Techniques',
      'Responsive Design Principles',
      'Testing and Quality Assurance',
      'Deployment and DevOps',
      'Frequently Asked Questions'
    ]
  },
  
  // Introduction Section
  {
    id: 'introduction-section',
    title: 'Introduction to Modern Web Development',
    type: 'introduction',
    contentType: 'paragraph',
    content: 'Web development has evolved dramatically over the past decade, with new frameworks, tools, and methodologies emerging at a rapid pace. In 2023, developers have more options than ever before, but this abundance of choice can also lead to decision paralysis. This comprehensive guide aims to navigate the complex landscape of modern web development, helping you make informed decisions about which technologies to adopt for your projects.\n\nWhether you\'re a seasoned developer looking to stay current with the latest trends or a newcomer trying to chart a learning path, this article will provide valuable insights into the state of web development in 2023.'
  },
  
  // Regular Section with Bullet Points
  {
    id: 'frontend-frameworks',
    title: 'Frontend Frameworks in 2023',
    type: 'regular',
    contentType: 'bullet-list',
    content: 'The frontend development landscape continues to be dominated by a few major frameworks, each with its own philosophy and approach. Here\'s an overview of the most popular options in 2023:',
    bulletPoints: [
      'React: Still the market leader, React continues to evolve with features like Server Components and the new React compiler.',
      'Vue.js: Version 3 has matured with the Composition API offering a more flexible alternative to the Options API.',
      'Angular: Now on version 16, Angular remains popular for enterprise applications with its comprehensive feature set.',
      'Svelte: Gaining significant traction due to its compile-time approach and minimal runtime overhead.',
      'Next.js: The React framework has become the go-to solution for server-side rendering and static site generation.',
      'Astro: A newer entrant focused on content-driven websites with a "ship less JavaScript" philosophy.'
    ]
  },
  
  // Section with Table
  {
    id: 'framework-comparison',
    title: 'Framework Comparison',
    type: 'regular',
    contentType: 'table',
    content: 'When choosing a framework, it\'s important to consider various factors such as performance, learning curve, and community support. The following table provides a comparison of the major frameworks:',
    tableData: {
      headers: ['Framework', 'GitHub Stars', 'Bundle Size', 'Learning Curve', 'Community Support', 'Best For'],
      rows: [
        ['React', '200k+', '42.2kB', 'Moderate', 'Excellent', 'Large applications, SPAs'],
        ['Vue.js', '200k+', '33.2kB', 'Easy', 'Very Good', 'Progressive enhancement, SPAs'],
        ['Angular', '85k+', '143kB', 'Steep', 'Good', 'Enterprise applications'],
        ['Svelte', '65k+', '1.8kB', 'Easy', 'Growing', 'Performance-critical apps'],
        ['Next.js', '100k+', 'Varies', 'Moderate', 'Very Good', 'SEO-focused React apps']
      ]
    }
  },
  
  // Section with Images
  {
    id: 'backend-technologies',
    title: 'Backend Technologies and APIs',
    type: 'regular',
    contentType: 'image-gallery',
    content: 'The backend landscape has seen a shift towards serverless architectures and API-first development. RESTful APIs remain popular, but GraphQL continues to gain adoption for its flexibility and efficiency in data fetching.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
        alt: 'Server room with modern equipment',
        caption: 'Modern backend infrastructure often leverages cloud services'
      },
      {
        url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
        alt: 'Developer working with API documentation',
        caption: 'API-first development has become a standard approach'
      }
    ]
  },
  
  // Section with Links
  {
    id: 'performance-optimization',
    title: 'Performance Optimization Techniques',
    type: 'regular',
    contentType: 'paragraph',
    content: 'Web performance has become increasingly important, both for user experience and SEO. Modern web applications need to be fast, responsive, and efficient. Here are some key performance optimization techniques to consider:',
    bulletPoints: [
      'Code splitting and lazy loading',
      'Image optimization and next-gen formats',
      'Efficient caching strategies',
      'Minimizing main thread work',
      'Reducing JavaScript bundle sizes'
    ],
    internalLinks: [
      {
        text: 'Learn more about responsive design',
        url: '#responsive-design-principles'
      }
    ],
    externalLinks: [
      {
        text: 'Web Vitals documentation',
        url: 'https://web.dev/vitals/'
      },
      {
        text: 'PageSpeed Insights',
        url: 'https://pagespeed.web.dev/'
      }
    ]
  },
  
  // FAQ Section
  {
    id: 'faq-section',
    title: 'Frequently Asked Questions',
    type: 'faq',
    contentType: 'faq',
    content: 'Here are answers to some common questions about modern web development:',
    faqItems: [
      {
        question: 'Which frontend framework should I learn in 2023?',
        answer: 'React remains the most in-demand framework in the job market, making it a solid choice for career prospects. However, Vue.js is often easier to learn for beginners. If you\'re just starting, consider learning the fundamentals of JavaScript deeply before committing to a framework.'
      },
      {
        question: 'Is server-side rendering necessary for all web applications?',
        answer: 'No, server-side rendering (SSR) is particularly beneficial for content-heavy sites that need good SEO and fast initial load times. For web applications where most content is behind authentication or generated client-side, SSR may not provide significant benefits relative to its complexity.'
      },
      {
        question: 'How important is TypeScript for modern web development?',
        answer: 'TypeScript has become increasingly important in the web development ecosystem. Many major frameworks and libraries now use TypeScript by default, and it provides significant benefits for code quality, maintainability, and developer experience, especially in larger teams and projects.'
      },
      {
        question: 'What are Web Vitals and why do they matter?',
        answer: 'Core Web Vitals are a set of metrics that measure real-world user experience for loading performance, interactivity, and visual stability. They matter because they directly impact user experience and are used by Google as ranking factors for search results.'
      }
    ]
  },
  
  // Conclusion Section
  {
    id: 'conclusion-section',
    title: 'Conclusion',
    type: 'conclusion',
    contentType: 'paragraph',
    content: 'Modern web development continues to evolve at a rapid pace, with new tools and techniques emerging regularly. While this can be overwhelming, focusing on fundamentals and gradually adopting new technologies as needed will help you stay effective as a developer.\n\nRemember that no single technology stack is perfect for all use cases. The best approach is to understand the strengths and weaknesses of different options and choose the right tools for your specific project requirements and team capabilities.\n\nBy staying curious, continuously learning, and focusing on delivering value to users, you\'ll be well-positioned to thrive in the dynamic field of web development in 2023 and beyond.'
  }
];

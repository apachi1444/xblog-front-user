// Unified template definitions that can be used across the application
export interface Template {
  id: string;
  name: string;
  title: string;
  description: string;
  icon?: string;
  category: string;
  popular?: boolean;
  isNew?: boolean;
  locked?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  estimatedTime?: string;
  previewContent?: string;
  color?: string;
  gradient?: string;
  bestFor?: string;
  structure?: {
    sections: Array<{
      title: string;
      description: string;
    }>;
    seoTips: string[];
  };
}

// Template categories
export interface TemplateCategory {
  id: string;
  name: string;
  icon: string;
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: 'blog',
    name: 'Blog Posts',
    icon: 'mdi:text-box-multiple-outline',
  },
  {
    id: 'howto',
    name: 'How-To Guides',
    icon: 'mdi:book-open-page-variant-outline',
  },
  {
    id: 'listicle',
    name: 'Listicles',
    icon: 'mdi:format-list-numbered',
  },
  {
    id: 'product',
    name: 'Product Reviews',
    icon: 'mdi:star-outline',
  },
  {
    id: 'comparison',
    name: 'Comparisons',
    icon: 'mdi:compare',
  },
  {
    id: 'case',
    name: 'Case Studies',
    icon: 'mdi:file-document-outline',
  },
];

// Unified template list combining both article templates and design templates
export const UNIFIED_TEMPLATES: Template[] = [
  // Design Templates (from TemplateSelectionModal)
  {
    id: 'template1',
    name: 'Purple Pulse',
    title: 'Purple Pulse Design',
    description: 'A sleek, modern accordion style with a purple theme, interactive toggles, and clean spacing.',
    icon: '🔮',
    category: 'design',
    popular: true,
    isNew: false,
    locked: false,
    color: '#9c27b0',
    gradient: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)',
    bestFor: 'tech blogs, SaaS platforms, digital services',
  },
  {
    id: 'template2',
    name: 'Blue Breeze',
    title: 'Blue Breeze Design',
    description: 'A calming, professional FAQ with soft blue accents, minimalist borders, and smooth transitions.',
    icon: '🔵',
    category: 'design',
    popular: true,
    isNew: false,
    locked: false,
    color: '#2196f3',
    gradient: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
    bestFor: 'corporate websites, finance, healthcare, or legal industries',
  },
  {
    id: 'template3',
    name: 'Green Garden',
    title: 'Green Garden Design',
    description: 'A fresh, nature-inspired design with green accents and organic shapes.',
    icon: '🌿',
    category: 'design',
    popular: false,
    isNew: true,
    locked: false,
    color: '#4caf50',
    gradient: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
    bestFor: 'environmental blogs, health & wellness, organic products',
  },
  {
    id: 'template4',
    name: 'Orange Sunset',
    title: 'Orange Sunset Design',
    description: 'A warm, energetic design with orange gradients and dynamic layouts.',
    icon: '🌅',
    category: 'design',
    popular: false,
    isNew: false,
    locked: false,
    color: '#ff9800',
    gradient: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
    bestFor: 'creative agencies, lifestyle blogs, entertainment',
  },
  {
    id: 'template5',
    name: 'Crystal Timeline',
    title: 'Crystal Timeline Design',
    description: 'A unique vertical timeline layout with left-aligned bullets and rich visual hierarchy.',
    icon: '💎',
    category: 'design',
    popular: false,
    isNew: false,
    locked: false,
    color: '#4caf50',
    gradient: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
    bestFor: 'storytelling, process documentation, step-by-step guides',
  },

  // Content Templates (from template-data.ts)
  {
    id: 'ultimate-guide',
    name: 'Ultimate Guide',
    title: 'Ultimate Guide Template',
    description: 'Comprehensive, in-depth guide covering all aspects of a topic with expert insights',
    icon: 'mdi:book-open-variant',
    category: 'howto',
    popular: true,
    isNew: false,
    locked: false,
    difficulty: 'medium',
    estimatedTime: '15-20 min',
    structure: {
      sections: [
        {
          title: 'Introduction',
          description: 'Hook readers with a compelling statistic or question, establish your authority, and outline what they ll learn',
        },
        {
          title: 'What is [Topic]?',
          description: 'Define the topic clearly and explain its importance',
        },
        {
          title: 'Why [Topic] Matters',
          description: 'Explain the benefits and importance of the topic',
        },
        {
          title: 'Key Components/Elements of [Topic]',
          description: 'Break down the main elements that readers need to understand',
        },
        {
          title: 'How to Implement [Topic] - Step by Step',
          description: 'Detailed, actionable steps with examples',
        },
        {
          title: 'Common Mistakes to Avoid',
          description: 'Pitfalls and how to navigate around them',
        },
        {
          title: 'Tools and Resources',
          description: 'Recommended tools, software, or resources',
        },
        {
          title: 'Expert Tips',
          description: 'Advanced strategies from industry experts',
        },
        {
          title: 'Case Studies/Examples',
          description: 'Real-world examples showing successful implementation',
        },
        {
          title: 'Conclusion',
          description: 'Summarize key points and provide next steps',
        },
      ],
      seoTips: [
        'Include your primary keyword in the title, first paragraph, and at least one H2',
        'Add 3-5 related keywords throughout the content naturally',
        'Aim for 2000+ words for comprehensive guides',
        'Include a table of contents with jump links',
        'Use descriptive alt text for all images',
      ],
    },
  },
  {
    id: 'listicle-template',
    name: 'Top 10 List',
    title: 'Top 10 List Template',
    description: 'Engaging, scannable list-based article format that drives high engagement and shares',
    icon: 'mdi:format-list-numbered',
    category: 'listicle',
    popular: true,
    isNew: false,
    locked: false,
    difficulty: 'easy',
    estimatedTime: '10-15 min',
    structure: {
      sections: [
        {
          title: 'Introduction',
          description: 'Explain why this list matters and what criteria you used for selection',
        },
        {
          title: 'Item #1',
          description: 'Start with the most impressive item to hook readers',
        },
        {
          title: 'Item #2',
          description: 'Continue with detailed explanation and benefits',
        },
        {
          title: 'Items #3-9',
          description: 'Follow the same structure for remaining items',
        },
        {
          title: 'Item #10',
          description: 'End with a strong recommendation',
        },
        {
          title: 'Honorable Mentions',
          description: 'Additional options that didn t make the top 10',
        },
        {
          title: 'How to Choose',
          description: 'Criteria for readers to make their own selection',
        },
        {
          title: 'Conclusion',
          description: 'Summarize key takeaways and provide a final recommendation',
        },
      ],
      seoTips: [
        'Include the number in your title (e.g., "10 Best...")',
        'Use H2 headings for each list item',
        'Include a comparison table for easy scanning',
        'Add internal links to related content',
        'Use bullet points within list items for better readability',
      ],
    },
  },
  {
    id: 'product-review',
    name: 'Product Review',
    title: 'Product Review Template',
    description: 'Balanced, thorough product evaluation that builds trust and drives conversions',
    icon: 'mdi:star-check',
    category: 'product',
    popular: false,
    isNew: true,
    locked: false,
    difficulty: 'medium',
    estimatedTime: '12-18 min',
    structure: {
      sections: [
        {
          title: 'Introduction',
          description: 'Brief overview of the product and why it matters',
        },
        {
          title: 'Quick Verdict',
          description: 'Summary for readers who want the bottom line fast',
        },
        {
          title: 'Who Should Buy This',
          description: 'Ideal user profile and use cases',
        },
        {
          title: 'Key Specifications',
          description: 'Technical details and features in table format',
        },
        {
          title: 'Design and Build Quality',
          description: 'Analysis of physical aspects and durability',
        },
        {
          title: 'Performance and Functionality',
          description: 'How well it performs its core functions',
        },
        {
          title: 'User Experience',
          description: 'Ease of use and learning curve',
        },
        {
          title: 'Pros and Cons',
          description: 'Balanced list of advantages and disadvantages',
        },
        {
          title: 'Value for Money',
          description: 'Price analysis compared to alternatives',
        },
        {
          title: 'Alternatives to Consider',
          description: 'Competing products for different needs/budgets',
        },
        {
          title: 'Conclusion',
          description: 'Final verdict and recommendations',
        },
      ],
      seoTips: [
        'Include product name and "review" in the title',
        'Add schema markup for review content',
        'Include pricing information and where to buy',
        'Use comparison tables with competing products',
        'Include original product photos with descriptive alt text',
      ],
    },
  },
  {
    id: 'how-to-guide',
    name: 'Step-by-Step Tutorial',
    title: 'Step-by-Step Tutorial',
    description: 'Clear, actionable instructions that solve specific problems and build authority',
    icon: 'mdi:clipboard-text-outline',
    category: 'howto',
    popular: false,
    isNew: false,
    locked: false,
    difficulty: 'easy',
    estimatedTime: '8-12 min',
    structure: {
      sections: [
        {
          title: 'Introduction',
          description: 'Define the problem and what readers will achieve',
        },
        {
          title: 'What You ll Need',
          description: 'Required tools, materials, or prerequisites',
        },
        {
          title: 'Step 1: [First Action]',
          description: 'Clear instructions with images for the first step',
        },
        {
          title: 'Step 2: [Second Action]',
          description: 'Detailed explanation of the second step',
        },
        {
          title: 'Steps 3-X: [Remaining Actions]',
          description: 'Continue with numbered steps in logical order',
        },
        {
          title: 'Troubleshooting Common Issues',
          description: 'Solutions to problems readers might encounter',
        },
        {
          title: 'Tips for Success',
          description: 'Expert advice to improve results',
        },
        {
          title: 'Conclusion',
          description: 'Recap of what was learned and next steps',
        },
      ],
      seoTips: [
        'Use "How to" in your title',
        'Include step-by-step schema markup',
        'Add process photos or screenshots for each step',
        'Use numbered lists for steps',
        'Include estimated time to complete in the introduction',
      ],
    },
  },
];

// Utility functions
export const getTemplateById = (id: string): Template | undefined => UNIFIED_TEMPLATES.find(template => template.id === id);

export const getTemplatesByCategory = (category: string): Template[] => {
  if (category === 'all') return UNIFIED_TEMPLATES;
  return UNIFIED_TEMPLATES.filter(template => template.category === category);
};

export const getPopularTemplates = (): Template[] => UNIFIED_TEMPLATES.filter(template => template.popular);

export const getNewTemplates = (): Template[] => UNIFIED_TEMPLATES.filter(template => template.isNew);

export const searchTemplates = (query: string): Template[] => {
  const lowercaseQuery = query.toLowerCase();
  return UNIFIED_TEMPLATES.filter(template =>
    template.title.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.name.toLowerCase().includes(lowercaseQuery)
  );
};

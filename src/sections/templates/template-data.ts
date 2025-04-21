import { ArticleTemplate, TemplateCategory } from './template-types';

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

export const ARTICLE_TEMPLATES : ArticleTemplate[] = [
  {
    id: 'template1',
    title: 'Product Review',
    description: 'A comprehensive review template for products with pros, cons, and detailed analysis.',
    category: 'review',
    popular: true,
    isNew: false,
    locked: false, // Free template
  },
  {
    id: 'template2',
    title: 'SEO Blog Post',
    description: 'Optimized for search engines with proper heading structure and keyword placement.',
    category: 'blog',
    popular: true,
    isNew: false,
    locked: true, // Premium template
    previewContent: 'This template helps you create SEO-optimized blog posts that rank well in search engines. It includes proper heading structure, keyword placement guidance, and meta description suggestions.\n\nThe template follows best practices for content structure with introduction, body sections, and conclusion. It also includes prompts for adding relevant images, internal links, and calls to action.'
  },
  {
    id: 'ultimate-guide',
    title: 'Ultimate Guide Template',
    description: 'Comprehensive, in-depth guide covering all aspects of a topic with expert insights',
    icon: 'mdi:book-open-variant',
    category: 'howto',
    popular: true,
    isNew: false,
    locked: true, // Premium template
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
    title: 'Top 10 List Template',
    description: 'Engaging, scannable list-based article format that drives high engagement and shares',
    icon: 'mdi:format-list-numbered',
    category: 'listicle',
    popular: true,
    isNew: false,
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
    locked: false
  },
  {
    id: 'product-review',
    title: 'Product Review Template',
    description: 'Balanced, thorough product evaluation that builds trust and drives conversions',
    icon: 'mdi:star-check',
    category: 'product',
    popular: false,
    isNew: true,
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
    locked: false
  },
  {
    id: 'how-to-guide',
    title: 'Step-by-Step Tutorial',
    description: 'Clear, actionable instructions that solve specific problems and build authority',
    icon: 'mdi:clipboard-text-outline',
    category: 'howto',
    popular: false,
    isNew: false,
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
    locked: false
  },
  {
    id: 'comparison-post',
    title: 'Product Comparison Template',
    description: 'Side-by-side analysis helping readers make informed decisions between options',
    icon: 'mdi:compare-horizontal',
    category: 'comparison',
    popular: false,
    isNew: true,
    difficulty: 'medium',
    estimatedTime: '12-15 min',
    structure: {
      sections: [
        {
          title: 'Introduction',
          description: 'Overview of what s being compared and why it matters',
        },
        {
          title: 'Quick Comparison Table',
          description: 'At-a-glance feature and specification comparison',
        },
        {
          title: 'Key Differences',
          description: 'Most important distinctions between options',
        },
        {
          title: '[Option A] Overview',
          description: 'Detailed look at the first option',
        },
        {
          title: '[Option B] Overview',
          description: 'Detailed look at the second option',
        },
        {
          title: 'Feature-by-Feature Comparison',
          description: 'Detailed analysis of specific features',
        },
        {
          title: 'Pricing Comparison',
          description: 'Cost analysis and value assessment',
        },
        {
          title: 'Who Should Choose [Option A]',
          description: 'Ideal user profile for first option',
        },
        {
          title: 'Who Should Choose [Option B]',
          description: 'Ideal user profile for second option',
        },
        {
          title: 'Conclusion',
          description: 'Summary and final recommendations',
        },
      ],
      seoTips: [
        'Include both product names in the title with "vs" between them',
        'Use comparison tables with clear visual distinctions',
        'Include a "winner" for different categories or use cases',
        'Add internal links to individual product reviews',
        'Use product images with descriptive alt text',
      ],
    },
    locked: false
  },
  {
    id: 'case-study',
    title: 'Case Study Template',
    description: 'Real-world success story demonstrating problem-solving and results',
    icon: 'mdi:file-chart-outline',
    category: 'case',
    popular: false,
    isNew: false,
    difficulty: 'hard',
    estimatedTime: '15-20 min',
    structure: {
      sections: [
        {
          title: 'Executive Summary',
          description: 'Brief overview of the case and key results',
        },
        {
          title: 'Client/Company Background',
          description: 'Context about the subject of the case study',
        },
        {
          title: 'The Challenge',
          description: 'Clear explanation of the problem that needed solving',
        },
        {
          title: 'Goals and Objectives',
          description: 'What success looked like for this project',
        },
        {
          title: 'Solution Strategy',
          description: 'The approach taken to solve the problem',
        },
        {
          title: 'Implementation Process',
          description: 'How the solution was executed step by step',
        },
        {
          title: 'Results and Outcomes',
          description: 'Quantifiable results with data and metrics',
        },
        {
          title: 'Key Takeaways',
          description: 'Lessons learned that readers can apply',
        },
        {
          title: 'Future Plans',
          description: 'Next steps or ongoing developments',
        },
        {
          title: 'Conclusion',
          description: 'Summary of the case study and final thoughts',
        },
      ],
      seoTips: [
        'Include company/client name and result in title (e.g., "How Company X Increased Sales by 50%")',
        'Use real data and statistics throughout',
        'Include testimonial quotes from stakeholders',
        'Add before/after comparisons where applicable',
        'Use charts and graphs to visualize results',
      ],
    },
    locked: false
  },
];
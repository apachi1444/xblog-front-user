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
    name: 'Slate Glow',
    title: 'Slate Glow Design',
    description: 'A neutral-toned, elegant accordion with gray hues and soft shadow effects. Polished yet approachable.',
    icon: '⚪',
    category: 'design',
    popular: true,
    isNew: true,
    locked: false,
    color: '#607d8b',
    gradient: 'linear-gradient(135deg, #607d8b 0%, #455a64 100%)',
    bestFor: 'product FAQs, agencies, portfolios',
  },
  {
    id: 'template4',
    name: 'Dual Grid Lite',
    title: 'Dual Grid Lite Design',
    description: 'A 2-column grid layout with clean cards and a soft gray background—great for visual browsing.',
    icon: '🌤',
    category: 'design',
    popular: true,
    isNew: true,
    locked: false,
    color: '#ff9800',
    gradient: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
    bestFor: 'eCommerce, lifestyle brands, or mobile-first designs',
  },
  {
    id: 'template5',
    name: 'Crystal Timeline',
    title: 'Crystal Timeline Design',
    description: 'A unique vertical timeline layout with left-aligned bullets and rich visual hierarchy.',
    icon: '💎',
    category: 'design',
    popular: true,
    isNew: true,
    locked: false,
    color: '#4caf50',
    gradient: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
    bestFor: 'storytelling, process documentation, step-by-step guides',
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

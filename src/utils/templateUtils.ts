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
  comingSoon?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  htmlFile?: string;
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
    htmlFile: 'template1.html',
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
    htmlFile: 'template2.html',
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
    htmlFile: 'template3.html',
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
    htmlFile: 'template4.html',
    estimatedTime: '6 min',
  },
  {
    id: 'template-premium',
    name: 'Premium Gold',
    title: 'Premium Gold Template',
    description: 'An exclusive premium template with advanced features, custom animations, and professional styling.',
    icon: '👑',
    category: 'design',
    popular: true,
    isNew: false,
    locked: true,
    color: '#ffd700',
    gradient: 'linear-gradient(135deg, #ffd700 0%, #ffb300 100%)',
    bestFor: 'luxury brands, premium services, high-end content',
    htmlFile: 'template-premium.html',
  },
  {
    id: 'template-coming-soon',
    name: 'Future Vision',
    title: 'Future Vision Template',
    description: 'An innovative template with cutting-edge design patterns. Coming soon with revolutionary features.',
    icon: '🚀',
    category: 'design',
    popular: false,
    isNew: true,
    locked: false,
    comingSoon: true,
    color: '#9c27b0',
    gradient: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)',
    bestFor: 'innovative brands, tech startups, future-focused content',
    estimatedTime: '8 min',
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
    htmlFile: 'template5.html',
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

// Template preview URL utilities
export const createEncryptedTemplateId = (templateId: string): string => 
  // Simple encoding - in production you might want to use a proper encryption
   btoa(templateId).replace(/[+/=]/g, (match) => {
    switch (match) {
      case '+': return '-';
      case '/': return '_';
      case '=': return '';
      default: return match;
    }
  })
;

export const decryptTemplateId = (encryptedId: string): string => {
  try {
    // Remove '_preview' suffix if present
    const cleanId = encryptedId.replace('_preview', '');

    // Reverse the encoding process
    const base64 = cleanId.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if needed
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

    return atob(padded);
  } catch (error) {
    console.error('Failed to decrypt template ID:', error);
    return '';
  }
};

export const generateTemplatePreviewUrl = (templateId: string): string => {
  const encryptedId = createEncryptedTemplateId(templateId);
  return `/templates/${encryptedId}_preview`;
};

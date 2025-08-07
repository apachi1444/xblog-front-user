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
  // New parent-child layout system
  parent_id?: number; // ID of the parent layout (e.g., 1, 2, 3)
  isParentLayout?: boolean; // True if this is a parent layout template
  childTemplates?: string[]; // Array of child template IDs (only for parent layouts)
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
// Parent Layout Templates - These define the main template families
export const PARENT_TEMPLATES = [
  {
    parent_id: 1,
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
];

// Child Templates - These are the actual template variations
export const UNIFIED_TEMPLATES : Template[] = [
  {
    id: 'template1',
    name: 'Premium Gold',
    title: 'Premium Gold Template',
    description: 'An exclusive premium template with advanced features, custom animations, and professional styling.',
    icon: '👑',
    category: 'design',
    parent_id: 1,
    popular: true,
    isNew: false,
    locked: false,
    color: '#ffd700',
    gradient: 'linear-gradient(135deg, #ffd700 0%, #ffb300 100%)',
    bestFor: 'luxury brands, premium services, high-end content',
    htmlFile: 'template1.html',
  },
  {
    id: 'template2',
    name: 'Premium Gold',
    title: 'Premium Gold Template',
    description: 'An exclusive premium template with advanced features, custom animations, and professional styling.',
    icon: '👑',
    category: 'design',
    parent_id: 1,
    popular: true,
    isNew: false,
    locked: false,
    color: '#ffd700',
    gradient: 'linear-gradient(135deg, #ffd700 0%, #ffb300 100%)',
    bestFor: 'luxury brands, premium services, high-end content',
    htmlFile: 'template2.html',
  },
  {
    id: 'template3',
    name: 'Premium Gold',
    title: 'Premium Gold Template',
    description: 'An exclusive premium template with advanced features, custom animations, and professional styling.',
    icon: '👑',
    category: 'design',
    parent_id: 1,
    popular: true,
    isNew: false,
    locked: true,
    color: '#ffd700',
    gradient: 'linear-gradient(135deg, #ffd700 0%, #ffb300 100%)',
    bestFor: 'luxury brands, premium services, high-end content',
    htmlFile: 'template3.html',
  },
  {
    id: 'template4',
    name: 'Premium Gold',
    title: 'Premium Gold Template',
    description: 'An exclusive premium template with advanced features, custom animations, and professional styling.',
    icon: '👑',
    category: 'design',
    parent_id: 1,
    popular: true,
    isNew: false,
    locked: true,
    color: '#ffd700',
    gradient: 'linear-gradient(135deg, #ffd700 0%, #ffb300 100%)',
    bestFor: 'luxury brands, premium services, high-end content',
    htmlFile: 'template4.html',
  },
  {
    id: 'template5',
    name: 'Crystal Timeline',
    title: 'Crystal Timeline Design',
    description: 'A unique vertical timeline layout with left-aligned bullets and rich visual hierarchy.',
    icon: '💎',
    category: 'design',
    popular: true,
    parent_id: 1,
    isNew: true,
    locked: false,
    comingSoon: true,
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

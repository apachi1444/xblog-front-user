import type { Article } from 'src/types/article';

import {
  _id,
  _price,
  _times,
  _company,
  _boolean,
  _fullName,
  _taskNames,
  _postTitles,
  _description,
  _productNames,
} from './_mock';

// ----------------------------------------------------------------------

export const _myAccount = {
  displayName: 'Jaydon Frankie',
  email: 'demo@xblog.ai',
  photoURL: '/assets/images/avatar/avatar-25.webp',
};

// ----------------------------------------------------------------------

export const _users = [...Array(24)].map((_, index) => ({
  id: _id(index),
  name: _fullName(index),
  company: _company(index),
  isVerified: _boolean(index),
  avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`,
  status: index % 4 ? 'active' : 'banned',
  role:
    [
      'Leader',
      'Hr Manager',
      'UI Designer',
      'UX Designer',
      'UI/UX Designer',
      'Project Manager',
      'Backend Developer',
      'Full Stack Designer',
      'Front End Developer',
      'Full Stack Developer',
    ][index] || 'UI Designer',
}));

// ----------------------------------------------------------------------

export const _posts: Article[] = [
  // Real API response structure - Comprehensive draft for testing
  {
    id: 6,
    // New API fields - Step 1 data
    target_country: 'us',
    language: 'english',
    primary_keyword: 'digital marketing strategies',
    secondary_keywords: '["social media marketing", "content marketing", "email marketing", "SEO optimization"]',
    content_description: 'A comprehensive guide covering the essential digital marketing strategies that modern businesses need to succeed in today\'s competitive online landscape.',
    article_title: 'The Complete Guide to Digital Marketing Strategies for Modern Businesses',
    meta_title: 'Digital Marketing Strategies Guide 2024 | Boost Your Business Online',
    meta_description: 'Discover proven digital marketing strategies to grow your business. Learn social media, content marketing, SEO, and email marketing techniques that drive results.',
    url_slug: 'complete-guide-digital-marketing-strategies-modern-businesses',

    // Step 2 data
    article_type: 'how-to',
    article_size: 'large',
    tone_of_voice: 'professional',
    point_of_view: 'second-person',
    plagiat_removal: true,
    include_images: true,
    include_videos: false,
    internal_links: '[{"url": "https://example.com/seo-guide", "link_text": "SEO Best Practices"}, {"url": "https://example.com/content-strategy", "link_text": "Content Strategy Tips"}]',
    external_links: '[{"url": "https://blog.hubspot.com/marketing", "link_text": "HubSpot Marketing Blog"}, {"url": "https://moz.com/beginners-guide-to-seo", "link_text": "Moz SEO Guide"}]',

    // Legacy and additional fields
    content: 'A comprehensive guide to getting started with digital marketing strategies for modern businesses.',
    sections: JSON.stringify([
      {
        id: 'section-1',
        title: 'Introduction to Digital Marketing',
        content: 'Digital marketing has revolutionized how businesses connect with their customers. In today\'s digital age, having a strong online presence is crucial for success.',
        status: 'completed',
        subsections: []
      },
      {
        id: 'section-2',
        title: 'Social Media Marketing Strategies',
        content: 'Social media platforms offer unprecedented opportunities to engage with your target audience. Learn how to create compelling content that drives engagement and conversions.',
        status: 'completed',
        subsections: []
      },
      {
        id: 'section-3',
        title: 'Content Marketing Best Practices',
        content: 'Content is king in digital marketing. Discover how to create valuable, relevant content that attracts and retains customers while driving profitable customer action.',
        status: 'completed',
        subsections: []
      },
      {
        id: 'section-4',
        title: 'Email Marketing Automation',
        content: 'Email marketing remains one of the most effective digital marketing channels. Learn how to build automated email campaigns that nurture leads and drive sales.',
        status: 'completed',
        subsections: []
      },
      {
        id: 'section-5',
        title: 'SEO Optimization Techniques',
        content: 'Search engine optimization is essential for organic visibility. Master the fundamentals of on-page and off-page SEO to improve your search rankings.',
        status: 'completed',
        subsections: []
      }
    ]),
    featured_media: 'https://images.unsplash.com/photo-1562577309-2592ab84b1bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDkxMTJ8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nfGVufDB8fHx8MTc0Njk4NDAwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'draft',
    platform: 'shopify',
    scheduled_publish_date: '2025-06-25T10:00:00',
    created_at: '2025-06-18T00:53:09',

    // Legacy compatibility
    title: 'The Complete Guide to Digital Marketing Strategies for Modern Businesses',
  },
  // Second comprehensive draft for testing
  {
    id: 7,
    // Step 1 data - Different settings
    target_country: 'global',
    language: 'english',
    primary_keyword: 'e-commerce SEO',
    secondary_keywords: '["product optimization", "online store SEO", "conversion rate optimization"]',
    content_description: 'Learn how to optimize your e-commerce website for search engines and increase organic traffic to boost sales.',
    article_title: 'E-commerce SEO: Boost Your Online Store\'s Visibility',
    meta_title: 'E-commerce SEO Guide: Increase Online Store Traffic & Sales',
    meta_description: 'Master e-commerce SEO with our comprehensive guide. Learn product optimization, technical SEO, and conversion strategies.',
    url_slug: 'ecommerce-seo-boost-online-store-visibility',

    // Step 2 data - Different settings
    article_type: 'listicle',
    article_size: 'medium',
    tone_of_voice: 'friendly',
    point_of_view: 'first-person',
    plagiat_removal: false,
    include_images: true,
    include_videos: true,
    internal_links: '[{"url": "https://example.com/product-pages", "link_text": "Product Page Optimization"}]',
    external_links: '[{"url": "https://developers.google.com/search", "link_text": "Google Search Console"}]',

    // Legacy and additional fields
    content: 'Learn how to optimize your e-commerce website for search engines.',
    sections: JSON.stringify([
      {
        id: 'section-1',
        title: 'Understanding E-commerce SEO Fundamentals',
        content: 'E-commerce SEO differs from traditional SEO in several key ways. Learn the unique challenges and opportunities of optimizing online stores.',
        status: 'completed',
        subsections: []
      },
      {
        id: 'section-2',
        title: 'Product Page Optimization Strategies',
        content: 'Product pages are the heart of your e-commerce site. Discover how to optimize product titles, descriptions, and images for maximum search visibility.',
        status: 'completed',
        subsections: []
      },
      {
        id: 'section-3',
        title: 'Technical SEO for E-commerce Sites',
        content: 'Technical SEO is crucial for large e-commerce sites. Learn about site speed, mobile optimization, and structured data implementation.',
        status: 'completed',
        subsections: []
      }
    ]),
    featured_media: '',
    status: 'draft',
    platform: 'wordpress',
    created_at: '2025-06-17T14:30:00',

    // Legacy compatibility
    title: 'E-commerce SEO: Boost Your Online Store\'s Visibility',
  },

  // Additional mock articles with real API structure
  ...Array.from({ length: 21 }, (_, index) => ({
    id: index + 8, // Start from 8 since we have 6 and 7 above
    title: _postTitles(index),
    // Some articles have no featured_media to test "Image not set" functionality
    featured_media: index % 5 === 0 ? '' : 'https://images.unsplash.com/photo-1562577309-2592ab84b1bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDkxMTJ8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nfGVufDB8fHx8MTc0Njk4NDAwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    created_at: _times(index),
    status: index === 0 ? 'scheduled' : ['published', 'draft', 'scheduled'][index % 3] as 'published' | 'draft' | 'scheduled',
    platform: ['shopify', 'wordpress', 'wix', 'squarespace'][index % 4],
    content: _description(index),
  }))
];

// ----------------------------------------------------------------------

const COLORS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

export const _products = [...Array(24)].map((_, index) => {
  const setIndex = index + 1;

  return {
    id: _id(index),
    price: _price(index),
    name: _productNames(index),
    priceSale: setIndex % 3 ? null : _price(index),
    coverUrl: `/assets/images/product/product-${setIndex}.webp`,
    colors:
      (setIndex === 1 && COLORS.slice(0, 2)) ||
      (setIndex === 2 && COLORS.slice(1, 3)) ||
      (setIndex === 3 && COLORS.slice(2, 4)) ||
      (setIndex === 4 && COLORS.slice(3, 6)) ||
      (setIndex === 23 && COLORS.slice(4, 6)) ||
      (setIndex === 24 && COLORS.slice(5, 6)) ||
      COLORS,
    status:
      ([1, 3, 5].includes(setIndex) && 'sale') || ([4, 8, 12].includes(setIndex) && 'new') || '',
  };
});

// ----------------------------------------------------------------------

export const _langs = [
  {
    value: 'en',
    label: 'English',
    icon: '/assets/icons/flags/ic-flag-en.svg',
  },
  {
    value: 'es',
    label: 'Español',
    icon: '/assets/icons/flags/ic-flag-es.svg',
  },
  {
    value: 'ar',
    label: 'العربية',
    icon: '/assets/icons/flags/ic-flag-ar.svg',
  },
  {
    value: 'fr',
    label: 'Français',
    icon: '/assets/icons/flags/ic-flag-fr.svg',
  },
  {
    value: 'pt',
    label: 'Português',
    icon: '/assets/icons/flags/ic-flag-pt.svg',
  },
  {
    value: 'ru',
    label: 'Русский',
    icon: '/assets/icons/flags/ic-flag-ru.svg',
  },
];

// ----------------------------------------------------------------------

export const _timeline = [...Array(5)].map((_, index) => ({
  id: _id(index),
  title: [
    '1983, orders, $4220',
    '12 Invoices have been paid',
    'Order #37745 from September',
    'New order placed #XF-2356',
    'New order placed #XF-2346',
  ][index],
  type: `order${index + 1}`,
  time: _times(index),
}));

// ----------------------------------------------------------------------

export const _tasks = [...Array(5)].map((_, index) => ({
  id: _id(index),
  name: _taskNames(index),
}));

// ----------------------------------------------------------------------

export const _notifications = [
  {
    id: _id(1),
    title: 'Your order is placed',
    description: 'waiting for shipping',
    avatarUrl: null,
    type: 'order-placed',
    postedAt: _times(1),
    isUnRead: true,
  },
  {
    id: _id(2),
    title: _fullName(2),
    description: 'answered to your comment on the Minimal',
    avatarUrl: '/assets/images/avatar/avatar-2.webp',
    type: 'friend-interactive',
    postedAt: _times(2),
    isUnRead: true,
  },
  {
    id: _id(3),
    title: 'You have new message',
    description: '5 unread messages',
    avatarUrl: null,
    type: 'chat-message',
    postedAt: _times(3),
    isUnRead: false,
  },
  {
    id: _id(4),
    title: 'You have new mail',
    description: 'sent from Guido Padberg',
    avatarUrl: null,
    type: 'mail',
    postedAt: _times(4),
    isUnRead: false,
  },
  {
    id: _id(5),
    title: 'Delivery processing',
    description: 'Your order is being shipped',
    avatarUrl: null,
    type: 'order-shipped',
    postedAt: _times(5),
    isUnRead: false,
  },
];
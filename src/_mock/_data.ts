import type { Store } from 'src/types/store';
import type { StoreProps } from 'src/sections/stores/components/store-table-row';
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
  email: 'demo@minimals.cc',
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

export const _posts: Article[] = [...Array(23)].map((_, index) => ({
  id: _id(index),
  title: _postTitles(index),
  description: _description(index),
  slug: _postTitles(index).toLowerCase().replace(/\s+/g, '-'),
  coverImage: `/assets/images/cover/cover-${index + 1}.webp`,
  status: ['published', 'draft', 'scheduled'][index % 3] as 'published' | 'draft' | 'scheduled',
  createdAt: _times(index),
  updatedAt: _times(index),
  publishedAt: _times(index),
  author: {
    id: _id(index),
    name: _fullName(index),
    avatar: `/assets/images/avatar/avatar-${index + 1}.webp`,
  },
  storeId: index % 4 === 0 ? undefined : _id(Math.floor(index / 3)), // Changed null to undefined
  keywords: {
    primary: ['WordPress', 'SEO', 'Marketing', 'Design', 'Development'][index % 5],
    secondary: [
      'Plugin', 
      'Theme', 
      'Performance', 
      'Security', 
      'Analytics'
    ].slice(0, (index % 5) + 1)
  },
  meta: {
    title: `SEO Title for ${_postTitles(index)}`,
    description: _description(index).substring(0, 160),
    url: `https://example.com/blog/${_postTitles(index).toLowerCase().replace(/\s+/g, '-')}`,
  }
}));

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
    value: 'fr',
    label: 'French',
    icon: '/assets/icons/flags/ic-flag-fr.svg',
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

export const _stores: Store[] = [
  {
    id: "1",
    name: "WordPress",
    url: "https://itclevers.com",
    logo: "/placeholder.svg",
    isConnected: true,
    articlesCount: 42,
    lastUpdated: "2023-05-15",
    performance: {
      visitors: 15000,
      sales: 500,
      revenue: 25000,
    },
    business : "Technology",
    creationDate : "2025-02-02",
    platform : "WordPress",
    articles_list: [
      {
        id: "1",
        title: "10 Must-Have WordPress Plugins for 2023",
        description: "Discover the essential plugins that will enhance your WordPress site...",
        publishedDate: "2023-05-10",
        readTime: "8 min read",
        views: 1200,
      },
    ],
  },
  {
    id: "2",
    name: "WordPress",
    url: "https://itclevers.com",
    logo: "/placeholder.svg",
    isConnected: true,
    articlesCount: 42,
    lastUpdated: "2023-05-15",
    performance: {
      visitors: 15000,
      sales: 500,
      revenue: 25000,
    },
    business : "Technology",
    creationDate : "2025-02-02",
    platform : "WordPress",
    articles_list: [
      {
        id: "1",
        title: "10 Must-Have WordPress Plugins for 2023",
        description: "Discover the essential plugins that will enhance your WordPress site...",
        publishedDate: "2023-05-10",
        readTime: "8 min read",
        views: 1200,
      },
    ],
  },
]

export const fakeStores = [...Array(12)].map((_, index) => ({
  id: _id(index),
  name: _company(index),
  url: `https://${_company(index).toLowerCase().replace(/\s+/g, '-')}.com`,
  logo: `/assets/images/logo/logo_${(index % 10) + 1}.png`,
  platform: ['Shopify', 'WordPress', 'Wix'][index % 3],
  business: ['Retail', 'Technology', 'Food & Beverage', 'Fashion', 'Health & Beauty'][index % 5],
  creationDate: '11/08/2023',
  articlesCount: Math.floor(Math.random() * 50),
  isConnected: _boolean(index),
}));
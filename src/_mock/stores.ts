import type { Store } from 'src/types/store';

import { _times, _company, _boolean, _postTitles, _description } from './_mock';

// Platform configurations with specific names - mostly WordPress for now
const platformConfigs = [
  { name: 'wordpress', avatar: '/assets/icons/platforms/wordpress.svg' },
  { name: 'linkedin', avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/512px-LinkedIn_logo_initials.png' },
  { name: 'wordpress', avatar: '/assets/icons/platforms/wordpress.svg' },
  { name: 'shopify', avatar: '/assets/icons/platforms/shopify.svg' }, // Not supported yet
  { name: 'wix', avatar: '/assets/icons/platforms/wix.svg' } // Not supported yet
];

export const _fakeStores: Store[] = [...Array(5)].map((__, index) => {
  const platform = platformConfigs[index % platformConfigs.length];

  // Special handling for LinkedIn
  const isLinkedIn = platform.name === 'linkedin';
  const storeName = isLinkedIn ? 'LinkedIn - John Doe' : _company(index);
  const storeUrl = isLinkedIn ? 'https://linkedin.com/in/johndoe' : `https://${_company(index).toLowerCase().replace(/\s+/g, '-')}.com`;
  const businessType = isLinkedIn ? 'Personal Profile' : ['Technology', 'E-commerce', 'Fashion', 'Food', 'Health'][index % 5];

  return {
    id: index,
    name: storeName,
    url: storeUrl,
    avatar: platform.avatar,
    is_active: _boolean(index),
    category: platform.name,
    created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    articlesCount: isLinkedIn ? Math.floor(Math.random() * 20) + 5 : Math.floor(Math.random() * 100),
    lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    performance: {
      visitors: Math.floor(Math.random() * 10000),
      sales: Math.floor(Math.random() * 1000),
      revenue: Math.floor(Math.random() * 50000),
    },
    articles_list: [...Array(3)].map((_, articleIndex) => ({
      id: articleIndex + 1,
      title: _postTitles(articleIndex),
      featured_media: `/assets/images/cover/cover-${(articleIndex % 24) + 1}.webp`,
      created_at: _times(articleIndex),
      status: ['draft', 'published', 'scheduled'][articleIndex % 3] as 'draft' | 'publish' | 'scheduled',
      platform: platform.name,
      content: _description(articleIndex),
    })),
    business: businessType,
    // Legacy fields for backward compatibility
    logo: platform.avatar,
    isConnected: _boolean(index),
    platform: platform.name,
    creationDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
  };
});



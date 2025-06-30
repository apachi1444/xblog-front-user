import type { Store } from 'src/types/store';

import { _times, _company, _boolean, _postTitles, _description } from './_mock';

// Platform configurations with specific names - mostly WordPress for now
const platformConfigs = [
  { name: 'WordPress', logo: '/assets/icons/platforms/wordpress.svg' },
  { name: 'WordPress', logo: '/assets/icons/platforms/wordpress.svg' },
  { name: 'WordPress', logo: '/assets/icons/platforms/wordpress.svg' },
  { name: 'Shopify', logo: '/assets/icons/platforms/shopify.svg' }, // Not supported yet
  { name: 'Wix', logo: '/assets/icons/platforms/wix.svg' } // Not supported yet
];

export const _fakeStores: Store[] = [...Array(5)].map((__, index) => {
  const platform = platformConfigs[index % platformConfigs.length];

  return {
    id: index,
    name: _company(index),
    url: `https://${_company(index).toLowerCase().replace(/\s+/g, '-')}.com`,
    logo: platform.logo,
    isConnected: _boolean(index),
    articlesCount: Math.floor(Math.random() * 100),
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
      status: ['draft', 'published', 'scheduled'][articleIndex % 3] as 'draft' | 'published' | 'scheduled',
      platform: platform.name.toLowerCase(),
      content: _description(articleIndex),
    })),
    platform: platform.name,
    business: ['Technology', 'E-commerce', 'Fashion', 'Food', 'Health'][index % 5],
    creationDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
  };
});



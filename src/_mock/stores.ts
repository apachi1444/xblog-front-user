import type { Store } from 'src/types/store';

import { _times, _company, _boolean, _postTitles, _description } from './_mock';

export const _fakeStores: Store[] = [...Array(5)].map((__, index) => ({
  id: index,
  name: _company(index),
  url: `https://${_company(index).toLowerCase().replace(/\s+/g, '-')}.com`,
  logo: `/assets/icons/platforms/store-${(index % 3) + 1}.svg`,
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
    platform: ['shopify', 'wordpress', 'wix'][articleIndex % 3],
    content: _description(articleIndex),
  })),
  platform: ['WordPress', 'Shopify', 'Wix'][index % 3],
  business: ['Technology', 'E-commerce', 'Fashion', 'Food', 'Health'][index % 5],
  creationDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
}));



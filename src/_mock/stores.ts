import type { Store } from 'src/types/store';

import { _id, _times, _company, _boolean, _fullName, _postTitles, _description } from './_mock';

export const _fakeStores: Store[] = [...Array(5)].map((_, index) => ({
  id: _id(index),
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
  articles_list: [...Array(3)].map((key, articleIndex) => ({
    id: key,
    title: _postTitles(articleIndex),
    description: _description(articleIndex),
    slug: _postTitles(articleIndex).toLowerCase().replace(/\s+/g, '-'),
    coverImage: `/assets/images/cover/cover-${(articleIndex % 24) + 1}.webp`,
    author: {
      id: _id(articleIndex + 10),
      name: _fullName(articleIndex),
      avatar: `/assets/images/avatar/avatar-${(articleIndex % 24) + 1}.webp`,
    },
    storeId: _id(index),
    status: ['draft', 'published', 'scheduled'][articleIndex % 3] as 'draft' | 'published' | 'scheduled',
    createdAt: _times(articleIndex),
    updatedAt: _times(articleIndex),
    publishedAt: ['published', 'scheduled'].includes(['draft', 'published', 'scheduled'][articleIndex % 3]) 
      ? _times(articleIndex + 5) 
      : undefined,
    keywords: {
      primary: ['WordPress', 'SEO', 'Marketing', 'Design', 'Development'][articleIndex % 5],
      secondary: [
        'Plugin', 
        'Theme', 
        'Performance', 
        'Security', 
        'Analytics'
      ].slice(0, (articleIndex % 5) + 1)
    },
    meta: {
      title: `SEO Title for ${_postTitles(articleIndex)}`,
      description: _description(articleIndex).substring(0, 160),
      url: `https://example.com/blog/${_postTitles(articleIndex).toLowerCase().replace(/\s+/g, '-')}`,
    }
  })),
  platform: ['WordPress', 'Shopify', 'Wix'][index % 3],
  business: ['Technology', 'E-commerce', 'Fashion', 'Food', 'Health'][index % 5],
  creationDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
}));



import type { Store } from 'src/types/store';
import { _id, _company, _boolean } from './_mock';

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
  articles_list: [
    {
      id: _id(index),
      title: `Sample Article ${index + 1}`,
      description: "This is a sample article description...",
      publishedDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      readTime: `${Math.floor(Math.random() * 20) + 5} min read`,
      views: Math.floor(Math.random() * 1000)
    }
  ],
  platform: ['WordPress', 'Shopify', 'Wix'][index % 3],
  business: ['Technology', 'E-commerce', 'Fashion', 'Food', 'Health'][index % 5],
  creationDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
}));


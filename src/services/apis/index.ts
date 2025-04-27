import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosError, AxiosRequestConfig } from 'axios';

import MockAdapter from 'axios-mock-adapter';
import { createApi } from '@reduxjs/toolkit/query/react';

import { _posts } from 'src/_mock/_data';
import { _fakeStores } from 'src/_mock/stores';

import customRequest from './axios';

// Initialize mock adapter
const mock = new MockAdapter(customRequest, { onNoMatch: 'passthrough' });

// Mock data for subscription
const mockSubscriptionDetails = {
  start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  end_date: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
  connected_websites: 3,
  websites_limit: 5,
  articles_created: 45,
  articles_limit: 100,
  regeneration_number: 15,
  regeneration_limit: 50,
  subscription_url: 'https://example.com/manage-subscription',
  subscription_name: 'FREEEE'
};

// Mock data for calendar
const mockCalendarEvents = [...Array(10)].map((_, index) => ({
  id: `event-${index}`,
  title: `Scheduled Article ${index + 1}`,
  start: new Date(Date.now() + (index * 24 * 60 * 60 * 1000)).toISOString(),
  end: new Date(Date.now() + ((index + 1) * 24 * 60 * 60 * 1000)).toISOString(),
  articleId: `article-${index}`,
  status: ['draft', 'scheduled', 'published'][index % 3],
  storeId: `store-${index % 3}`,
}));


// Make sure BASE_URL is defined
const ARTICLES_BASE_URL = '/articles';

// Helper to check if mocking should be enabled
const shouldUseMocks = () => true

// Setup mock endpoints
const setupMocks = () => {
  if (shouldUseMocks()) {
    // Generate title mock with delay
    mock.onPost('/generate/title').reply(async (config) => {
      // Random delay between 1-3 seconds
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const { primaryKeyword, targetCountry } = JSON.parse(config.data);
      return [200, {
        title: `Ultimate Guide to ${primaryKeyword} in ${targetCountry} ${new Date().getFullYear()}`,
        score: 85
      }];
    });

    // Generate meta mock with delay
    mock.onPost('/generate/meta').reply(async (config) => {
      // Random delay between 1-3 seconds
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const { title, primaryKeyword } = JSON.parse(config.data);
      return [200, {
        metaTitle: `${title} | Complete ${primaryKeyword} Guide ${new Date().getFullYear()}`,
        metaDescription: `Learn everything about ${primaryKeyword}. Our comprehensive guide covers all aspects with expert tips, examples, and best practices.`,
        urlSlug: `${primaryKeyword.toLowerCase().replace(/\s+/g, '-')}-guide-${new Date().getFullYear()}`
      }];
    });

    // Generate keywords mock with delay
    mock.onPost('/generate/keywords').reply(async (config) => {
      // Random delay between 1-3 seconds
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const { primaryKeyword } = JSON.parse(config.data);
      return [200, {
        keywords: [
          `${primaryKeyword} guide`,
          `best ${primaryKeyword}`,
          `${primaryKeyword} tips`,
          `${primaryKeyword} tutorial`,
          `${primaryKeyword} examples`,
          `${primaryKeyword} for beginners`,
          `professional ${primaryKeyword}`,
          `${primaryKeyword} ${new Date().getFullYear()}`
        ],
        score: 90
      }];
    });

    mock.onGet('/stores/').reply(() => [
        200, 
        {
          stores: _fakeStores,
          count: _fakeStores.length
        }
      ]);

    // Setup mock for articles endpoint
    mock.onGet(new RegExp(`/all${ARTICLES_BASE_URL}/.*`)).reply(() => {
      // Add console.log to verify the mock is being hit
      console.log('Mock articles endpoint hit');
      
      return [
        200, 
        {
          count: _posts.length,
          drafts_articles: _posts.filter(post => post.status === 'draft'),
          published_articles: _posts.filter(post => post.status === 'published')
        }
      ];
    });

    // Subscription endpoints
    mock.onGet('/subscriptions').reply(200, mockSubscriptionDetails);

    mock.onPost('/subscription/upgrade').reply(200, {
      success: true,
      message: 'Subscription upgraded successfully',
    });

    // Calendar endpoints
    mock.onGet('/calendars').reply(200, {
      events: mockCalendarEvents,
      total: mockCalendarEvents.length,
    });

    mock.onPost('/schedule-article').reply((config) => {
      const scheduleData = JSON.parse(config.data);
      return [201, {
        id: `schedule-${Date.now()}`,
        ...scheduleData,
        status: 'scheduled',
      }];
    });

    mock.onPut(/\/calendars\/.*/).reply((config) => {
      const calendarId = config.url?.split('/').pop();
      const updateData = JSON.parse(config.data);
      return [200, {
        id: calendarId,
        ...updateData,
        updatedAt: new Date().toISOString(),
      }];
    });

    // Store operations mocks
    mock.onDelete(/\/stores\/.*/).reply((config) => {
      const storeId = config.url?.split('/').pop();
      
      return [200, { 
        success: true,
        message: `Store ${storeId} deleted successfully`
      }];
    });

    // Disconnect store mock
    mock.onPost(/\/stores\/disconnect\/.*/).reply((config) => {
      const storeId = config.url?.match(/\/disconnect\/(\d+)$/)?.[1];
      
      return [200, {
        success: true,
        message: `Store ${storeId} disconnected successfully`,
        store: {
          ..._fakeStores.find(store => store.id === storeId),
          isConnected: false
        }
      }];
    });

    // Reconnect store mock
    mock.onPost(/\/stores\/reconnect\/.*/).reply((config) => {
      const storeId = config.url?.match(/\/reconnect\/(\d+)$/)?.[1];
      
      return [200, {
        success: true,
        message: `Store ${storeId} reconnected successfully`,
        store: {
          ..._fakeStores.find(store => store.id === storeId),
          isConnected: true
        }
      }];
    });

    // Generate sections mock with delay
    mock.onPost('/generate/sections').reply(async (config) => {
      // Random delay between 2-4 seconds
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
      
      const { keyword } = JSON.parse(config.data);
      
      return [200, {
        sections: [
          {
            id: '1',
            title: `Introduction to ${keyword}`,
            content: 'Brief overview and importance of the topic.',
            status: 'Not Started'
          },
          {
            id: '2',
            title: 'Understanding the Basics',
            content: 'Fundamental concepts and key principles.',
            status: 'Not Started',
            subsections: [
              {
                id: '2.1',
                title: 'Key Concepts',
                content: 'Essential terminology and basic principles.',
                status: 'Not Started'
              },
              {
                id: '2.2',
                title: 'Common Applications',
                content: 'Real-world use cases and applications.',
                status: 'Not Started'
              }
            ]
          },
          {
            id: '3',
            title: 'Best Practices and Tips',
            content: 'Expert recommendations and proven strategies.',
            status: 'Not Started'
          },
          {
            id: '4',
            title: 'Advanced Techniques',
            content: 'In-depth exploration of advanced concepts.',
            status: 'Not Started'
          },
          {
            id: '5',
            title: 'Conclusion and Next Steps',
            content: 'Summary and recommendations for further learning.',
            status: 'Not Started'
          }
        ],
        score: 88
      }];
    });

    // Add error handling mock to log what's happening
    mock.onAny().reply((config) => {
      console.log('Unhandled request:', config.url);
      return [404, { message: 'Endpoint not mocked' }];
    });

    console.log('🔧 Mock API enabled');
  } else {
    mock.reset();
  }
};

// Initial setup
setupMocks();

const getRequestConfig = (
  args: string | (AxiosRequestConfig & { body?: AxiosRequestConfig['data'] }),
): AxiosRequestConfig & { body?: AxiosRequestConfig['data'] } => {
  if (typeof args === 'string') {
    return { url: args };
  }
  return args;
};

const axiosBaseQuery =
  (): BaseQueryFn<
    | {
        url: string;
        method?: AxiosRequestConfig['method'];
        body?: AxiosRequestConfig['data'];
        params?: AxiosRequestConfig['params'];
        headers?: AxiosRequestConfig['headers'];
        responseType?: AxiosRequestConfig['responseType'];
        paramsSerializer?: AxiosRequestConfig['paramsSerializer'];
      }
    | string,
    unknown,
    unknown
  > =>
  async (requestConfig) => {
    const {
      url,
      method = 'GET',
      body,
      params,
      headers,
      responseType,
    } = getRequestConfig(requestConfig);

    try {
      const result = await customRequest({
        url,
        method,
        data: body,
        params,
        headers,
        responseType,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err?.response?.data !== undefined ? err?.response?.data : err.message,
        },
      };
    }
  };

export const api = createApi({
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Articles', 'Stores'],
  endpoints: () => ({}),
});

export interface Page<T> {
  getTotalPages: number;
  getTotalElements: number;
  number: number;
  size: number;
  numberOfElements: number;
  content: T[];
}

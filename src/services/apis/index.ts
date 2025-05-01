import type { BaseQueryFn } from '@reduxjs/toolkit/query';

import MockAdapter from 'axios-mock-adapter';
import { createApi } from '@reduxjs/toolkit/query/react';
import { type AxiosError, type AxiosRequestConfig } from 'axios';

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

    mock.onGet('/stores/').reply(() => [
        200,
        {
          stores: _fakeStores,
          count: _fakeStores.length
        }
      ]);

    // Setup mock for articles endpoint - get all articles
    mock.onGet(new RegExp(`/all${ARTICLES_BASE_URL}/.*`)).reply(() => [
        200,
        {
          count: _posts.length,
          articles: _posts
        }
      ]);

    mock.onGet(new RegExp(`${ARTICLES_BASE_URL}/\\d+$`)).reply((config) => {
      const articleId = config.url?.split('/').pop();
      const article = _posts.find(post => post.id === articleId);

      if (article) {
        return [200, article];
      }
      return [404, { message: 'Article not found' }];
    });

    // Mock create article
    mock.onPost(ARTICLES_BASE_URL).reply((config) => {
      const newArticle = JSON.parse(config.data);
      const articleWithId = {
        ...newArticle,
        id: `article-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return [201, articleWithId];
    });

    // Mock delete article
    mock.onDelete(new RegExp(`${ARTICLES_BASE_URL}/.*`)).reply((config) => {
      const articleId = config.url?.split('/').pop();
      const articleExists = _posts.some(post => post.id === articleId);

      if (articleExists) {
        return [200, { message: `Article ${articleId} deleted successfully` }];
      }
      return [404, { message: 'Article not found' }];
    });

    // Subscription endpoints
    mock.onGet('/subscriptions').reply(200, mockSubscriptionDetails);

    // Mock subscription plans endpoint
    mock.onGet('/subscriptions/plans').reply(200, {
      plans: [
        {
          id: '1',
          name: 'Free',
          price: '0',
          features: [
            'Basic Article Generation',
            'Limited Analytics',
            'Standard Support',
            '5 Articles per month',
            '1GB Storage'
          ],
          current: false
        },
        {
          id: '2',
          name: 'Basic',
          price: '9.99',
          features: [
            'Advanced Article Generation',
            'Basic Analytics',
            'Standard Support',
            '20 Articles per month',
            '5GB Storage'
          ],
          current: false
        },
        {
          id: '3',
          name: 'Professional',
          price: '29.99',
          features: [
            'All Basic Features',
            'Unlimited Article Generation',
            'Advanced Analytics',
            'Priority Support',
            'Custom Publishing Schedule'
          ],
          current: true,
          highlight: true
        }
      ]
    });

    // Mock invoices endpoint
    mock.onGet('/subscriptions/invoices').reply(200, {
      invoices: [
        {
          id: '1',
          invoiceNumber: 'INV-001',
          amount: 29.99,
          currency: 'USD',
          status: 'paid',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          plan: 'Pro',
          downloadUrl: 'https://example.com/invoices/INV-001.pdf'
        },
        {
          id: '2',
          invoiceNumber: 'INV-002',
          amount: 29.99,
          currency: 'USD',
          status: 'paid',
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          plan: 'Pro',
          downloadUrl: 'https://example.com/invoices/INV-002.pdf'
        }
      ],
      count: 2
    });

    // Mock create subscription endpoint
    mock.onPost('/subscriptions/create').reply(200, {
      success: true,
      message: 'Subscription created successfully',
    });

    // Mock upgrade subscription endpoint
    mock.onPatch('/subscriptions/upgrade').reply(200, {
      success: true,
      message: 'Subscription upgraded successfully',
    });

    // Legacy endpoint (can be removed if not needed)
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
      const { article_id, scheduled_date } = scheduleData;

      // Find the article in the mock data
      const articleIndex = _posts.findIndex(post => post.id === article_id);

      if (articleIndex !== -1) {
        // Update the article status and scheduledAt date
        _posts[articleIndex] = {
          ..._posts[articleIndex],
          status: 'scheduled',
          scheduledAt: scheduled_date,
          updatedAt: new Date().toISOString()
        };

        console.log(`Article ${article_id} scheduled for ${scheduled_date}`);
      } else {
        console.warn(`Article ${article_id} not found for scheduling`);
      }

      return [201, {
        id: `schedule-${Date.now()}`,
        ...scheduleData,
        status: 'scheduled',
        message: 'Article scheduled successfully'
      }];
    });

    // Mock unschedule article endpoint
    mock.onPost('/articles/unschedule').reply((config) => {
      const unscheduleData = JSON.parse(config.data);
      const { article_id } = unscheduleData;

      // Find the article in the mock data
      const articleIndex = _posts.findIndex(post => post.id === article_id);

      if (articleIndex !== -1) {
        // Update the article status and remove scheduledAt date
        _posts[articleIndex] = {
          ..._posts[articleIndex],
          status: 'draft', // Change status back to draft
          scheduledAt: undefined, // Remove scheduled date
          updatedAt: new Date().toISOString()
        };

        console.log(`Article ${article_id} unscheduled successfully`);

        // Return the updated article
        return [200, {
          ..._posts[articleIndex],
          message: 'Article unscheduled successfully'
        }];
      }

      // If article not found
      console.warn(`Article ${article_id} not found for removing schedule`);
      return [404, { message: 'Article not found' }];
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

    // Mock delete calendar entry
    mock.onDelete(/\/calendars\/.*/).reply((config) => {
      const calendarId = config.url?.split('/').pop();
      return [200, {
        success: true,
        message: `Calendar entry ${calendarId} deleted successfully`
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
          ..._fakeStores.find(store => store.id === Number(storeId)),
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
          ..._fakeStores.find(store => store.id === Number(storeId)),
          isConnected: true
        }
      }];
    });

    // Mock title generation endpoint
    mock.onPost('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBgXmwBn-QvGmCMIU4OkkG-UPB7SKG6K-Y').reply((config) => {
      try {
        const requestData = JSON.parse(config.data);
        const { topic, keywords = [], targetAudience = 'general readers' } = requestData;
        let title = '';

        // Simple algorithm to generate a title
        if (keywords && keywords.length > 0) {
          // Use one of the keywords in the title
          const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];

          const titleTemplates = [
            `${randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1)}: The Ultimate Guide to ${topic}`,
            `How to Master ${topic} with ${randomKeyword} Techniques`,
            `10 ${randomKeyword} Strategies for Improving Your ${topic}`,
            `The Complete ${randomKeyword} Guide to ${topic}`,
            `Why ${topic} Matters: ${randomKeyword} Insights for ${targetAudience}`
          ];

          title = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
        } else {
          // No keywords provided
          const titleTemplates = [
            `The Ultimate Guide to ${topic}`,
            `How to Master ${topic} in 5 Simple Steps`,
            `10 Proven Strategies for ${topic}`,
            `Everything You Need to Know About ${topic}`,
            `${topic}: A Comprehensive Guide for ${targetAudience}`
          ];

          title = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
        }

        console.log("response of the title ", title);


        // Add a simulated delay to make it feel more realistic
        return [
          200,
          {
            title,
            metadata: {
              topic,
              keywords,
              targetAudience,
              generationTime: Math.random() * 2 + 0.5, // Random time between 0.5 and 2.5 seconds
              model: 'gemini-pro-mock'
            }
          }
        ];
      } catch (error) {
        console.error('Error in title generation mock:', error);
        return [500, { error: 'Internal server error in title generation' }];
      }
    });

    // Mock section generation endpoint
    mock.onPost('/generate/sections').reply((config) => {
      try {
        const requestData = JSON.parse(config.data);
        const { title, keyword } = requestData;

        // Create mock sections based on the title and keyword
        const mockSections = [
          {
            id: 'section-1',
            title: `Introduction to ${keyword}`,
            content: `This section provides an overview of ${keyword} and why it's important.`
          },
          {
            id: 'section-2',
            title: `Understanding ${keyword} Fundamentals`,
            content: `Learn the core concepts and principles behind ${keyword}.`
          },
          {
            id: 'section-3',
            title: `Benefits of ${keyword}`,
            content: `Discover the key advantages and benefits of implementing ${keyword} in your strategy.`
          },
          {
            id: 'section-4',
            title: `Best Practices for ${keyword}`,
            content: `Follow these industry-proven best practices to maximize your success with ${keyword}.`
          },
          {
            id: 'section-5',
            title: `Common Challenges with ${keyword} and How to Overcome Them`,
            content: `Address the typical obstacles you might face when working with ${keyword} and learn effective solutions.`
          },
          {
            id: 'section-6',
            title: `Case Studies: Successful ${keyword} Implementation`,
            content: `Real-world examples of organizations that have successfully implemented ${keyword}.`
          },
          {
            id: 'section-7',
            title: `Tools and Resources for ${keyword}`,
            content: `A curated list of the best tools, platforms, and resources to help you with ${keyword}.`
          },
          {
            id: 'section-8',
            title: `Future Trends in ${keyword}`,
            content: `Explore upcoming developments and future directions in the field of ${keyword}.`
          },
          {
            id: 'section-9',
            title: `Conclusion: Taking Your ${keyword} Strategy to the Next Level`,
            content: `Summarize key points and provide next steps for advancing your ${keyword} implementation.`
          }
        ];

        return [
          200,
          {
            sections: mockSections,
            score: Math.floor(Math.random() * 30) + 70 // Random score between 70-100
          }
        ];
      } catch (error) {
        return [500, { error: 'Internal server error in section generation' }];
      }
    });

    // Catch-all for unhandled requests
    mock.onAny().reply((config) => {
      console.log('Unhandled request:', config.url);
      return [404, { message: 'Endpoint not mocked' }];
    });

    console.log('🔧 Mock API enabled with AI-powered content generation');
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

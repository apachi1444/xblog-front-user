import type { BaseQueryFn } from '@reduxjs/toolkit/query';

import MockAdapter from 'axios-mock-adapter';
import { createApi } from '@reduxjs/toolkit/query/react';
import { type AxiosError, type AxiosRequestConfig } from 'axios';

import { _posts } from 'src/_mock/_data';
import { _fakeStores } from 'src/_mock/stores';

import customRequest from './axios';
//import { setupGenerateContentMocks } from './mockGenerateContent';

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
    // setupGenerateContentMocks(mock);

    mock.onGet('/stores/').reply(() => [
        200,
        {
          stores: _fakeStores,
          count: _fakeStores.length
        }
      ]);

    // Setup mock for articles endpoint
    mock.onGet(new RegExp(`/all${ARTICLES_BASE_URL}/.*`)).reply(() => [
        200,
        {
          count: _posts.length,
          articles: _posts
        }
      ]);

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

    // Add error handling mock to log what's happening
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

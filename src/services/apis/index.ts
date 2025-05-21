import type { BaseQueryFn } from '@reduxjs/toolkit/query';

import MockAdapter from 'axios-mock-adapter';
import { createApi } from '@reduxjs/toolkit/query/react';
import { type AxiosError, type AxiosRequestConfig } from 'axios';

import { _posts } from 'src/_mock/_data';
import { _fakeStores } from 'src/_mock/stores';

import customRequest from './axios';

// Initialize mock adapter
const mock = new MockAdapter(customRequest, { onNoMatch: 'passthrough' });

// Mock data for subscription with expiration date in 2 days to trigger the banner
const mockSubscriptionDetails = {
  start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  end_date: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
  // Set expiration date to 2 days from now to trigger the banner
  expiration_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  connected_websites: 3,
  websites_limit: 5,
  articles_created: 45,
  articles_limit: 100,
  regeneration_number: 15,
  regeneration_limit: 20,
  subscription_url: 'https://example.com/manage-subscription',
  subscription_name: 'Professional'
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

    // Mock user endpoint
    mock.onGet('/users/me').reply(200, {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '/assets/images/avatar/avatar-1.webp',
      role: 'user',
      created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      is_completed_onboarding: true,
      subscription: {
        name: 'Professional',
        price: 29.99,
        billing_cycle: 'monthly',
        status: 'active'
      },
      regenerations: {
        available: 15,
        total: 50
      }
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

    mock.onGet('/regenerations/status').reply(200, {
      success: true,
      regenerationsAvailable: 15,
      regenerationsTotal: 50
    });

    mock.onPost('/regenerations/use').reply((config) =>
       [200, {
        success: true,
        regenerationsAvailable: 14, // Decreased by 1
        regenerationsTotal: 50
      }]
    );

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
    // Mock generate-keywords endpoint
    mock.onPost('/generate-keywords').reply((config) => {
      try {
        const requestData = JSON.parse(config.data);
        const { primary_keyword } = requestData;

        // Generate mock secondary keywords based on the primary keyword
        const mockKeywords = [
          `what is ${primary_keyword}`,
          `${primary_keyword} meaning`,
          `how does ${primary_keyword} work`,
          `${primary_keyword} basics for beginners`,
          `${primary_keyword} strategies for 2024`,
          `${primary_keyword} tutorial for small business`,
          `${primary_keyword} optimization techniques`,
          `what is on page ${primary_keyword}`,
          `learn ${primary_keyword} online`,
          `best ${primary_keyword} tools for beginners`
        ].join(', ');

        return [
          200,
          {
            keywords: mockKeywords,
            success: true,
            message: null
          }
        ];
      } catch (error) {
        console.error('Error in keywords generation mock:', error);
        return [500, { success: false, message: 'Internal server error in keywords generation' }];
      }
    });

    // Mock generate-title endpoint
    mock.onPost('/generate-title').reply((config) => {
      try {
        const requestData = JSON.parse(config.data);
        const { primary_keyword, content_description } = requestData;

        // Generate a title based on the primary keyword and content description
        const titleTemplates = [
          `What is ${primary_keyword}? A Beginner's Guide to Ranking #1`,
          `The Ultimate ${primary_keyword} Guide for 2024`,
          `How to Master ${primary_keyword} in 5 Simple Steps`,
          `${primary_keyword}: Everything You Need to Know`,
          `Why ${primary_keyword} Matters for Your Business Success`
        ];

        const title = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];

        return [
          200,
          {
            title,
            success: true,
            message: null
          }
        ];
      } catch (error) {
        console.error('Error in title generation mock:', error);
        return [500, { success: false, message: 'Internal server error in title generation' }];
      }
    });

    // Mock generate-topic endpoint
    mock.onPost('/generate-topic').reply((config) => {
      try {
        const requestData = JSON.parse(config.data);
        const { primary_keyword, secondary_keywords } = requestData;

        // Generate content description based on the primary keyword
        const contentTemplates = [
          `Explain "${primary_keyword}" for beginners. Define ${primary_keyword} meaning, and generally how it works. Touch on ranking factors or ${primary_keyword} benefits.`,
          `Create a comprehensive guide about ${primary_keyword} that covers the fundamentals, best practices, and implementation strategies.`,
          `Discuss the importance of ${primary_keyword} in today's digital landscape and how businesses can leverage it for growth.`,
          `Provide an in-depth analysis of ${primary_keyword} techniques, tools, and methodologies for achieving optimal results.`,
          `Explore the evolution of ${primary_keyword}, current trends, and future predictions for this rapidly changing field.`
        ];

        const content = contentTemplates[Math.floor(Math.random() * contentTemplates.length)];

        return [
          200,
          {
            content,
            success: true,
            message: null
          }
        ];
      } catch (error) {
        console.error('Error in topic generation mock:', error);
        return [500, { success: false, message: 'Internal server error in topic generation' }];
      }
    });

    // Mock generate-meta-tags endpoint
    mock.onPost('/generate-meta-tags').reply((config) => {
      try {
        const requestData = JSON.parse(config.data);
        const { primary_keyword, title } = requestData;

        // Generate meta information based on the primary keyword and title
        const meta_title = `${title} | Learn ${primary_keyword} Today`;
        const meta_description = `What is ${primary_keyword} and how does it work? Learn ${primary_keyword} meaning in this beginner's guide and start ranking your website higher today!`;
        const url_slug = primary_keyword.toLowerCase().replace(/\s+/g, '-');

        return [
          200,
          {
            metaTitle: meta_title,
            metaDescription: meta_description,
            urlSlug: url_slug,
            success: true,
            message: null
          }
        ];
      } catch (error) {
        console.error('Error in meta tags generation mock:', error);
        return [500, { success: false, message: 'Internal server error in meta tags generation' }];
      }
    });

    // Mock generate-table-of-contents endpoint
    mock.onPost('/generate-table-of-contents').reply((config) => {
      try {
        const requestData = JSON.parse(config.data);
        const { title, keyword } = requestData;

        // Generate mock sections based on the keyword
        const sections = [
          {
            id: 'section-1',
            title: `Introduction to ${keyword}`,
            status: 'completed'
          },
          {
            id: 'section-2',
            title: `What is ${keyword}?`,
            status: 'completed',
            subsections: [
              {
                id: 'subsection-2-1',
                title: `Definition of ${keyword}`,
                status: 'completed'
              },
              {
                id: 'subsection-2-2',
                title: `History of ${keyword}`,
                status: 'completed'
              }
            ]
          },
          {
            id: 'section-3',
            title: `Why ${keyword} Matters`,
            status: 'completed'
          },
          {
            id: 'section-4',
            title: `Key Components of ${keyword}`,
            status: 'completed'
          },
          {
            id: 'section-5',
            title: `How to Implement ${keyword}`,
            status: 'completed',
            subsections: [
              {
                id: 'subsection-5-1',
                title: `Step 1: Research`,
                status: 'completed'
              },
              {
                id: 'subsection-5-2',
                title: `Step 2: Planning`,
                status: 'completed'
              },
              {
                id: 'subsection-5-3',
                title: `Step 3: Execution`,
                status: 'completed'
              }
            ]
          },
          {
            id: 'section-6',
            title: `Best Practices for ${keyword}`,
            status: 'completed'
          },
          {
            id: 'section-7',
            title: `Common Mistakes to Avoid with ${keyword}`,
            status: 'completed'
          },
          {
            id: 'section-8',
            title: `Tools and Resources for ${keyword}`,
            status: 'completed'
          },
          {
            id: 'section-9',
            title: `Conclusion: Mastering ${keyword}`,
            status: 'completed'
          }
        ];

        return [
          200,
          {
            sections,
            success: true,
            message: null,
            score: 85
          }
        ];
      } catch (error) {
        console.error('Error in table of contents generation mock:', error);
        return [500, { success: false, message: 'Internal server error in table of contents generation' }];
      }
    });

    // Mock generate-internal-links endpoint
    mock.onPost('/generate-internal-links').reply((config) => {
      try {
        const requestData = JSON.parse(config.data);
        const { title, keyword } = requestData;

        // Generate mock sections with internal links
        const sections = [
          {
            id: 'section-1',
            title: `Introduction to ${keyword}`,
            content: `This is an introduction to ${keyword}. It's important to understand [the basics of ${keyword}](#section-2) before diving deeper.`,
            status: 'completed'
          },
          {
            id: 'section-2',
            title: `What is ${keyword}?`,
            content: `${keyword} is a methodology that helps businesses improve their online presence. Learn more about [why ${keyword} matters](#section-3) for your business.`,
            status: 'completed'
          },
          {
            id: 'section-3',
            title: `Why ${keyword} Matters`,
            content: `${keyword} is crucial because it drives traffic and conversions. To implement it effectively, check out our [implementation guide](#section-5).`,
            status: 'completed'
          }
        ];

        return [
          200,
          {
            sections,
            success: true,
            message: null,
            score: 90
          }
        ];
      } catch (error) {
        console.error('Error in internal links generation mock:', error);
        return [500, { success: false, message: 'Internal server error in internal links generation' }];
      }
    });

    // Mock generate-external-links endpoint
    mock.onPost('/generate-external-links').reply((config) => {
      try {
        const requestData = JSON.parse(config.data);
        const { title, keyword } = requestData;

        // Generate mock sections with external links
        const sections = [
          {
            id: 'section-1',
            title: `Introduction to ${keyword}`,
            content: `This is an introduction to ${keyword}. According to [Google](https://www.google.com), ${keyword} is one of the most searched topics.`,
            status: 'completed'
          },
          {
            id: 'section-2',
            title: `What is ${keyword}?`,
            content: `${keyword} is defined by [Wikipedia](https://www.wikipedia.org) as a methodology that helps businesses improve their online presence.`,
            status: 'completed'
          },
          {
            id: 'section-3',
            title: `Why ${keyword} Matters`,
            content: `${keyword} is crucial because it drives traffic and conversions. [Moz](https://moz.com) has published extensive research on this topic.`,
            status: 'completed'
          }
        ];

        return [
          200,
          {
            sections,
            success: true,
            message: null,
            score: 88
          }
        ];
      } catch (error) {
        console.error('Error in external links generation mock:', error);
        return [500, { success: false, message: 'Internal server error in external links generation' }];
      }
    });

    // Mock generate-images endpoint
    mock.onPost('/generate-images').reply((config) => {
      try {
        const requestData = JSON.parse(config.data);
        const { title, keyword } = requestData;

        // Generate mock sections with image suggestions
        const sections = [
          {
            id: 'section-1',
            title: `Introduction to ${keyword}`,
            content: `This is an introduction to ${keyword}.`,
            status: 'completed',
            imagePrompt: `A professional illustration showing the concept of ${keyword} with modern design elements`,
            imageUrl: `https://via.placeholder.com/800x400?text=Introduction+to+${  encodeURIComponent(keyword)}`
          },
          {
            id: 'section-2',
            title: `What is ${keyword}?`,
            content: `${keyword} is a methodology that helps businesses improve their online presence.`,
            status: 'completed',
            imagePrompt: `An infographic explaining the key components of ${keyword} with icons and text`,
            imageUrl: `https://via.placeholder.com/800x400?text=What+is+${  encodeURIComponent(keyword)}`
          },
          {
            id: 'section-3',
            title: `Why ${keyword} Matters`,
            content: `${keyword} is crucial because it drives traffic and conversions.`,
            status: 'completed',
            imagePrompt: `A chart or graph showing the benefits of ${keyword} with upward trending lines`,
            imageUrl: `https://via.placeholder.com/800x400?text=Why+${  encodeURIComponent(keyword)  }+Matters`
          }
        ];

        return [
          200,
          {
            sections,
            success: true,
            message: null,
            score: 92
          }
        ];
      } catch (error) {
        console.error('Error in images generation mock:', error);
        return [500, { success: false, message: 'Internal server error in images generation' }];
      }
    });

    // Mock generate-article endpoint
    mock.onPost('/generate-article').reply((config) => {
      try {
        const requestData = JSON.parse(config.data);
        const { title, keyword, articleSize = 'medium' } = requestData;

        // Determine content length based on article size
        let contentLength = 'medium';
        switch (articleSize.toLowerCase()) {
          case 'small':
            contentLength = 'brief';
            break;
          case 'large':
            contentLength = 'comprehensive';
            break;
          default:
            contentLength = 'detailed';
        }

        // Generate mock full article with sections
        const sections = [
          {
            id: 'section-1',
            title: `Introduction to ${keyword}`,
            content: `Welcome to our ${contentLength} guide on ${keyword}. In this article, we'll explore everything you need to know about ${keyword}, from basic concepts to advanced strategies. Whether you're a beginner or an experienced professional, you'll find valuable insights to enhance your understanding and implementation of ${keyword}.`,
            status: 'completed'
          },
          {
            id: 'section-2',
            title: `What is ${keyword}?`,
            content: `${keyword} refers to a set of practices and techniques designed to improve online visibility and reach target audiences effectively. It encompasses various elements including content optimization, technical setup, and strategic planning. Understanding the fundamentals of ${keyword} is essential for anyone looking to establish a strong online presence.`,
            status: 'completed',
            subsections: [
              {
                id: 'subsection-2-1',
                title: `Definition of ${keyword}`,
                content: `At its core, ${keyword} can be defined as the process of optimizing digital content and properties to increase visibility, attract relevant traffic, and achieve specific business objectives. It involves a combination of technical knowledge, creative content creation, and analytical skills.`,
                status: 'completed'
              },
              {
                id: 'subsection-2-2',
                title: `History of ${keyword}`,
                content: `The concept of ${keyword} has evolved significantly over the years. What began as simple optimization techniques has transformed into a sophisticated discipline that integrates multiple aspects of digital marketing. This evolution reflects the changing landscape of the internet and user behavior.`,
                status: 'completed'
              }
            ]
          },
          {
            id: 'section-3',
            title: `Why ${keyword} Matters`,
            content: `Implementing effective ${keyword} strategies is crucial for several reasons. First, it helps increase visibility among your target audience. Second, it builds credibility and authority in your industry. Third, it drives qualified traffic to your digital properties, potentially leading to higher conversion rates and business growth.`,
            status: 'completed'
          },
          {
            id: 'section-4',
            title: `Key Components of ${keyword}`,
            content: `Successful ${keyword} implementation requires attention to several key components. These include thorough research, strategic planning, quality content creation, technical optimization, and continuous performance monitoring. Each component plays a vital role in the overall effectiveness of your ${keyword} efforts.`,
            status: 'completed'
          },
          {
            id: 'section-5',
            title: `How to Implement ${keyword}`,
            content: `Implementing ${keyword} effectively involves a systematic approach. Begin with comprehensive research to understand your audience and competition. Then, develop a strategic plan that outlines your goals and tactics. Finally, execute your plan methodically, making adjustments based on performance data.`,
            status: 'completed',
            subsections: [
              {
                id: 'subsection-5-1',
                title: `Step 1: Research`,
                content: `The research phase is foundational to successful ${keyword} implementation. During this stage, identify your target audience, analyze competitor strategies, and determine relevant keywords and topics. This information will guide your content creation and optimization efforts.`,
                status: 'completed'
              },
              {
                id: 'subsection-5-2',
                title: `Step 2: Planning`,
                content: `Based on your research findings, develop a comprehensive ${keyword} plan. This should include content calendars, resource allocation, and specific tactics for different channels or platforms. A well-structured plan ensures consistent execution and helps track progress toward your goals.`,
                status: 'completed'
              },
              {
                id: 'subsection-5-3',
                title: `Step 3: Execution`,
                content: `The execution phase involves implementing your ${keyword} plan across various channels. This includes creating and optimizing content, setting up technical elements, and launching campaigns. Maintain quality control throughout this process to ensure all elements align with your strategy.`,
                status: 'completed'
              }
            ]
          },
          {
            id: 'section-6',
            title: `Best Practices for ${keyword}`,
            content: `To maximize the effectiveness of your ${keyword} efforts, follow these best practices: focus on user experience, create high-quality content, optimize for mobile devices, leverage data for decision-making, and stay updated on industry trends and algorithm changes. These practices will help you achieve sustainable results.`,
            status: 'completed'
          },
          {
            id: 'section-7',
            title: `Common Mistakes to Avoid with ${keyword}`,
            content: `When implementing ${keyword}, avoid these common pitfalls: neglecting user experience for technical optimization, creating low-quality content, ignoring mobile optimization, failing to track performance metrics, and using outdated tactics. Being aware of these mistakes will help you develop more effective strategies.`,
            status: 'completed'
          },
          {
            id: 'section-8',
            title: `Tools and Resources for ${keyword}`,
            content: `Numerous tools and resources can support your ${keyword} efforts. These include research tools for keyword analysis, content creation platforms, technical optimization solutions, analytics software, and educational resources. Selecting the right tools for your specific needs can significantly enhance your efficiency and effectiveness.`,
            status: 'completed'
          },
          {
            id: 'section-9',
            title: `Conclusion: Mastering ${keyword}`,
            content: `Mastering ${keyword} requires a combination of knowledge, strategic thinking, and consistent execution. By understanding the fundamental concepts, implementing best practices, and continuously learning and adapting, you can achieve significant results. Remember that ${keyword} is an ongoing process that requires patience and persistence.`,
            status: 'completed'
          }
        ];

        return [
          200,
          {
            sections,
            success: true,
            message: null,
            score: 95
          }
        ];
      } catch (error) {
        console.error('Error in full article generation mock:', error);
        return [500, { success: false, message: 'Internal server error in full article generation' }];
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
      headers = {}, // Initialize headers as empty object if undefined
      responseType,
    } = getRequestConfig(requestConfig);

    // Add the X-API-KEY header for authentication
    const requestHeaders = {
      ...headers,
      'Access-Control-Allow-Origin': '*'
    };

    console.log('Request headers:', requestHeaders);

    try {
      const result = await customRequest({
        url,
        method,
        data: body,
        params,
        headers: requestHeaders,
        responseType,
      });
      return { data: result.data };
    } catch (axiosError) {
      console.log('Error occurred. Headers sent:', requestHeaders);
      console.error('Error details:', axiosError);

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
  tagTypes: ['Articles', 'Stores','User'],
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

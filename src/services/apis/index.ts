/* eslint-disable no-plusplus */
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

import MockAdapter from 'axios-mock-adapter';
import { createApi } from '@reduxjs/toolkit/query/react';
import { type AxiosError, type AxiosRequestConfig } from 'axios';

import { generateInvoiceTemplate } from 'src/utils/invoiceTemplate';
import { logMockApiStatus, validateMockApiConfig } from 'src/utils/mockApiConfig';

import { CONFIG } from 'src/config-global';
import { _fakeStores } from 'src/_mock/stores';
import { _posts, _calendars } from 'src/_mock/_data';

import customRequest from './axios';

// Initialize mock adapter
const mock = new MockAdapter(customRequest, { onNoMatch: 'passthrough' });

// Dynamic counters for mock data
let mockArticleCount = 45; // Starting count
let mockWebsiteCount = 3;  // Starting count

// Mock data for subscription with expiration date in 2 days to trigger the banner
const getMockSubscriptionDetails = () => ({
  start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  end_date: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
  // Set expiration date to 2 days from now to trigger the banner
  expiration_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  connected_websites: mockWebsiteCount,
  websites_limit: 5,
  articles_created: mockArticleCount,
  articles_limit: 100,
  regenerations_number: 0,
  regenerations_limit: 20,
  subscription_url: 'https://example.com/manage-subscription',
  subscription_name: 'Free',
  plan_id: '1' // Matches the Free plan ID in the plans list
});


// Make sure BASE_URL is defined
const ARTICLES_BASE_URL = '/articles';

// Helper to check if mocking should be enabled based on environment variable
const shouldUseMocks = () => CONFIG.useMockApi;

// Setup mock endpoints
const setupMocks = () => {
  if (shouldUseMocks()) {

    mock.onGet('/stores').reply(() => [
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
      const article = _posts.find(post => post.id.toString() === articleId);

      if (article) {
        return [200, article];
      }
      return [404, { message: 'Article not found' }];
    });

    // Mock create article
    mock.onPost(ARTICLES_BASE_URL).reply((config) => {
      const requestData = JSON.parse(config.data);
      console.log('🔥 Mock create article endpoint called with:', requestData);

      // Increment article count for subscription tracking
      mockArticleCount++;
      console.log('🔥 Article count incremented to:', mockArticleCount);

      const newArticle = {
        id: `article_${Date.now()}`,
        title: requestData.title || 'Untitled Article',
        content: requestData.content || '',
        meta_description: requestData.meta_description || '',
        keywords: requestData.keywords || [],
        status: requestData.status || 'draft',
        website_id: requestData.website_id || null,
        featured_media: '', // New articles start without featured media
        platform: 'shopify', // Default platform
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('🔥 Returning created article:', newArticle);
      return [201, newArticle];
    });

    // Mock update article
    mock.onPatch(new RegExp(`${ARTICLES_BASE_URL}/update/.*`)).reply((config) => {
      const requestData = JSON.parse(config.data);
      const articleId = config.url?.split('/').pop();
      console.log('🔥 Mock update article endpoint called for ID:', articleId);
      console.log('🔥 Update data:', requestData);

      // Create a comprehensive updated article object that includes all possible fields
      const updatedArticle = {
        id: articleId,
        // Basic article fields
        title: requestData.article_title || requestData.title || 'Updated Article',
        article_title: requestData.article_title || requestData.title || 'Updated Article',
        content: requestData.content || 'Updated content',
        content__description: requestData.content__description || 'Updated description',

        // Meta fields
        meta_title: requestData.meta_title || 'Updated meta title',
        meta_description: requestData.meta_description || 'Updated meta description',
        url_slug: requestData.url_slug || 'updated-article',

        // Keywords
        primary_keyword: requestData.primary_keyword || 'updated keyword',
        secondary_keywords: requestData.secondary_keywords || '["keyword1", "keyword2"]',

        // Article configuration
        target_country: requestData.target_country || 'global',
        language: requestData.language || 'english',
        article_type: requestData.article_type || 'how-to',
        article_size: requestData.article_size || 'medium',
        tone_of_voice: requestData.tone_of_voice || 'friendly',
        point_of_view: requestData.point_of_view || 'third-person',
        plagiat_removal: requestData.plagiat_removal || false,
        include_cta: requestData.include_cta || false,
        include_images: requestData.include_images || false,
        include_videos: requestData.include_videos || false,

        // Links
        internal_links: requestData.internal_links || '',
        external_links: requestData.external_links || '',

        // Generated content fields - THESE ARE THE IMPORTANT ONES!
        sections: requestData.sections || null,
        toc: requestData.toc || null,
        images: requestData.images || null,
        faq: requestData.faq || null,

        // Media and template
        featured_media: requestData.featured_media || '',
        template_name: requestData.template_name || 'template1',

        // Status and timestamps
        status: requestData.status || 'draft',
        scheduled_publish_date: requestData.scheduled_publish_date || null,
        website_id: requestData.website_id || null,
        platform: requestData.platform || 'shopify',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('🔥 Returning updated article with generated content:', {
        id: updatedArticle.id,
        title: updatedArticle.title,
        content: updatedArticle.content ? `${updatedArticle.content.length} chars` : 'empty',
        toc: updatedArticle.toc ? 'included' : 'null',
        images: updatedArticle.images ? 'included' : 'null',
        faq: updatedArticle.faq ? 'included' : 'null',
        sections: updatedArticle.sections ? 'included' : 'null'
      });

      return [200, updatedArticle];
    });

    // Mock delete article
    mock.onDelete(new RegExp(`${ARTICLES_BASE_URL}/.*`)).reply((config) => {
      const articleId = config.url?.split('/').pop();
      const articleExists = _posts.some(post => post.id.toString() === articleId);

      if (articleExists) {
        // Decrement article count for subscription tracking
        mockArticleCount = Math.max(0, mockArticleCount - 1);
        console.log('🔥 Article count decremented to:', mockArticleCount);
        return [200, { message: `Article ${articleId} deleted successfully` }];
      }
      return [404, { message: 'Article not found' }];
    });

    // Subscription endpoints
    mock.onGet('/subscriptions').reply((config) => {
      const subscriptionData = getMockSubscriptionDetails();
      console.log('🔥 Mock subscription endpoint called:', config.url);
      console.log('🔥 Returning subscription data:', subscriptionData);
      return [200, subscriptionData];
    });

    // Mock subscription plans endpoint
    mock.onGet('/all/plans').reply((config) => {
      console.log('🔥 Mock plans endpoint called:', config.url);
      return [200, [
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
      ]];
    });

    // Mock user endpoint
    mock.onGet('/users/me').reply(200, {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '/assets/images/avatar/avatar-1.webp',
      role: 'user',
      telephone: '+1 (555) 123-4567',
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

    // Mock user update endpoint
    mock.onPatch('/users/me').reply((config) => {
      const updateData = JSON.parse(config.data);
      return [200, {
        id: '1',
        name: updateData.name || 'John Doe',
        email: 'john.doe@example.com',
        avatar: updateData.avatar || '/assets/images/avatar/avatar-1.webp',
        role: 'user',
        telephone: updateData.telephone || '+1 (555) 123-4567',
        created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
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
      }];
    });



    // Mock new user invoices endpoint
    mock.onGet(/\/api\/v1\/user\/invoices\/(.+)/).reply(200, {
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
        },
        {
          id: '3',
          invoiceNumber: 'INV-003',
          amount: 49.99,
          currency: 'USD',
          status: 'paid',
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          plan: 'Premium',
          downloadUrl: 'https://example.com/invoices/INV-003.pdf'
        }
      ],
      count: 3
    });

    // Mock invoice PDF download endpoint
    mock.onGet(/\/api\/v1\/(.+)\/download/).reply((config) => {
      // Extract payment ID from URL
      const paymentId = config.url?.match(/\/api\/v1\/(.+)\/download/)?.[1] || '1';

      // Create mock invoice data based on payment ID
      const invoiceData = {
        // Invoice details
        invoiceNumber: `INV-${paymentId.padStart(3, '0')}`,
        invoiceDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        status: 'due' as const,

        // Company details
        companyName: 'XBlog AI Platform',
        companyAddress: '456 Business Park, Suite 100',
        companyCity: 'San Francisco, CA 94102',
        companyPhone: '+44 7383 596325',
        companyEmail: 'contact@xblog.ai',
        companyWebsite: 'xblog.ai',

        // Customer details
        customerName: 'Acme Corporation',
        customerAddress: '123 Business Ave',
        customerCity: 'New York, NY 10001',
        customerEmail: 'billing@acme.com',

        // Invoice items
        items: [
          {
            description: paymentId === '1' ? 'Starter Plan' : paymentId === '2' ? 'Pro Plan' : 'Premium Plan',
            quantity: 1,
            tax: 10,
            amount: paymentId === '1' ? 29.00 : paymentId === '2' ? 29.99 : 49.99
          }
        ],

        // Totals
        subtotal: paymentId === '1' ? 29.00 : paymentId === '2' ? 29.99 : 49.99,
        totalTax: paymentId === '1' ? 2.90 : paymentId === '2' ? 3.00 : 5.00,
        total: paymentId === '1' ? 31.90 : paymentId === '2' ? 32.99 : 54.99,

        // Payment terms
        paymentTerms: 'Net 30 days. Late payments subject to 1.5% monthly service charge.'
      };

      // Generate the beautiful invoice HTML
      const invoiceHtml = generateInvoiceTemplate(invoiceData);

      return [200, invoiceHtml];
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
      calendars: _calendars,
      total: _calendars.length,
    });

    mock.onPost('/schedule-article').reply((config) => {
      const scheduleData = JSON.parse(config.data);
      const { article_id, scheduled_date } = scheduleData;

      // Find the article in the mock data
      const articleIndex = _posts.findIndex(post => post.id.toString() === article_id.toString());

      if (articleIndex !== -1) {
        // Update the article status and scheduledAt date
        _posts[articleIndex] = {
          ..._posts[articleIndex],
          status: 'scheduled'
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

    // Mock delete calendar entry (unschedule)
    mock.onDelete(/\/calendars\/.*/).reply((config) => {
      const calendarId = config.url?.split('/').pop();

      // Find the calendar entry to get the article_id
      const calendarEntry = _calendars.find(cal => cal.id.toString() === calendarId);

      if (calendarEntry) {
        // Update the corresponding article status to 'draft'
        const articleIndex = _posts.findIndex(post => post.id === calendarEntry.article_id);
        if (articleIndex !== -1) {
          _posts[articleIndex] = {
            ..._posts[articleIndex],
            status: 'draft',
            scheduled_publish_date: undefined // Remove the scheduled date
          };
          console.log(`Article ${calendarEntry.article_id} unscheduled and moved to draft`);
        }

        // Remove the calendar entry from the mock data
        const calendarIndex = _calendars.findIndex(cal => cal.id.toString() === calendarId);
        if (calendarIndex !== -1) {
          _calendars.splice(calendarIndex, 1);
        }
      }

      return [200, {
        success: true,
        message: `Calendar entry ${calendarId} deleted successfully`
      }];
    });

    // Store operations mocks
    mock.onDelete(/\/stores\/.*/).reply((config) => {
      const storeId = config.url?.split('/').pop();

      // Decrement website count for subscription tracking
      mockWebsiteCount = Math.max(0, mockWebsiteCount - 1);
      console.log('🔥 Website count decremented to:', mockWebsiteCount);

      return [200, {
        success: true,
        message: `Store ${storeId} deleted successfully`
      }];
    });

    // Disconnect store mock
    mock.onPatch(/\/stores\/disconnect\/.*/).reply((config) => {
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
    mock.onPatch(/\/stores\/reconnect\/.*/).reply((config) => {
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

    // WordPress connection mock
    mock.onPost('/connect/wordpress').reply((config) => {
      const requestData = JSON.parse(config.data);
      console.log('🔥 Mock WordPress connection endpoint called with:', requestData);

      // Increment website count for subscription tracking
      mockWebsiteCount++;
      console.log('🔥 Website count incremented to:', mockWebsiteCount);

      const newStore = {
        id: `store_${Date.now()}`,
        name: requestData.store_url || 'WordPress Site',
        url: requestData.store_url || 'https://example.com',
        isConnected: true,
        message: 'WordPress site connected successfully'
      };

      console.log('🔥 Returning connected WordPress store:', newStore);
      return [200, newStore];
    });

    // Add store mock (generic store addition)
    mock.onPost('/stores').reply((config) => {
      const requestData = JSON.parse(config.data);
      console.log('🔥 Mock add store endpoint called with:', requestData);

      // Increment website count for subscription tracking
      mockWebsiteCount++;
      console.log('🔥 Website count incremented to:', mockWebsiteCount);

      const newStore = {
        id: `store_${Date.now()}`,
        name: requestData.name || 'New Store',
        url: requestData.url || 'https://example.com',
        platform: requestData.platform || 'unknown',
        isConnected: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('🔥 Returning created store:', newStore);
      return [201, newStore];
    });
    // Mock generate-keywords endpoint
    mock.onPost('/generate-keywords').reply((config) => {
      try {
        // Simulate server overload (20% chance of 500 error for testing retry functionality)
        if (Math.random() < 0.2) {
          console.log('🔥 Simulating server overload (500 error) for keywords generation');
          return [500, {
            success: false,
            message: 'Internal Server Error - Server is temporarily overloaded. Please try again.'
          }];
        }

        const requestData = JSON.parse(config.data);
        const { primary_keyword, language = 'english' } = requestData;

        console.log('🔑 Mock keywords generation called with:', { primary_keyword, language });

        // Generate mock secondary keywords based on the primary keyword and language
        let mockKeywords;

        if (language.toLowerCase() === 'french' || language.toLowerCase() === 'français') {
          // French keywords
          mockKeywords = [
            `qu'est-ce que ${primary_keyword}`,
            `${primary_keyword} définition`,
            `comment fonctionne ${primary_keyword}`,
            `${primary_keyword} pour débutants`,
            `stratégies ${primary_keyword} 2024`,
            `tutoriel ${primary_keyword}`,
            `techniques d'optimisation ${primary_keyword}`,
            `apprendre ${primary_keyword} en ligne`,
            `meilleurs outils ${primary_keyword}`,
            `guide complet ${primary_keyword}`
          ].join(', ');
        } else {
          // English keywords (default)
          mockKeywords = [
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
        }

        console.log('🔑 Generated mock keywords:', mockKeywords);

        return [
          200,
          {
            keywords: mockKeywords,
            success: true,
            message: `Successfully generated secondary keywords in ${language}`
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
        // Simulate server overload (15% chance of 500 error for testing retry functionality)
        if (Math.random() < 0.15) {
          console.log('🔥 Simulating server overload (500 error) for title generation');
          return [500, {
            success: false,
            message: 'Internal Server Error - Server is temporarily overloaded. Please try again.'
          }];
        }

        const requestData = JSON.parse(config.data);
        const { primary_keyword, language = 'english' } = requestData;

        console.log('📝 Mock title generation called with:', { primary_keyword, language });

        // Generate a title based on the primary keyword, content description, and language
        let titleTemplates;
        if (language.toLowerCase() === 'french' || language.toLowerCase() === 'français') {
          titleTemplates = [
            `Qu'est-ce que ${primary_keyword}? Guide Complet pour Débutants`,
            `Le Guide Ultime de ${primary_keyword} pour 2024`,
            `Comment Maîtriser ${primary_keyword} en 5 Étapes Simples`,
            `${primary_keyword}: Tout ce que Vous Devez Savoir`,
            `Pourquoi ${primary_keyword} est Important pour Votre Succès`
          ];
        } else {
          titleTemplates = [
            `What is ${primary_keyword}? A Beginner's Guide to Ranking #1`,
            `The Ultimate ${primary_keyword} Guide for 2024`,
            `How to Master ${primary_keyword} in 5 Simple Steps`,
            `${primary_keyword}: Everything You Need to Know`,
            `Why ${primary_keyword} Matters for Your Business Success`
          ];
        }

        // Return array of title alternatives to match new API format
        const shuffledTitles = [...titleTemplates].sort(() => 0.5 - Math.random());
        const titles = shuffledTitles.slice(0, 3);

        return [
          200,
          {
            titles,
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
        const { primary_keyword } = requestData;

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
        const { primary_keyword, title, language = 'english' } = requestData;

        // Generate meta information based on the primary keyword, title, and language
        let meta_title; let meta_description;
        if (language.toLowerCase() === 'french' || language.toLowerCase() === 'français') {
          meta_title = `${title} | Apprenez ${primary_keyword} Aujourd'hui`;
          meta_description = `Qu'est-ce que ${primary_keyword} et comment ça marche? Apprenez la signification de ${primary_keyword} dans ce guide pour débutants et commencez à mieux classer votre site web dès aujourd'hui!`;
        } else {
          meta_title = `${title} | Learn ${primary_keyword} Today`;
          meta_description = `What is ${primary_keyword} and how does it work? Learn ${primary_keyword} meaning in this beginner's guide and start ranking your website higher today!`;
        }

        const url_slug = primary_keyword.toLowerCase().replace(/\s+/g, '-');

        console.log('🏷️ Generated mock meta tags:', { meta_title, meta_description, url_slug });

        return [
          200,
          {
            metaTitle: meta_title,
            metaDescription: meta_description,
            urlSlug: url_slug,
            success: true,
            message: `Successfully generated meta tags in ${language}`
          }
        ];
      } catch (error) {
        console.error('Error in meta tags generation mock:', error);
        return [500, { success: false, message: 'Internal server error in meta tags generation' }];
      }
    });

    // Mock generate-internal-links endpoint
    mock.onPost('/generate-internal-links').reply((config) => {
      try {
        // Simulate server overload (20% chance of 500 error for testing retry functionality)
        if (Math.random() < 0.20) {
          console.log('🔥 Simulating server overload (500 error) for internal links generation');
          return [500, {
            success: false,
            message: 'Internal Server Error - Server is temporarily overloaded. Please try again.'
          }];
        }

        const requestData = JSON.parse(config.data);
        const { website_url } = requestData;

        if (!website_url) {
          return [400, { success: false, message: 'Website URL is required' }];
        }

        // Generate mock internal links based on the website URL
        const internalLinks = [
          {
            link_text: 'Home',
            link_url: website_url
          },
          {
            link_text: 'About Us',
            link_url: `${website_url}/about`
          },
          {
            link_text: 'Contact Us',
            link_url: `${website_url}/contact`
          }
        ];

        return [
          200,
          {
            internal_links: internalLinks,
            success: true,
            message: null
          }
        ];
      } catch (error) {
        return [500, { success: false, message: 'Internal server error in internal links generation' }];
      }
    });

    // Mock generate-external-links endpoint
    mock.onPost('/generate-external-links').reply((config) => {
      try {
        // Simulate server overload (20% chance of 500 error for testing retry functionality)
        if (Math.random() < 0.20) {
          console.log('🔥 Simulating server overload (500 error) for external links generation');
          return [500, {
            success: false,
            message: 'Internal Server Error - Server is temporarily overloaded. Please try again.'
          }];
        }

        const requestData = JSON.parse(config.data);
        const { primary_keyword } = requestData;

        // Generate mock external links based on the primary keyword and content description
        const externalLinks = [
          {
            link_text: 'Wikipedia',
            link_url: `https://en.wikipedia.org/wiki/${primary_keyword}`
          },
          {
            link_text: 'Google',
            link_url: `https://www.google.com/search?q=${primary_keyword}`
          },
          {
            link_text: 'Moz',
            link_url: `https://moz.com/blog/${primary_keyword}`
          }
        ];
        return [
          200,
          {
            external_links: externalLinks,
            success: true,
            message: null
          }
        ];
      }
      catch (error) {
        return [500, { success: false, message: 'Internal server error in external links generation' }];
      }
    });

    // Mock generate-table-of-contents endpoint
    mock.onPost('/generate-table-of-contents').reply((config) => {
      try {
        const requestData = JSON.parse(config.data);
        const { primary_keyword } = requestData;
        const keyword = "test"

        // Generate mock table of contents based on the primary keyword
        const tableOfContents = [
          {
            heading: `Introduction to ${primary_keyword}`,
            subheadings: [
              `What is ${primary_keyword}?`,
              `Why ${primary_keyword} matters`,
              `Overview of this guide`
            ]
          },
          {
            heading: `Understanding ${primary_keyword}`,
            subheadings: [
              `Key concepts and definitions`,
              `Historical background`,
              `Current trends and developments`
            ]
          },
          {
            heading: `Benefits of ${primary_keyword}`,
            subheadings: [
              `Primary advantages`,
              `Long-term benefits`,
              `ROI considerations`
            ]
          },
          {
            heading: `Implementation Guide`,
            subheadings: [
              `Getting started`,
              `Best practices`,
              `Common pitfalls to avoid`
            ]
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
            table_of_contents: tableOfContents, // ✅ Fixed: use underscore format
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
    
    // Mock generate-images endpoint
    mock.onPost('/generate-images').reply((config) => {
      try {
        const requestData = JSON.parse(config.data);
        const { topic, number_of_images = 3 } = requestData;

        // Generate mock images array with correct format
        const images = Array.from({ length: number_of_images }, (_, index) => ({
          img_text: `Professional image for ${topic} - Image ${index + 1}`,
          img_url: `https://via.placeholder.com/800x400?text=Image+${index + 1}+for+${encodeURIComponent(topic)}`
        }));

        return [
          200,
          {
            images,
            success: true,
            message: 'Images generated successfully'
          }
        ];
      } catch (error) {
        console.error('Error in images generation mock:', error);
        return [500, { success: false, message: 'Internal server error in images generation' }];
      }
    });

    // Mock generate-full-article endpoint
    mock.onPost('/generate-full-article').reply((config) => {
      try {
        // Parse request data and log for debugging
        const requestData = JSON.parse(config.data);
        console.log('🔥 Mock generate-full-article endpoint called with:', {
          title: requestData.title,
          template_name: requestData.template_name,
          language: requestData.language
        });

        // Use the aa.html content with dark theme styling to match the local display
        const articleHtml = `<!DOCTYPE html>
<html lang="english">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Explore the best free mobile games for 2025, with in-depth reviews, gameplay tips, monetization insights, and future trends shaping the industry.">
  <meta name="keywords" content="free mobile games 2025, best android games, free-to-play games, mobile gaming trends">
  <meta name="author" content="Gaming Insights Team">
  <meta property="og:title" content="Top Free Mobile Games 2025: Reviews, Tips & Trends">
  <meta property="og:description" content="Explore the best free mobile games for 2025, with in-depth reviews, gameplay tips, monetization insights, and future trends shaping the industry.">
  <meta property="og:image" content="https://example.com/images/top-mobile-game-2025.png">
  <meta property="og:url" content="https://example.com/articles/best-free-mobile-games-2025">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="https://example.com/articles/best-free-mobile-games-2025">
  <title>Top Free Mobile Games 2025: Reviews, Tips & Trends</title>
</head>
<style>
        body {
            background-color: #1a1a1a;
            color: #ffffff;
        }
        section a, article a, div a {
            color: #60a5fa;
            text-decoration: underline;
        }
        .dark-bg {
            background-color: #2d2d2d;
        }
        .dark-border {
            border-color: #404040;
        }
  </style>
<body class="bg-gray-900 text-white">

    <!---TITLE--->

        <div class="max-w-4xl mx-auto px-4 py-8 bg-gray-900 min-h-screen">
    <!-- Header Section -->
    <header class="mb-12">
      <div class="flex items-center text-sm text-blue-400 mb-3 font-medium">
      </div>
      <h1 class="text-4xl md:text-5xl font-bold mb-4 text-white">
        The Best Free Mobile Games to Play in 2025
      </h1>

    <!---END TITLE--->

    <!---READING LABEL--->

            <div class="flex items-center text-gray-300 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>Read time: 12 minutes</span>
      </div>
    </header>


    <!---END READING LABEL--->

    <!---TABLE OF CONTENTS--->

            <section class="mb-8 bg-gray-800 rounded-lg p-5 border border-gray-700">
              <div class="flex items-center mb-4 text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 mr-2">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                <h2 class="text-lg font-semibold text-white">Table of Contents</h2>
              </div>
              <nav>
                <ul class="space-y-2">

                  <li class="font-medium list-none">
                    <a href="#introduction" class="text-blue-400 hover:text-blue-300 transition-colors">
                      Introduction
                    </a>
                  </li>
                  <li class="font-medium list-none">
                    <a href="#top-5-free-mobile-games-in-2025" class="text-blue-400 hover:text-blue-300 transition-colors">
                      Top 5 Free Mobile Games in 2025
                    </a>
                  </li>
                  <li class="list-disc list-inside text-blue-400">
                    <span>
                      <a href="#game-1:-realm-of-eternia:-tactics" class="text-blue-400 hover:text-blue-300 transition-colors">
                        Game 1: Realm of Eternia: Tactics
                      </a>
                    </span>
                  </li>
                  <li class="list-disc list-inside text-blue-400">
                    <span>
                      <a href="#game-2:-cosmic-crusaders" class="text-blue-400 hover:text-blue-300 transition-colors">
                        Game 2: Cosmic Crusaders
                      </a>
                    </span>
                  </li>
                  <li class="list-disc list-inside text-blue-400">
                    <span>
                      <a href="#game-3:-pocket-pet-paradise" class="text-blue-400 hover:text-blue-300 transition-colors">
                        Game 3: Pocket Pet Paradise
                      </a>
                    </span>
                  </li>
                  <li class="list-disc list-inside text-blue-400">
                    <span>
                      <a href="#game-4:-cyberpunk-city-racer" class="text-blue-400 hover:text-blue-300 transition-colors">
                        Game 4: Cyberpunk City Racer
                      </a>
                    </span>
                  </li>
                  <li class="list-disc list-inside text-blue-400">
                    <span>
                      <a href="#game-5:-mystic-match-mania" class="text-blue-400 hover:text-blue-300 transition-colors">
                        Game 5: Mystic Match Mania
                      </a>
                    </span>
                  </li>
                  <li class="font-medium list-none">
                    <a href="#gameplay-tips-for-casual-gaming" class="text-blue-400 hover:text-blue-300 transition-colors">
                      Gameplay Tips for Casual Gaming
                    </a>
                  </li>
                  <li class="font-medium list-none">
                    <a href="#understanding-free-to-play-monetization" class="text-blue-400 hover:text-blue-300 transition-colors">
                      Understanding Free-to-Play Monetization
                    </a>
                  </li>
                  <li class="list-disc list-inside text-blue-400">
                    <span>
                      <a href="#in-app-purchases" class="text-blue-400 hover:text-blue-300 transition-colors">
                        In-App Purchases
                      </a>
                    </span>
                  </li>
                  <li class="list-disc list-inside text-blue-400">
                    <span>
                      <a href="#advertising-models" class="text-blue-400 hover:text-blue-300 transition-colors">
                        Advertising Models
                      </a>
                    </span>
                  </li>
                  <li class="list-disc list-inside text-blue-400">
                    <span>
                      <a href="#ethical-considerations" class="text-blue-400 hover:text-blue-300 transition-colors">
                        Ethical Considerations
                      </a>
                    </span>
                  </li>
                  <li class="font-medium list-none">
                    <a href="#future-trends-in-mobile-games" class="text-blue-400 hover:text-blue-300 transition-colors">
                      Future Trends in Mobile Games
                    </a>
                  </li>
                  <li class="font-medium list-none">
                    <a href="#conclusion" class="text-blue-400 hover:text-blue-300 transition-colors">
                      Conclusion
                    </a>
                  </li>
                </ul>
              </nav>
            </section>

    <!---END TABLE OF CONTENTS--->

    <!---MAGIC--->

            <!--Introduction -->
            <section id="Introduction"> <h2 class="text-2xl font-bold mb-4 text-white">Introduction</h2> <p class="mb-4 text-gray-300 leading-relaxed">The mobile gaming landscape is constantly evolving, and 2025 promises to be a banner year for free-to-play titles...</p> </section>
            <!--Section one -->
            <section id="top-5-free-mobile-games"> <h2 class="text-2xl font-bold mb-4 text-white">Top 5 Free Mobile Games in 2025</h2> <p class="mb-4 text-gray-300 leading-relaxed">The mobile gaming market continues to explode...</p> </section>
            <!--Section two -->
            <section id="gameplay-tips-for-casual-gaming"> <h2 class="text-2xl font-bold mb-4 text-white">Gameplay Tips for Casual Gaming</h2> <p class="mb-4 text-gray-300 leading-relaxed">Casual mobile gaming offers a fantastic escape...</p> </section>
            <!--Section three -->
            <section id="gameplay-tips-advanced"> <h2 class="text-2xl font-bold mb-4 text-white">Gameplay Tips for Casual Gaming</h2> <p class="mb-4 text-gray-300 leading-relaxed">So, you've downloaded a few free mobile games and are ready to dive in...</p> </section>
            <!--conclusion -->
            <section id="Conclusion"> <h2 class="text-2xl font-bold mb-4 text-white">Conclusion</h2> <p class="mb-4 text-gray-300 leading-relaxed">The mobile gaming landscape in 2025 offers a wealth of free and engaging experiences...</p> </section>

    <!---END MAGIC--->

    <!---FAQ--->

    <section id="faq" class="mb-12">
        <div class="flex items-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 mr-2 text-blue-400">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <path d="M12 17h.01"></path>
            </svg>
            <h2 class="text-2xl font-bold text-white">Frequently Asked Questions</h2>
        </div>
        <div class="border border-gray-700 rounded-lg bg-gray-800">

        <details class="group px-4 py-3 border-b border-gray-700">
              <summary class="flex items-center justify-between cursor-pointer list-none text-left hover:text-blue-400 font-medium text-white">
                Are free mobile games in 2025 safe to download?
                <svg class="w-5 h-5 ml-2 transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div class="mt-3 text-gray-300">
              Most games from official stores like Google Play and App Store are safe, but always check reviews and permissions before installing.
              </div>
            </details>

        <details class="group px-4 py-3 border-b border-gray-700">
              <summary class="flex items-center justify-between cursor-pointer list-none text-left hover:text-blue-400 font-medium text-white">
                Do free mobile games really stay free?
                <svg class="w-5 h-5 ml-2 transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div class="mt-3 text-gray-300">
              Generally, yes, but many include optional in-app purchases or ads to support development.
              </div>
            </details>
        </div></section>
    <!---END FAQ--->

    <!---EXTERNAL LINKS--->

            <section class="rounded-lg border border-gray-700 p-6 bg-gray-800 mb-12">
                <div class="flex items-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         class="h-6 w-6 mr-2 text-blue-400">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    <h2 class="text-2xl font-bold text-white">External Resources</h2>
                </div>

                <div class="space-y-5">

                <div class="border-b border-gray-600 last:border-0 pb-4 last:pb-0">
                    <a
                        href="https://www.statista.com/topics/1906/mobile-gaming/"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-lg font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                    >
                        Statista: Mobile Gaming Market
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             class="ml-1 h-4 w-4">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                    </a>
                </div>

                <div class="border-b border-gray-600 last:border-0 pb-4 last:pb-0">
                    <a
                        href="https://play.google.com/store/apps/category/GAME"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-lg font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                    >
                        Google Play Free Games Ranking
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             class="ml-1 h-4 w-4">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                    </a>
                </div>

                </div>
            </section>

    <!---END EXTERNAL LINKS--->

</body>
</html>`;

        // Return HTML content directly as string (not wrapped in object)
        console.log('✅ Mock generate-full-article returning HTML content successfully');
        return [200, articleHtml];
      } catch (error) {
        console.error('Error in full article generation mock:', error);
        return [500, { success: false, message: 'Internal server error in full article generation' }];
      }
    });

    // Mock generate-faq endpoint
    mock.onPost('/generate-faq').reply((config) => {
      try {
        const requestData = JSON.parse(config.data);
        const { primary_keyword } = requestData;

        // Generate mock FAQ based on the title and primary keyword
        const faq = [
          {
            question: `What is ${primary_keyword}?`,
            answer: `${primary_keyword} is a comprehensive approach that helps businesses achieve their goals through strategic implementation and best practices. It involves understanding key concepts and applying them effectively in real-world scenarios.`
          },
          {
            question: `How does ${primary_keyword} work?`,
            answer: `${primary_keyword} works by following a systematic process that includes planning, implementation, and optimization. The process typically involves analyzing current situations, identifying opportunities, and implementing targeted strategies.`
          },
          {
            question: `What are the benefits of ${primary_keyword}?`,
            answer: `The main benefits of ${primary_keyword} include improved efficiency, better results, cost savings, and enhanced performance. Organizations that implement ${primary_keyword} often see significant improvements in their operations.`
          },
          {
            question: `Who should use ${primary_keyword}?`,
            answer: `${primary_keyword} is suitable for businesses of all sizes, professionals looking to improve their skills, and organizations seeking to optimize their processes. It's particularly valuable for those in competitive industries.`
          },
          {
            question: `How long does it take to see results with ${primary_keyword}?`,
            answer: `Results from ${primary_keyword} can vary depending on implementation and specific goals. However, most organizations begin to see initial improvements within 2-4 weeks, with significant results typically visible within 3-6 months.`
          },
          {
            question: `What are common mistakes to avoid with ${primary_keyword}?`,
            answer: `Common mistakes include rushing the implementation process, not properly training team members, ignoring data and analytics, and failing to adapt strategies based on results. Proper planning and patience are key to success.`
          }
        ];

        return [
          200,
          {
            faq,
            success: true,
            message: 'FAQ generated successfully'
          }
        ];
      } catch (error) {
        console.error('Error in FAQ generation mock:', error);
        return [500, { success: false, message: 'Internal server error in FAQ generation' }];
      }
    });

    // Mock generate-sections endpoint
    mock.onPost('/generate-sections').reply((config) => {
      try {
        const requestData = JSON.parse(config.data);
        const { primary_keyword } = requestData;
        console.log('🔥 Mock generate-sections endpoint called with:', {
          primary_keyword,
          toc: requestData.toc?.length || 0,
          language: requestData.language
        });

        // Generate mock sections in string format (matching API response structure)
        const sectionsObject = {
          introduction: `
html\n<section id="Introduction">\n  <h2>Introduction to ${primary_keyword}</h2>\n  <p>Welcome to our comprehensive guide on ${primary_keyword}. This introduction will provide you with a solid foundation and overview of what you can expect to learn throughout this article.</p>\n  <p>Understanding ${primary_keyword} is crucial for anyone looking to improve their knowledge and skills in this area. We'll cover all the essential aspects and provide practical insights.</p>\n</section>\n
`,
          section_one: `
html\n<section id="what-is-${primary_keyword.toLowerCase().replace(/\s+/g, '-')}">\n  <h2>What is ${primary_keyword}?</h2>\n  <p>${primary_keyword} is a fundamental concept that plays a vital role in modern applications. It encompasses various techniques and methodologies that help achieve specific goals.</p>\n  <p>The importance of ${primary_keyword} cannot be overstated, as it provides the foundation for many advanced concepts and practical implementations.</p>\n  <ul>\n    <li>Key characteristic 1 of ${primary_keyword}</li>\n    <li>Key characteristic 2 of ${primary_keyword}</li>\n    <li>Key characteristic 3 of ${primary_keyword}</li>\n  </ul>\n</section>\n
`,
          section_two: `
html\n<section id="benefits-of-${primary_keyword.toLowerCase().replace(/\s+/g, '-')}">\n  <h2>Benefits of ${primary_keyword}</h2>\n  <p>Implementing ${primary_keyword} offers numerous advantages that can significantly impact your results. Here are the primary benefits you can expect:</p>\n  <div>\n    <h3>Primary Benefits</h3>\n    <ul>\n      <li><strong>Improved efficiency:</strong> ${primary_keyword} streamlines processes and reduces complexity</li>\n      <li><strong>Better results:</strong> Consistent application leads to superior outcomes</li>\n      <li><strong>Cost savings:</strong> Optimized approaches reduce resource requirements</li>\n    </ul>\n  </div>\n</section>\n
`,
          section_three: `
html\n<section id="implementation-guide">\n  <h2>How to Implement ${primary_keyword}</h2>\n  <p>Successfully implementing ${primary_keyword} requires a systematic approach and careful planning. Follow these steps to ensure optimal results:</p>\n  <ol>\n    <li><strong>Planning Phase:</strong> Define your objectives and requirements</li>\n    <li><strong>Preparation:</strong> Gather necessary resources and tools</li>\n    <li><strong>Implementation:</strong> Execute your plan systematically</li>\n    <li><strong>Testing:</strong> Validate results and make adjustments</li>\n    <li><strong>Optimization:</strong> Refine and improve based on feedback</li>\n  </ol>\n</section>\n
`,
          conclusion: `
html\n<section id="Conclusion">\n  <h2>Conclusion</h2>\n  <p>In conclusion, ${primary_keyword} represents a powerful approach that can deliver significant value when properly understood and implemented. Throughout this guide, we've explored the key concepts, benefits, and practical implementation strategies.</p>\n  <p>By following the guidelines and best practices outlined in this article, you'll be well-equipped to leverage ${primary_keyword} effectively in your own projects and initiatives.</p>\n</section>\n
`
        };

        // Return the sections object directly (not wrapped in another object)
        // The transformResponse function will convert this to the expected format
        console.log('✅ Mock generate-sections returning sections object successfully');
        return [200, sectionsObject];
      } catch (error) {
        console.error('Error in sections generation mock:', error);
        return [500, { success: false, message: 'Internal server error in sections generation' }];
      }
    });




    // Mock feedback/ratings endpoint
    mock.onPost('/api/v1/ratings').reply((config) => {
      try {
        const requestData = JSON.parse(config.data);
        const { stars, comment } = requestData;

        console.log('🔥 Mock feedback API called with:', { stars, comment });

        // Validate required fields
        if (!stars || stars < 1 || stars > 5) {
          return [400, {
            success: false,
            message: 'Invalid rating. Stars must be between 1 and 5.'
          }];
        }

        // Simulate successful feedback submission
        const feedbackId = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        console.log('✅ Mock feedback submitted successfully:', {
          feedback_id: feedbackId,
          stars,
          comment: comment || 'No comment provided'
        });

        return [200, {
          success: true,
          message: 'Thank you for your feedback! Your input helps us improve our service.',
          feedback_id: feedbackId
        }];

      } catch (error) {
        console.error('❌ Error in feedback mock API:', error);
        return [500, {
          success: false,
          message: 'Internal server error while processing feedback'
        }];
      }
    });

    // Mock endpoints for drafts
    mock.onGet('/drafts').reply((config) => {
      const { page = 1, limit = 20 } = config.params || {};

      // Mock drafts data
      const mockDrafts = [
        {
          id: 'draft_1',
          title: 'React Native vs React: Understanding the Key Differences',
          content: {
            step1: {
              contentDescription: 'Presentation of React Native & difference between it and react native',
              primaryKeyword: 'React Native vs React',
              secondaryKeywords: ['mobile development', 'web development'],
              language: 'en-us',
              targetCountry: 'us',
              title: 'React Native vs React: Understanding the Key Differences',
            },
            step2: {
              articleType: 'how-to',
              articleSize: 'medium',
              toneOfVoice: 'friendly',
              pointOfView: 'second-person',
            },
            step3: { sections: [] }
          },
          status: 'draft',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          store_id: 1,
          user_id: 'user_123'
        },
        {
          id: 'draft_2',
          title: 'SEO Optimization Tips for E-commerce',
          content: {
            step1: {
              contentDescription: 'SEO Optimization Tips for E-commerce Websites',
              primaryKeyword: 'e-commerce SEO optimization',
              secondaryKeywords: ['product page SEO', 'online store optimization'],
              language: 'en-us',
              targetCountry: 'us',
            },
            step2: {
              articleType: 'listicle',
              articleSize: 'large',
              toneOfVoice: 'professional',
            },
            step3: { sections: [] }
          },
          status: 'draft',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          store_id: 1,
          user_id: 'user_123'
        }
      ];

      return [200, {
        drafts: mockDrafts,
        total: mockDrafts.length,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
      }];
    });

    mock.onGet(/\/drafts\/(.+)/).reply((config) => {
      const draftId = config.url?.split('/').pop();

      const mockDraft = {
        id: draftId,
        title: 'Sample Draft',
        content: {
          step1: {
            contentDescription: 'Sample content description',
            primaryKeyword: 'sample keyword',
            secondaryKeywords: ['keyword1', 'keyword2'],
            language: 'en-us',
            targetCountry: 'us',
          },
          step2: {
            articleType: 'how-to',
            articleSize: 'medium',
            toneOfVoice: 'friendly',
          },
          step3: { sections: [] }
        },
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        store_id: 1,
        user_id: 'user_123'
      };

      return [200, { draft: mockDraft, success: true }];
    });

    mock.onPost('/drafts').reply((config) => {
      const requestData = JSON.parse(config.data);
      const draftId = `draft_${Date.now()}`;

      const newDraft = {
        id: draftId,
        title: requestData.title || 'Untitled Draft',
        content: requestData.content || {},
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        store_id: requestData.store_id || 1,
        user_id: 'user_123'
      };

      return [200, { draft: newDraft, success: true }];
    });

    mock.onPatch(/\/drafts\/(.+)/).reply((config) => {
      const draftId = config.url?.split('/').pop();
      const requestData = JSON.parse(config.data);

      const updatedDraft = {
        id: draftId,
        title: requestData.title || 'Updated Draft',
        content: requestData.content || {},
        status: 'draft',
        created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        store_id: 1,
        user_id: 'user_123'
      };

      return [200, { draft: updatedDraft, success: true }];
    });

    mock.onDelete(/\/drafts\/(.+)/).reply(() => [200, { success: true }]);

    mock.onPost(/\/drafts\/(.+)\/publish/).reply((config) => [200, { success: true, article_id: `article_${Date.now()}` }]);

    // Mock WordPress publish endpoint
    mock.onPost('/publish/wordpress').reply((config) => {
      const requestData = JSON.parse(config.data);

      // Simulate different scenarios for testing
      const shouldSucceed = Math.random() > 0.2; // 80% success rate

      if (shouldSucceed) {
        return [200, {
          success: true,
          message: `Article published successfully to WordPress!`,
          published_url: `https://example-wordpress-site.com/blog/article-${requestData.article_id}`,
          platform: 'WordPress'
        }];
      }

      // Simulate random errors
      const errors = [
        'WordPress authentication failed. Please check your credentials.',
        'WordPress site is temporarily unavailable.',
        'Invalid WordPress REST API endpoint.',
        'Insufficient permissions to publish articles.'
      ];
      const randomError = errors[Math.floor(Math.random() * errors.length)];

      return [400, {
        success: false,
        message: randomError,
        platform: 'WordPress'
      }];
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

// Function to enable/disable mocks dynamically
export const toggleMocks = (enable: boolean) => {
  if (enable) {
    setupMocks();
  } else {
    mock.reset();
    console.log('🔧 Mock API disabled');
  }
};

// Function to initialize mocks based on environment configuration
export const initializeMocks = () => {
  // Validate the environment configuration
  validateMockApiConfig();

  const isTestMode = shouldUseMocks();
  toggleMocks(isTestMode);

  // Log the current configuration status
  logMockApiStatus();
};

// Initial setup based on test mode
initializeMocks();

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
    };

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
      const err = axiosError as AxiosError;

      // The 401 handling is already done in the Axios response interceptor
      // So we just need to return the error here
      return {
        error: {
          status: err.response?.status,
          data: err?.response?.data !== undefined ? err?.response?.data : err.message,
        },
      };
    }
  };

// Cache duration constants (in seconds)
export const CACHE_DURATION = {
  SUBSCRIPTIONS: 3600, // 1 hour
  ARTICLES: 3600,      // 1 hour
  STORES: 3600,        // 1 hour
  USER: 3600,          // 1 hour
  PLANS: 3600,         // 1 hour
};

export const api = createApi({
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Articles', 'Stores', 'User', 'Subscription', 'Plans', 'Drafts', 'SocialConnections'],
  endpoints: () => ({}),
  // Global configuration for all queries
  keepUnusedDataFor: CACHE_DURATION.SUBSCRIPTIONS, // Default cache duration
  refetchOnFocus: false,     // Don't refetch when window regains focus
  refetchOnReconnect: false, // Don't refetch when reconnecting
});

export interface Page<T> {
  getTotalPages: number;
  getTotalElements: number;
  number: number;
  size: number;
  numberOfElements: number;
  content: T[];
}

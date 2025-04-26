import { api } from '.';

// Define the base URL for subscription endpoints
const SUBSCRIPTION_BASE_URL = '/subscriptions';

// Interface for invoice data
export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  plan: string;
  downloadUrl?: string;
}

// Interface for invoice response
interface InvoicesResponse {
  invoices: Invoice[];
  count: number;
}

// Fallback/mock subscription data
const FALLBACK_SUBSCRIPTION_DETAILS: SubscriptionDetails = {
  start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
  end_date: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(), // 335 days from now
  connected_websites: 3,
  websites_limit: 5,
  articles_created: 45,
  articles_limit: 100,
  regeneration_number: 15,
  regeneration_limit: 50,
  subscription_url: 'https://example.com/manage-subscription',
};

// Interface for subscription details
export interface SubscriptionDetails {
  start_date: string;
  end_date: string;
  connected_websites: number;
  websites_limit: number;
  articles_created: number;
  articles_limit: number;
  regeneration_number: number;
  regeneration_limit: number;
  subscription_url: string;
}

// RTK Query endpoints for subscription operations
export const subscriptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get user invoices
    getUserInvoices: builder.query<InvoicesResponse, void>({
      query: () => ({
        url: `${SUBSCRIPTION_BASE_URL}/invoices`,
        method: 'GET',
      }),
    }),
    
    // Get subscription details
    getSubscriptionDetails: builder.query<SubscriptionDetails, void>({
      query: () => ({
        url: `${SUBSCRIPTION_BASE_URL}`,
        method: 'GET',
      }),
      transformErrorResponse: () => {
        console.log('Subscription API error, using fallback data');
        return FALLBACK_SUBSCRIPTION_DETAILS;
      },
    }),

    createSubscription: builder.mutation<void, { planId: string }>({
      query: (data) => ({
        url: `${SUBSCRIPTION_BASE_URL}/create`,
        method: 'POST',
        body: data,
      }),
    }),
    
    // Upgrade subscription
    upgradeSubscription: builder.mutation<void, { planId: string }>({
      query: (data) => ({
        url: `${SUBSCRIPTION_BASE_URL}/upgrade`,
        method: 'PATCH',
        body: data,
      }),
    }),
  }),
});

// Export hooks
export const {
  useGetUserInvoicesQuery,
  useLazyGetUserInvoicesQuery,
  useGetSubscriptionDetailsQuery,
  useLazyGetSubscriptionDetailsQuery,
  useUpgradeSubscriptionMutation,
  useCreateSubscriptionMutation
} = subscriptionApi;

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
  subscription_name: string;
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

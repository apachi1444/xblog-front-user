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
    getSubscriptionDetails: builder.query<any, void>({
      query: () => ({
        url: `${SUBSCRIPTION_BASE_URL}/details`,
        method: 'GET',
      }),
    }),
    
    // Cancel subscription
    cancelSubscription: builder.mutation<void, void>({
      query: () => ({
        url: `${SUBSCRIPTION_BASE_URL}/cancel`,
        method: 'POST',
      }),
    }),
    
    // Upgrade subscription
    upgradeSubscription: builder.mutation<void, { planId: string }>({
      query: (data) => ({
        url: `${SUBSCRIPTION_BASE_URL}/upgrade`,
        method: 'POST',
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
  useCancelSubscriptionMutation,
  useUpgradeSubscriptionMutation,
} = subscriptionApi;
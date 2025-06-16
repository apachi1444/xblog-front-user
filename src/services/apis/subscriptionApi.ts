import { api, CACHE_DURATION } from '.';

// Define the base URL for subscription endpoints
const SUBSCRIPTION_BASE_URL = 'subscriptions';

// Interface for invoice data - Updated to match API response
export interface Invoice {
  payment_id: number;
  plan_id: string;
  plan_name : string;
  customer_id: string;
  email: string;
  amount: string;
  currency: string;
  status: string;
  created_at: string;
  // Computed fields for UI compatibility
  id?: string;
  invoiceNumber?: string;
  createdAt?: string;
  plan?: string;
  downloadUrl?: string;
}

// Interface for invoice response
export interface InvoicesResponse {
  invoices: Invoice[];
  count?: number;
}

// Interface for subscription details
export interface SubscriptionDetails {
  start_date: string;
  end_date: string;
  expiration_date: string; // Date when subscription expires
  connected_websites: number;
  websites_limit: number;
  articles_created: number;
  articles_limit: number;
  regeneration_number: number;
  regeneration_limit: number;
  subscription_url: string;
  subscription_name: string;
  plan_id: string; // ID to match with plans from getSubscriptionPlans
}

// Interface for subscription plan
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  features: string[] | null; // Features might be null from the backend
  url: string;
  // Additional properties that might be used in the UI
  current?: boolean;
  highlight?: boolean;
}

// RTK Query endpoints for subscription operations
export const subscriptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get user invoices - Updated to new endpoint
    getUserInvoices: builder.query<InvoicesResponse, void>({
        query: () => {
        const url = '/user/invoices';
        return {
          url,
          method: 'GET',
        };
      },
    }),

    // Get subscription details
    getSubscriptionDetails: builder.query<SubscriptionDetails, void>({
      query: () => ({
        url: `${SUBSCRIPTION_BASE_URL}`,
        method: 'GET',
        providesTags: ['Subscription'],
        // Cache the subscription details for 1 hour
        keepUnusedDataFor: CACHE_DURATION.SUBSCRIPTIONS,
      }),
    }),

    // Get subscription plans
    getSubscriptionPlans: builder.query<SubscriptionPlan[], void>({
      query: () => ({
        url: '/all/plans',
        method: 'GET',
        providesTags: ['Plans'],
        // Cache the plans for 1 hour
        keepUnusedDataFor: CACHE_DURATION.PLANS,
      }),
    }),

    createSubscription: builder.mutation<void, { plan_id: string }>({
      query: (data) => ({
        url: `${SUBSCRIPTION_BASE_URL}`,
        method: 'POST',
        body: data,
        invalidatesTags: ['Subscription', 'Plans'],
      }),
    }),

    // Upgrade subscription
    upgradeSubscription: builder.mutation<void, { planId: string }>({
      query: (data) => ({
        url: `${SUBSCRIPTION_BASE_URL}/upgrade`,
        method: 'PATCH',
        body: data,
        invalidatesTags: ['Subscription', 'Plans'],
      }),
    }),
  }),
});

// Export hooks
export const {
  useGetUserInvoicesQuery,
  useLazyGetUserInvoicesQuery,
  useGetSubscriptionDetailsQuery,
  useGetSubscriptionPlansQuery,
  useLazyGetSubscriptionPlansQuery,
  useUpgradeSubscriptionMutation,
  useCreateSubscriptionMutation
} = subscriptionApi;

import { api } from '.';

// Define the base URL for plans endpoints
const PLANS_BASE_URL = '/plans';

// Interface for plan data
export interface Plan {
  id: string;
  name: string;
  price: number;
  url: string;
  features?: string[];
}

// Fallback plans data
export const FALLBACK_PLANS : Plan[] = [
  {
    id: "free-plan",
    name: "Free",
    price: 0,
    url: "free-plan",
    features: ["5 Articles/month", "Basic Analytics", "Standard Support"]
  },
  {
    id: "starter-plan",
    name: "Starter",
    price: 29,
    url: "starter-plan",
    features: ["20 Articles/month", "Advanced Analytics", "Priority Support"]
  },
  {
    id: "professional-plan",
    name: "Professional",
    price: 49,
    url: "professional-plan",
    features: ["Unlimited Articles", "Premium Analytics", "24/7 Support", "Custom Publishing"]
  }
];

// Interface for get plans response
export interface GetPlansResponse {
  plans: Plan[];
}

// RTK Query endpoints
export const plansApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get available plans endpoint
    getPlans: builder.query<GetPlansResponse, void>({
      query: () => ({
        url: `${PLANS_BASE_URL}`,
        method: 'GET',
      }),
      transformResponse: (response: GetPlansResponse, meta, arg) => {
        // If the API fails or returns empty data, provide fallback plans
        if (!response || !response.plans || response.plans.length === 0) {
          return {plans: FALLBACK_PLANS};
        }
        return response;
      },
    }),
  }),
});

// Export hooks
export const {
  useGetPlansQuery,
  useLazyGetPlansQuery
} = plansApi;
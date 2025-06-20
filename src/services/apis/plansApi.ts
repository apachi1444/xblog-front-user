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
      providesTags: ['Plans'],
      // Cache the plans for 1 hour to prevent unnecessary refetches
      keepUnusedDataFor: 3600, // 1 hour in seconds
    }),
  }),
});

// Export hooks
export const {
  useGetPlansQuery,
} = plansApi;
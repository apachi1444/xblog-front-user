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
    }),
  }),
});

// Export hooks
export const {
  useGetPlansQuery,
} = plansApi;
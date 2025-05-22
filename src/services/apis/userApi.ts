
import type { AuthUser } from 'src/types/user';

import { api } from '.';


// Define the base URL for user endpoints
const USER_BASE_URL = '/users';

// Interface for updating user information
interface UpdateUserRequest {
  name?: string;
  avatar?: string;
  telephone?: string;
  is_active?: boolean;
  is_completed_onboarding?: boolean;
  interests?: string | null;
  heard_about_us?: string | null;
}

// RTK Query endpoints for user operations
export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user information
    getCurrentUser: builder.query<AuthUser, void>({
      query: () => ({
        url: `${USER_BASE_URL}/me`,
        method: 'GET',
      }),
    }),

    // Update user information
    updateUser: builder.mutation<AuthUser, UpdateUserRequest>({
      query: (userData) => ({
        url: `${USER_BASE_URL}/me`,
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Export hooks
export const {
  useLazyGetCurrentUserQuery,
  useUpdateUserMutation,
} = userApi;
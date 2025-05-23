
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
      query: () => {
        // Force usage of token from localStorage
        let token = null;
        try {
          const authData = localStorage.getItem('xblog_auth_session_v2');
          if (authData) {
            const parsedData = JSON.parse(authData);
            token = parsedData.accessToken;
          }
        } catch (error) {
          console.error('Error retrieving token from localStorage:', error);
        }

        return {
          url: `${USER_BASE_URL}/me`,
          method: 'GET',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        };
      },
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

import type { AuthUser } from 'src/types/user';

import { api } from '.';

// Define the base URL for user endpoints
const USER_BASE_URL = '/users';

// Helper function to get token from localStorage
const getTokenFromStorage = (): string | null => {
  try {
    const authData = localStorage.getItem('xblog_auth_session_v2');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.accessToken || null;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving token from localStorage:', error);
    return null;
  }
};

// Interface for updating user information
interface UpdateUserRequest {
  email?: string;
  name?: string;
  avatar?: string;
  telephone?: string;
  role?: string;
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
        // Manually inject token from localStorage if available
        const token = getTokenFromStorage();
        return {
          url: `${USER_BASE_URL}/me`,
          method: 'GET',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        };
      },
    }),

    // Update user information
    updateUser: builder.mutation<AuthUser, UpdateUserRequest>({
      query: (userData) => {
        // Manually inject token from localStorage if available
        const token = getTokenFromStorage();
        return {
          url: `${USER_BASE_URL}/me`,
          method: 'PATCH',
          body: userData,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        };
      },
      invalidatesTags: ['User'],
    }),
  }),
});

// Export hooks
export const {
  useLazyGetCurrentUserQuery,
  useUpdateUserMutation,
} = userApi;
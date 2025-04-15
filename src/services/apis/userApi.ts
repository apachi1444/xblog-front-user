
import type { AuthUser } from 'src/types/user';

import { api } from '.';


// Define the base URL for user endpoints
const USER_BASE_URL = '/users';

// Interface for updating user information
interface UpdateUserRequest {
  email?: string;
  name?: string;
  avatar?: string;
  telephone?: string;
  role?: string;
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
    }),
  }),
});

// Export hooks
export const {
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useUpdateUserMutation,
} = userApi;
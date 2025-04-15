import { api } from '.';

// Define the base URL for auth endpoints
const AUTH_BASE_URL = '/auth';

// New interface for email/password login response
interface LoginResponse {
  user: {
    email: string;
    avatar?: string;
    telephone: string;
    name: string;
    role?: string;
    created_at?: string;
    updated_at?: string;
  };
}

// New interface for login credentials
interface LoginCredentials {
  email: string;
  password: string;
}

interface VerifyTokenResponse {
  valid: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    picture?: string;
  };
}

interface GoogleAuthResponse {
  token_access: string;
  token_type : string;
}

// RTK Query endpoints
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Google authentication endpoint
    googleAuth: builder.mutation<GoogleAuthResponse, string>({
      query: (accessToken) => ({
        url: `/google/login?token=${accessToken}`,
        method: 'POST',
      }),
    }),
    
    // New email/password login endpoint
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: `${AUTH_BASE_URL}/auth/login`,
        method: 'POST',
        body: credentials,
      }),
    }),
    
    // Verify token endpoint
    verifyToken: builder.query<VerifyTokenResponse, string>({
      query: (token) => ({
        url: `${AUTH_BASE_URL}/auth/verify`,
        method: 'POST',
        body: { token },
      }),
    }),
    
    // Logout endpoint
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `${AUTH_BASE_URL}/auth/logout`,
        method: 'POST',
      }),
    }),
  }),
});

// Export hooks
export const {
  useGoogleAuthMutation,
  useLoginMutation,
  useVerifyTokenQuery,
  useLogoutMutation,
} = authApi;
import { api } from '.';

// Define the base URL for auth endpoints
const AUTH_BASE_URL = '/auth';

// New interface for email/password login response
interface LoginResponse {
  token_access: string;
  token_type: string;
}

// New interface for login credentials
interface LoginCredentials {
  email: string;
  password: string;
}

// Interface for sign up request
interface SignUpRequest {
  name: string;
  email: string;
  avatar: string;
  password: string;
}

// Interface for sign up response
interface SignUpResponse {
  user: {
    email: string;
    avatar?: string;
    name: string;
    created_at?: string;
  };
}

interface GoogleAuthResponse {
  token_access: string;
  token_type: string;
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
        url: `${AUTH_BASE_URL}/login`,
        method: 'POST',
        body: credentials,
      }),
    }),
  
    // Sign up endpoint
    signUp: builder.mutation<SignUpResponse, SignUpRequest>({
      query: (userData) => ({
        url: `${AUTH_BASE_URL}/register`,
        method: 'POST',
        body: userData,
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
  useSignUpMutation,
  useLogoutMutation,
} = authApi;
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

// New interfaces for password operations
interface RequestPasswordResetRequest {
  email: string;
}

interface RequestPasswordResetResponse {
  message: string;
}

interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

interface ResetPasswordResponse {
  message: string;
}

interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

interface ChangePasswordResponse {
  message: string;
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

    // Request password reset (sends email with reset link)
    requestPasswordReset: builder.mutation<RequestPasswordResetResponse, RequestPasswordResetRequest>({
      query: (data) => ({
        url: `${AUTH_BASE_URL}/request-password-reset`,
        method: 'POST',
        body: data,
      }),
    }),

    // Reset password (with token from email)
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: `${AUTH_BASE_URL}/reset-password`,
        method: 'POST',
        body: data,
      }),
    }),

    // Change password (when user is logged in)
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (data) => ({
        url: `${AUTH_BASE_URL}/change-password`,
        method: 'POST',
        body: data,
      }),
    }),

    verifyEmail: builder.mutation<string, {token: string}>({
      query: (data) => ({
        url: `${AUTH_BASE_URL}/verify-email`,
        method: 'GET',
        params: { token: data.token },
      }),
    }),
  }),
});

// Export hooks
export const {
  useGoogleAuthMutation,
  useLoginMutation,
  useSignUpMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useVerifyEmailMutation,
} = authApi;

import { googleLogout, useGoogleLogin } from '@react-oauth/google';

export type GoogleAuthResponse = {
  success: boolean;
  error?: string;
};

export const useGoogleAuth = () => {
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // await dispatch(authenticateWithGoogle(response.access_token)).unwrap();
        // This function should be implemented elsewhere to handle the token
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Authentication failed'
        };
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      return { success: false, error: 'Google login failed' };
    }
  });

  const logOut = () => {
    googleLogout();
    return { success: true };
  };

  return { 
    login: () => login(), // Return the function to be executed when needed
    logOut 
  };
};
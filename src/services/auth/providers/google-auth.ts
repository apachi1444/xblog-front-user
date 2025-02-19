import { googleLogout, useGoogleLogin } from '@react-oauth/google';


export const useGoogleAuth = () => {
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // await dispatch(authenticateWithGoogle(response.access_token)).unwrap();
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
    googleLogout()
  }

  return { login , logOut};
}; 
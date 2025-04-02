import { useGoogleAuth } from './providers/google-auth';

export type AuthResponse = {
  success: boolean;
  error?: string;
};

export type Provider = 'google';

export const useAuthService = () => {
  const googleAuth = useGoogleAuth();

  const loginWithProvider = (provider: Provider): void => {
    switch (provider) {
      case 'google':
        googleAuth.login();
        break;
      default:
        console.error(`Unsupported provider: ${provider}`);
        break;
    }
  };

  const logoutFromProvider = (provider: Provider): AuthResponse => {
    try {
      switch (provider) {
        case 'google':
          return googleAuth.logOut();
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Logout failed'
      };
    }
  };

  return { 
    loginWithProvider,
    logoutFromProvider
  };
};
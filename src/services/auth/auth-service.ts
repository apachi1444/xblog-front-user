import { useGoogleAuth } from './providers/google-auth';
import { useGithubAuth } from './providers/github-auth';
import { useFacebookAuth } from './providers/facebook-auth';

export type AuthResponse = {
  success: boolean;
  error?: string;
};

export type Provider = 'google' | 'github' | 'facebook';

export const useAuthService = () => {
  const googleAuth = useGoogleAuth();
  const githubAuth = useGithubAuth();
  const facebookAuth = useFacebookAuth();

  const loginWithProvider = async (provider: Provider): Promise<AuthResponse> => {
    try {
      switch (provider) {
        case 'google':
          // return await googleAuth.login();
          return await githubAuth.login();
        case 'github':
          return await githubAuth.login();
        case 'facebook':
          return await facebookAuth.login();
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      };
    }
  };

  return { loginWithProvider };
}; 
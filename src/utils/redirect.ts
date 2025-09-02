export const createSignUpUrlWithEmail = (email: string): string => {
  try {
    // Encode the email to handle special characters
    const encodedEmail = encodeURIComponent(email.trim());

    // Construct the URL with query parameters (relative URL for React Router)
    const url = new URL('/sign-up', window.location.origin);
    url.searchParams.set('redirect_from', 'homepage');
    url.searchParams.set('email', encodedEmail);

    return url.toString();
  } catch (error) {
    console.warn('Error creating sign-up URL with email:', error);
    // Fallback to basic sign-up URL
    return '/sign-up';
  }
};

export const extractEmailFromUrl = (searchParams: string): string => {
  try {
    const urlParams = new URLSearchParams(searchParams);
    const email = urlParams.get('email');
    const redirectFrom = urlParams.get('redirect_from');

    if (email && redirectFrom === 'homepage') {
      const decodedEmail = decodeURIComponent(email);
      return decodedEmail;
    }

    return '';
  } catch (error) {
    return '';
  }
};

export const hasValidRedirectParams = (searchParams: string): boolean => {
  const urlParams = new URLSearchParams(searchParams);
  const email = urlParams.get('email');
  const redirectFrom = urlParams.get('redirect_from');
  
  return !!(email && redirectFrom === 'homepage');
};

export const cleanUrlParams = (paramsToRemove: string[] = ['email', 'redirect_from']): void => {
  try {
    const newUrl = new URL(window.location.href);

    paramsToRemove.forEach(param => {
      newUrl.searchParams.delete(param);
    });

    // Replace the current URL without the parameters
    window.history.replaceState({}, '', newUrl.toString());
  } catch (error) {
    console.warn('Error cleaning URL parameters:', error);
  }
};

export const redirectToSignUpWithEmail = (email: string): void => {
  const signUpUrl = createSignUpUrlWithEmail(email);
  window.location.href = signUpUrl;
};

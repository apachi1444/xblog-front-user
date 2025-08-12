import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAnalytics } from 'src/contexts/analytics-context';

// Page name mapping for better analytics
const PAGE_NAME_MAP: Record<string, string> = {
  '/': 'Home',
  '/home': 'Home',
  '/user': 'User Dashboard',
  '/generate': 'Generate Flow',
  '/create': 'Create Article',
  '/products': 'Products',
  '/blog': 'Blog Management',
  '/stores': 'Stores Management',
  '/settings': 'Settings',
  '/profile': 'Profile',
  '/calendar': 'Calendar',
  '/templates': 'Templates',
  '/ai-chat': 'AI Chat',
  '/upgrade-license': 'Upgrade License',
  '/book-demo': 'Book Demo',
  '/add-store': 'Add Store',
  '/onboarding': 'Onboarding',
  '/onboarding/success': 'Onboarding Success',
  '/mock-payment': 'Mock Payment',
  '/sign-in': 'Sign In',
  '/sign-up': 'Sign Up',
  '/verify-email': 'Verify Email',
  '/forgot-password': 'Forgot Password',
  '/reset-password': 'Reset Password',
  '/404': 'Page Not Found',
  '/error-test': 'Error Test',
  '/article-preview-demo': 'Article Preview Demo',
  '/test-draft-editing': 'Test Draft Editing',
};

// Extract page name from pathname
function getPageName(pathname: string): string {
  // Check for exact matches first
  if (PAGE_NAME_MAP[pathname]) {
    return PAGE_NAME_MAP[pathname];
  }

  // Handle dynamic routes
  if (pathname.startsWith('/templates/')) {
    return 'Template Preview';
  }

  if (pathname.startsWith('/create/')) {
    return 'Create Article - Step';
  }

  if (pathname.startsWith('/blog/')) {
    return 'Blog Article Details';
  }

  if (pathname.startsWith('/stores/')) {
    return 'Store Details';
  }

  // Fallback: clean up pathname for display
  const cleanPath = pathname
    .split('/')
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' - ');

  return cleanPath || 'Unknown Page';
}

// Component to track page views automatically
export function PageViewTracker() {
  const location = useLocation();
  const analytics = useAnalytics();

  useEffect(() => {
    if (!analytics.isInitialized) {
      return;
    }

    const pageName = getPageName(location.pathname);
    
    // Track page view with enhanced data
    analytics.trackEnhancedEvent('page_view', 'navigation', {
      page_name: pageName,
      page_path: location.pathname,
      page_search: location.search,
      page_hash: location.hash,
      referrer: document.referrer,
    });

    // Also send to gtag for standard GA4 page view tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-GHWWXY67FK', {
        page_title: pageName,
        page_location: window.location.href,
        page_path: location.pathname,
      });
    }

    console.log('📊 Page view tracked:', pageName, location.pathname);
  }, [location.pathname, location.search, location.hash, analytics]);

  // This component doesn't render anything
  return null;
}

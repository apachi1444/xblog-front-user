import { useLocation } from 'react-router-dom';

// Define the routes where the support chat should be visible
const SUPPORT_CHAT_VISIBLE_ROUTES = [
  '/', // Dashboard/home
  '/templates',
  '/blog',
  '/generate',
  '/create',
  '/stores',
  '/calendar',
];

/**
 * Hook to determine if the support chat should be visible based on the current route
 * @returns {boolean} Whether the support chat should be visible
 */
export const useSupportChatVisibility = (): boolean => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Check if the current path is in the list of routes where the chat should be visible
  // or if it's a sub-route of one of those routes (e.g., /templates/123)
  return SUPPORT_CHAT_VISIBLE_ROUTES.some(route => 
    currentPath === route || 
    (route !== '/' && currentPath.startsWith(`${route  }/`))
  );
};

import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRewards } from 'src/contexts/RewardsContext';

// ----------------------------------------------------------------------

interface CrispChatProps {
  /**
   * Routes where Crisp chat should be visible
   * Default: ['/'] (only home page)
   */
  visibleRoutes?: string[];
  /**
   * Crisp website ID
   */
  websiteId?: string;
  /**
   * Custom positioning styles
   */
  position?: {
    bottom?: string;
    right?: string;
    left?: string;
    top?: string;
  };
}

// Extend window interface to include Crisp
declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

export function CrispChat({ 
  visibleRoutes = ['/'], 
  websiteId = "0f340101-1ddb-44b7-8023-a5ac1013bcb1",
  position = { bottom: '20px', right: '20px' }
}: CrispChatProps) {
  const location = useLocation();
  const { isRewardsSidebarOpen } = useRewards();
  const scriptLoadedRef = useRef(false);
  const crispInitializedRef = useRef(false);

  // Check if current route should show Crisp chat and rewards sidebar is not open
  const shouldShowCrisp = visibleRoutes.includes(location.pathname) && !isRewardsSidebarOpen;

  // Load Crisp script
  useEffect(() => {
    if (shouldShowCrisp && !scriptLoadedRef.current) {
      // Initialize Crisp
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = websiteId;

      // Create and append script
      const script = document.createElement('script');
      script.src = 'https://client.crisp.chat/l.js';
      script.async = true;
      
      script.onload = () => {
        scriptLoadedRef.current = true;
        crispInitializedRef.current = true;
        
        // Apply custom positioning if provided
        if (position && window.$crisp) {
          // Wait for Crisp to be fully loaded
          setTimeout(() => {
            const crispElement = document.querySelector('.crisp-client') as HTMLElement;
            if (crispElement) {
              Object.assign(crispElement.style, {
                bottom: position.bottom || '20px',
                right: position.right || '20px',
                left: position.left || 'auto',
                top: position.top || 'auto',
              });
            }
          }, 1000);
        }
      };

      document.head.appendChild(script);
    }
  }, [shouldShowCrisp, websiteId, position]);

  // Show/hide Crisp based on route and rewards sidebar state
  useEffect(() => {
    if (scriptLoadedRef.current && window.$crisp) {
      if (shouldShowCrisp) {
        // Show Crisp chat
        window.$crisp.push(['do', 'chat:show']);
      } else {
        // Hide Crisp chat
        window.$crisp.push(['do', 'chat:hide']);
      }
    }
  }, [shouldShowCrisp, isRewardsSidebarOpen]);

  // Cleanup on unmount
  useEffect(() => () => {
      if (window.$crisp && crispInitializedRef.current) {
        window.$crisp.push(['do', 'chat:hide']);
      }
    }, []);

  return null; // This component doesn't render anything visible
}

// Hook for controlling Crisp chat programmatically
export function useCrispChat() {
  const openChat = () => {
    if (window.$crisp) {
      window.$crisp.push(['do', 'chat:open']);
    }
  };

  const closeChat = () => {
    if (window.$crisp) {
      window.$crisp.push(['do', 'chat:close']);
    }
  };

  const hideChat = () => {
    if (window.$crisp) {
      window.$crisp.push(['do', 'chat:hide']);
    }
  };

  const showChat = () => {
    if (window.$crisp) {
      window.$crisp.push(['do', 'chat:show']);
    }
  };

  const setMessage = (message: string) => {
    if (window.$crisp) {
      window.$crisp.push(['set', 'message:text', message]);
    }
  };

  const setUserData = (data: { email?: string; name?: string; [key: string]: any }) => {
    if (window.$crisp) {
      if (data.email) {
        window.$crisp.push(['set', 'user:email', data.email]);
      }
      if (data.name) {
        window.$crisp.push(['set', 'user:nickname', data.name]);
      }
    }
  };

  return {
    openChat,
    closeChat,
    hideChat,
    showChat,
    setMessage,
    setUserData,
  };
}

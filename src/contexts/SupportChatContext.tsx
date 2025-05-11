import type { ReactNode } from 'react';

import { useTranslation } from 'react-i18next';
import React, { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';
import { useSupportChatVisibility } from 'src/hooks/useSupportChatVisibility';

// Define message types
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

// Define context type
interface SupportChatContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  unreadCount: number;
  isVisible: boolean; // Whether the chat is visible on the current route
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (text: string) => void;
  markAllAsRead: () => void;
}

// Create context with default values
const SupportChatContext = createContext<SupportChatContextType>({
  isOpen: false,
  messages: [],
  unreadCount: 0,
  isVisible: false,
  openChat: () => {},
  closeChat: () => {},
  toggleChat: () => {},
  sendMessage: () => {},
  markAllAsRead: () => {},
});

// Sample automated responses based on user input
const automatedResponses: Record<string, string[]> = {
  default: [
    "Thank you for reaching out! Our support team will get back to you shortly.",
    "I'll connect you with a specialist who can help with that.",
    "Thanks for your message. How else can I assist you today?",
  ],
  greeting: [
    "Hello! How can I help you today?",
    "Hi there! What can I assist you with?",
    "Welcome to our support chat! How may I help you?",
  ],
  pricing: [
    "We offer several pricing plans to fit your needs. The Basic plan starts at $9.99/month, while our Pro plan is $29.99/month with additional features.",
    "Our pricing is flexible based on your needs. Would you like me to send you our detailed pricing information?",
  ],
  account: [
    "For account-related issues, I can help you troubleshoot or connect you with our account specialists.",
    "I'd be happy to help with your account. Could you please provide more details about the issue you're experiencing?",
  ],
  feature: [
    "That feature is available in our Pro and Enterprise plans. Would you like more information about it?",
    "I'd be happy to explain how that feature works. What specific aspect are you interested in?",
  ],
};

// Helper function to get an automated response
const getAutomatedResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return automatedResponses.greeting[Math.floor(Math.random() * automatedResponses.greeting.length)];
  } if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
    return automatedResponses.pricing[Math.floor(Math.random() * automatedResponses.pricing.length)];
  } if (lowerMessage.includes('account') || lowerMessage.includes('login') || lowerMessage.includes('sign in')) {
    return automatedResponses.account[Math.floor(Math.random() * automatedResponses.account.length)];
  } if (lowerMessage.includes('feature') || lowerMessage.includes('function') || lowerMessage.includes('can it')) {
    return automatedResponses.feature[Math.floor(Math.random() * automatedResponses.feature.length)];
  }

  return automatedResponses.default[Math.floor(Math.random() * automatedResponses.default.length)];
};

// Provider component
export const SupportChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Check if the chat should be visible on the current route
  const isChatVisibleOnRoute = useSupportChatVisibility();

  // Initialize with welcome message
  useEffect(() => {
    // Only initialize if the chat is visible on this route
    if (isChatVisibleOnRoute) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        text: t('support.welcomeMessage', 'Hello! How can I help you today?'),
        sender: 'support',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [t, isChatVisibleOnRoute]);

  // Mark all messages as read
  const markAllAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  // Open chat
  const openChat = useCallback(() => {
    setIsOpen(true);
    markAllAsRead();
  }, [markAllAsRead]);

  // Close chat
  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Toggle chat
  const toggleChat = useCallback(() => {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }, [isOpen, closeChat, openChat]);

  // Send a message
  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate support response after a delay
    setTimeout(() => {
      const supportMessage: ChatMessage = {
        id: `support-${Date.now()}`,
        text: getAutomatedResponse(text),
        sender: 'support',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, supportMessage]);

      // Increment unread count if chat is closed
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    }, 1000);
  }, [isOpen]);

  return (
    <SupportChatContext.Provider
      value={useMemo(() => ({
        isOpen,
        messages,
        unreadCount,
        isVisible: isChatVisibleOnRoute,
        openChat,
        closeChat,
        toggleChat,
        sendMessage,
        markAllAsRead,
      }), [isOpen, messages, unreadCount, isChatVisibleOnRoute, openChat, closeChat, toggleChat, sendMessage, markAllAsRead])}
    >
      {children}
    </SupportChatContext.Provider>
  );
};

// Custom hook to use the support chat context
export const useSupportChat = () => useContext(SupportChatContext);



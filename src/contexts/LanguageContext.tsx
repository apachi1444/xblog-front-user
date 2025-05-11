import type { ReactNode } from 'react';

import { useTranslation } from 'react-i18next';
import React, { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';

// Local storage key for language preference
const LANGUAGE_STORAGE_KEY = 'language';

// Define the context type
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
});

// Props for the LanguageProvider component
interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: string;
}

// Provider component that wraps the app
export function LanguageContextProvider({ children, defaultLanguage = 'en' }: LanguageProviderProps) {
  const { i18n } = useTranslation();
  
  // Initialize state from localStorage or default to provided language
  const [language, setLanguageState] = useState<string>(() => {
    try {
      const storedValue = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      // Return the stored value if it exists, otherwise use default
      return storedValue || defaultLanguage;
    } catch (error) {
      console.error('Error reading language from localStorage:', error);
      return defaultLanguage; // Default language on error
    }
  });

  // Update localStorage and i18n when language changes
  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      
      // Update i18n language
      if (i18n.language !== language) {
        i18n.changeLanguage(language);
      }
      
      // Dispatch a custom event so other components can react to language changes
      window.dispatchEvent(new CustomEvent('languageChange', { detail: { language } }));
    } catch (error) {
      console.error('Error saving language to localStorage:', error);
    }
  }, [language, i18n]);

  // Set language function
  const setLanguage = useCallback((newLanguage: string) => {
    setLanguageState(newLanguage);
  }, []);

  // Create the context value object
  const contextValue = useMemo(() => ({
    language,
    setLanguage,
  }), [language, setLanguage]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageContextProvider');
  }
  return context;
}


// eslint-disable-next-line import/no-extraneous-dependencies
import i18n from "i18next";
// eslint-disable-next-line import/no-extraneous-dependencies
import { initReactI18next } from "react-i18next";

import enJSON from './en/en.json'
import ptJSON from './pt/pt.json'
import frJSON from './fr/fr.json'
import arJSON from './ar/ar.json'
import ruJSON from './ru/ru.json'
import esJSON from './es/es.json'

// Get language from localStorage or default to 'en'
const getInitialLanguage = (): string => {
  try {
    const storedLanguage = localStorage.getItem('language');
    return storedLanguage || 'en';
  } catch (error) {
    console.error('Error reading language from localStorage:', error);
    return 'en';
  }
};

i18n.use(initReactI18next).init({
  resources: {
    en: enJSON,
    pt: ptJSON,
    fr: frJSON,
    ar: arJSON,
    ru: ruJSON,
    es: esJSON
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false // React already escapes values
  }
});

export default i18n;
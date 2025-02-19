// eslint-disable-next-line import/no-extraneous-dependencies
import i18n from "i18next";
// eslint-disable-next-line import/no-extraneous-dependencies
import { initReactI18next } from "react-i18next";

import enJSON from './en/en.json'
import ptJSON from './pt/pt.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { ...enJSON },
    pt: { ...ptJSON },
  },
  lng: "en",
});
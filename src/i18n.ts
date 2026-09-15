import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import deLocale from './locales/de/de.json';
import enLocale from './locales/en//en.json';
import frLocale from './locales/fr/fr.json';
import twLocale from './locales/gh/tw.json';
import plLocale from './locales/pl/pl.json';

i18n
  .use(LanguageDetector) // 1. Automatically analyzes browser, headers, and device cookies
  .use(initReactI18next) 
  .init({
    resources: {
      en: { translation: enLocale },
      pl: { translation: plLocale },
      fr: { translation: frLocale },
      tw: { translation: twLocale },
      de: { translation: deLocale }
    },
    // ============================================================
    // THE SMART DETECT & FALLBACK CONFIGURATION
    // ============================================================
    // Only accept exact matches from this array group
    supportedLngs: ['en', 'pl', 'fr','tw','de'], 
    
    // If a user's device is set to an unsupported language (e.g., German 'de' or Spanish 'es'),
    // it skips guessing loops and gracefully snaps flush onto English.
    fallbackLng: 'en', 

    // Forces regional variants (like 'pl-PL' or 'en-US') to simplify down to their 2-letter roots ('pl', 'en')
    nonExplicitSupportedLngs: true,

    detection: {
      // Order of operations: Checks custom storage first (if they manually flipped a toggle),
      // then falls back to reading their native device browser configuration.
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'] // Saves choices so returning visits remain cached
    },

    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;


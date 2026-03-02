import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

// Get initial language from URL path
const getInitialLanguageFromURL = (): string => {
  if (typeof window !== 'undefined') {
    const pathLang = window.location.pathname.split('/')[1];
    if (pathLang === 'en' || pathLang === 'ar') {
      return pathLang;
    }
  }
  return 'ar'; // default to Arabic
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguageFromURL(),
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

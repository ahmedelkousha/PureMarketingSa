import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const getInitialLanguage = () => {
    const pathLang = location.pathname.split('/')[1];
    if (pathLang === 'en' || pathLang === 'ar') {
      return pathLang;
    }
    return 'ar'; // Default to Arabic
  };

  const [language, setLanguageState] = useState(getInitialLanguage);
  const isRTL = language === 'ar';

  useEffect(() => {
    const pathLang = location.pathname.split('/')[1];
    if (pathLang === 'en' || pathLang === 'ar') {
      if (pathLang !== language) {
        setLanguageState(pathLang);
        i18n.changeLanguage(pathLang);
      }
    }
  }, [location.pathname, language, i18n]);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRTL, language]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    
    const currentPath = location.pathname;
    const pathParts = currentPath.split('/');
    
    if (pathParts[1] === 'en' || pathParts[1] === 'ar') {
      pathParts[1] = lang;
    } else {
      pathParts.splice(1, 0, lang);
    }
    
    navigate(pathParts.join('/') || `/${lang}`);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

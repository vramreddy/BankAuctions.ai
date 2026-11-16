import React, { createContext, useContext, useEffect, useState } from 'react';
import { LANGUAGES, validLanguage, translate } from './translation.js';

export const LanguageContext = createContext({ language: 'en', setLanguage: () => {}, locale: 'en-IN' });
export function LanguageProvider({ children }) {
  const [language, updateLanguage] = useState(() => {
    try { return validLanguage(localStorage.getItem('ba_language')); } catch { return 'en'; }
  });
  const setLanguage = (code) => updateLanguage(validLanguage(code));
  useEffect(() => {
    document.documentElement.lang = language;
    try { localStorage.setItem('ba_language', language); } catch { /* Storage may be unavailable in private browsing. */ }
  }, [language]);
  useEffect(() => {
    const sync = event => { if (event.key === 'ba_language') updateLanguage(validLanguage(event.newValue)); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const locale = LANGUAGES.find(item => item.code === language).locale;
  return React.createElement(LanguageContext.Provider, { value: { language, setLanguage, locale, t: text => translate(text, language) } }, children);
}
export const useLanguage = () => useContext(LanguageContext);

// hooks/useLocale.js
import {createContext, useContext, useEffect, useState} from 'react';

export const translations = {
  en: {label_shirt: 'T-shirt', label_hoodie: 'Hoodies'},
  sk: {label_shirt: 'Tričká', label_hoodie: 'Mikiny'},
};

const LocaleContext = createContext(null);

export function LocaleProvider({children, initialLanguage = 'en'}) {
  const norm = (initialLanguage || 'en').toLowerCase();
  const [language, setLanguage] = useState(translations[norm] ? norm : 'en');

  // ⬇️ kľúčové: keď sa zmení initialLanguage (napr. klik na /sk), zmeň stav
  useEffect(() => {
    const next = (initialLanguage || 'en').toLowerCase();
    setLanguage(translations[next] ? next : 'en');
  }, [initialLanguage]);

  const changeLanguage = (newLang) => {
    const l = (newLang || 'en').toLowerCase();
    setLanguage(translations[l] ? l : 'en');
  };

  const t = translations[language] || translations.en;

  return (
    <LocaleContext.Provider
      value={{
        language,
        t,
        changeLanguage,
        availableLanguages: Object.keys(translations),
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider');
  return ctx;
}

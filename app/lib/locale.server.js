// app/lib/locale.server.js

// Definícia podporovaných jazykov
const LOCALES = {
  en: {language: 'EN', country: 'US', pathPrefix: 'en'},
  sk: {language: 'SK', country: 'SK', pathPrefix: 'sk'},
};

export function getLocaleFromRequest(request) {
  try {
    const url = new URL(request.url);
    // Hľadáme prefix ako /sk alebo /en na začiatku cesty
    const match = url.pathname.match(/^\/(en|sk)(\/|$)/i);
    const code = match ? match[1].toLowerCase() : null;

    if (code && LOCALES[code]) {
      return LOCALES[code];
    }

    // Ak nič nenájdeme, vrátime defaultný jazyk z prostredia
    const fallback =
      LOCALES[import.meta.env.VITE_PUBLIC_DEFAULT_LOCALE || 'en'];
    return fallback;
  } catch (err) {
    console.error('getLocaleFromRequest error:', err);
    return LOCALES.en;
  }
}

export {LOCALES};

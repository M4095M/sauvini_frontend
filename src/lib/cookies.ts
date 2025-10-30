import Cookies from 'js-cookie';
import { Language, DEFAULT_LANGUAGE, LANGUAGE_COOKIE_NAME, SUPPORTED_LANGUAGES } from "./language";

// Client-side function to get language from cookies
export function getClientLanguage(): Language {
  const language = Cookies.get(LANGUAGE_COOKIE_NAME) as Language;
  
  if (language && Object.keys(SUPPORTED_LANGUAGES).includes(language)) {
    return language;
  }
  
  return DEFAULT_LANGUAGE;
}

// Client-side function to set language cookie
export function setLanguageCookie(language: Language): void {
  Cookies.set(LANGUAGE_COOKIE_NAME, language, { 
    expires: 365, // 1 year
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
}

// Function to detect browser language with fallback
export function getBrowserLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const browserLang = navigator.language.split('-')[0] as Language;
  return Object.keys(SUPPORTED_LANGUAGES).includes(browserLang) ? browserLang : DEFAULT_LANGUAGE;
}

import { useLanguage } from "@/context/LanguageContext";

/**
 * A safe translation hook that provides fallback values and prevents "Missing translation" errors
 * from appearing in the UI. This is useful for components that need graceful degradation.
 */
export function useSafeTranslation() {
  const { t, hasTranslation, isRTL } = useLanguage();

  /**
   * Safe translation function that returns a fallback if the translation is missing
   * @param key - The translation key
   * @param fallback - The fallback text to use if translation is missing
   * @param hideMissing - Whether to hide "Missing translation:" messages (default: true)
   * @returns The translated text or fallback
   */
  const safeTranslate = (
    key: string,
    fallback: string = "",
    hideMissing: boolean = true
  ): string => {
    const translation = t(key);

    // Check if the translation contains "Missing translation:" or "Invalid translation key:"
    if (
      hideMissing &&
      (translation.includes("Missing translation:") ||
        translation.includes("Invalid translation key:"))
    ) {
      return fallback;
    }

    return translation || fallback;
  };

  /**
   * Check if a translation key exists and is valid
   * @param key - The translation key to check
   * @returns True if the translation exists and is valid
   */
  const isValidTranslation = (key: string): boolean => {
    return hasTranslation(key);
  };

  /**
   * Get translation with validation - throws error if missing (useful for development)
   * @param key - The translation key
   * @param fallback - Optional fallback (only used in production)
   * @returns The translated text
   */
  const strictTranslate = (key: string, fallback?: string): string => {
    const translation = t(key);

    if (
      translation.includes("Missing translation:") ||
      translation.includes("Invalid translation key:")
    ) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`Missing translation key: ${key}`);
      }
      return fallback || translation;
    }

    return translation;
  };

  return {
    safeTranslate,
    isValidTranslation,
    strictTranslate,
    isRTL,
    // Expose the original translation function for cases where you want the raw behavior
    t,
  };
}

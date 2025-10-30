/**
 * Translation Testing Utilities
 *
 * Provides testing utilities for translation functionality
 */

import { render, screen } from "@testing-library/react";
import { LanguageProvider } from "@/context/LanguageContext";
import { Language } from "@/lib/language";

interface TranslationTestOptions {
  language?: Language;
  fallbackLanguage?: Language;
}

/**
 * Render a component with translation context for testing
 */
export function renderWithTranslations(
  component: React.ReactElement,
  options: TranslationTestOptions = {}
) {
  const { language = "en", fallbackLanguage = "en" } = options;

  return render(
    <LanguageProvider initialLanguage={language}>{component}</LanguageProvider>
  );
}

/**
 * Test that a translation key renders correctly
 */
export function testTranslationKey(
  component: React.ReactElement,
  expectedKey: string,
  expectedText?: string,
  options: TranslationTestOptions = {}
) {
  const { language = "en" } = options;

  renderWithTranslations(component, options);

  if (expectedText) {
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  } else {
    // Just check that the component renders without "Missing translation" errors
    const missingTranslationElements =
      screen.queryAllByText(/Missing translation:/);
    expect(missingTranslationElements).toHaveLength(0);
  }
}

/**
 * Test translation fallback behavior
 */
export function testTranslationFallback(
  component: React.ReactElement,
  key: string,
  fallbackText: string,
  options: TranslationTestOptions = {}
) {
  const { language = "en" } = options;

  renderWithTranslations(component, options);

  // Should show fallback text when translation is missing
  expect(screen.getByText(fallbackText)).toBeInTheDocument();

  // Should not show "Missing translation" error
  const missingTranslationElements =
    screen.queryAllByText(/Missing translation:/);
  expect(missingTranslationElements).toHaveLength(0);
}

/**
 * Test RTL/LTR layout behavior
 */
export function testLayoutDirection(
  component: React.ReactElement,
  language: Language,
  expectedDirection: "ltr" | "rtl"
) {
  renderWithTranslations(component, { language });

  const container = screen.getByTestId("test-container") || document.body;
  expect(container).toHaveAttribute("dir", expectedDirection);
}

/**
 * Mock translation function for testing
 */
export function createMockTranslations(translations: Record<string, string>) {
  return (key: string): string => {
    return translations[key] || `Missing translation: ${key}`;
  };
}

/**
 * Test component with missing translations
 */
export function testMissingTranslations(
  component: React.ReactElement,
  missingKeys: string[],
  options: TranslationTestOptions = {}
) {
  const { language = "en" } = options;

  renderWithTranslations(component, options);

  // Check that missing translation errors are handled gracefully
  missingKeys.forEach((key) => {
    const missingTranslationElements = screen.queryAllByText(
      `Missing translation: ${key}`
    );
    expect(missingTranslationElements).toHaveLength(0);
  });
}

/**
 * Test translation key validation
 */
export function testTranslationKeyValidation(
  component: React.ReactElement,
  validKeys: string[],
  invalidKeys: string[],
  options: TranslationTestOptions = {}
) {
  const { language = "en" } = options;

  renderWithTranslations(component, options);

  // Valid keys should render properly
  validKeys.forEach((key) => {
    const missingTranslationElements = screen.queryAllByText(
      `Missing translation: ${key}`
    );
    expect(missingTranslationElements).toHaveLength(0);
  });

  // Invalid keys should be handled gracefully
  invalidKeys.forEach((key) => {
    const missingTranslationElements = screen.queryAllByText(
      `Missing translation: ${key}`
    );
    expect(missingTranslationElements).toHaveLength(0);
  });
}

/**
 * Test language switching
 */
export function testLanguageSwitching(
  component: React.ReactElement,
  languages: Language[],
  expectedTexts: Record<Language, string>
) {
  languages.forEach((language) => {
    const { unmount } = renderWithTranslations(component, { language });

    if (expectedTexts[language]) {
      expect(screen.getByText(expectedTexts[language])).toBeInTheDocument();
    }

    unmount();
  });
}

/**
 * Test translation interpolation
 */
export function testTranslationInterpolation(
  component: React.ReactElement,
  key: string,
  params: Record<string, any>,
  expectedText: string,
  options: TranslationTestOptions = {}
) {
  const { language = "en" } = options;

  renderWithTranslations(component, options);

  // Check that interpolated text renders correctly
  expect(screen.getByText(expectedText)).toBeInTheDocument();
}

/**
 * Test translation context provider
 */
export function testTranslationContext(
  component: React.ReactElement,
  expectedLanguage: Language,
  expectedDirection: "ltr" | "rtl"
) {
  renderWithTranslations(component, { language: expectedLanguage });

  // Test that the context provides the correct language
  const languageContext = screen.getByTestId("language-context");
  expect(languageContext).toHaveAttribute("data-language", expectedLanguage);
  expect(languageContext).toHaveAttribute("data-direction", expectedDirection);
}

export default {
  renderWithTranslations,
  testTranslationKey,
  testTranslationFallback,
  testLayoutDirection,
  createMockTranslations,
  testMissingTranslations,
  testTranslationKeyValidation,
  testLanguageSwitching,
  testTranslationInterpolation,
  testTranslationContext,
};

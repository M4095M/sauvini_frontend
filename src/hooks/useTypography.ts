import { useLanguage } from '@/hooks/useLanguage';
import { clsx } from 'clsx';

export function useTypography() {
  const { language, isRTL } = useLanguage();
  
  // Get font class based on current language
  const getFontClass = () => {
    return language === 'ar' ? 'font-tajawal' : 'font-work-sans';
  };

  // Get typography class with language suffix
  const getTypographyClass = (style: string) => {
    return language === 'ar' ? `${style}-ar` : style;
  };

  // Get complete typography classes
  const getClasses = (style: string, additionalClasses?: string) => {
    return clsx(
      getFontClass(),
      getTypographyClass(style),
      isRTL && 'text-right',
      additionalClasses
    );
  };

  return {
    getFontClass,
    getTypographyClass,
    getClasses,
    isRTL,
    language,
  };
}
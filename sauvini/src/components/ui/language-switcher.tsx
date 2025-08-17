"use client";

import { useLanguage } from "../../hooks/useLanguage";
import { Language, SUPPORTED_LANGUAGES } from "@/lib/language";
import Button from "./button";
import { Flag } from "lucide-react";
import { AR, EN, FR } from "./icons/languages";
import { useState } from "react";

interface LanguageSwitcherProps {
  className?: string;
}

type Av_languages = {
  code: Language;
  display: string;
  icon: React.ReactNode;
};

function LanguageDiv({
  code,
  display,
  icon,
  onClick,
}: Av_languages & { onClick?: () => void }) {
  return (
    <div
      key={code}
      className="px-6 py-4 flex gap-2 rounded-full bg-primary-50 cursor-pointer hover:bg-primary-100 transition-colors"
      onClick={onClick}
    >
      <span className="font-work-sans font-medium text-base text-primary-300">
        {display}
      </span>
      <span>{icon}</span>
    </div>
  );
}

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const availableLanguages: Av_languages[] = [
    { code: "en", display: "EN", icon: <EN /> },
    { code: "ar", display: "عـ", icon: <AR /> },
    { code: "fr", display: "FR", icon: <FR /> },
  ];

  const currentLanguage = availableLanguages.find(
    (lang) => lang.code === language
  );
  const otherLanguages = availableLanguages.filter(
    (lang) => lang.code !== language
  );

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={`relative h-fit ${className}`}>
      {/* Current language display */}
      {currentLanguage && (
        <LanguageDiv
          code={currentLanguage.code}
          display={currentLanguage.display}
          icon={currentLanguage.icon}
          onClick={toggleDropdown}
        />
      )}

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute mt-1 top-full z-10 bg-white border border-neutral-200 rounded-lg shadow-lg min-w-full">
          {otherLanguages.map((lang) => (
            <div
              key={lang.code}
              className="px-6 py-4 flex gap-2 hover:bg-neutral-100 cursor-pointer transition-colors first:rounded-t-lg last:rounded-b-lg"
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="font-work-sans font-medium text-base text-neutral-600">
                {lang.display}
              </span>
              <span>{lang.icon}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

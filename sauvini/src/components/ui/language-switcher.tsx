"use client";

import { useLanguage } from "../../hooks/useLanguage";
import { Language, SUPPORTED_LANGUAGES } from "@/lib/language";
import Button from "./button";
import { Flag } from "lucide-react";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className={`flex items-center gap-3  ${className}`}>
      <span className="text-sm font-medium">{t("common.language")}:</span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => {
          return (
            <option key={code} value={code}>
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
}

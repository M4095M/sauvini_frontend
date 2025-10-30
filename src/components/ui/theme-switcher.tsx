"use client";

import { useTheme } from "../../hooks/useTheme";
import { Theme } from "@/context/ThemeContext";

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className = "" }: ThemeSwitcherProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themes: { value: Theme; label: string; icon: string }[] = [
    { value: "light", label: "Light", icon: "☀️" },
    { value: "dark", label: "Dark", icon: "🌙" },
    { value: "system", label: "System", icon: "💻" },
  ];

  return (
    <div className={`flex items-center gap-2 font-work-sans ${className}`}>
      <span className="text-small">Theme:</span>
      <div className="relative">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
          className="appearance-none bg-white dark:bg-neutral-600 border border-neutral-300 dark:border-neutral-500 text-neutral-600 dark:text-neutral-200 px-3 py-2 pr-8 rounded-lg text-small focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-500"
        >
          {themes.map(({ value, label, icon }) => (
            <option
              key={value}
              value={value}
              className="bg-white dark:bg-neutral-600 text-neutral-600 dark:text-neutral-200"
            >
              {icon} {label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-neutral-400 dark:text-neutral-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Display current resolved theme */}
      <div className="text-small text-neutral-500 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-500 px-2 py-1 rounded-md">
        {resolvedTheme === "light" ? "☀️" : "🌙"} {resolvedTheme}
      </div>
    </div>
  );
}

/* Alternative: Toggle Button Style Theme Switcher */
export function ThemeToggle({ className = "" }: ThemeSwitcherProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-lg bg-white dark:bg-neutral-600 border border-neutral-300 dark:border-neutral-500
        hover:bg-neutral-100 dark:hover:bg-neutral-500
        focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-600
        transition-all duration-200 font-work-sans
        ${className}
      `}
      aria-label={`Switch to ${
        resolvedTheme === "light" ? "dark" : "light"
      } theme`}
    >
      <div className="w-5 h-5 flex items-center justify-center">
        {resolvedTheme === "light" ? (
          // Sun icon for light theme
          <svg
            className="w-4 h-4 text-warning-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          // Moon icon for dark theme
          <svg
            className="w-4 h-4 text-primary-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </div>
    </button>
  );
}

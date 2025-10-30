"use client";

import type React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { RTL_LANGUAGES } from "@/lib/language";
import Logo from "@/components/logo/logo";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();
  const isRTL = RTL_LANGUAGES.includes(language);

  return (
    <div className="min-h-screen auth-background-gradient sm:px-28 pb-0 pt-14 px-0 md:py-20 flex justify-center items-center">
      <div className="w-full h-full flex justify-center items-center bg-neutral-100 rounded-[80px] relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }} // start slightly below and invisible
          animate={{ opacity: 1, y: 0 }} // fade in & move to normal position
          transition={{
            duration: 1, // smooth timing
            ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for natural easing
          }}
          className="absolute flex justify-between w-full top-0 p-6"
        >
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-md hover:shadow-primary-500/10 dark:hover:shadow-primary-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform duration-300" />
            </Link>
            <Logo color={"text-primary-300"} width={84} height={84} />
          </div>
          <LanguageSwitcher />
        </motion.div>
        {children}
      </div>
    </div>
  );
}

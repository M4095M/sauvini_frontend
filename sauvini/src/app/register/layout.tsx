"use client";

import Logo from "@/components/logo/logo";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

import { motion } from "motion/react";

export default function RegisterLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <div className="min-h-screen auth-background-gradient sm:px-28 pb-0 pt-14 px-0 md:py-20 flex justify-center items-center ">
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
          <Logo color={"text-primary-300"} width={84} height={84} />
          <LanguageSwitcher />
        </motion.div>
        {children}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { LandingFooter, NavBarAuthed, NavBarGuest } from "@/components/landing";
import { useLanguage } from "@/hooks/useLanguage";
import { RTL_LANGUAGES } from "@/lib/language";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();
  const isRTL = RTL_LANGUAGES.includes(language);
  const [isMobile, setIsMobile] = useState(false);

  // TODO: wire with auth
  const isAuthenticated = false;

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800
    flex flex-col gap-7">
      {/* header */}
      {isAuthenticated ? (
        <NavBarAuthed
          userProfile={{
            id: "1",
            name: "John",
            lastname: "Doe",
            avatar: "/placeholder.svg",
            userType: "student",
            title: "Level 6",
          }}
        />
      ) : (
        <NavBarGuest />
      )}

      {/* main content */}
      <main className="w-full" dir={isRTL ? "rtl" : "ltr"}>
        {children}
      </main>

      {/* footer */}

      <div className="flex justify-center">
        <div className="w-full">
          <LandingFooter />
        </div>
      </div>
    </div>
  );
}

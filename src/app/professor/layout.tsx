"use client";

import type React from "react";

import ProfessorHeader from "@/components/professor/ProfessorHeader";
import MobileHeader from "@/components/professor/MobileHeader";
import Footer from "@/components/ui/footer";
import { useLanguage } from "@/hooks/useLanguage";
import { RTL_LANGUAGES } from "@/lib/language";
import ProfessorSidebar from "@/components/professor/SideBar";
import { SidebarProvider } from "@/context/SideBarContext";
import { useProfessorProfile } from "@/hooks/useProfessorProfile";

export default function ProfessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();
  const { professorProfile, isHydrated } = useProfessorProfile();
  const isRTL = RTL_LANGUAGES.includes(language);

  return (
    <SidebarProvider>
      {/* Desktop Layout - Fixed Sidebar Pattern */}
      <div className="hidden md:block min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
        {/* Fixed Sidebar */}
        <ProfessorSidebar />

        {/* Main Content - Offset by sidebar width */}
        <div className={`min-h-screen ${isRTL ? "pr-60" : "pl-60"}`}>
          {/* Inner Content - Centered within available space */}
          <div className="flex flex-col w-full max-w-[1200px] mx-auto px-3 md:px-4 lg:px-6 pt-5 pb-6 gap-6 overflow-x-hidden">
            {isHydrated && (
              <div className="w-full min-w-0">
                <ProfessorHeader professorProfile={professorProfile} />
              </div>
            )}

            <main className="w-full min-w-0" dir={isRTL ? "rtl" : "ltr"}>
              {children}
            </main>

            <Footer isRTL={isRTL} />
          </div>
        </div>
      </div>

      {/* Mobile Layout - Full Width with Off-Canvas Drawer */}
      <div
        className="flex flex-col min-h-screen md:hidden bg-gradient-to-br from-purple-100 to-blue-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Mobile Header with Hamburger Menu - Fixed at top */}
        {isHydrated && <MobileHeader professorProfile={professorProfile} />}

        {/* Off-Canvas Sidebar Drawer (Controlled by SidebarContext) */}
        <ProfessorSidebar />

        {/* Main Content - With top padding to account for fixed header */}
        <main className="flex-1 flex flex-col w-full px-4 pt-[140px] pb-6 gap-6 overflow-x-hidden">
          {children}
        </main>

        {/* Footer */}
        <Footer isMobile isRTL={isRTL} />
      </div>
    </SidebarProvider>
  );
}

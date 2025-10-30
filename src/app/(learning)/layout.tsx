"use client";

import { useState, useEffect } from "react";
import UserHeader from "@/components/modules/UserHeader";
import Footer from "@/components/ui/footer";
import { useLanguage } from "@/hooks/useLanguage";
import { RTL_LANGUAGES } from "@/lib/language";
import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import Sidebar from "@/components/modules/SideBar";
import { SidebarProvider } from "@/context/SideBarContext";
import { useAuth } from "@/hooks/useAuth";

export default function LearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isRTL = RTL_LANGUAGES.includes(language);
  const [isMobile, setIsMobile] = useState(false);

  // Convert authenticated user to user profile format
  const userProfile = user
    ? {
        id: user.id || "user_001",
        name: (user as any)?.first_name || (user as any)?.name || "Student",
        lastname: (user as any)?.last_name || (user as any)?.lastname || "User",
        email: user.email || "student@example.com",
        wilaya: (user as any)?.wilaya || "Alger",
        phoneNumber:
          (user as any)?.phone || (user as any)?.phoneNumber || "0555000000",
        academicStream:
          (user as any)?.academic_stream ||
          (user as any)?.academicStream ||
          "Experimental Sciences",
        avatar:
          (user as any)?.profile_picture_path ||
          (user as any)?.avatar ||
          "/placeholder.svg",
        level: (user as any)?.level || 6,
        notificationCount:
          (user as any)?.notification_count ||
          (user as any)?.notificationCount ||
          0,
        xp: (user as any)?.xp || 0,
        createdAt:
          (user as any)?.created_at || (user as any)?.createdAt || new Date(),
        chaptersCompleted:
          (user as any)?.chapters_completed ||
          (user as any)?.chaptersCompleted ||
          0,
        lessonsCompleted:
          (user as any)?.lessons_completed ||
          (user as any)?.lessonsCompleted ||
          0,
        lessonsLeft:
          (user as any)?.lessons_left || (user as any)?.lessonsLeft || 0,
      }
    : {
        id: "user_001",
        name: "Student",
        lastname: "User",
        email: "student@example.com",
        wilaya: "Alger",
        phoneNumber: "0555000000",
        academicStream: "Experimental Sciences",
        avatar: "/placeholder.svg",
        level: 6,
        notificationCount: 0,
        xp: 0,
        createdAt: new Date(),
        chaptersCompleted: 0,
        lessonsCompleted: 0,
        lessonsLeft: 0,
      };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <SidebarProvider>
      {/* Desktop */}

      <div className="hidden md:flex min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 justify-center">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            width: 1200,
            padding: "20px 12px 0 12px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 10,
            flexShrink: 0,
            marginLeft: isRTL ? 0 : 240,
            marginRight: isRTL ? 240 : 0,
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 24,
              alignSelf: "stretch",
              width: "100%",
            }}
          >
            <UserHeader userProfile={userProfile} />
            {children}
            <Footer isRTL={isRTL} />
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div
        className="flex flex-col min-h-screen w-full md:hidden bg-gradient-to-br from-purple-100 to-blue-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800"
        style={{
          paddingTop: 60,
          gap: 24,
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        {/* Mobile Sidebar Drawer */}
        <Sidebar />

        {children}

        <div className="mt-auto w-full">
          <Footer isMobile isRTL={isRTL} />
        </div>
      </div>
    </SidebarProvider>
  );
}

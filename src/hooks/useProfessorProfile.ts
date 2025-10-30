"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AdminApi } from "@/api/admin";
import { ProfessorApi } from "@/api/professor";

export interface ProfessorProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
  wilaya: string;
  avatar: string;
  academicTitle: string;
  permissions: string[];
  assignedModules: any[];
  createdAt: string;
}

/**
 * Custom hook that safely handles professor profile data to prevent hydration mismatches
 * Only returns the profile data after hydration is complete
 */
export function useProfessorProfile() {
  const { user, getUserRole } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [professorProfile, setProfessorProfile] = useState<ProfessorProfile>({
    id: "prof_1",
    firstName: "Professor",
    lastName: "User",
    email: "professor@example.com",
    phone: "+213000000000",
    birthdate: "1980-01-01",
    gender: "other",
    wilaya: "Algiers",
    avatar: "/placeholder.svg",
    academicTitle: "Professor",
    permissions: [],
    assignedModules: [],
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    // Mark as hydrated after first render
    setIsHydrated(true);

    if (!user) return;

    const fetchProfile = async () => {
      const userRole = getUserRole();
      let profileData: any = null;

      try {
        if (userRole === "admin") {
          // Fetch admin profile
          const response = await AdminApi.getProfile();
          if (response.success && response.data) {
            profileData = response.data;
          }
        } else {
          // Fetch professor profile (or use user data as fallback)
          const response = await ProfessorApi.getProfile();
          if (response.success && response.data) {
            profileData = response.data;
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Fall back to user data if API call fails
        profileData = user;
      }

      // Map profile data to ProfessorProfile format
      // This works for both admin and professor data
      const profile: ProfessorProfile = {
        id: profileData?.id || user.id || "prof_1",
        firstName:
          profileData?.first_name ||
          (user as any)?.first_name ||
          (user as any)?.firstName ||
          (userRole === "admin" ? "Admin" : "Professor"),
        lastName:
          profileData?.last_name ||
          (user as any)?.last_name ||
          (user as any)?.lastName ||
          "User",
        email: profileData?.email || user.email || "professor@example.com",
        phone:
          profileData?.phone_number ||
          (user as any)?.phone_number ||
          (user as any)?.phone ||
          (userRole === "admin" ? "" : "+213000000000"), // Empty for admin if not provided
        birthdate:
          profileData?.date_of_birth ||
          (user as any)?.birthdate ||
          (user as any)?.date_of_birth ||
          (userRole === "admin" ? "" : "1980-01-01"), // Empty for admin if not provided
        gender:
          userRole === "admin"
            ? "" // Admin doesn't have gender field
            : profileData?.gender || (user as any)?.gender || "other",
        wilaya:
          profileData?.wilaya ||
          (user as any)?.wilaya ||
          (userRole === "admin" ? "" : "Algiers"), // Empty for admin if not provided
        avatar:
          profileData?.profile_picture_path ||
          (user as any)?.profile_picture_path ||
          (user as any)?.avatar ||
          "/placeholder.svg",
        academicTitle:
          userRole === "admin"
            ? "Admin"
            : profileData?.academic_title ||
              (user as any)?.academic_title ||
              (user as any)?.academicTitle ||
              "Professor",
        permissions:
          (user as any)?.permissions ||
          (userRole === "admin"
            ? [
                "manage_modules",
                "manage_chapters",
                "manage_lessons",
                "create_quiz",
                "create_exercise",
                "upload_chapter_exam",
                "answer_questions",
                "grade_exams",
                "grade_exercises",
                "schedule_live_sessions",
                "view_account",
                "manage_professors",
                "manage_students",
                "manage_purchases",
              ]
            : [
                "manage_modules",
                "manage_chapters",
                "manage_lessons",
                "create_quiz",
                "create_exercise",
                "upload_chapter_exam",
                "answer_questions",
                "grade_exams",
                "grade_exercises",
                "schedule_live_sessions",
                "view_account",
              ]),
        assignedModules:
          (user as any)?.assigned_modules ||
          (user as any)?.assignedModules ||
          [],
        createdAt:
          profileData?.created_at ||
          (user as any)?.created_at ||
          (user as any)?.createdAt ||
          new Date().toISOString(),
      };
      setProfessorProfile(profile);
    };

    fetchProfile();
  }, [user, getUserRole]);

  return {
    professorProfile,
    isHydrated,
  };
}

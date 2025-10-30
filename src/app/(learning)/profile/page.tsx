"use client";

import StudentProfile from "@/components/student/StudentProfile";
import { useAuth } from "@/hooks/useAuth";

export default function Page() {
  const { user } = useAuth();

  // Convert authenticated user to Student interface format
  const student = user
    ? {
        id: user.id || "user_001",
        first_name:
          (user as any)?.first_name || (user as any)?.name || "Student",
        last_name:
          (user as any)?.last_name || (user as any)?.lastname || "User",
        email: user.email || "student@example.com",
        wilaya: (user as any)?.wilaya || "Alger",
        phone_number:
          (user as any)?.phone || (user as any)?.phoneNumber || "0555000000",
        academic_stream:
          (user as any)?.academic_stream ||
          (user as any)?.academicStream ||
          "Experimental Sciences",
        profile_picture_path:
          (user as any)?.profile_picture_path &&
          (user as any)?.profile_picture_path !== "undefined"
            ? (user as any)?.profile_picture_path
            : (user as any)?.avatar && (user as any)?.avatar !== "undefined"
            ? (user as any)?.avatar
            : "/placeholder.svg",
        email_verified: (user as any)?.email_verified || true,
        created_at:
          (user as any)?.created_at ||
          (user as any)?.createdAt ||
          new Date().toISOString(),
        updated_at:
          (user as any)?.updated_at ||
          (user as any)?.updatedAt ||
          new Date().toISOString(),
      }
    : {
        id: "user_001",
        first_name: "Student",
        last_name: "User",
        email: "student@example.com",
        wilaya: "Alger",
        phone_number: "0555000000",
        academic_stream: "Experimental Sciences",
        profile_picture_path: "/placeholder.svg",
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

  return <StudentProfile user={student} />;
}

"use client";

import StudentProfile from "@/components/student/StudentProfile";
import { MOCK_USER_PROFILE } from "@/data/mockModules";
import { StudentOnlyRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import type { UserProfile } from "@/types/modules";
import type { Student } from "@/types/api";

export default function Page() {
  const { user } = useAuth();
  const [studentProfile, setStudentProfile] = useState<UserProfile>(MOCK_USER_PROFILE);
  
  useEffect(() => {
    // If we have a logged-in student user, map it to UserProfile format
    if (user && 'academic_stream' in user) {
      // This is a Student type
      const student = user as Student;
      
      // Map Student data to UserProfile format
      // For now, we'll merge with mock data and override with actual student data
      setStudentProfile({
        ...MOCK_USER_PROFILE,
        name: student.first_name,
        lastname: student.last_name,
        wilaya: student.wilaya,
        phoneNumber: student.phone_number,
        email: student.email,
        // Other fields will use mock data until backend provides them
      });
    }
  }, [user]);

  return (
    <StudentOnlyRoute>
      <StudentProfile user={studentProfile} />
    </StudentOnlyRoute>
  );
}
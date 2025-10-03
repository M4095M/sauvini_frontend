"use client";

import StudentProfile from "@/components/student/StudentProfile";
import { StudentOnlyRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import type { Student } from "@/types/api";
import { StudentApi } from "@/api";
import { useRouter } from "next/navigation";


export default function Page() {
  // const { getUserRole, isAuthenticated, getStudentSub } = useAuth();
  const router = useRouter();
  
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // useEffect(() => {
  //   const fetchStudentInfo = async () => {
  //     try {
  //       setIsLoading(true);
  //       setError(null);
        
  //       const studentSub = getStudentSub();
  //       if (studentSub) {
  //         const response = await StudentApi.getStudentById(studentSub);
          
  //         if (response.success && response.data) {
  //           setStudentData(response.data);
  //         } else {
  //           setError(response.message || 'Failed to fetch student data');
  //         }
  //       } else {
  //         setError('No student ID found');
  //       }
  //     } catch (err) {
  //       console.error('Error fetching student info:', err);
  //       setError('An error occurred while fetching student data');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   if (isAuthenticated && getUserRole() === "student") {
  //     fetchStudentInfo();
  //   }
  // }, [isAuthenticated, getUserRole, getStudentSub]);

  // // Redirect if not authenticated or not a student
  // useEffect(() => {
  //   if (!isAuthenticated && getUserRole() !== "student") {
  //     router.push("/auth/login/student");
  //   }
  // }, [isAuthenticated, getUserRole, router]);

  // Loading state
  if (isLoading) {
    return (
      <StudentOnlyRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-300 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </StudentOnlyRoute>
    );
  }

  // Error state
  if (error) {
    return (
      <StudentOnlyRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary-300 text-white rounded-lg hover:bg-primary-400"
            >
              Retry
            </button>
          </div>
        </div>
      </StudentOnlyRoute>
    );
  }

  return (
    <StudentOnlyRoute>
      {studentData && <StudentProfile user={studentData} />}
    </StudentOnlyRoute>
  );
}
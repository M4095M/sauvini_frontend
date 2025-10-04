"use client";

import StudentProfile from "@/components/student/StudentProfile";
import { StudentOnlyRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import type { Student } from "@/types/api";
import { useEffect } from "react";


export default function Page() {
  // Get user info from AuthContext - already fetched during initialization
  const { user, isLoading, error } = useAuth();

  // Loading state - AuthContext is still initializing
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

  // Error state - AuthContext encountered an error
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

  // Main content - display student profile
  return (
    <StudentOnlyRoute>
      {user && <StudentProfile user={user as Student} />}
    </StudentOnlyRoute>
  );
}
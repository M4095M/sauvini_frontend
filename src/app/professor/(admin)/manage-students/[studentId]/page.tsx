"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StudentProfile from "@/components/professor/adminStudents/StudentProfile";
import { StudentManagementApi } from "@/api/studentManagement";
import type { FrontendStudent } from "@/types/students";
import { mapApiStudentToFrontend } from "@/types/students";
import Loader from "@/components/ui/Loader";

export default function Page() {
  const params = useParams();
  const studentId = params?.studentId as string;

  const [student, setStudent] = useState<FrontendStudent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await StudentManagementApi.getStudentById(studentId);

        if (response.success && response.data) {
          setStudent(mapApiStudentToFrontend(response.data));
        } else {
          setError("Student not found");
        }
      } catch (err) {
        console.error("Error fetching student:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch student"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (loading) {
    return (
      <main className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center">
        <Loader />
      </main>
    );
  }

  if (error || !student) {
    return (
      <main className="w-full min-h-[calc(100vh-80px)] px-4 sm:px-6 md:px-8 lg:px-12 py-6">
        <div className="max-w-[1152px] mx-auto">
          <div className="text-center text-neutral-500">
            {error || "Student not found."}
          </div>
        </div>
      </main>
    );
  }

  return <StudentProfile student={student} />;
}

"use client";

import StudentCard from "./StudentCard";
import StudentInformation from "./StudentInformation";
import type { FrontendStudent } from "@/types/students";

interface Props {
  student: FrontendStudent;
  className?: string;
}

export default function StudentProfile({ student, className = "" }: Props) {
  return (
    <div className={`w-full ${className}`}>
      <StudentCard student={student} className="mb-16" />
      <StudentInformation student={student} />
    </div>
  );
}

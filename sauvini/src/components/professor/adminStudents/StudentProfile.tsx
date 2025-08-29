"use client";

import StudentCard from "../StudentCard";
import StudentInformation from "./StudentInformation";
import { Student } from "@/data/students";

interface Props {
  student: Student;
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
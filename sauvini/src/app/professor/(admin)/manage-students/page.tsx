"use client";

import StudentsGrid from "@/components/professor/adminStudents/StudentsGrid";
import { useLanguage } from "@/hooks/useLanguage";
import { MOCK_STUDENTS } from "@/data/students";

export default function Page() {
    const { isRTL } = useLanguage();

    return <StudentsGrid students={MOCK_STUDENTS} className="w-full" />;
}
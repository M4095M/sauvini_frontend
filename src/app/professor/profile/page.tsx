"use client";

import ProfessorProfileComponent from "@/components/professor/ProfessorProfileComponent";
import { useProfessorProfile } from "@/hooks/useProfessorProfile";

export default function ProfessorProfilePage() {
  const { professorProfile, isHydrated } = useProfessorProfile();

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  return <ProfessorProfileComponent professor={professorProfile} />;
}

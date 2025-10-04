import ProfessorProfileComponent from "@/components/professor/ProfessorProfileComponent";
import { MOCK_PROFESSOR } from "@/data/mockProfessor";

export default function ProfessorProfilePage() {
  const professor = MOCK_PROFESSOR;

  return <ProfessorProfileComponent professor={professor} />;
}

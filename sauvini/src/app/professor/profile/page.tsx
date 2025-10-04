import ProfessorProfileComponent from "@/components/professor/ProfessorProfileComponent"
import { useAuth } from "@/context/AuthContext"
import { MOCK_PROFESSOR } from "@/data/mockProfessor"
import { useEffect } from "react"

export default function ProfessorProfilePage() {
  const professor = MOCK_PROFESSOR

  const {user} = useAuth()

  console.log("Authenticated user in professor profile page:", user)

  return <ProfessorProfileComponent professor={professor} />
}
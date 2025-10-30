"use client"

import ProfessorCard from "./ProfessorCard"
import ProfessorInformation from "./ProfessorInformation"
import type { ProfessorUser } from "@/types/professor"

interface Props {
  professor: ProfessorUser
  className?: string
}

export default function ProfessorProfileComponent({ professor, className = "" }: Props) {
  return (
    <div className={`w-full ${className}`}>
      <ProfessorCard professor={professor} className="mb-16" />
      <ProfessorInformation professor={professor} />
    </div>
  )
}
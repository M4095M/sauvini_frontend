"use client";

import StudentCard from "./StudentCard";
import StudentInformation from "./StudentInformation";
import type { UserProfile } from "@/types/modules";

interface Props {
  user: UserProfile;
  className?: string;
}

export default function StudentProfile({ user, className = "" }: Props) {
  return (
    <div className={`w-full ${className}`}>
      <StudentCard user={user} className="mb-16" />
      <StudentInformation user={user} />
    </div>
  );
}
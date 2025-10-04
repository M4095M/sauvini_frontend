import StudentProfile from "@/components/student/StudentProfile";
import { MOCK_USER_PROFILE } from "@/data/mockModules";

export default function Page() {
  const student = MOCK_USER_PROFILE;

  return <StudentProfile user={student} />;
}

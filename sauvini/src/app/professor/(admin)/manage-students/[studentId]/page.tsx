import StudentProfile from "@/components/professor/adminStudents/StudentProfile";
import { MOCK_STUDENTS, Student } from "@/data/students";

async function fetchStudent(id: string) {
  
  return MOCK_STUDENTS.find((s) => s.id === id) ?? null;
}

export default async function Page() {
  const student: Student = {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
  }

  if (!student) {
    return (
      <main className="w-full min-h-[calc(100vh-80px)] px-4 sm:px-6 md:px-8 lg:px-12 py-6">
        <div className="max-w-[1152px] mx-auto">
          <div className="text-center text-neutral-500">Student not found.</div>
        </div>
      </main>
    );
  }

  return (<StudentProfile student={student} />);
}
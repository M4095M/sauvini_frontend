import StudentProfile from "@/components/professor/StudentProfile";
import { MOCK_STUDENTS } from "@/data/students";

type Params = { params: { studentId: string } };

async function fetchStudent(id: string) {
  // try API first (adjust endpoint if you have a different route)
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/${encodeURIComponent(id)}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return json;
    }
  } catch (err) {
    // ignore, fallback to mock
  }

  // fallback
  return MOCK_STUDENTS.find((s) => s.id === id) ?? null;
}

export default async function Page({ params }: Params) {
  const id = params.studentId;
  const student = await fetchStudent(id);

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
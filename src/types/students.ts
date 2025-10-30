import type { StudentWithProgress as ApiStudent } from "@/api/studentManagement";

/**
 * Frontend Student type with formatted display fields
 */
export interface FrontendStudent {
  id: string;
  profile_picture?: string;
  name: string;
  phone?: string;
  email?: string;
  wilaya?: string;
  academic_stream?: string;
  xp?: number;
  chaptersCompleted?: number;
  lessonsCompleted?: number;
  lessonsLeft?: number;
  status?: "active" | "inactive" | "suspended";
  // Keep the raw data for API updates
  raw?: ApiStudent;
}

/**
 * Convert API student to frontend display format
 */
export function mapApiStudentToFrontend(student: ApiStudent): FrontendStudent {
  // Extract ID from RecordId format if needed
  let id = student.id || "";
  if (typeof id === "object" && id !== null && "id" in id) {
    id = (id as any).id || String(id);
  } else {
    id = String(id);
  }

  // Combine first and last name
  const name =
    `${student.first_name || ""} ${student.last_name || ""}`.trim() ||
    "Unknown";

  // Determine status
  let status: "active" | "inactive" | "suspended" = "inactive";
  if (student.is_active) {
    status = "active";
  }

  // Calculate lessons left
  const lessonsTotal = student.lessons_total || 0;
  const lessonsCompleted = student.lessons_completed || 0;
  const lessonsLeft = Math.max(0, lessonsTotal - lessonsCompleted);

  return {
    id,
    profile_picture: student.profile_picture,
    name,
    phone: student.phone,
    email: student.email,
    wilaya: student.wilaya,
    academic_stream: student.academic_stream,
    xp: student.total_xp,
    chaptersCompleted: student.chapters_completed,
    lessonsCompleted,
    lessonsLeft,
    status,
    raw: student,
  };
}

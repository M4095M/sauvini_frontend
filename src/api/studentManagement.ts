import { BaseApi } from "./base";
import type { ApiResponse } from "@/types/api";

// ===========================================
// TYPES
// ===========================================

export interface StudentWithProgress {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  phone?: string; // Keep for backward compatibility
  wilaya?: string;
  academic_stream?: string;
  profile_picture?: string;
  is_active: boolean;
  email_verified: boolean;
  created_at?: string;
  updated_at?: string;
  // Progress fields
  total_xp?: number;
  chapters_completed?: number;
  lessons_completed?: number;
  lessons_total?: number;
}

export interface StudentFilters {
  search?: string;
  academic_stream?: string;
  wilaya?: string;
  is_active?: boolean;
  email_verified?: boolean;
}

export interface StudentListParams extends StudentFilters {
  page?: number;
  per_page?: number;
}

export interface StudentListResponse {
  students: StudentWithProgress[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface UpdateStudentStatusRequest {
  is_active: boolean;
}

export interface UpdateEmailVerificationRequest {
  email_verified: boolean;
}

export interface StudentStatistics {
  total_students: number;
  active_students: number;
  inactive_students: number;
  verified_students: number;
  unverified_students: number;
}

// ===========================================
// STUDENT MANAGEMENT API CLASS
// ===========================================

/**
 * StudentManagementApi - Handles all student management API calls (admin only)
 */
export class StudentManagementApi extends BaseApi {
  // ===========================================
  // ADMIN ENDPOINTS
  // ===========================================

  /**
   * Get all students with filters and pagination (admin)
   * @param params - Query parameters for filtering and pagination
   * @returns Student list with pagination info
   */
  static async getAllStudents(
    params?: StudentListParams
  ): Promise<ApiResponse<StudentListResponse>> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.per_page)
        queryParams.append("per_page", params.per_page.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.academic_stream)
        queryParams.append("academic_stream", params.academic_stream);
      if (params?.wilaya) queryParams.append("wilaya", params.wilaya);
      if (params?.is_active !== undefined)
        queryParams.append("is_active", params.is_active.toString());
      if (params?.email_verified !== undefined)
        queryParams.append("email_verified", params.email_verified.toString());

      const queryString = queryParams.toString();
      const url = `/auth/admin/students${queryString ? `?${queryString}` : ""}`;

      return await this.get<StudentListResponse>(url, { requiresAuth: true });
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  }

  /**
   * Get student by ID with progress information (admin)
   * @param studentId - The student ID
   * @returns Student with progress
   */
  static async getStudentById(
    studentId: string
  ): Promise<ApiResponse<StudentWithProgress | null>> {
    try {
      return await this.get<StudentWithProgress | null>(
        `/auth/admin/students/${studentId}`,
        { requiresAuth: true }
      );
    } catch (error) {
      console.error(`Error fetching student ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Update student active status (admin)
   * @param studentId - The student ID
   * @param request - Status update request
   * @returns Success status
   */
  static async updateStudentStatus(
    studentId: string,
    request: UpdateStudentStatusRequest
  ): Promise<ApiResponse<boolean>> {
    try {
      return await this.put<boolean>(
        `/auth/admin/students/${studentId}/status`,
        request,
        { requiresAuth: true }
      );
    } catch (error) {
      console.error(`Error updating student status ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Update student email verification status (admin)
   * @param studentId - The student ID
   * @param request - Email verification update request
   * @returns Success status
   */
  static async updateStudentEmailVerification(
    studentId: string,
    request: UpdateEmailVerificationRequest
  ): Promise<ApiResponse<boolean>> {
    try {
      return await this.put<boolean>(
        `/auth/admin/students/${studentId}/email-verification`,
        request,
        { requiresAuth: true }
      );
    } catch (error) {
      console.error(
        `Error updating student email verification ${studentId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Delete student (soft delete - sets is_active to false) (admin)
   * @param studentId - The student ID
   * @returns Success status
   */
  static async deleteStudent(studentId: string): Promise<ApiResponse<boolean>> {
    try {
      return await this.delete<boolean>(
        `/auth/admin/students/${studentId}/delete`,
        {
          requiresAuth: true,
        }
      );
    } catch (error) {
      console.error(`Error deleting student ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Get student statistics (admin)
   * @returns Student statistics
   */
  static async getStudentStatistics(): Promise<ApiResponse<StudentStatistics>> {
    try {
      return await this.get<StudentStatistics>(
        "/auth/admin/students/statistics",
        {
          requiresAuth: true,
        }
      );
    } catch (error) {
      console.error("Error fetching student statistics:", error);
      throw error;
    }
  }
}

// Export convenience functions for direct usage
export const {
  getAllStudents,
  getStudentById,
  updateStudentStatus,
  updateStudentEmailVerification,
  deleteStudent,
  getStudentStatistics,
} = StudentManagementApi;

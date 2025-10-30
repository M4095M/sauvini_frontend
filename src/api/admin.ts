import { BaseApi } from "./base";
import type {
  ApiResponse,
  PaginationRequest,
  ApproveRejectProfessorRequest,
  Professor,
  Student,
  Admin,
} from "@/types/api";

/**
 * Admin API class that handles all admin-specific functionality
 * Extends BaseApi to inherit common HTTP methods and token management
 *
 * This class provides administrative functionality including:
 * - Professor management (approval, rejection, listing)
 * - Student management and oversight
 * - System administration features
 * - Analytics and reporting
 *
 * All methods in this class require admin authentication
 */
export class AdminApi extends BaseApi {
  // ===========================================
  // PROFILE MANAGEMENT
  // ===========================================

  /**
   * Get current admin's profile information
   * @returns Promise with admin profile data
   */
  static async getProfile(): Promise<ApiResponse<Admin>> {
    return this.get<Admin>("/admin/profile", { requiresAuth: true });
  }

  // ===========================================
  // PROFESSOR MANAGEMENT
  // ===========================================

  /**
   * Get all professors with pagination and optional filtering
   * @param pagination - Optional pagination parameters
   * @param filters - Optional filters for professor status, etc.
   * @returns Promise with paginated list of professors
   */
  static async getAllProfessors(
    pagination?: PaginationRequest,
    filters?: {
      status?: "pending" | "approved" | "rejected" | "deactivated";
      email_verified?: boolean;
      wilaya?: string;
    }
  ): Promise<ApiResponse<Professor[]>> {
    const params = new URLSearchParams();

    // Add pagination parameters
    if (pagination?.page) params.append("page", pagination.page.toString());
    if (pagination?.limit) params.append("limit", pagination.limit.toString());

    // Add filter parameters
    if (filters?.status) params.append("status", filters.status);
    if (filters?.email_verified !== undefined)
      params.append("email_verified", filters.email_verified.toString());
    if (filters?.wilaya) params.append("wilaya", filters.wilaya);

    const queryString = params.toString();
    const url = queryString
      ? `/auth/admin/all-professors?${queryString}`
      : "/auth/admin/all-professors";

    return this.get<Professor[]>(url, { requiresAuth: true });
  }

  /**
   * Get pending professors awaiting approval
   * @param pagination - Optional pagination parameters
   * @returns Promise with list of professors with 'new' status
   */
  static async getPendingProfessors(
    pagination?: PaginationRequest
  ): Promise<ApiResponse<Professor[]>> {
    return this.getAllProfessors(pagination, { status: "new" });
  }

  /**
   * Get approved professors
   * @param pagination - Optional pagination parameters
   * @returns Promise with list of approved professors
   */
  static async getApprovedProfessors(
    pagination?: PaginationRequest
  ): Promise<ApiResponse<Professor[]>> {
    return this.getAllProfessors(pagination, { status: "approved" });
  }

  /**
   * Get rejected professors
   * @param pagination - Optional pagination parameters
   * @returns Promise with list of rejected professors
   */
  static async getRejectedProfessors(
    pagination?: PaginationRequest
  ): Promise<ApiResponse<Professor[]>> {
    return this.getAllProfessors(pagination, { status: "rejected" });
  }

  /**
   * Get detailed information about a specific professor
   * @param professorId - The ID of the professor
   * @returns Promise with professor details
   */
  static async getProfessor(
    professorId: string
  ): Promise<ApiResponse<Professor>> {
    return this.get<Professor>(`/auth/admin/professors/${professorId}`, {
      requiresAuth: true,
    });
  }

  /**
   * Approve a professor account
   * @param data - Professor ID to approve
   * @returns Promise with approval result
   */
  static async approveProfessor(
    data: ApproveRejectProfessorRequest
  ): Promise<ApiResponse<null>> {
    return this.post<null>("/auth/admin/approve-professor", data, {
      requiresAuth: true,
    });
  }

  /**
   * Reject a professor account
   * @param data - Professor ID to reject
   * @returns Promise with rejection result
   */
  static async rejectProfessor(
    data: ApproveRejectProfessorRequest
  ): Promise<ApiResponse<null>> {
    return this.post<null>("/auth/admin/reject-professor", data, {
      requiresAuth: true,
    });
  }

  /**
   * Deactivate a professor account
   * @param data - Professor ID to deactivate
   * @returns Promise with deactivation result
   */
  static async deactivateProfessor(
    data: ApproveRejectProfessorRequest
  ): Promise<ApiResponse<null>> {
    return this.post<null>("/auth/admin/deactivate-professor", data, {
      requiresAuth: true,
    });
  }

  /**
   * Reactivate a professor account
   * @param data - Professor ID to reactivate
   * @returns Promise with reactivation result
   */
  static async reactivateProfessor(
    data: ApproveRejectProfessorRequest
  ): Promise<ApiResponse<null>> {
    return this.post<null>("/auth/admin/reactivate-professor", data, {
      requiresAuth: true,
    });
  }

  /**
   * Bulk approve multiple professors
   * @param professorIds - Array of professor IDs to approve
   * @returns Promise with bulk approval results
   */
  static async bulkApproveProfessors(professorIds: string[]): Promise<
    ApiResponse<{
      approved: string[];
      failed: Array<{ id: string; error: string }>;
    }>
  > {
    return this.post<{
      approved: string[];
      failed: Array<{ id: string; error: string }>;
    }>(
      "/auth/admin/professors/bulk-approve",
      { ids: professorIds },
      { requiresAuth: true }
    );
  }

  /**
   * Bulk reject multiple professors
   * @param professorIds - Array of professor IDs to reject
   * @returns Promise with bulk rejection results
   */
  static async bulkRejectProfessors(professorIds: string[]): Promise<
    ApiResponse<{
      rejected: string[];
      failed: Array<{ id: string; error: string }>;
    }>
  > {
    return this.post<{
      rejected: string[];
      failed: Array<{ id: string; error: string }>;
    }>(
      "/auth/admin/professors/bulk-reject",
      { ids: professorIds },
      { requiresAuth: true }
    );
  }

  // ===========================================
  // STUDENT MANAGEMENT
  // ===========================================

  /**
   * Get all students with pagination and optional filtering
   * @param pagination - Optional pagination parameters
   * @param filters - Optional filters for student data
   * @returns Promise with paginated list of students
   */
  static async getAllStudents(
    pagination?: PaginationRequest,
    filters?: {
      email_verified?: boolean;
      wilaya?: string;
      academic_stream?: string;
    }
  ): Promise<ApiResponse<Student[]>> {
    const params = new URLSearchParams();

    // Add pagination parameters
    if (pagination?.page) params.append("page", pagination.page.toString());
    if (pagination?.limit) params.append("limit", pagination.limit.toString());

    // Add filter parameters
    if (filters?.email_verified !== undefined)
      params.append("email_verified", filters.email_verified.toString());
    if (filters?.wilaya) params.append("wilaya", filters.wilaya);
    if (filters?.academic_stream)
      params.append("academic_stream", filters.academic_stream);

    const queryString = params.toString();
    const url = queryString
      ? `/auth/admin/all-students?${queryString}`
      : "/auth/admin/all-students";

    return this.get<Student[]>(url, { requiresAuth: true });
  }

  /**
   * Get detailed information about a specific student
   * @param studentId - The ID of the student
   * @returns Promise with student details
   */
  static async getStudent(studentId: string): Promise<ApiResponse<Student>> {
    return this.get<Student>(`/auth/admin/students/${studentId}`, {
      requiresAuth: true,
    });
  }

  /**
   * Suspend a student account
   * @param studentId - The ID of the student to suspend
   * @param reason - Reason for suspension
   * @returns Promise with suspension result
   */
  static async suspendStudent(
    studentId: string,
    reason?: string
  ): Promise<ApiResponse<null>> {
    return this.post<null>(
      `/auth/admin/students/${studentId}/suspend`,
      { reason },
      { requiresAuth: true }
    );
  }

  /**
   * Reactivate a suspended student account
   * @param studentId - The ID of the student to reactivate
   * @returns Promise with reactivation result
   */
  static async reactivateStudent(
    studentId: string
  ): Promise<ApiResponse<null>> {
    return this.post<null>(
      `/auth/admin/students/${studentId}/reactivate`,
      {},
      { requiresAuth: true }
    );
  }

  // ===========================================
  // ADMIN MANAGEMENT
  // ===========================================

  /**
   * Get all admin accounts
   * @param pagination - Optional pagination parameters
   * @returns Promise with list of admin accounts
   */
  static async getAllAdmins(
    pagination?: PaginationRequest
  ): Promise<ApiResponse<Admin[]>> {
    const params = new URLSearchParams();
    if (pagination?.page) params.append("page", pagination.page.toString());
    if (pagination?.limit) params.append("limit", pagination.limit.toString());

    const queryString = params.toString();
    const url = queryString
      ? `/auth/admin/all-admins?${queryString}`
      : "/auth/admin/all-admins";

    return this.get<Admin[]>(url, { requiresAuth: true });
  }

  /**
   * Create a new admin account
   * @param adminData - Admin account data
   * @returns Promise with created admin data
   */
  static async createAdmin(adminData: {
    email: string;
    password: string;
  }): Promise<ApiResponse<Admin>> {
    return this.post<Admin>("/auth/admin/create-admin", adminData, {
      requiresAuth: true,
    });
  }

  /**
   * Update admin account information
   * @param adminId - The ID of the admin to update
   * @param updateData - Data to update
   * @returns Promise with updated admin data
   */
  static async updateAdmin(
    adminId: string,
    updateData: {
      email?: string;
      password?: string;
    }
  ): Promise<ApiResponse<Admin>> {
    return this.put<Admin>(`/auth/admin/admins/${adminId}`, updateData, {
      requiresAuth: true,
    });
  }

  /**
   * Delete an admin account
   * @param adminId - The ID of the admin to delete
   * @returns Promise with deletion result
   */
  static async deleteAdmin(adminId: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`/auth/admin/admins/${adminId}`, {
      requiresAuth: true,
    });
  }

  // ===========================================
  // ANALYTICS AND REPORTING
  // ===========================================

  /**
   * Get system analytics dashboard data
   * @returns Promise with dashboard statistics
   */
  static async getDashboardStats(): Promise<
    ApiResponse<{
      total_students: number;
      total_professors: number;
      pending_professors: number;
      approved_professors: number;
      rejected_professors: number;
      verified_students: number;
      unverified_students: number;
      active_sessions: number;
      recent_registrations: {
        students_this_week: number;
        professors_this_week: number;
      };
    }>
  > {
    return this.get<{
      total_students: number;
      total_professors: number;
      pending_professors: number;
      approved_professors: number;
      rejected_professors: number;
      verified_students: number;
      unverified_students: number;
      active_sessions: number;
      recent_registrations: {
        students_this_week: number;
        professors_this_week: number;
      };
    }>("/auth/admin/dashboard/stats", { requiresAuth: true });
  }

  /**
   * Get user activity analytics
   * @param period - Time period for analytics ('day' | 'week' | 'month' | 'year')
   * @returns Promise with activity data
   */
  static async getUserActivityAnalytics(
    period: "day" | "week" | "month" | "year" = "week"
  ): Promise<
    ApiResponse<{
      registrations: Array<{
        date: string;
        students: number;
        professors: number;
      }>;
      logins: Array<{ date: string; count: number }>;
      active_users: Array<{ date: string; count: number }>;
    }>
  > {
    return this.get<{
      registrations: Array<{
        date: string;
        students: number;
        professors: number;
      }>;
      logins: Array<{ date: string; count: number }>;
      active_users: Array<{ date: string; count: number }>;
    }>(`/auth/admin/analytics/activity?period=${period}`, {
      requiresAuth: true,
    });
  }

  /**
   * Export user data for reporting
   * @param type - Type of data to export ('students' | 'professors' | 'all')
   * @param format - Export format ('csv' | 'xlsx' | 'json')
   * @returns Promise with export file data
   */
  static async exportUserData(
    type: "students" | "professors" | "all",
    format: "csv" | "xlsx" | "json" = "csv"
  ): Promise<
    ApiResponse<{
      download_url: string;
      expires_at: string;
      file_size: number;
    }>
  > {
    return this.post<{
      download_url: string;
      expires_at: string;
      file_size: number;
    }>("/auth/admin/export", { type, format }, { requiresAuth: true });
  }

  /**
   * Get download URL for professor CV file
   * @param professorId - The ID of the professor
   * @returns Promise with download URL
   */
  static async getProfessorCvDownloadUrl(professorId: string): Promise<
    ApiResponse<{
      download_url: string;
      expires_at: string;
      file_name: string;
    }>
  > {
    return this.get<{
      download_url: string;
      expires_at: string;
      file_name: string;
    }>(`/auth/admin/professor/${professorId}/cv/download`, {
      requiresAuth: true,
    });
  }

  // ===========================================
  // SYSTEM MANAGEMENT
  // ===========================================

  /**
   * Get system health status
   * @returns Promise with system health information
   */
  static async getSystemHealth(): Promise<
    ApiResponse<{
      status: "healthy" | "warning" | "critical";
      database: { status: string; response_time_ms: number };
      redis: { status: string; response_time_ms: number };
      file_storage: { status: string; available_space_gb: number };
      memory_usage: {
        used_mb: number;
        available_mb: number;
        percentage: number;
      };
      uptime_seconds: number;
    }>
  > {
    return this.get<{
      status: "healthy" | "warning" | "critical";
      database: { status: string; response_time_ms: number };
      redis: { status: string; response_time_ms: number };
      file_storage: { status: string; available_space_gb: number };
      memory_usage: {
        used_mb: number;
        available_mb: number;
        percentage: number;
      };
      uptime_seconds: number;
    }>("/auth/admin/system/health", { requiresAuth: true });
  }

  /**
   * Clear system caches
   * @param cache_type - Type of cache to clear ('all' | 'user_sessions' | 'file_cache' | 'redis')
   * @returns Promise with cache clearing result
   */
  static async clearSystemCache(
    cache_type: "all" | "user_sessions" | "file_cache" | "redis" = "all"
  ): Promise<
    ApiResponse<{
      cleared: string[];
      errors: string[];
    }>
  > {
    return this.post<{
      cleared: string[];
      errors: string[];
    }>(
      "/auth/admin/system/clear-cache",
      { cache_type },
      { requiresAuth: true }
    );
  }

  /**
   * Update system configuration
   * @param config - Configuration updates
   * @returns Promise with updated configuration
   */
  static async updateSystemConfig(
    config: Record<string, unknown>
  ): Promise<ApiResponse<Record<string, unknown>>> {
    return this.put<Record<string, unknown>>(
      "/auth/admin/system/config",
      config,
      { requiresAuth: true }
    );
  }
}

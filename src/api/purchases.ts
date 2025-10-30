import { BaseApi } from "./base";
import type { ApiResponse } from "@/types/api";

// ===========================================
// TYPES
// ===========================================

export interface Purchase {
  id: string;
  student_id: string;
  chapter_id: string;
  module_id: string;
  price: number;
  phone: string;
  receipt_url: string;
  status: "pending" | "approved" | "rejected";
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  rejection_reason?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PurchaseWithDetails extends Purchase {
  student_name: string;
  student_email?: string;
  student_phone?: string;
  student_stream?: string;
  chapter_name: string;
  module_name: string;
}

export interface PurchaseFilters {
  status?: string;
  student_id?: string;
  module_id?: string;
  chapter_id?: string;
  reviewed_by?: string;
  date_from?: string;
  date_to?: string;
}

export interface PurchaseListParams extends PurchaseFilters {
  page?: number;
  per_page?: number;
}

export interface PurchaseListResponse {
  purchases: PurchaseWithDetails[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface PurchaseStatistics {
  total_purchases: number;
  pending_purchases: number;
  approved_purchases: number;
  rejected_purchases: number;
  total_revenue: number;
  pending_revenue: number;
}

export interface CreatePurchaseRequest {
  student_id: string;
  chapter_id: string;
  module_id: string;
  price: number;
  phone: string;
  receipt_url: string;
}

export interface UpdatePurchaseStatusRequest {
  status: "pending" | "approved" | "rejected";
  rejection_reason?: string;
}

// ===========================================
// PURCHASES API CLASS
// ===========================================

/**
 * PurchasesApi - Handles all purchase-related API calls
 */
export class PurchasesApi extends BaseApi {
  // ===========================================
  // ADMIN ENDPOINTS
  // ===========================================

  /**
   * Get all purchases with filters and pagination (admin)
   * @param params - Query parameters for filtering and pagination
   * @returns Purchase list with pagination info
   */
  static async getAllPurchases(
    params?: PurchaseListParams
  ): Promise<ApiResponse<PurchaseListResponse>> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.per_page)
        queryParams.append("per_page", params.per_page.toString());
      if (params?.status) queryParams.append("status", params.status);
      if (params?.student_id)
        queryParams.append("student_id", params.student_id);
      if (params?.module_id) queryParams.append("module_id", params.module_id);
      if (params?.chapter_id)
        queryParams.append("chapter_id", params.chapter_id);
      if (params?.reviewed_by)
        queryParams.append("reviewed_by", params.reviewed_by);
      if (params?.date_from) queryParams.append("date_from", params.date_from);
      if (params?.date_to) queryParams.append("date_to", params.date_to);

      const queryString = queryParams.toString();
      const url = `/auth/admin/purchases${
        queryString ? `?${queryString}` : ""
      }`;

      return await this.get<PurchaseListResponse>(url, { requiresAuth: true });
    } catch (error) {
      console.error("Error fetching purchases:", error);
      throw error;
    }
  }

  /**
   * Get purchase by ID with full details (admin)
   * @param purchaseId - The purchase ID
   * @returns Purchase with details
   */
  static async getPurchaseById(
    purchaseId: string
  ): Promise<ApiResponse<PurchaseWithDetails | null>> {
    try {
      return await this.get<PurchaseWithDetails | null>(
        `/auth/admin/purchases/${purchaseId}`,
        { requiresAuth: true }
      );
    } catch (error) {
      console.error(`Error fetching purchase ${purchaseId}:`, error);
      throw error;
    }
  }

  /**
   * Update purchase status (admin)
   * @param purchaseId - The purchase ID
   * @param request - Status update request
   * @returns Success status
   */
  static async updatePurchaseStatus(
    purchaseId: string,
    request: UpdatePurchaseStatusRequest
  ): Promise<ApiResponse<boolean>> {
    try {
      return await this.put<boolean>(
        `/auth/admin/purchases/${purchaseId}/status`,
        request,
        { requiresAuth: true }
      );
    } catch (error) {
      console.error(`Error updating purchase status ${purchaseId}:`, error);
      throw error;
    }
  }

  /**
   * Delete purchase (admin)
   * @param purchaseId - The purchase ID
   * @returns Success status
   */
  static async deletePurchase(
    purchaseId: string
  ): Promise<ApiResponse<boolean>> {
    try {
      return await this.delete<boolean>(
        `/auth/admin/purchases/${purchaseId}/delete`,
        {
          requiresAuth: true,
        }
      );
    } catch (error) {
      console.error(`Error deleting purchase ${purchaseId}:`, error);
      throw error;
    }
  }

  /**
   * Get purchase statistics (admin)
   * @returns Purchase statistics
   */
  static async getPurchaseStatistics(): Promise<
    ApiResponse<PurchaseStatistics>
  > {
    try {
      return await this.get<PurchaseStatistics>(
        "/auth/admin/purchases/statistics",
        {
          requiresAuth: true,
        }
      );
    } catch (error) {
      console.error("Error fetching purchase statistics:", error);
      throw error;
    }
  }

  // ===========================================
  // STUDENT ENDPOINTS
  // ===========================================

  /**
   * Create a new purchase (student)
   * @param request - Purchase creation request
   * @returns Created purchase
   */
  static async createPurchase(
    request: CreatePurchaseRequest
  ): Promise<ApiResponse<Purchase>> {
    try {
      return await this.post<Purchase>("/purchases", request, {
        requireAuth: true,
      });
    } catch (error) {
      console.error("Error creating purchase:", error);
      throw error;
    }
  }

  /**
   * Get purchases for a specific student
   * @param studentId - The student ID
   * @returns List of student purchases
   */
  static async getStudentPurchases(
    studentId: string
  ): Promise<ApiResponse<PurchaseWithDetails[]>> {
    try {
      return await this.get<PurchaseWithDetails[]>(
        `/purchases/student/${studentId}`,
        { requireAuth: true }
      );
    } catch (error) {
      console.error(`Error fetching student purchases ${studentId}:`, error);
      throw error;
    }
  }
}

// Export convenience functions for direct usage
export const {
  getAllPurchases,
  getPurchaseById,
  updatePurchaseStatus,
  deletePurchase,
  getPurchaseStatistics,
  createPurchase,
  getStudentPurchases,
} = PurchasesApi;

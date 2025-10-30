import { useState, useCallback } from "react";
import { AdminApi } from "@/api/admin";
import type {
  PaginationRequest,
  ApproveRejectProfessorRequest,
  Professor,
  Student,
  Admin,
} from "@/types/api";

/**
 * Custom hook for admin operations
 * Provides state management and error handling for all admin-related API calls
 */
export function useAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // ===========================================
  // PROFESSOR MANAGEMENT
  // ===========================================

  const getAllProfessors = useCallback(
    async (
      pagination?: PaginationRequest,
      filters?: {
        status?:
          | "pending"
          | "approved"
          | "accepted"
          | "rejected"
          | "deactivated";
        email_verified?: boolean;
        wilaya?: string;
      }
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await AdminApi.getAllProfessors(pagination, filters);
        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.message || "Failed to fetch professors");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getPendingProfessors = useCallback(
    async (pagination?: PaginationRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await AdminApi.getPendingProfessors(pagination);
        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.message || "Failed to fetch pending professors");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getApprovedProfessors = useCallback(
    async (pagination?: PaginationRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await AdminApi.getApprovedProfessors(pagination);
        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.message || "Failed to fetch approved professors");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getRejectedProfessors = useCallback(
    async (pagination?: PaginationRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await AdminApi.getRejectedProfessors(pagination);
        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.message || "Failed to fetch rejected professors");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getProfessor = useCallback(async (professorId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminApi.getProfessor(professorId);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || "Failed to fetch professor details");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveProfessor = useCallback(
    async (data: ApproveRejectProfessorRequest): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await AdminApi.approveProfessor(data);
        if (response.success) {
          return true;
        } else {
          setError(response.message || "Failed to approve professor");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const rejectProfessor = useCallback(
    async (data: ApproveRejectProfessorRequest): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await AdminApi.rejectProfessor(data);
        if (response.success) {
          return true;
        } else {
          setError(response.message || "Failed to reject professor");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const bulkApproveProfessors = useCallback(async (professorIds: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminApi.bulkApproveProfessors(professorIds);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || "Failed to bulk approve professors");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkRejectProfessors = useCallback(async (professorIds: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminApi.bulkRejectProfessors(professorIds);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || "Failed to bulk reject professors");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===========================================
  // STUDENT MANAGEMENT
  // ===========================================

  const getAllStudents = useCallback(
    async (
      pagination?: PaginationRequest,
      filters?: {
        email_verified?: boolean;
        wilaya?: string;
        academic_stream?: string;
      }
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await AdminApi.getAllStudents(pagination, filters);
        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.message || "Failed to fetch students");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getStudent = useCallback(async (studentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminApi.getStudent(studentId);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || "Failed to fetch student details");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const suspendStudent = useCallback(
    async (studentId: string, reason?: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await AdminApi.suspendStudent(studentId, reason);
        if (response.success) {
          return true;
        } else {
          setError(response.message || "Failed to suspend student");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reactivateStudent = useCallback(
    async (studentId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await AdminApi.reactivateStudent(studentId);
        if (response.success) {
          return true;
        } else {
          setError(response.message || "Failed to reactivate student");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ===========================================
  // ADMIN MANAGEMENT
  // ===========================================

  const getAllAdmins = useCallback(async (pagination?: PaginationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminApi.getAllAdmins(pagination);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || "Failed to fetch admins");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createAdmin = useCallback(
    async (adminData: { email: string; password: string }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await AdminApi.createAdmin(adminData);
        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.message || "Failed to create admin");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateAdmin = useCallback(
    async (
      adminId: string,
      updateData: { email?: string; password?: string }
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await AdminApi.updateAdmin(adminId, updateData);
        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.message || "Failed to update admin");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteAdmin = useCallback(async (adminId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminApi.deleteAdmin(adminId);
      if (response.success) {
        return true;
      } else {
        setError(response.message || "Failed to delete admin");
        return false;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===========================================
  // ANALYTICS AND REPORTING
  // ===========================================

  const getDashboardStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminApi.getDashboardStats();
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || "Failed to fetch dashboard stats");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserActivityAnalytics = useCallback(
    async (period: "day" | "week" | "month" | "year" = "week") => {
      setLoading(true);
      setError(null);
      try {
        const response = await AdminApi.getUserActivityAnalytics(period);
        if (response.success && response.data) {
          return response.data;
        } else {
          setError(
            response.message || "Failed to fetch user activity analytics"
          );
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const exportUserData = useCallback(
    async (
      type: "students" | "professors" | "all",
      format: "csv" | "xlsx" | "json" = "csv"
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await AdminApi.exportUserData(type, format);
        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.message || "Failed to export user data");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ===========================================
  // SYSTEM MANAGEMENT
  // ===========================================

  const getSystemHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminApi.getSystemHealth();
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || "Failed to fetch system health");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSystemCache = useCallback(
    async (
      cache_type: "all" | "user_sessions" | "file_cache" | "redis" = "all"
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await AdminApi.clearSystemCache(cache_type);
        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.message || "Failed to clear system cache");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateSystemConfig = useCallback(
    async (config: Record<string, unknown>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await AdminApi.updateSystemConfig(config);
        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.message || "Failed to update system config");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    // State
    loading,
    error,

    // Actions
    clearError,

    // Professor Management
    getAllProfessors,
    getPendingProfessors,
    getApprovedProfessors,
    getRejectedProfessors,
    getProfessor,
    approveProfessor,
    rejectProfessor,
    bulkApproveProfessors,
    bulkRejectProfessors,

    // Student Management
    getAllStudents,
    getStudent,
    suspendStudent,
    reactivateStudent,

    // Admin Management
    getAllAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,

    // Analytics and Reporting
    getDashboardStats,
    getUserActivityAnalytics,
    exportUserData,

    // System Management
    getSystemHealth,
    clearSystemCache,
    updateSystemConfig,
  };
}

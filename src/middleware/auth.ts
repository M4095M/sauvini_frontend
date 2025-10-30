"use client";

import { BaseApi } from "@/api";
import type { ApiResponse, TokenPair, UserRole } from "@/types/api";

// ===========================================
// TYPES
// ===========================================

interface AuthMiddlewareConfig {
  requireAuth?: boolean;
  requiredRole?: UserRole;
  skipAuthRefresh?: boolean;
  timeout?: number;
}

interface AuthMiddlewareResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  shouldRetry?: boolean;
}

// ===========================================
// AUTHENTICATION MIDDLEWARE
// ===========================================

export class AuthMiddleware {
  private static instance: AuthMiddleware;
  private refreshPromise: Promise<TokenPair> | null = null;

  private constructor() {}

  static getInstance(): AuthMiddleware {
    if (!AuthMiddleware.instance) {
      AuthMiddleware.instance = new AuthMiddleware();
    }
    return AuthMiddleware.instance;
  }

  // ===========================================
  // MAIN MIDDLEWARE FUNCTION
  // ===========================================

  async execute<T>(
    apiCall: () => Promise<ApiResponse<T>>,
    config: AuthMiddlewareConfig = {}
  ): Promise<AuthMiddlewareResult<T>> {
    const {
      requireAuth = true,
      requiredRole,
      skipAuthRefresh = false,
      timeout = 30000,
    } = config;

    try {
      // Check authentication requirements
      if (requireAuth) {
        const authCheck = await this.checkAuthentication(requiredRole);
        if (!authCheck.success) {
          return {
            success: false,
            error: authCheck.error,
            shouldRetry: false,
          };
        }
      }

      // Execute the API call with timeout
      const result = await this.executeWithTimeout(apiCall, timeout);

      // Handle authentication errors
      if (result.error && this.isAuthError(result.error)) {
        if (!skipAuthRefresh) {
          const refreshResult = await this.handleTokenRefresh();
          if (refreshResult.success) {
            // Retry the original call
            return this.execute(apiCall, { ...config, skipAuthRefresh: true });
          }
        }

        return {
          success: false,
          error: "Authentication failed. Please log in again.",
          shouldRetry: false,
        };
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error("Auth middleware error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        shouldRetry: false,
      };
    }
  }

  // ===========================================
  // AUTHENTICATION CHECKS
  // ===========================================

  private async checkAuthentication(requiredRole?: UserRole): Promise<{
    success: boolean;
    error?: string;
  }> {
    // Check if user is authenticated
    if (!BaseApi.isAuthenticated()) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    // Check token expiration
    const tokens = BaseApi.getTokens();
    if (!tokens || BaseApi.isTokenExpired(tokens)) {
      try {
        await this.refreshTokens();
      } catch (error) {
        return {
          success: false,
          error: "Session expired. Please log in again.",
        };
      }
    }

    // Check role requirements
    if (requiredRole) {
      const userRole = BaseApi.getCurrentUserRole();
      if (!userRole || !this.hasRequiredRole(userRole, requiredRole)) {
        return {
          success: false,
          error: `Access denied. Required role: ${requiredRole}`,
        };
      }
    }

    return { success: true };
  }

  // ===========================================
  // TOKEN MANAGEMENT
  // ===========================================

  private async refreshTokens(): Promise<void> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const tokens = BaseApi.getTokens();
    if (!tokens?.refresh_token) {
      throw new Error("No refresh token available");
    }

    this.refreshPromise = this.performTokenRefresh(tokens.refresh_token);

    try {
      await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(refreshToken: string): Promise<TokenPair> {
    try {
      // Determine user type to use correct refresh endpoint
      const userRole = BaseApi.getCurrentUserRole();

      let refreshEndpoint: string;
      switch (userRole) {
        case "admin":
          refreshEndpoint = "/auth/admin/refresh-token";
          break;
        case "professor":
          refreshEndpoint = "/auth/professor/refresh-token";
          break;
        case "student":
          refreshEndpoint = "/auth/student/refresh-token";
          break;
        default:
          refreshEndpoint = "/auth/student/refresh-token";
      }

      const response = await fetch(`${BaseApi["baseURL"]}${refreshEndpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data: ApiResponse<TokenPair> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.message || "Token refresh failed");
      }

      BaseApi.setTokens(data.data);
      return data.data;
    } catch (error) {
      BaseApi.clearTokens();
      this.redirectToLogin();
      throw error;
    }
  }

  // ===========================================
  // UTILITY METHODS
  // ===========================================

  private async executeWithTimeout<T>(
    apiCall: () => Promise<ApiResponse<T>>,
    timeout: number
  ): Promise<{ data?: T; error?: string }> {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve({
          error: "Request timeout",
        });
      }, timeout);

      apiCall()
        .then((response) => {
          clearTimeout(timeoutId);
          if (response.success && response.data) {
            resolve({ data: response.data });
          } else {
            resolve({ error: response.message || "API call failed" });
          }
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          resolve({
            error: error instanceof Error ? error.message : "API call failed",
          });
        });
    });
  }

  private isAuthError(error: string): boolean {
    const authErrorPatterns = [
      "unauthorized",
      "authentication",
      "token",
      "expired",
      "invalid",
      "401",
    ];

    return authErrorPatterns.some((pattern) =>
      error.toLowerCase().includes(pattern)
    );
  }

  private hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy: Record<UserRole, number> = {
      student: 1,
      professor: 2,
      admin: 3,
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  private redirectToLogin(): void {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (currentPath !== "/auth/login" && currentPath !== "/auth/register") {
        sessionStorage.setItem("redirect_after_login", currentPath);
      }
      window.location.href = "/auth/login";
    }
  }

  // ===========================================
  // CONVENIENCE METHODS
  // ===========================================

  async withAuth<T>(
    apiCall: () => Promise<ApiResponse<T>>,
    requiredRole?: UserRole
  ): Promise<AuthMiddlewareResult<T>> {
    return this.execute(apiCall, {
      requireAuth: true,
      requiredRole,
    });
  }

  async withOptionalAuth<T>(
    apiCall: () => Promise<ApiResponse<T>>
  ): Promise<AuthMiddlewareResult<T>> {
    return this.execute(apiCall, {
      requireAuth: false,
    });
  }

  async withStudentAuth<T>(
    apiCall: () => Promise<ApiResponse<T>>
  ): Promise<AuthMiddlewareResult<T>> {
    return this.execute(apiCall, {
      requireAuth: true,
      requiredRole: "student",
    });
  }

  async withProfessorAuth<T>(
    apiCall: () => Promise<ApiResponse<T>>
  ): Promise<AuthMiddlewareResult<T>> {
    return this.execute(apiCall, {
      requireAuth: true,
      requiredRole: "professor",
    });
  }

  async withAdminAuth<T>(
    apiCall: () => Promise<ApiResponse<T>>
  ): Promise<AuthMiddlewareResult<T>> {
    return this.execute(apiCall, {
      requireAuth: true,
      requiredRole: "admin",
    });
  }
}

// ===========================================
// SINGLETON INSTANCE
// ===========================================

export const authMiddleware = AuthMiddleware.getInstance();

// ===========================================
// CONVENIENCE FUNCTIONS
// ===========================================

export async function withAuth<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  requiredRole?: UserRole
): Promise<AuthMiddlewareResult<T>> {
  return authMiddleware.withAuth(apiCall, requiredRole);
}

export async function withOptionalAuth<T>(
  apiCall: () => Promise<ApiResponse<T>>
): Promise<AuthMiddlewareResult<T>> {
  return authMiddleware.withOptionalAuth(apiCall);
}

export async function withStudentAuth<T>(
  apiCall: () => Promise<ApiResponse<T>>
): Promise<AuthMiddlewareResult<T>> {
  return authMiddleware.withStudentAuth(apiCall);
}

export async function withProfessorAuth<T>(
  apiCall: () => Promise<ApiResponse<T>>
): Promise<AuthMiddlewareResult<T>> {
  return authMiddleware.withProfessorAuth(apiCall);
}

export async function withAdminAuth<T>(
  apiCall: () => Promise<ApiResponse<T>>
): Promise<AuthMiddlewareResult<T>> {
  return authMiddleware.withAdminAuth(apiCall);
}

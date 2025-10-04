"use client";

import { useAuth as useAuthContext } from "@/context/AuthContextEnhanced";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { UserRole } from "@/types/api";

// ===========================================
// ENHANCED AUTHENTICATION HOOK
// ===========================================

export function useAuth() {
  const authContext = useAuthContext();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  // ===========================================
  // INITIALIZATION
  // ===========================================

  useEffect(() => {
    if (!authContext.isLoading) {
      setIsInitialized(true);
    }
  }, [authContext.isLoading]);

  // ===========================================
  // AUTHENTICATION METHODS
  // ===========================================

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        return await authContext.login(email, password);
      } catch (error) {
        console.error("Login error:", error);
        return false;
      }
    },
    [authContext]
  );

  const logout = useCallback(async () => {
    try {
      await authContext.logout();
      // The authContext.logout() already handles the redirect
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [authContext]);

  // ===========================================
  // ROLE-BASED ACCESS CONTROL
  // ===========================================

  const hasRole = useCallback(
    (role: UserRole): boolean => {
      if (!authContext.user) return false;

      // Check various possible role properties
      const userRole =
        authContext.user.role ||
        authContext.user.type ||
        authContext.user.user_type;
      return userRole === role;
    },
    [authContext.user]
  );

  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => {
      return roles.some((role) => hasRole(role));
    },
    [hasRole]
  );

  const hasAllRoles = useCallback(
    (roles: UserRole[]): boolean => {
      return roles.every((role) => hasRole(role));
    },
    [hasRole]
  );

  const isStudent = useCallback(() => hasRole("student"), [hasRole]);
  const isProfessor = useCallback(() => hasRole("professor"), [hasRole]);
  const isAdmin = useCallback(() => hasRole("admin"), [hasRole]);

  // ===========================================
  // ROUTE PROTECTION
  // ===========================================

  const requireAuth = useCallback(
    (redirectTo: string = "/auth/login") => {
      if (!authContext.isAuthenticated) {
        router.push(redirectTo);
        return false;
      }
      return true;
    },
    [authContext.isAuthenticated, router]
  );

  const requireRole = useCallback(
    (role: UserRole, redirectTo?: string) => {
      if (!authContext.isAuthenticated) {
        router.push("/auth/login");
        return false;
      }

      if (!hasRole(role)) {
        const defaultRedirect = getDefaultRedirectForRole(
          authContext.user?.role as UserRole
        );
        router.push(redirectTo || defaultRedirect);
        return false;
      }

      return true;
    },
    [authContext.isAuthenticated, authContext.user, hasRole, router]
  );

  const requireAnyRole = useCallback(
    (roles: UserRole[], redirectTo?: string) => {
      if (!authContext.isAuthenticated) {
        router.push("/auth/login");
        return false;
      }

      if (!hasAnyRole(roles)) {
        const defaultRedirect = getDefaultRedirectForRole(
          authContext.user?.role as UserRole
        );
        router.push(redirectTo || defaultRedirect);
        return false;
      }

      return true;
    },
    [authContext.isAuthenticated, authContext.user, hasAnyRole, router]
  );

  // ===========================================
  // USER INFO
  // ===========================================

  const getUserFullName = useCallback((): string | null => {
    if (!authContext.user) return null;

    const user = authContext.user;
    if ("first_name" in user && "last_name" in user) {
      return `${user.first_name} ${user.last_name}`.trim();
    }

    return user.email || null;
  }, [authContext.user]);

  const getUserRole = useCallback((): UserRole | null => {
    if (!authContext.user) return null;

    const user = authContext.user;
    const role = user.role || user.type || user.user_type;
    return (role as UserRole) || "student";
  }, [authContext.user]);

  const getUserEmail = useCallback((): string | null => {
    return authContext.user?.email || null;
  }, [authContext.user]);

  // ===========================================
  // LOADING STATES
  // ===========================================

  const isLoading = authContext.isLoading || !isInitialized;

  // ===========================================
  // RETURN VALUE
  // ===========================================

  return {
    // Basic auth state
    user: authContext.user,
    isAuthenticated: authContext.isAuthenticated,
    isLoading,
    isInitialized,

    // Authentication methods
    login,
    logout,

    // Role-based access control
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isStudent,
    isProfessor,
    isAdmin,

    // Route protection
    requireAuth,
    requireRole,
    requireAnyRole,

    // User info
    getUserFullName,
    getUserRole,
    getUserEmail,
  };
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

function getDefaultRedirectForRole(role?: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "professor":
      return "/professor";
    case "student":
      return "/";
    default:
      return "/auth/login";
  }
}

// ===========================================
// CONVENIENCE HOOKS
// ===========================================

export function useRequireAuth(redirectTo?: string) {
  const { requireAuth, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      requireAuth(redirectTo);
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo]);

  return { isAuthenticated, isLoading };
}

export function useRequireRole(role: UserRole, redirectTo?: string) {
  const { requireRole, isAuthenticated, isLoading, hasRole } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasRole(role)) {
      requireRole(role, redirectTo);
    }
  }, [isAuthenticated, isLoading, hasRole, role, requireRole, redirectTo]);

  return { isAuthenticated, isLoading, hasRole: hasRole(role) };
}

export function useRequireAnyRole(roles: UserRole[], redirectTo?: string) {
  const { requireAnyRole, isAuthenticated, isLoading, hasAnyRole } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasAnyRole(roles)) {
      requireAnyRole(roles, redirectTo);
    }
  }, [
    isAuthenticated,
    isLoading,
    hasAnyRole,
    roles,
    requireAnyRole,
    redirectTo,
  ]);

  return { isAuthenticated, isLoading, hasAnyRole: hasAnyRole(roles) };
}

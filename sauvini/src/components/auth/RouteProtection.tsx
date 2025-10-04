"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AuthGuard } from "./AuthGuard";

// ===========================================
// TYPES
// ===========================================

interface RouteConfig {
  path: string;
  requireAuth: boolean;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

interface RouteProtectionProps {
  children: React.ReactNode;
  routes?: RouteConfig[];
  defaultRedirect?: string;
}

// ===========================================
// ROUTE CONFIGURATION
// ===========================================

const DEFAULT_ROUTES: RouteConfig[] = [
  // Public routes
  { path: "/", requireAuth: false },
  { path: "/auth/login", requireAuth: false },
  { path: "/auth/register", requireAuth: false },
  { path: "/register", requireAuth: false },
  { path: "/auth/forgot-password", requireAuth: false },
  { path: "/auth/reset-password", requireAuth: false },
  { path: "/public", requireAuth: false },
  { path: "/util", requireAuth: false },
  { path: "/util/auth", requireAuth: false },

  // Student routes
  { path: "/student", requireAuth: true, allowedRoles: ["student"] },
  { path: "/learning", requireAuth: true, allowedRoles: ["student"] },
  { path: "/lessons", requireAuth: true, allowedRoles: ["student"] },
  { path: "/quizes", requireAuth: true, allowedRoles: ["student"] },
  { path: "/profile", requireAuth: true, allowedRoles: ["student"] },

  // Professor routes
  { path: "/professor", requireAuth: true, allowedRoles: ["professor"] },
  {
    path: "/professor/dashboard",
    requireAuth: true,
    allowedRoles: ["professor"],
  },
  {
    path: "/professor/courses",
    requireAuth: true,
    allowedRoles: ["professor"],
  },
  {
    path: "/professor/students",
    requireAuth: true,
    allowedRoles: ["professor"],
  },
  {
    path: "/professor/analytics",
    requireAuth: true,
    allowedRoles: ["professor"],
  },

  // Admin routes
  { path: "/admin", requireAuth: true, allowedRoles: ["admin"] },
  { path: "/admin/dashboard", requireAuth: true, allowedRoles: ["admin"] },
  { path: "/admin/users", requireAuth: true, allowedRoles: ["admin"] },
  { path: "/admin/analytics", requireAuth: true, allowedRoles: ["admin"] },
  { path: "/admin/settings", requireAuth: true, allowedRoles: ["admin"] },
];

// ===========================================
// COMPONENT
// ===========================================

export function RouteProtection({
  children,
  routes = DEFAULT_ROUTES,
  defaultRedirect = "/auth/login",
}: RouteProtectionProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // ===========================================
  // ROUTE MATCHING LOGIC
  // ===========================================

  const findMatchingRoute = useCallback(
    (path: string): RouteConfig | null => {
      // Exact match first
      const exactMatch = routes.find((route) => route.path === path);
      if (exactMatch) return exactMatch;

      // Pattern matching for nested routes
      for (const route of routes) {
        if (
          path.startsWith(route.path + "/") ||
          path.startsWith(route.path + "?")
        ) {
          return route;
        }
      }

      // Default route for unmatched paths
      return {
        path: path,
        requireAuth: true, // Default to requiring auth for unknown routes
        allowedRoles: undefined,
      };
    },
    [routes]
  );

  // ===========================================
  // AUTHORIZATION CHECK
  // ===========================================

  useEffect(() => {
    const checkRouteAccess = async () => {
      setIsChecking(true);

      try {
        // Wait for auth context to finish loading
        if (isLoading) {
          return;
        }

        const route = findMatchingRoute(pathname);

        // If route doesn't require auth, allow access
        if (!route.requireAuth) {
          setIsAuthorized(true);
          setIsChecking(false);
          return;
        }

        // Check if user is authenticated
        if (!isAuthenticated || !user) {
          setIsAuthorized(false);
          setIsChecking(false);

          // Redirect to login with return URL
          const returnUrl = encodeURIComponent(pathname);
          router.push(`${defaultRedirect}?returnUrl=${returnUrl}`);
          return;
        }

        // Check role-based access
        if (route.allowedRoles && route.allowedRoles.length > 0) {
          const userRole = getUserRoleFromUser(user);

          if (!userRole || !route.allowedRoles.includes(userRole)) {
            setIsAuthorized(false);
            setIsChecking(false);

            // Redirect to appropriate page based on user role
            const redirectPath = getRedirectPathForRole(userRole);
            router.push(redirectPath);
            return;
          }
        }

        // All checks passed
        setIsAuthorized(true);
        setIsChecking(false);
      } catch (error) {
        console.error("Route protection check failed:", error);
        setIsAuthorized(false);
        setIsChecking(false);
        router.push(defaultRedirect);
      }
    };

    checkRouteAccess();
  }, [
    pathname,
    isAuthenticated,
    user,
    isLoading,
    router,
    defaultRedirect,
    findMatchingRoute,
  ]);

  // ===========================================
  // RENDER LOGIC
  // ===========================================

  // Show loading spinner while checking
  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking access..." />
      </div>
    );
  }

  // Show unauthorized message if access denied
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">
            You don&apos;t have permission to access this page.
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

function getUserRoleFromUser(user: any): UserRole | null {
  if (!user) return null;

  // Check various possible role properties
  if (user.role) return user.role as UserRole;
  if (user.type) return user.type as UserRole;
  if (user.user_type) return user.user_type as UserRole;

  // Default to student if no role is found
  return "student";
}

function getRedirectPathForRole(role: UserRole | null): string {
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
// CONVENIENCE COMPONENTS
// ===========================================

export function ProtectedRoute({
  children,
  requiredRole,
  fallback,
}: {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole={requiredRole} fallback={fallback}>
      {children}
    </AuthGuard>
  );
}

export function PublicRoute({ children }: { children: React.ReactNode }) {
  return <AuthGuard requireAuth={false}>{children}</AuthGuard>;
}

// ===========================================
// HOOK FOR ROUTE PROTECTION
// ===========================================

export function useRouteProtection() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const checkAccess = (requiredRole?: UserRole): boolean => {
    if (isLoading) return false;
    if (!isAuthenticated || !user) return false;

    if (requiredRole) {
      const userRole = getUserRoleFromUser(user);
      return userRole === requiredRole;
    }

    return true;
  };

  const getRedirectPath = (): string => {
    if (!isAuthenticated || !user) {
      return "/auth/login";
    }

    const userRole = getUserRoleFromUser(user);
    return getRedirectPathForRole(userRole);
  };

  return {
    checkAccess,
    getRedirectPath,
    isAuthenticated,
    isLoading,
    user,
  };
}

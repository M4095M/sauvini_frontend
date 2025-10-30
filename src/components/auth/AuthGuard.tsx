"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Shield, Lock } from "lucide-react";

// ===========================================
// TYPES
// ===========================================

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

interface AuthState {
  isChecking: boolean;
  isAuthorized: boolean;
  error: string | null;
}

// ===========================================
// COMPONENT
// ===========================================

export function AuthGuard({
  children,
  requiredRole,
  fallback,
  redirectTo,
  requireAuth = true,
}: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [authState, setAuthState] = useState<AuthState>({
    isChecking: true,
    isAuthorized: false,
    error: null,
  });

  // ===========================================
  // AUTHENTICATION LOGIC
  // ===========================================

  useEffect(() => {
    const checkAuth = async () => {
      setAuthState((prev) => ({ ...prev, isChecking: true, error: null }));

      try {
        // If authentication is not required, allow access
        if (!requireAuth) {
          setAuthState({
            isChecking: false,
            isAuthorized: true,
            error: null,
          });
          return;
        }

        // Wait for auth context to finish loading
        if (isLoading) {
          return;
        }

        // Check if user is authenticated
        if (!isAuthenticated || !user) {
          setAuthState({
            isChecking: false,
            isAuthorized: false,
            error: "Authentication required",
          });

          // Redirect to login with return URL
          const returnUrl = encodeURIComponent(pathname);
          router.push(`/auth/login?returnUrl=${returnUrl}`);
          return;
        }

        // Check role-based authorization
        if (requiredRole) {
          const userRole = getUserRoleFromUser(user);

          if (!userRole || !hasRequiredRole(userRole, requiredRole)) {
            setAuthState({
              isChecking: false,
              isAuthorized: false,
              error: `Access denied. Required role: ${requiredRole}`,
            });

            // Redirect to appropriate page based on user role
            const redirectPath = getRedirectPathForRole(userRole);
            router.push(redirectPath);
            return;
          }
        }

        // All checks passed
        setAuthState({
          isChecking: false,
          isAuthorized: true,
          error: null,
        });
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthState({
          isChecking: false,
          isAuthorized: false,
          error: "Authentication check failed",
        });
      }
    };

    checkAuth();
  }, [
    isAuthenticated,
    user,
    isLoading,
    requiredRole,
    requireAuth,
    pathname,
    router,
  ]);

  // ===========================================
  // RENDER LOGIC
  // ===========================================

  // Show loading spinner while checking authentication
  if (authState.isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Show error state if authentication failed
  if (!authState.isAuthorized) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              {requiredRole ? (
                <Shield className="w-6 h-6 text-red-600" />
              ) : (
                <Lock className="w-6 h-6 text-red-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {requiredRole ? "Access Denied" : "Authentication Required"}
            </h2>
            <p className="mt-2 text-gray-600">
              {authState.error ||
                "You don't have permission to access this page."}
            </p>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {requiredRole
                ? `This page requires ${requiredRole} privileges. Please contact an administrator if you believe this is an error.`
                : "Please log in to access this page."}
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => router.push("/auth/login")}
              className="flex-1"
            >
              Go to Login
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Go Back
            </Button>
          </div>
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

  // Check if user has a role property
  if (user.role) {
    return user.role as UserRole;
  }

  // Check if user has a type property (alternative naming)
  if (user.type) {
    return user.type as UserRole;
  }

  // Check if user has a user_type property
  if (user.user_type) {
    return user.user_type as UserRole;
  }

  // Default to student if no role is found
  return "student";
}

function hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
  // Define role hierarchy (admin > professor > student)
  const roleHierarchy: Record<UserRole, number> = {
    student: 1,
    professor: 2,
    admin: 3,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
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

export function StudentGuard({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="student" fallback={fallback}>
      {children}
    </AuthGuard>
  );
}

export function ProfessorGuard({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="professor" fallback={fallback}>
      {children}
    </AuthGuard>
  );
}

export function AdminGuard({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="admin" fallback={fallback}>
      {children}
    </AuthGuard>
  );
}

export function PublicGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard requireAuth={false}>{children}</AuthGuard>;
}

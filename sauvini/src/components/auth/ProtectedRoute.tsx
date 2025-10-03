/**
 * ProtectedRoute Component
 * 
 * A wrapper component that protects routes based on authentication status and user roles.
 * Automatically redirects unauthenticated users to login page and handles role-based access.
 * 
 * Features:
 * - Authentication requirement enforcement
 * - Role-based access control
 * - Automatic redirects
 * - Loading states
 * - Customizable fallback content
 * - SSR-safe implementation
 * 
 * Usage:
 * ```tsx
 * // Protect route for any authenticated user
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 * 
 * // Protect route for specific role
 * <ProtectedRoute requiredRole="professor">
 *   <AdminPanel />
 * </ProtectedRoute>
 * 
 * // Custom fallback content
 * <ProtectedRoute fallback={<CustomSpinner />}>
 *   <Content />
 * </ProtectedRoute>
 * ```
 */

'use client';

import { useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types/api';

// ===========================================
// COMPONENT TYPES
// ===========================================

interface ProtectedRouteProps {
  children: React.ReactNode;
  
  /** Role required to access this route */
  requiredRole?: UserRole;
  
  /** Custom fallback component while loading */
  fallback?: React.ReactNode;
  
  /** Custom component to show when access is denied */
  accessDenied?: React.ReactNode;
  
  /** Redirect path for unauthenticated users (default: '/auth/login') */
  loginRedirect?: string;
  
  /** Redirect path for users without required role (default: '/unauthorized') */
  unauthorizedRedirect?: string;
  
  /** Whether to show loading state during authentication check */
  showLoadingState?: boolean;
}

// ===========================================
// DEFAULT COMPONENTS
// ===========================================

/**
 * Default loading component
 */
const DefaultLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

/**
 * Default access denied component
 */
const DefaultAccessDenied = ({ 
  requiredRole, 
  userRole 
}: { 
  requiredRole: string; 
  userRole: string | null; 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center max-w-md mx-auto px-4">
      <div className="bg-red-100 rounded-full p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
      <p className="text-gray-600 mb-4">
        This page requires {requiredRole} access. 
        {userRole && ` You are currently logged in as a ${userRole}.`}
      </p>
      <button 
        onClick={() => window.history.back()}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Go Back
      </button>
    </div>
  </div>
);

// ===========================================
// MAIN COMPONENT
// ===========================================

/**
 * ProtectedRoute component for authentication and role-based route protection
 */
export default function ProtectedRoute({
  children,
  requiredRole,
  fallback = <DefaultLoadingFallback />,
  accessDenied,
  loginRedirect = '/auth/select-role',
  unauthorizedRedirect = '/unauthorized',
  showLoadingState = true,
}: ProtectedRouteProps) {
  
  // ===========================================
  // HOOKS AND STATE
  // ===========================================
  
  const router = useRouter();
  const pathname = usePathname();
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    hasRole,
    getUserRole
  } = useAuth();

  // ===========================================
  // COMPUTED VALUES
  // ===========================================

  /**
   * Determine the current access state
   */
  const accessState = useMemo(() => {
    // Still loading authentication state
    if (isLoading) {
      return 'loading';
    }
    
    // Not authenticated at all
    if (!isAuthenticated || !user) {
      return 'unauthenticated';
    }
    
    // Authenticated but doesn't have required role
    if (requiredRole && !hasRole(requiredRole)) {
      return 'unauthorized';
    }
    
    // All checks passed
    return 'authorized';
  }, [isLoading, isAuthenticated, user, requiredRole, hasRole]);

  // ===========================================
  // SIDE EFFECTS
  // ===========================================

  /**
   * Handle redirects based on authentication state
   */
  useEffect(() => {
    // Don't redirect during loading
    if (isLoading) return;
    
    // Store current path for post-login redirect (only for unauthenticated users)
    if (accessState === 'unauthenticated') {
      // Don't store auth pages as redirect targets
      if (!pathname.startsWith('/auth') && !pathname.startsWith('/register')) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('redirect_after_login', pathname);
        }
      }
      
      // Redirect to login
      router.push(loginRedirect); 
      return;
    }
    
    // Handle role-based unauthorized access
    if (accessState === 'unauthorized') {
      router.push(unauthorizedRedirect);
      return;
    }
  }, [
    accessState, 
    isLoading, 
    router, 
    pathname, 
    loginRedirect, 
    unauthorizedRedirect
  ]);

  // ===========================================
  // RENDER LOGIC
  // ===========================================

  // Show loading state
  if (accessState === 'loading' && showLoadingState) {
    return fallback;
  }
  
  // Show access denied for unauthorized users (fallback if redirect hasn't happened yet)
  if (accessState === 'unauthorized') {
    if (accessDenied) {
      return <>{accessDenied}</>;
    }
    
    return (
      <DefaultAccessDenied 
        requiredRole={requiredRole!} 
        userRole={getUserRole()} 
      />
    );
  }
  
  // Don't render anything while redirecting unauthenticated users
  if (accessState === 'unauthenticated') {
    return showLoadingState ? fallback : null;
  }
  
  // User is authorized, render the protected content
  if (accessState === 'authorized') {
    return <>{children}</>;
  }
  
  // Fallback (shouldn't normally reach here)
  return showLoadingState ? fallback : null;
}

// ===========================================
// CONVENIENCE COMPONENTS
// ===========================================

/**
 * Student-only protected route
 */
export function StudentOnlyRoute(props: Omit<ProtectedRouteProps, 'requiredRole'>) {
  return <ProtectedRoute {...props} requiredRole="student" />;
}

/**
 * Professor-only protected route
 */
export function ProfessorOnlyRoute(props: Omit<ProtectedRouteProps, 'requiredRole'>) {
  return <ProtectedRoute {...props} requiredRole="professor" />;
}

/**
 * Admin-only protected route
 */
export function AdminOnlyRoute(props: Omit<ProtectedRouteProps, 'requiredRole'>) {
  return <ProtectedRoute {...props} requiredRole="admin" />;
}

// ===========================================
// UTILITY COMPONENTS
// ===========================================

/**
 * Component that renders different content based on authentication status
 */
interface ConditionalAuthContentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: UserRole;
}

export function ConditionalAuthContent({
  children,
  fallback = null,
  requireAuth = true,
  requiredRole,
}: ConditionalAuthContentProps) {
  const { isAuthenticated, hasRole, isLoading } = useAuth();
  
  // Still loading
  if (isLoading) {
    return <>{fallback}</>;
  }
  
  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }
  
  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return <>{fallback}</>;
  }
  
  // All checks passed
  return <>{children}</>;
}

// ===========================================
// HIGHER-ORDER COMPONENT
// ===========================================

/**
 * Higher-order component for protecting components
 * 
 * Usage:
 * ```tsx
 * const ProtectedComponent = withAuth(MyComponent, { requiredRole: 'professor' });
 * ```
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  const WrappedComponent = (props: P) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
  
  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// ===========================================
// CUSTOM HOOKS
// ===========================================

/**
 * Hook to check if current user can access a route
 */
export function useCanAccess(requiredRole?: UserRole): {
  canAccess: boolean;
  isLoading: boolean;
  reason: 'loading' | 'unauthenticated' | 'unauthorized' | 'authorized';
} {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  
  return useMemo(() => {
    if (isLoading) {
      return { canAccess: false, isLoading: true, reason: 'loading' };
    }
    
    if (!isAuthenticated) {
      return { canAccess: false, isLoading: false, reason: 'unauthenticated' };
    }
    
    if (requiredRole && !hasRole(requiredRole)) {
      return { canAccess: false, isLoading: false, reason: 'unauthorized' };
    }
    
    return { canAccess: true, isLoading: false, reason: 'authorized' };
  }, [isAuthenticated, isLoading, hasRole, requiredRole]);
}
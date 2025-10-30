/**
 * Authentication Context
 *
 * This context provides authentication state management for the entire application.
 * It integrates with the AuthApi to handle login, logout, registration, and user state.
 *
 * Features:
 * - Centralized authentication state
 * - Automatic token management
 * - User data caching
 * - Loading states for better UX
 * - Integration with API classes
 * - Role-based functionality
 *
 * Usage:
 * ```tsx
 * // Wrap your app with AuthProvider
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 *
 * // Use in components
 * const { user, login, logout, isAuthenticated, isLoading } = useAuth();
 * ```
 */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

// Import our API classes and types
import { AuthApi, BaseApi } from "@/api";
import type {
  User,
  Student,
  Professor,
  Admin,
  UserRole,
  LoginRequest,
  LoginResponse,
  RegisterStudentData,
  RegisterProfessorData,
  TokenPair,
} from "@/types/api";

// ===========================================
// CONTEXT TYPES
// ===========================================

/**
 * Authentication context type definition
 */
interface AuthContextType {
  // User state
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Authentication methods
  loginStudent: (email: string, password: string) => Promise<Student>;
  loginProfessor: (email: string, password: string) => Promise<Professor>;
  loginAdmin: (email: string, password: string) => Promise<Admin>;
  logout: () => Promise<void>;

  // Registration methods
  registerStudent: (data: RegisterStudentData) => Promise<{ message: string }>;
  registerProfessor: (
    data: RegisterProfessorData,
    cvFile: File,
    profilePicture?: File
  ) => Promise<{ message: string }>;

  // User management
  refreshUser: () => Promise<void>;

  // Utility methods
  hasRole: (role: UserRole) => boolean;
  getUserRole: () => UserRole | null;
  getUserFullName: () => string | null;

  // Error handling
  error: string | null;
  clearError: () => void;
}

/**
 * Props for AuthProvider component
 */
interface AuthProviderProps {
  children: ReactNode;
  /** Optional initial user data (useful for SSR) */
  initialUser?: User | null;
  /** Optional initial loading state */
  initialLoading?: boolean;
}

// ===========================================
// CONTEXT CREATION
// ===========================================

/**
 * Authentication context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===========================================
// PROVIDER COMPONENT
// ===========================================

/**
 * AuthProvider component that wraps the app and provides authentication state
 */
export function AuthProvider({
  children,
  initialUser = null,
  initialLoading = true,
}: AuthProviderProps) {
  // ===========================================
  // STATE MANAGEMENT
  // ===========================================

  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<string | null>(null);

  // ===========================================
  // COMPUTED VALUES
  // ===========================================

  /**
   * Check if user is authenticated based on both token validity and user presence
   */
  const isAuthenticated = useMemo(() => {
    return BaseApi.isAuthenticated() && user !== null;
  }, [user]);

  // ===========================================
  // ERROR HANDLING
  // ===========================================

  /**
   * Handle API errors and extract user-friendly messages
   */
  const handleApiError = useCallback((error: unknown): string => {
    let message = "An unexpected error occurred";

    if (typeof error === "string") {
      message = error;
    } else if (typeof error === "object" && error !== null) {
      const errorObj = error as Record<string, unknown>;
      if (typeof errorObj.message === "string") {
        message = errorObj.message;
      } else if (
        typeof errorObj.response === "object" &&
        errorObj.response !== null
      ) {
        const response = errorObj.response as Record<string, unknown>;
        if (typeof response.data === "object" && response.data !== null) {
          const data = response.data as Record<string, unknown>;
          if (typeof data.message === "string") {
            message = data.message;
          }
        }
      }
    }

    setError(message);
    return message;
  }, []);

  /**
   * Clear the current error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ===========================================
  // AUTHENTICATION METHODS
  // ===========================================

  /**
   * Log in a student with email and password
   */
  const loginStudent = useCallback(
    async (email: string, password: string): Promise<Student> => {
      setIsLoading(true);
      clearError();

      try {
        const credentials: LoginRequest = { email, password };

        const response = await AuthApi.loginStudent(credentials);

        if (!response) {
          throw new Error("Login failed");
        }

        // Store tokens
        BaseApi.setTokens(response.token);

        // Update user state
        setUser(response.user);

        // Handle post-login redirect if stored
        if (typeof window !== "undefined") {
          const redirectPath = sessionStorage.getItem("redirect_after_login");
          if (redirectPath) {
            sessionStorage.removeItem("redirect_after_login");
            window.location.href = redirectPath;
          }
        }

        return response.user;
      } catch (error: unknown) {
        const errorMessage = handleApiError(error);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [handleApiError, clearError]
  );

  /**
   * Log in a professor with email and password
   */
  const loginProfessor = useCallback(
    async (email: string, password: string): Promise<Professor> => {
      setIsLoading(true);
      clearError();

      try {
        const credentials: LoginRequest = { email, password };

        const response = await AuthApi.loginProfessor(credentials);

        if (!response) {
          throw new Error("Login failed");
        }

        // Store tokens
        BaseApi.setTokens(response.token);

        // Update user state
        setUser(response.user);

        // Handle post-login redirect if stored
        if (typeof window !== "undefined") {
          const redirectPath = sessionStorage.getItem("redirect_after_login");
          if (redirectPath) {
            sessionStorage.removeItem("redirect_after_login");
            window.location.href = redirectPath;
          }
        }

        return response.user;
      } catch (error: unknown) {
        const errorMessage = handleApiError(error);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [handleApiError, clearError]
  );

  /**
   * Log in an admin with email and password
   */
  const loginAdmin = useCallback(
    async (email: string, password: string): Promise<Admin> => {
      setIsLoading(true);
      clearError();

      try {
        const credentials: LoginRequest = { email, password };

        const response = await AuthApi.loginAdmin(credentials);

        if (!response) {
          throw new Error("Login failed");
        }

        // Store tokens
        BaseApi.setTokens(response.token);

        // Update user state
        setUser(response.user);

        // Handle post-login redirect if stored
        if (typeof window !== "undefined") {
          const redirectPath = sessionStorage.getItem("redirect_after_login");
          if (redirectPath) {
            sessionStorage.removeItem("redirect_after_login");
            window.location.href = redirectPath;
          }
        }

        return response.user;
      } catch (error: unknown) {
        const errorMessage = handleApiError(error);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [handleApiError, clearError]
  );

  /**
   * Log out the current user
   */
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      await AuthApi.logout();
    } catch (error) {
      // Even if logout fails on server, we still clear local state
      console.error("Logout error (continuing anyway):", error);
    } finally {
      // Always clear local state
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  // ===========================================
  // REGISTRATION METHODS
  // ===========================================

  /**
   * Register a new student
   */
  const registerStudent = useCallback(
    async (data: RegisterStudentData): Promise<User> => {
      setIsLoading(true);
      clearError();

      try {
        const response = await AuthApi.registerStudent(data);

        if (!response.success || !response.data) {
          throw new Error(response.message || "Registration failed");
        }

        setUser(response.user);
        return response.user;
      } catch (error: unknown) {
        const errorMessage = handleApiError(error);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [handleApiError, clearError]
  );

  /**
   * Register a new professor
   */
  const registerProfessor = useCallback(
    async (data: RegisterProfessorData): Promise<User> => {
      setIsLoading(true);
      clearError();

      try {
        const response = await AuthApi.registerProfessor(data);

        if (!response.success || !response.data) {
          throw new Error(response.message || "Registration failed");
        }

        setUser(response.user);
        return response.user;
      } catch (error: unknown) {
        const errorMessage = handleApiError(error);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [handleApiError, clearError]
  );

  // ===========================================
  // USER MANAGEMENT METHODS
  // ===========================================

  /**
   * Refresh user data from the server
   */
  const refreshUser = useCallback(async (): Promise<void> => {
    if (!BaseApi.isAuthenticated()) return;

    try {
      const response = await AuthApi.getCurrentUser();

      if (response.success && response.data) {
        setUser(response.data);
      } else {
        // If we can't get user data but we have tokens, something's wrong
        console.warn("Failed to refresh user data, clearing auth state");
        BaseApi.clearTokens();
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      // On refresh failure, clear auth state
      BaseApi.clearTokens();
      setUser(null);
    }
  }, []);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(
    async (userData: Partial<User>): Promise<User> => {
      setIsLoading(true);
      clearError();

      try {
        const response = await AuthApi.updateProfile(userData);

        if (!response.success || !response.data) {
          throw new Error(response.message || "Profile update failed");
        }

        setUser(response.data);
        return response.data;
      } catch (error: unknown) {
        const errorMessage = handleApiError(error);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [handleApiError, clearError]
  );

  /**
   * Change user password
   */
  const changePassword = useCallback(
    async (passwordData: {
      currentPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    }): Promise<void> => {
      setIsLoading(true);
      clearError();

      try {
        const response = await AuthApi.changePassword(
          passwordData.currentPassword,
          passwordData.newPassword
        );

        if (!response.success) {
          throw new Error(response.message || "Password change failed");
        }
      } catch (error: unknown) {
        const errorMessage = handleApiError(error);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [handleApiError, clearError]
  );

  // ===========================================
  // UTILITY METHODS
  // ===========================================

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback(
    (role: "student" | "professor"): boolean => {
      return user?.role === role;
    },
    [user]
  );

  /**
   * Get user's full name
   */
  const getUserFullName = useCallback((): string | null => {
    if (!user) return null;
    return `${user.firstName} ${user.lastName}`.trim();
  }, [user]);

  /**
   * Check if user's email is verified
   */
  const isEmailVerified = useCallback(async (): Promise<boolean> => {
    // For now, assume user is verified if they have a token
    // In a real app, you'd check the user's verification status
    return AuthApi.isAuthenticated();
  }, []);

  // ===========================================
  // INITIALIZATION EFFECT
  // ===========================================

  /**
   * Initialize authentication state on component mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      try {
        // Check if we have valid tokens
        if (BaseApi.isAuthenticated()) {
          // Try to get current user
          await refreshUser();
        } else {
          // No valid tokens, ensure user state is null
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        // Clear any invalid state
        BaseApi.clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Only run initialization if we don't have initial user data
    if (initialUser === null) {
      initializeAuth();
    } else {
      // We have initial user data, just stop loading
      setIsLoading(false);
    }
  }, [initialUser, refreshUser]);

  // ===========================================
  // CONTEXT VALUE
  // ===========================================

  /**
   * Memoized context value to prevent unnecessary re-renders
   */
  const contextValue = useMemo<AuthContextType>(
    () => ({
      // User state
      user,
      isLoading,
      isAuthenticated,

      // Authentication methods
      login,
      logout,

      // Registration methods
      registerStudent,
      registerProfessor,

      // User management
      refreshUser,
      updateProfile,
      changePassword,

      // Utility methods
      hasRole,
      getUserFullName,
      isEmailVerified,

      // Error handling
      error,
      clearError,
    }),
    [
      user,
      isLoading,
      isAuthenticated,
      login,
      logout,
      registerStudent,
      registerProfessor,
      refreshUser,
      updateProfile,
      changePassword,
      hasRole,
      getUserFullName,
      isEmailVerified,
      error,
      clearError,
    ]
  );

  // ===========================================
  // RENDER
  // ===========================================

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// ===========================================
// CUSTOM HOOK
// ===========================================

/**
 * Custom hook to access authentication context
 *
 * @throws Error if used outside of AuthProvider
 * @returns AuthContextType
 *
 * Usage:
 * ```tsx
 * const { user, login, logout, isAuthenticated } = useAuth();
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider. " +
        "Make sure to wrap your component tree with <AuthProvider>."
    );
  }

  return context;
}

// ===========================================
// ADDITIONAL HOOKS
// ===========================================

/**
 * Hook that returns only the user data (useful for components that only need user info)
 */
export function useUser(): User | null {
  const { user } = useAuth();
  return user;
}

/**
 * Hook that returns authentication status (useful for conditional rendering)
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

/**
 * Hook that returns loading state (useful for showing spinners)
 */
export function useAuthLoading(): boolean {
  const { isLoading } = useAuth();
  return isLoading;
}

/**
 * Hook for role-based functionality
 */
export function useRole(): {
  role: "student" | "professor" | null;
  isStudent: boolean;
  isProfessor: boolean;
  hasRole: (role: "student" | "professor") => boolean;
} {
  const { user, hasRole } = useAuth();

  return useMemo(
    () => ({
      role: user?.role || null,
      isStudent: user?.role === "student",
      isProfessor: user?.role === "professor",
      hasRole,
    }),
    [user?.role, hasRole]
  );
}

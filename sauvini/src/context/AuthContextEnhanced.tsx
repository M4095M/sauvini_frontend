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
import { useRouter } from "next/navigation";
import { AuthApi, BaseApi } from "@/api";
import type {
  User,
  Student,
  Professor,
  Admin,
  UserRole,
  LoginRequest,
  RegisterStudentData,
  RegisterProfessorData,
  TokenPair,
} from "@/types/api";

// ===========================================
// CONTEXT TYPES
// ===========================================

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
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

  // Utility methods
  getUserRole: () => UserRole | null;
  hasRole: (role: UserRole) => boolean;
  getUserFullName: () => string | null;
  refreshUser: () => Promise<void>;

  // Error handling
  clearError: () => void;
  setError: (error: string) => void;

  // Token management
  refreshTokens: () => Promise<void>;
  isTokenExpired: () => boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

// ===========================================
// CONTEXT CREATION
// ===========================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===========================================
// PROVIDER COMPONENT
// ===========================================

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isInitialized: false,
    error: null,
  });

  // ===========================================
  // STATE UPDATERS
  // ===========================================

  const updateAuthState = useCallback((updates: Partial<AuthState>) => {
    setAuthState((prev) => ({ ...prev, ...updates }));
  }, []);

  const setLoading = useCallback(
    (isLoading: boolean) => {
      updateAuthState({ isLoading });
    },
    [updateAuthState]
  );

  const setError = useCallback(
    (error: string) => {
      updateAuthState({ error });
    },
    [updateAuthState]
  );

  const clearError = useCallback(() => {
    updateAuthState({ error: null });
  }, [updateAuthState]);

  // ===========================================
  // ERROR HANDLING
  // ===========================================

  const handleApiError = useCallback(
    (error: unknown): string => {
      let message = "An unexpected error occurred";

      if (typeof error === "string") {
        message = error;
      } else if (typeof error === "object" && error !== null) {
        const errorObj = error as Record<string, unknown>;
        if (typeof errorObj.message === "string") {
          message = errorObj.message;
        }
      }

      setError(message);
      return message;
    },
    [setError]
  );

  // ===========================================
  // AUTHENTICATION METHODS
  // ===========================================

  const loginStudent = useCallback(
    async (email: string, password: string): Promise<Student> => {
      setLoading(true);
      clearError();

      try {
        const credentials: LoginRequest = { email, password };
        const response = await AuthApi.loginStudent(credentials);

        if (!response.success || !response.data) {
          throw new Error(response.message || "Login failed");
        }

        // Store tokens
        BaseApi.setTokens(response.data.token);

        // Update user state
        updateAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });

        return response.data.user;
      } catch (error: unknown) {
        const errorMessage = handleApiError(error);
        setLoading(false);
        throw new Error(errorMessage);
      }
    },
    [handleApiError, clearError, setLoading, updateAuthState]
  );

  const loginProfessor = useCallback(
    async (email: string, password: string): Promise<Professor> => {
      setLoading(true);
      clearError();

      try {
        const credentials: LoginRequest = { email, password };
        const response = await AuthApi.loginProfessor(credentials);

        if (!response.success || !response.data) {
          throw new Error(response.message || "Login failed");
        }

        BaseApi.setTokens(response.data.token);
        updateAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });

        return response.data.user;
      } catch (error: unknown) {
        const errorMessage = handleApiError(error);
        setLoading(false);
        throw new Error(errorMessage);
      }
    },
    [handleApiError, clearError, setLoading, updateAuthState]
  );

  const loginAdmin = useCallback(
    async (email: string, password: string): Promise<Admin> => {
      setLoading(true);
      clearError();

      try {
        const credentials: LoginRequest = { email, password };
        const response = await AuthApi.loginAdmin(credentials);

        if (!response.success || !response.data) {
          throw new Error(response.message || "Login failed");
        }

        BaseApi.setTokens(response.data.token);
        updateAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });

        return response.data.user;
      } catch (error: unknown) {
        const errorMessage = handleApiError(error);
        setLoading(false);
        throw new Error(errorMessage);
      }
    },
    [handleApiError, clearError, setLoading, updateAuthState]
  );

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      await AuthApi.logout();
    } catch (error) {
      console.error("Logout error (continuing anyway):", error);
    } finally {
      BaseApi.clearTokens();
      updateAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      // Force direct navigation to login page to bypass route protection
      window.location.href = "/auth/login";
    }
  }, [setLoading, updateAuthState]);

  // ===========================================
  // REGISTRATION METHODS
  // ===========================================

  const registerStudent = useCallback(
    async (data: RegisterStudentData): Promise<{ message: string }> => {
      setLoading(true);
      clearError();

      try {
        const response = await AuthApi.registerStudent(data);

        if (!response.success || !response.data) {
          throw new Error(response.message || "Registration failed");
        }

        setLoading(false);
        return response.data;
      } catch (error: unknown) {
        const errorMessage = handleApiError(error);
        setLoading(false);
        throw new Error(errorMessage);
      }
    },
    [handleApiError, clearError, setLoading]
  );

  const registerProfessor = useCallback(
    async (
      data: RegisterProfessorData,
      cvFile: File,
      profilePicture?: File
    ): Promise<{ message: string }> => {
      setLoading(true);
      clearError();

      try {
        const response = await AuthApi.registerProfessor(
          data,
          cvFile,
          profilePicture
        );

        if (!response.success || !response.data) {
          throw new Error(response.message || "Registration failed");
        }

        setLoading(false);
        return response.data;
      } catch (error: unknown) {
        const errorMessage = handleApiError(error);
        setLoading(false);
        throw new Error(errorMessage);
      }
    },
    [handleApiError, clearError, setLoading]
  );

  // ===========================================
  // UTILITY METHODS
  // ===========================================

  const getUserRole = useCallback((): UserRole | null => {
    return BaseApi.getCurrentUserRole();
  }, []);

  const hasRole = useCallback((role: UserRole): boolean => {
    return BaseApi.hasRole(role);
  }, []);

  const getUserFullName = useCallback((): string | null => {
    if (!authState.user) return null;

    // Type-safe access to name fields
    if ("first_name" in authState.user && "last_name" in authState.user) {
      return `${authState.user.first_name} ${authState.user.last_name}`.trim();
    }

    return null;
  }, [authState.user]);

  const refreshUser = useCallback(async (): Promise<void> => {
    if (!BaseApi.isAuthenticated()) {
      updateAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    setLoading(true);
    try {
      // In a real app, you'd fetch the full user profile here
      // For now, we'll just update the authentication state
      const role = BaseApi.getCurrentUserRole();
      if (role) {
        updateAuthState({
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      BaseApi.clearTokens();
      updateAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, [setLoading, updateAuthState]);

  const refreshTokens = useCallback(async (): Promise<void> => {
    if (!BaseApi.isAuthenticated()) {
      return;
    }

    try {
      const tokens = BaseApi.getTokens();
      if (tokens?.refresh_token) {
        const response = await AuthApi.refreshAuthTokens(tokens.refresh_token);
        if (response.success && response.data) {
          BaseApi.setTokens(response.data);
        }
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      BaseApi.clearTokens();
      updateAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, [updateAuthState]);

  const isTokenExpired = useCallback((): boolean => {
    const tokens = BaseApi.getTokens();
    if (!tokens) return true;
    return BaseApi.isTokenExpired(tokens);
  }, []);

  // ===========================================
  // INITIALIZATION EFFECT
  // ===========================================

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have valid tokens
        if (BaseApi.isAuthenticated()) {
          const role = BaseApi.getCurrentUserRole();
          if (role) {
            // Create a minimal user object for compatibility
            // In a real app, you'd fetch the full user profile here
            updateAuthState({
              user: { email: "user@example.com" } as User,
              isAuthenticated: true,
              isLoading: false,
              isInitialized: true,
            });
          } else {
            updateAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              isInitialized: true,
            });
          }
        } else {
          updateAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
          });
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        BaseApi.clearTokens();
        updateAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
      }
    };

    initializeAuth();
  }, [updateAuthState]);

  // ===========================================
  // TOKEN REFRESH INTERVAL
  // ===========================================

  useEffect(() => {
    if (!authState.isAuthenticated) return;

    const interval = setInterval(() => {
      if (isTokenExpired()) {
        refreshTokens();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [authState.isAuthenticated, isTokenExpired, refreshTokens]);

  // ===========================================
  // CONTEXT VALUE
  // ===========================================

  const contextValue = useMemo<AuthContextType>(
    () => ({
      // State
      ...authState,

      // Authentication methods
      loginStudent,
      loginProfessor,
      loginAdmin,
      logout,

      // Registration methods
      registerStudent,
      registerProfessor,

      // Utility methods
      getUserRole,
      hasRole,
      getUserFullName,
      refreshUser,

      // Error handling
      clearError,
      setError,

      // Token management
      refreshTokens,
      isTokenExpired,
    }),
    [
      authState,
      loginStudent,
      loginProfessor,
      loginAdmin,
      logout,
      registerStudent,
      registerProfessor,
      getUserRole,
      hasRole,
      getUserFullName,
      refreshUser,
      clearError,
      setError,
      refreshTokens,
      isTokenExpired,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// ===========================================
// CUSTOM HOOK
// ===========================================

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
// UTILITY HOOKS
// ===========================================

export function useUser(): User | null {
  const { user } = useAuth();
  return user;
}

export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

export function useAuthLoading(): boolean {
  const { isLoading } = useAuth();
  return isLoading;
}

export function useRole(): {
  role: UserRole | null;
  isStudent: boolean;
  isProfessor: boolean;
  isAdmin: boolean;
  hasRole: (role: UserRole) => boolean;
} {
  const { getUserRole, hasRole } = useAuth();
  const role = getUserRole();

  return useMemo(
    () => ({
      role,
      isStudent: role === "student",
      isProfessor: role === "professor",
      isAdmin: role === "admin",
      hasRole,
    }),
    [role, hasRole]
  );
}

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
} from "@/types/api";

// ===========================================
// CONTEXT TYPES
// ===========================================

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
  logoutAllDevices: () => Promise<void>;

  // Registration methods
  registerStudent: (
    data: RegisterStudentData,
    profilePicture?: File
  ) => Promise<{ message: string }>;
  registerProfessor: (
    data: RegisterProfessorData,
    cvFile: File,
    profilePicture?: File
  ) => Promise<{ message: string }>;

  // Utility methods
  getUserRole: () => UserRole | null;
  hasRole: (role: UserRole) => boolean;
  getUserFullName: () => string | null;

  // Error handling
  error: string | null;
  clearError: () => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = useMemo(() => {
    return BaseApi.isAuthenticated() && user !== null;
  }, [user]);

  // ===========================================
  // ERROR HANDLING
  // ===========================================

  const handleApiError = useCallback((error: unknown): string => {
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
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ===========================================
  // AUTHENTICATION METHODS
  // ===========================================

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

        BaseApi.setTokens(response.token);
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

        BaseApi.setTokens(response.token);
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

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      await AuthApi.logout();
    } catch (error) {
      console.error("Logout error (continuing anyway):", error);
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  const logoutAllDevices = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      await AuthApi.logoutAllDevices();
    } catch (error) {
      console.error("Logout all devices error (continuing anyway):", error);
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  // ===========================================
  // REGISTRATION METHODS
  // ===========================================

  const registerStudent = useCallback(
    async (
      data: RegisterStudentData,
      profilePicture?: File
    ): Promise<{ message: string }> => {
      setIsLoading(true);
      clearError();

      try {
        const response = await AuthApi.registerStudent(data, profilePicture);

        if (!response.success || !response.data) {
          throw new Error(response.message || "Registration failed");
        }

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

  const registerProfessor = useCallback(
    async (
      data: RegisterProfessorData,
      cvFile: File,
      profilePicture?: File
    ): Promise<{ message: string }> => {
      setIsLoading(true);
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
    if (!user) return null;

    // Type-safe access to name fields
    if ("first_name" in user && "last_name" in user) {
      return `${user.first_name} ${user.last_name}`.trim();
    }

    return null;
  }, [user]);

  // ===========================================
  // INITIALIZATION EFFECT
  // ===========================================

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      try {
        // Check if we have valid tokens
        if (BaseApi.isAuthenticated()) {
          // Try to load user data from localStorage
          if (typeof window !== "undefined") {
            try {
              const storedUserData = localStorage.getItem("user_data");
              if (storedUserData) {
                const userData = JSON.parse(storedUserData);
                setUser(userData);
              } else {
                // If no user data in localStorage, create minimal user object
                const role = BaseApi.getCurrentUserRole();
                if (role) {
                  setUser({ email: "user@example.com" } as User);
                }
              }
            } catch (error) {
              console.error(
                "Failed to load user data from localStorage:",
                error
              );
              // Clear invalid data and tokens
              BaseApi.clearTokens();
              localStorage.removeItem("user_data");
              setUser(null);
            }
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        BaseApi.clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ===========================================
  // CONTEXT VALUE
  // ===========================================

  const contextValue = useMemo<AuthContextType>(
    () => ({
      // User state
      user,
      isLoading,
      isAuthenticated,

      // Authentication methods
      loginStudent,
      loginProfessor,
      loginAdmin,
      logout,
      logoutAllDevices,

      // Registration methods
      registerStudent,
      registerProfessor,

      // Utility methods
      getUserRole,
      hasRole,
      getUserFullName,

      // Error handling
      error,
      clearError,
    }),
    [
      user,
      isLoading,
      isAuthenticated,
      loginStudent,
      loginProfessor,
      loginAdmin,
      logout,
      logoutAllDevices,
      registerStudent,
      registerProfessor,
      getUserRole,
      hasRole,
      getUserFullName,
      error,
      clearError,
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

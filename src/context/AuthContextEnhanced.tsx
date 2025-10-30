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
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      console.log("AuthContextEnhanced - loginStudent called with:", {
        email,
        password,
      });
      setLoading(true);
      clearError();

      try {
        const credentials: LoginRequest = { email, password };
        console.log(
          "AuthContextEnhanced - loginStudent - calling AuthApi.loginStudent"
        );
        const response = await AuthApi.loginStudent(credentials);
        console.log(
          "AuthContextEnhanced - loginStudent - response received:",
          response
        );

        if (!response || !response.data) {
          throw new Error("Login failed");
        }

        if (!response.success) {
          // Check if it's an email verification error
          if (response.requires_verification) {
            setLoading(false);
            // Store user data temporarily for verification page
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem(
                  "pending_verification_user",
                  JSON.stringify(response.data.user)
                );
              } catch (error) {
                console.error(
                  "Failed to store pending verification user:",
                  error
                );
              }
            }
            // Redirect to verification page
            router.push(`/verify-email?email=${encodeURIComponent(email)}`);
            throw new Error(response.message || "Email verification required");
          }
          throw new Error(response.message || "Login failed");
        }

        // Extract token and user from response data
        const { token, user } = response.data;

        // Store tokens
        BaseApi.setTokens(token);

        // Store user data in localStorage for persistence
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("user_data", JSON.stringify(user));
          } catch (error) {
            console.error("Failed to store user data:", error);
          }
        }

        // Update user state
        updateAuthState({
          user: user,
          isAuthenticated: true,
          isLoading: false,
        });
        return user;
      } catch (error: unknown) {
        // Check if it's a 403 error with verification requirement
        if (error && typeof error === "object" && "status" in error) {
          const apiError = error as any;
          if (apiError.status === 403 && apiError.data?.requires_verification) {
            setLoading(false);
            // Store user data temporarily for verification page
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem(
                  "pending_verification_user",
                  JSON.stringify(apiError.data.data.user)
                );
              } catch (storageError) {
                console.error(
                  "Failed to store pending verification user:",
                  storageError
                );
              }
            }
            // Redirect to verification page
            router.push(`/verify-email?email=${encodeURIComponent(email)}`);
            throw new Error(
              apiError.data.message || "Email verification required"
            );
          }
        }

        const errorMessage = handleApiError(error);
        setLoading(false);
        throw new Error(errorMessage);
      }
    },
    [handleApiError, clearError, setLoading, updateAuthState, router]
  );

  const loginProfessor = useCallback(
    async (email: string, password: string): Promise<Professor> => {
      setLoading(true);
      clearError();

      try {
        const credentials: LoginRequest = { email, password };
        const response = await AuthApi.loginProfessor(credentials);

        if (!response || !response.success || !response.data) {
          throw new Error("Login failed");
        }

        // Extract token and user from response data
        const { token, user } = response.data;

        BaseApi.setTokens(token);

        // Store user data in localStorage for persistence
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("user_data", JSON.stringify(user));
          } catch (error) {
            console.error("Failed to store user data:", error);
          }
        }

        updateAuthState({
          user: user,
          isAuthenticated: true,
          isLoading: false,
        });

        return user;
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

        if (!response || !response.success || !response.data) {
          throw new Error("Login failed");
        }

        // Extract token and user from response data
        const { token, user } = response.data;

        console.log("loginAdmin: Token received:", token);
        console.log("loginAdmin: User received:", user);

        BaseApi.setTokens(token);

        // Store user data in localStorage for persistence
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("user_data", JSON.stringify(user));
          } catch (error) {
            console.error("Failed to store user data:", error);
          }
        }

        updateAuthState({
          user: user,
          isAuthenticated: true,
          isLoading: false,
        });

        return user;
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

      // Clear user data from localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("user_data");
        } catch (error) {
          console.error("Failed to clear user data:", error);
        }
      }

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
    async (
      data: RegisterStudentData,
      profilePicture?: File
    ): Promise<{ message: string }> => {
      setLoading(true);
      clearError();

      try {
        const response = await AuthApi.registerStudent(data, profilePicture);

        if (!response.success || !response.data) {
          throw new Error(response.message || "Registration failed");
        }

        setLoading(false);
        return { message: response.message || "Registration successful" };
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
        return { message: response.message || "Registration successful" };
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
    // Prevent multiple simultaneous refresh attempts
    if (isRefreshing) {
      console.log("refreshTokens: Refresh already in progress, skipping");
      return;
    }

    // Don't check BaseApi.isAuthenticated() here as it can cause race conditions
    // Instead, check if we have tokens directly
    const tokens = BaseApi.getTokens();
    if (!tokens?.refresh_token) {
      console.log(
        "refreshTokens: No refresh token available, skipping refresh"
      );
      return;
    }

    setIsRefreshing(true);
    try {
      console.log("refreshTokens: Attempting to refresh tokens");
      const response = await AuthApi.refreshAuthTokens(tokens.refresh_token);
      if (response.success && response.data) {
        console.log("refreshTokens: Token refresh successful");
        BaseApi.setTokens(response.data);

        // Update user data if available
        if (response.data.user) {
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(
                "user_data",
                JSON.stringify(response.data.user)
              );
            } catch (error) {
              console.error("Failed to store user data:", error);
            }
          }
          updateAuthState({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // Update authentication state even if no user data
          updateAuthState({
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } else {
        console.log("refreshTokens: Token refresh failed:", response.message);
        throw new Error(response.message || "Token refresh failed");
      }
    } catch (error) {
      console.error("refreshTokens: Token refresh failed:", error);
      BaseApi.clearTokens();

      // Clear user data from localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("user_data");
        } catch (error) {
          console.error("Failed to clear user data:", error);
        }
      }

      updateAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Session expired. Please log in again.",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [updateAuthState, isRefreshing]);

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
            // Try to get user data from localStorage first
            let userData: User | null = null;
            try {
              const storedUserData = localStorage.getItem("user_data");
              if (storedUserData) {
                userData = JSON.parse(storedUserData);
              }
            } catch (error) {
              console.error("Failed to parse stored user data:", error);
            }

            // If no stored user data, create minimal user object based on role
            if (!userData) {
              if (role === "student") {
                userData = {
                  email: "user@example.com",
                } as Student;
              } else if (role === "professor") {
                userData = {
                  email: "user@example.com",
                } as Professor;
              } else if (role === "admin") {
                userData = {
                  email: "user@example.com",
                } as Admin;
              }
            }

            updateAuthState({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
              isInitialized: true,
            });
          } else {
            console.log(
              "AuthContextEnhanced - no role found, setting unauthenticated"
            );
            updateAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              isInitialized: true,
            });
          }
        } else {
          console.log(
            "AuthContextEnhanced - not authenticated, setting unauthenticated"
          );
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
  }, []); // Empty dependency array - only run once on mount

  // ===========================================
  // TOKEN REFRESH INTERVAL
  // ===========================================

  useEffect(() => {
    if (!authState.isAuthenticated) return;

    // Check token expiration more frequently (every 30 seconds)
    const interval = setInterval(async () => {
      try {
        // Check if tokens exist and are expired
        const tokens = BaseApi.getTokens();
        if (tokens && BaseApi.isTokenExpired(tokens)) {
          console.log("Token refresh interval: Token expired, refreshing...");
          await refreshTokens();
        }
      } catch (error) {
        console.error("Token refresh interval error:", error);
        // Don't clear tokens here, let the refreshTokens function handle it
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [authState.isAuthenticated, refreshTokens]);

  // ===========================================
  // WINDOW FOCUS EVENT LISTENER
  // ===========================================

  useEffect(() => {
    if (!authState.isAuthenticated) return;

    const handleWindowFocus = async () => {
      try {
        // Check if tokens exist and are expired when user returns to the app
        const tokens = BaseApi.getTokens();
        if (tokens && BaseApi.isTokenExpired(tokens)) {
          console.log("Window focus: Token expired, refreshing...");
          await refreshTokens();
        }
      } catch (error) {
        console.error("Window focus token refresh error:", error);
      }
    };

    window.addEventListener("focus", handleWindowFocus);
    return () => window.removeEventListener("focus", handleWindowFocus);
  }, [authState.isAuthenticated, refreshTokens]);

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

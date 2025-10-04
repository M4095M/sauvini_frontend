"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// ===========================================
// TYPES
// ===========================================

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  profile_picture_path?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// ===========================================
// CONTEXT CREATION
// ===========================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===========================================
// PROVIDER COMPONENT
// ===========================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ===========================================
  // AUTHENTICATION METHODS
  // ===========================================

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("🔐 Attempting login for:", email);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/student/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success && data.data) {
        console.log("✅ Login successful");

        // Store user data and tokens
        const userData = data.data.user;
        const tokens = data.data.token;

        localStorage.setItem("user_data", JSON.stringify(userData));
        localStorage.setItem("auth_tokens", JSON.stringify(tokens));

        setUser(userData);
        return true;
      } else {
        console.log("❌ Login failed:", data.message);
        return false;
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      return false;
    }
  };

  const logout = () => {
    console.log("🚪 Logging out");
    localStorage.removeItem("user_data");
    localStorage.removeItem("auth_tokens");
    setUser(null);
  };

  // ===========================================
  // INITIALIZATION
  // ===========================================

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("user_data");
        const storedTokens = localStorage.getItem("auth_tokens");

        if (storedUser && storedTokens) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          console.log("👤 User restored from storage:", userData.email);
        }
      } catch (error) {
        console.error("❌ Error initializing auth:", error);
        // Clear corrupted data
        localStorage.removeItem("user_data");
        localStorage.removeItem("auth_tokens");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ===========================================
  // CONTEXT VALUE
  // ===========================================

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ===========================================
// HOOK
// ===========================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

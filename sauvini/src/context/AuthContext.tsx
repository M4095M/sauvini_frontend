'use client';

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode, 
  useCallback,
  useMemo 
} from 'react';

import { AuthApi, BaseApi, StudentApi } from '@/api';
import type { 
  User,
  Student,
  Professor,
  Admin,
  UserRole,
  LoginRequest,
  RegisterStudentData,
  RegisterProfessorData,
} from '@/types/api';

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
  
  // Registration methods
  registerStudent: (data: RegisterStudentData, profilePicture?: File) => Promise<Student>;
  registerProfessor: (data: RegisterProfessorData, cvFile: File, profilePicture?: File) => Promise<Professor>;
  
  // Utility methods
  getUserRole: () => UserRole | null;
  hasRole: (role: UserRole) => boolean;
  getUserFullName: () => string | null;
  getStudentSub: () => string | null;
  
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
    let message = 'An unexpected error occurred';
    
    if (typeof error === 'string') {
      message = error;
    } else if (typeof error === 'object' && error !== null) {
      const errorObj = error as Record<string, unknown>;
      if (typeof errorObj.message === 'string') {
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

  const loginStudent = useCallback(async (
    email: string, 
    password: string
  ): Promise<Student> => {
    setIsLoading(true);
    clearError();
    
    try {
      const credentials: LoginRequest = { email, password };
      const response = await AuthApi.loginStudent(credentials);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Login failed');
      }

      // Store tokens
      BaseApi.setTokens(response.data.token);


      console.log("from auth context: ", response.data.user)
      
      // Update user state
      setUser(response.data.user);
      
      return response.data.user;
      
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError, clearError]);

  const loginProfessor = useCallback(async (
    email: string, 
    password: string
  ): Promise<Professor> => {
    setIsLoading(true);
    clearError();
    
    try {
      const credentials: LoginRequest = { email, password };
      const response = await AuthApi.loginProfessor(credentials);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Login failed');
      }

      BaseApi.setTokens(response.data.token);
      setUser(response.data.user);
      
      return response.data.user;
      
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError, clearError]);

  const loginAdmin = useCallback(async (
    email: string, 
    password: string
  ): Promise<Admin> => {
    setIsLoading(true);
    clearError();
    
    try {
      const credentials: LoginRequest = { email, password };
      const response = await AuthApi.loginAdmin(credentials);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Login failed');
      }

      BaseApi.setTokens(response.data.token);
      setUser(response.data.user);
      
      return response.data.user;
      
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError, clearError]);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      await AuthApi.logout();
    } catch (error) {
      console.error('Logout error (continuing anyway):', error);
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  // ===========================================
  // REGISTRATION METHODS
  // ===========================================

  const registerStudent = useCallback(async (
    data: RegisterStudentData,
    profilePicture?: File
  ): Promise<Student> => {
    console.log('🎓 Starting student registration with data:', data);
    setIsLoading(true);
    clearError();
    
    try {
      console.log('📞 Calling AuthApi.registerStudent...');
      const response = await AuthApi.registerStudent(data, profilePicture);
      console.log('📋 Registration response received:', response);
      
      if (!response.success || !response.data) {
        console.error('❌ Registration failed - invalid response:', response);
        throw new Error(response.message || 'Registration failed');
      }

      console.log('✅ Student registration successful:', response.data);
      return response.data;
      
    } catch (error: unknown) {
      console.error('🔥 Student registration error:', error);
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError, clearError]);

  const registerProfessor = useCallback(async (
    data: RegisterProfessorData,
    cvFile: File,
    profilePicture?: File
  ): Promise<Professor> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await AuthApi.registerProfessor(data, cvFile, profilePicture);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Registration failed');
      }

      return response.data;
      
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError, clearError]);

  // ===========================================
  // UTILITY METHODS
  // ===========================================

  const getUserRole = useCallback((): UserRole | null => {
    return BaseApi.getCurrentUserRole();
  }, []);

  const hasRole = useCallback((role: UserRole): boolean => {
    return BaseApi.hasRole(role);
  }, []);

  const getStudentSub = useCallback((): string | null => {
    if (!user || !hasRole('student')) return null;
    return StudentApi.getStudentSub();
  }, [user, hasRole]);

  const getUserFullName = useCallback((): string | null => {
    if (!user) return null;
    
    // Type-safe access to name fields
    if ('first_name' in user && 'last_name' in user) {
      return `${user.first_name} ${user.last_name}`.trim();
    }
    
    return null;
  }, [user]);

  // ===========================================
  // INITIALIZATION EFFECT
  // ===========================================

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔐 Initializing authentication...');
      setIsLoading(true);
      
      try {
        // Get detailed authentication status
        const authStatus = BaseApi.getAuthStatus();
        console.log('📊 Auth status:', authStatus);
        
        // Case 1: No tokens at all - redirect to login
        if (!authStatus.hasTokens) {
          console.log('❌ No tokens found - user needs to login');
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        // Case 2: Tokens expired but can be refreshed
        if (authStatus.needsRefresh) {
          console.log('🔄 Access token expired - attempting refresh...');
          try {
            const refreshedTokens = await BaseApi.refreshTokens();
            BaseApi.setTokens(refreshedTokens);
            console.log('✅ Tokens refreshed successfully');
            
            // Continue to fetch user details with refreshed tokens
            await fetchUserDetails();
          } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError);
            // BaseApi.clearTokens();
            setUser(null);
            // Redirect to login will happen in ProtectedRoute components
            setIsLoading(false);
            return;
          }
        }
        
        // Case 3: Tokens are valid - fetch user details
        else if (authStatus.isAuthenticated) {
          console.log('✅ Valid tokens found - fetching user details...');
          await fetchUserDetails();
        }
        
        // Case 4: Tokens exist but are expired and cannot be refreshed
        else {
          console.log('❌ Tokens expired and cannot be refreshed - clearing tokens');
          BaseApi.clearTokens();
          setUser(null);
        }
        
      } catch (error) {
        console.error('🔥 Auth initialization failed:', error);
        // BaseApi.clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    /**
     * Fetch user details based on role
     */
    const fetchUserDetails = async () => {
      try {
        const role = BaseApi.getCurrentUserRole();
        console.log('👤 User role:', role);
        
        if (!role) {
          console.error('❌ No role found in token');
          throw new Error('Invalid token - no role found');
        }
        
        // Fetch user details based on role
        if (role === 'student') {
          const studentSub = BaseApi.getStudentSub();
          if (studentSub) {
            console.log('📚 Fetching student details...');
            const response = await StudentApi.getStudentById(studentSub);
            if (response.success && response.data) {
              setUser(response.data);
              console.log('✅ Student details loaded:', response.data);
            } else {
              throw new Error('Failed to fetch student details');
            }
          }
        } else if (role === 'professor') {
          // TODO: Implement professor details fetching
          console.log('👨‍🏫 Professor role detected - implement details fetching');
          // For now, create a minimal user object
          setUser({ email: 'professor@example.com' } as User);
        } else if (role === 'admin') {
          // TODO: Implement admin details fetching
          console.log('👨‍💼 Admin role detected - implement details fetching');
          // For now, create a minimal user object
          setUser({ email: 'admin@example.com' } as User);
        }
        
      } catch (error) {
        console.error('❌ Failed to fetch user details:', error);
        throw error;
      }
    };

    initializeAuth();
  }, []);

  // ===========================================
  // CONTEXT VALUE
  // ===========================================

  const contextValue = useMemo<AuthContextType>(() => ({
    // User state
    user,
    isLoading,
    isAuthenticated,
    
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
    getStudentSub,
    
    // Error handling
    error,
    clearError,
  }), [
    user,
    isLoading,
    isAuthenticated,
    loginStudent,
    loginProfessor,
    loginAdmin,
    logout,
    registerStudent,
    registerProfessor,
    getUserRole,
    hasRole,
    getStudentSub,
    getUserFullName,
    error,
    clearError,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// ===========================================
// CUSTOM HOOK
// ===========================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Make sure to wrap your component tree with <AuthProvider>.'
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
  
  return useMemo(() => ({
    role,
    isStudent: role === 'student',
    isProfessor: role === 'professor',
    isAdmin: role === 'admin',
    hasRole,
  }), [role, hasRole]);
}
import { useState, useCallback } from 'react';
import { AuthApi } from '@/api/auth';
import type { 
  LoginRequest, 
  LoginResponse,
  RegisterStudentData,
  RegisterProfessorData,
  ForgotPasswordRequest,
  ResetPasswordConfirmRequest,
  ApproveRejectProfessorRequest,
  PaginationRequest,
  Student, 
  Professor, 
  Admin,
  ApiResponse 
} from '@/types/api';

/**
 * Custom hook for authentication operations
 * Provides state management and error handling for all auth-related API calls
 */
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // ===========================================
  // LOGIN OPERATIONS
  // ===========================================

  const loginStudent = useCallback(async (credentials: LoginRequest): Promise<LoginResponse<Student> | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthApi.loginStudent(credentials);
      if (response.success && response.data) {
        // Store tokens automatically via BaseApi
        AuthApi.setTokens(response.data.token);
        return response.data;
      } else {
        setError(response.message || 'Login failed');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginProfessor = useCallback(async (credentials: LoginRequest): Promise<LoginResponse<Professor> | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthApi.loginProfessor(credentials);
      if (response.success && response.data) {
        AuthApi.setTokens(response.data.token);
        return response.data;
      } else {
        setError(response.message || 'Login failed');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginAdmin = useCallback(async (credentials: LoginRequest): Promise<LoginResponse<Admin> | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthApi.loginAdmin(credentials);
      if (response.success && response.data) {
        AuthApi.setTokens(response.data.token);
        return response.data;
      } else {
        setError(response.message || 'Login failed');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===========================================
  // REGISTRATION OPERATIONS
  // ===========================================

  const registerStudent = useCallback(async (
    data: RegisterStudentData, 
    profilePicture?: File
  ): Promise<Student | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthApi.registerStudent(data, profilePicture);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Registration failed');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerProfessor = useCallback(async (
    data: RegisterProfessorData,
    cvFile: File,
    profilePicture?: File
  ): Promise<Professor | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthApi.registerProfessor(data, cvFile, profilePicture);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Registration failed');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===========================================
  // PASSWORD RECOVERY OPERATIONS
  // ===========================================

  const forgotPasswordAdmin = useCallback(async (data: ForgotPasswordRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthApi.forgotPasswordAdmin(data);
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Failed to send reset email');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPasswordAdmin = useCallback(async (data: ResetPasswordConfirmRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthApi.resetPasswordAdmin(data);
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Failed to reset password');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===========================================
  // EMAIL VERIFICATION OPERATIONS
  // ===========================================

  const verifyStudentEmail = useCallback(async (token: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthApi.verifyStudentEmail(token);
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Email verification failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const resendEmailVerification = useCallback(async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthApi.resendEmailVerification(email);
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Failed to resend verification email');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===========================================
  // ADMIN OPERATIONS (moved to separate hook)
  // ===========================================

  const getAllProfessors = useCallback(async (pagination?: PaginationRequest): Promise<Professor[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthApi.getAllProfessors(pagination);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch professors');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveProfessor = useCallback(async (data: ApproveRejectProfessorRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthApi.approveProfessor(data);
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Failed to approve professor');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectProfessor = useCallback(async (data: ApproveRejectProfessorRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthApi.rejectProfessor(data);
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Failed to reject professor');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===========================================
  // LOGOUT OPERATION
  // ===========================================

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await AuthApi.logout();
    } catch (err) {
      // Even if logout fails on server, clear local tokens
      console.warn('Logout request failed, but clearing local tokens:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ===========================================
  // UTILITY FUNCTIONS
  // ===========================================

  const isAuthenticated = useCallback((): boolean => {
    return AuthApi.isAuthenticated();
  }, []);

  const getCurrentUserRole = useCallback(() => {
    return AuthApi.getCurrentUserRole();
  }, []);

  const hasRole = useCallback((role: 'admin' | 'professor' | 'student') => {
    return AuthApi.hasRole(role);
  }, []);

  return {
    // State
    loading,
    error,
    
    // Actions
    clearError,
    loginStudent,
    loginProfessor,
    loginAdmin,
    registerStudent,
    registerProfessor,
    forgotPasswordAdmin,
    resetPasswordAdmin,
    verifyStudentEmail,
    resendEmailVerification,
    getAllProfessors,
    approveProfessor,
    rejectProfessor,
    logout,
    
    // Utils
    isAuthenticated,
    getCurrentUserRole,
    hasRole,
  };
}

/**
 * Hook for checking authentication status without triggering re-renders
 * Useful for conditional rendering based on auth state
 */
export function useAuthStatus() {
  const isAuthenticated = AuthApi.isAuthenticated();
  const userRole = AuthApi.getCurrentUserRole();
  
  return {
    isAuthenticated,
    userRole,
    isAdmin: userRole === 'admin',
    isProfessor: userRole === 'professor',
    isStudent: userRole === 'student',
    hasRole: (role: 'admin' | 'professor' | 'student') => AuthApi.hasRole(role),
  };
}
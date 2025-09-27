import { BaseApi } from './base';
import type { 
  ApiResponse, 
  LoginRequest,
  LoginResponse,
  RegisterStudentData,
  RegisterProfessorData,
  ForgotPasswordRequest,
  ResetPasswordConfirmRequest,
  EmailVerificationRequest,
  ApproveRejectProfessorRequest,
  TokenPair,
  Student,
  Professor,
  Admin
} from '@/types/api';

/**
 * Authentication API class that handles all auth-related requests
 * Extends BaseApi to inherit common HTTP methods and token management
 */
export class AuthApi extends BaseApi {
  
  // ===========================================
  // LOGIN METHODS
  // ===========================================

  /**
   * Login as student
   * @param credentials - Email and password
   * @returns Promise with user data and tokens
   */
  static async loginStudent(credentials: LoginRequest): Promise<ApiResponse<LoginResponse<Student>>> {
    return this.post<LoginResponse<Student>>(
      '/auth/student/login',
      credentials,
      { skipAuth: true }
    );
  }

  /**
   * Login as professor  
   * @param credentials - Email and password
   * @returns Promise with user data and tokens
   */
  static async loginProfessor(credentials: LoginRequest): Promise<ApiResponse<LoginResponse<Professor>>> {
    return this.post<LoginResponse<Professor>>(
      '/auth/professor/login', 
      credentials,
      { skipAuth: true }
    );
  }

  /**
   * Login as admin
   * @param credentials - Email and password  
   * @returns Promise with user data and tokens
   */
  static async loginAdmin(credentials: LoginRequest): Promise<ApiResponse<LoginResponse<Admin>>> {
    return this.post<LoginResponse<Admin>>(
      '/auth/admin/login',
      credentials, 
      { skipAuth: true }
    );
  }

  // ===========================================
  // REGISTRATION METHODS
  // ===========================================

  /**
   * Register a new student account
   * @param data - Student registration data
   * @returns Promise with registration result
   */
  static async registerStudent(data: RegisterStudentData): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>(
      '/auth/student/register',
      data,
      { skipAuth: true }
    );
  }

  /**
   * Register a new professor account with CV and profile picture upload
   * @param data - Professor registration data
   * @param cvFile - CV file to upload
   * @param profilePicture - Optional profile picture file
   * @returns Promise with registration result
   */
  static async registerProfessor(
    data: RegisterProfessorData,
    cvFile: File,
    profilePicture?: File
  ): Promise<ApiResponse<{ message: string }>> {
    const formData = new FormData();
    
    // Add all professor data as form fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    // Add required CV file
    formData.append('cv', cvFile);
    
    // Add optional profile picture
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }

    return this.post<{ message: string }>(
      '/auth/professor/register',
      formData,
      { skipAuth: true }
    );
  }

  // ===========================================
  // TOKEN MANAGEMENT
  // ===========================================

  /**
   * Refresh authentication tokens (public API method)
   * @param refreshToken - The refresh token
   * @returns Promise with new token pair
   */
  static async refreshAuthTokens(refreshToken: string): Promise<ApiResponse<TokenPair>> {
    return this.post<TokenPair>(
      '/auth/refresh',
      { token: refreshToken },
      { skipAuth: true, skipAuthRefresh: true }
    );
  }

  /**
   * Logout and invalidate tokens
   * @returns Promise with logout result
   */
  static async logout(): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await this.post<{ message: string }>('/auth/logout');
      return response;
    } finally {
      // Always clear local tokens regardless of API response
      this.clearTokens();
    }
  }

  // ===========================================
  // PASSWORD RECOVERY
  // ===========================================

  /**
   * Request password reset email
   * @param data - Email address for password reset
   * @returns Promise with reset request result
   */
  static async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>(
      '/auth/forgot-password',
      data,
      { skipAuth: true }
    );
  }

  /**
   * Confirm password reset with token and new password
   * @param data - Reset token and new password
   * @returns Promise with reset confirmation result
   */
  static async resetPasswordConfirm(data: ResetPasswordConfirmRequest): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>(
      '/auth/reset-password-confirm',
      data,
      { skipAuth: true }
    );
  }

  // ===========================================
  // EMAIL VERIFICATION
  // ===========================================

  /**
   * Verify email address with token
   * @param data - Verification token
   * @returns Promise with verification result
   */
  static async verifyEmail(data: EmailVerificationRequest): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>(
      '/auth/verify-email',
      data,
      { skipAuth: true }
    );
  }

  /**
   * Resend email verification
   * @param email - Email address to resend verification to
   * @returns Promise with resend result
   */
  static async resendEmailVerification(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>(
      '/auth/resend-verification',
      { email },
      { skipAuth: true }
    );
  }

  // ===========================================
  // ADMIN METHODS
  // ===========================================

  /**
   * Get pending professors awaiting approval (admin only)
   * @returns Promise with list of pending professors
   */
  static async getPendingProfessors(): Promise<ApiResponse<Professor[]>> {
    return this.get<Professor[]>('/auth/admin/professors/pending');
  }

  /**
   * Approve a professor account (admin only)
   * @param data - Professor ID to approve
   * @returns Promise with approval result
   */
  static async approveProfessor(data: ApproveRejectProfessorRequest): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>('/auth/admin/professors/approve', data);
  }

  /**
   * Reject a professor account (admin only)
   * @param data - Professor ID to reject
   * @returns Promise with rejection result
   */
  static async rejectProfessor(data: ApproveRejectProfessorRequest): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>('/auth/admin/professors/reject', data);
  }
}
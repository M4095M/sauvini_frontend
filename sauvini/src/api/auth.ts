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
  PaginationRequest,
  TokenPair,
  Student,
  Professor,
  Admin
} from '@/types/api';

/**
 * Authentication API class that handles all auth-related requests
 * Extends BaseApi to inherit common HTTP methods and token management
 * 
 * This class provides complete authentication functionality for all user types:
 * - Student authentication and registration
 * - Professor authentication and registration  
 * - Admin authentication and management
 * - Password recovery flows
 * - Email verification
 */
export class AuthApi extends BaseApi {
  // ===========================================
  // LOGIN METHODS
  // ===========================================

  /**
   * Student login
   * @param credentials - Email and password
   * @returns Promise with login response including tokens and user data
   */
  static async loginStudent(credentials: LoginRequest): Promise<ApiResponse<LoginResponse<Student>>> {
    return this.post<LoginResponse<Student>>(
      '/auth/student/login',
      credentials,
      { requiresAuth: false }
    );
  }

  /**
   * Request password reset for student
   * @param email - Student email address
   * @returns Promise with reset request result
   */
  static async forgotPasswordStudent(email: string): Promise<ApiResponse<null>> {
    return this.post<null>(
      '/auth/student/forgot-password',
      { email },
      { requiresAuth: false }
    );
  }

  /**
   * Reset student password with token
   * @param token - Reset token from email
   * @param newPassword - New password
   * @returns Promise with reset result
   */
  static async resetPasswordStudent(token: string, newPassword: string): Promise<ApiResponse<null>> {
    return this.post<null>(
      '/auth/student/reset-password',
      { token, new_password: newPassword },
      { requiresAuth: false }
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
      { requiresAuth: false }
    );
  }

  /**
   * Request password reset for professor
   * @param email - Professor email address
   * @returns Promise with reset request result
   */
  static async forgotPasswordProfessor(email: string): Promise<ApiResponse<null>> {
    return this.post<null>(
      '/auth/professor/forgot-password',
      { email },
      { requiresAuth: false }
    );
  }

  /**
   * Reset professor password with token
   * @param token - Reset token from email
   * @param newPassword - New password
   * @returns Promise with reset result
   */
  static async resetPasswordProfessor(token: string, newPassword: string): Promise<ApiResponse<null>> {
    return this.post<null>(
      '/auth/professor/reset-password',
      { token, new_password: newPassword },
      { requiresAuth: false }
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
      { requiresAuth: false }
    );
  }

  // ===========================================
  // REGISTRATION METHODS
  // ===========================================

  /**
   * Register a new student account with optional profile picture upload
   * @param data - Student registration data
   * @param profilePicture - Optional profile picture file
   * @returns Promise with registration result including student data
   */
  static async registerStudent(
    data: RegisterStudentData,
    profilePicture?: File
  ): Promise<ApiResponse<Student>> {
    const formData = new FormData();
    
    // Add student data as JSON string (as required by backend)
    formData.append('student', JSON.stringify(data));
    
    // Add optional profile picture
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }

    return this.post<Student>(
      '/auth/student/register',
      formData,
      { requiresAuth: false }
    );
  }

  /**
   * Register a new professor account with CV and profile picture upload
   * @param data - Professor registration data
   * @param cvFile - CV file to upload
   * @param profilePicture - Optional profile picture file
   * @returns Promise with registration result including professor data
   */
  static async registerProfessor(
    data: RegisterProfessorData,
    cvFile: File,
    profilePicture?: File
  ): Promise<ApiResponse<Professor>> {
    const formData = new FormData();
    
    // Add professor data as JSON string (as required by backend)
    formData.append('professor_data', JSON.stringify(data));
    
    // Add required CV file
    formData.append('cv_file', cvFile);
    
    // Add optional profile picture
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }

    return this.post<Professor>(
      '/auth/professor/register',
      formData,
      { requiresAuth: false }
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
      { requiresAuth: false, skipAuthRefresh: true }
    );
  }

  /**
   * Logout and invalidate tokens
   * @returns Promise with logout result
   */
  static async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await this.post<null>('/auth/logout', {}, { requiresAuth: true });
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
   * Request password reset email for admin
   * @param data - Email address for password reset
   * @returns Promise with reset request result
   */
  static async forgotPasswordAdmin(data: ForgotPasswordRequest): Promise<ApiResponse<null>> {
    return this.post<null>(
      '/auth/admin/forgot-password',
      data,
      { requiresAuth: false }
    );
  }

  /**
   * Confirm password reset with token and new password for admin
   * @param data - Reset token and new password
   * @returns Promise with reset confirmation result
   */
  static async resetPasswordAdmin(data: ResetPasswordConfirmRequest): Promise<ApiResponse<null>> {
    return this.post<null>(
      '/auth/admin/reset-password',
      data,
      { requiresAuth: false }
    );
  }

  /**
   * Generic password reset request (for future implementation)
   * @param data - Email address for password reset
   * @returns Promise with reset request result
   */
  static async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<null>> {
    return this.post<null>(
      '/auth/forgot-password',
      data,
      { requiresAuth: false }
    );
  }

  /**
   * Generic password reset confirmation (for future implementation)
   * @param data - Reset token and new password
   * @returns Promise with reset confirmation result
   */
  static async resetPasswordConfirm(data: ResetPasswordConfirmRequest): Promise<ApiResponse<null>> {
    return this.post<null>(
      '/auth/reset-password-confirm',
      data,
      { requiresAuth: false }
    );
  }

  // ===========================================
  // EMAIL VERIFICATION
  // ===========================================

  /**
   * Verify student email address with token from URL query parameter
   * @param token - Verification token from email link
   * @returns Promise with verification result
   */
  static async verifyStudentEmail(token: string): Promise<ApiResponse<null>> {
    return this.get<null>(
      `/auth/student/verify-email?token=${encodeURIComponent(token)}`,
      { requiresAuth: false }
    );
  }

  /**
   * Generic email verification (for future implementation)
   * @param data - Verification token
   * @returns Promise with verification result
   */
  static async verifyEmail(data: EmailVerificationRequest): Promise<ApiResponse<null>> {
    return this.post<null>(
      '/auth/verify-email',
      data,
      { requiresAuth: false }
    );
  }

  /**
   * Send verification email to student (can be used for initial send or resend)
   * @param email - Email address to send verification to
   * @returns Promise with send result
   */
  static async sendStudentVerificationEmail(email: string): Promise<ApiResponse<null>> {
    return this.post<null>(
      '/auth/student/send-verification-email',
      { email },
      { requiresAuth: false }
    );
  }

  /**
   * @deprecated Use sendStudentVerificationEmail instead
   * Resend email verification
   * @param email - Email address to resend verification to
   * @returns Promise with resend result
   */
  static async resendEmailVerification(email: string): Promise<ApiResponse<null>> {
    console.warn('resendEmailVerification is deprecated. Use sendStudentVerificationEmail instead.');
    return this.sendStudentVerificationEmail(email);
  }

  // ===========================================
  // ADMIN METHODS
  // ===========================================

  /**
   * Get all professors with pagination (admin only)
   * @param pagination - Optional pagination parameters
   * @returns Promise with paginated list of professors
   */
  static async getAllProfessors(pagination?: PaginationRequest): Promise<ApiResponse<Professor[]>> {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    
    const queryString = params.toString();
    const url = queryString ? `/auth/admin/all-professors?${queryString}` : '/auth/admin/all-professors';
    
    return this.get<Professor[]>(url, { requiresAuth: true });
  }

  /**
   * Approve a professor account (admin only)
   * @param data - Professor ID to approve
   * @returns Promise with approval result
   */
  static async approveProfessor(data: ApproveRejectProfessorRequest): Promise<ApiResponse<null>> {
    return this.post<null>('/auth/admin/approve-professor', data, { requiresAuth: true });
  }

  /**
   * Reject a professor account (admin only)
   * @param data - Professor ID to reject
   * @returns Promise with rejection result
   */
  static async rejectProfessor(data: ApproveRejectProfessorRequest): Promise<ApiResponse<null>> {
    return this.post<null>('/auth/admin/reject-professor', data, { requiresAuth: true });
  }

  // ===========================================
  // LEGACY/DEPRECATED METHODS
  // ===========================================

  /**
   * @deprecated Use getAllProfessors with filtering instead
   * Get pending professors awaiting approval (admin only)
   * @returns Promise with list of pending professors
   */
  static async getPendingProfessors(): Promise<ApiResponse<Professor[]>> {
    console.warn('getPendingProfessors is deprecated. Use getAllProfessors with status filtering instead.');
    return this.get<Professor[]>('/auth/admin/professors/pending', { requiresAuth: true });
  }
}
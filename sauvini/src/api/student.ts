import { BaseApi } from './base';
import type { 
  ApiResponse, 
  PaginationRequest,
  Student
} from '@/types/api';

/**
 * Student API class that handles all student-specific functionality
 * Extends BaseApi to inherit common HTTP methods and token management
 * 
 * This class provides student functionality including:
 * - Profile management
 * - Course enrollment and progress tracking
 * - Lesson completion and quiz taking
 * - Achievement and certificate management
 * - Learning analytics and recommendations
 * 
 * All methods in this class require student authentication
 */
export class StudentApi extends BaseApi {
  
  // ===========================================
  // PROFILE MANAGEMENT
  // ===========================================

  /**
   * Get current student's profile information
   * @returns Promise with student profile data
   */
  static async getProfile(): Promise<ApiResponse<Student>> {
    return this.get<Student>('/student/profile', { requiresAuth: true });
  }

  /**
   * Update student profile information
   * @param profileData - Updated profile data
   * @returns Promise with updated student data
   */
  static async updateProfile(profileData: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    wilaya?: string;
    academic_stream?: string;
  }): Promise<ApiResponse<Student>> {
    return this.put<Student>('/student/profile', profileData, { requiresAuth: true });
  }

  /**
   * Update student profile picture
   * @param profilePicture - New profile picture file
   * @returns Promise with updated profile picture path
   */
  static async updateProfilePicture(profilePicture: File): Promise<ApiResponse<{
    profile_picture_path: string;
  }>> {
    const formData = new FormData();
    formData.append('profile_picture', profilePicture);

    return this.post<{
      profile_picture_path: string;
    }>('/student/profile/picture', formData, { requiresAuth: true });
  }

  /**
   * Change student password
   * @param passwordData - Current and new password
   * @returns Promise with success confirmation
   */
  static async changePassword(passwordData: {
    current_password: string;
    new_password: string;
  }): Promise<ApiResponse<null>> {
    return this.post<null>('/student/profile/change-password', passwordData, { requiresAuth: true });
  }

  // ===========================================
  // COURSE ENROLLMENT AND MANAGEMENT
  // ===========================================

  /**
   * Get available courses for enrollment
   * @param pagination - Optional pagination parameters
   * @param filters - Optional filters for courses
   * @returns Promise with list of available courses
   */
  static async getAvailableCourses(
    pagination?: PaginationRequest,
    filters?: {
      category?: string;
      difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
      professor_id?: string;
      search?: string;
    }
  ): Promise<ApiResponse<Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty_level: string;
    estimated_duration_hours: number;
    professor: {
      id: string;
      first_name: string;
      last_name: string;
    };
    enrolled_students: number;
    rating: number;
    total_lessons: number;
    is_enrolled: boolean;
    created_at: string;
  }>>> {
    const params = new URLSearchParams();
    
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    if (filters?.category) params.append('category', filters.category);
    if (filters?.difficulty_level) params.append('difficulty_level', filters.difficulty_level);
    if (filters?.professor_id) params.append('professor_id', filters.professor_id);
    if (filters?.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    const url = queryString ? `/student/courses/available?${queryString}` : '/student/courses/available';
    
    return this.get<Array<{
      id: string;
      title: string;
      description: string;
      category: string;
      difficulty_level: string;
      estimated_duration_hours: number;
      professor: {
        id: string;
        first_name: string;
        last_name: string;
      };
      enrolled_students: number;
      rating: number;
      total_lessons: number;
      is_enrolled: boolean;
      created_at: string;
    }>>(url, { requiresAuth: true });
  }

  /**
   * Get student's enrolled courses
   * @param pagination - Optional pagination parameters
   * @param filters - Optional filters for enrolled courses
   * @returns Promise with list of enrolled courses
   */
  static async getEnrolledCourses(
    pagination?: PaginationRequest,
    filters?: {
      status?: 'not_started' | 'in_progress' | 'completed';
      category?: string;
    }
  ): Promise<ApiResponse<Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    professor: {
      id: string;
      first_name: string;
      last_name: string;
    };
    enrollment_date: string;
    progress: number;
    completed_lessons: number;
    total_lessons: number;
    last_activity: string;
    status: 'not_started' | 'in_progress' | 'completed';
    next_lesson?: {
      id: string;
      title: string;
    };
  }>>> {
    const params = new URLSearchParams();
    
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    
    const queryString = params.toString();
    const url = queryString ? `/student/courses/enrolled?${queryString}` : '/student/courses/enrolled';
    
    return this.get<Array<{
      id: string;
      title: string;
      description: string;
      category: string;
      professor: {
        id: string;
        first_name: string;
        last_name: string;
      };
      enrollment_date: string;
      progress: number;
      completed_lessons: number;
      total_lessons: number;
      last_activity: string;
      status: 'not_started' | 'in_progress' | 'completed';
      next_lesson?: {
        id: string;
        title: string;
      };
    }>>(url, { requiresAuth: true });
  }

  /**
   * Enroll in a course
   * @param courseId - The ID of the course to enroll in
   * @returns Promise with enrollment result
   */
  static async enrollInCourse(courseId: string): Promise<ApiResponse<{
    enrollment_date: string;
    course_id: string;
    student_id: string;
  }>> {
    return this.post<{
      enrollment_date: string;
      course_id: string;
      student_id: string;
    }>(`/student/courses/${courseId}/enroll`, {}, { requiresAuth: true });
  }

  /**
   * Unenroll from a course
   * @param courseId - The ID of the course to unenroll from
   * @returns Promise with unenrollment result
   */
  static async unenrollFromCourse(courseId: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`/student/courses/${courseId}/enroll`, { requiresAuth: true });
  }

  // ===========================================
  // LESSON PROGRESS AND LEARNING
  // ===========================================

  /**
   * Get lessons for a specific course
   * @param courseId - The ID of the course
   * @param pagination - Optional pagination parameters
   * @returns Promise with list of lessons and progress
   */
  static async getCourseLessons(courseId: string, pagination?: PaginationRequest): Promise<ApiResponse<Array<{
    id: string;
    title: string;
    description: string;
    order: number;
    duration_minutes: number;
    content_type: 'video' | 'text' | 'interactive';
    is_completed: boolean;
    progress: number;
    can_access: boolean;
    video_url?: string;
    last_accessed?: string;
  }>>> {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    
    const queryString = params.toString();
    const url = queryString ? `/student/courses/${courseId}/lessons?${queryString}` : `/student/courses/${courseId}/lessons`;
    
    return this.get<Array<{
      id: string;
      title: string;
      description: string;
      order: number;
      duration_minutes: number;
      content_type: 'video' | 'text' | 'interactive';
      is_completed: boolean;
      progress: number;
      can_access: boolean;
      video_url?: string;
      last_accessed?: string;
    }>>(url, { requiresAuth: true });
  }

  /**
   * Get detailed lesson content
   * @param lessonId - The ID of the lesson
   * @returns Promise with lesson content and progress
   */
  static async getLesson(lessonId: string): Promise<ApiResponse<{
    id: string;
    title: string;
    description: string;
    content: string;
    order: number;
    duration_minutes: number;
    content_type: 'video' | 'text' | 'interactive';
    video_url?: string;
    resources: Array<{
      title: string;
      url: string;
      type: 'pdf' | 'link' | 'download';
    }>;
    progress: {
      is_completed: boolean;
      progress_percentage: number;
      time_spent_minutes: number;
      last_accessed?: string;
    };
    quiz?: {
      id: string;
      title: string;
      is_completed: boolean;
      best_score?: number;
      attempts_remaining?: number;
    };
  }>> {
    return this.get<{
      id: string;
      title: string;
      description: string;
      content: string;
      order: number;
      duration_minutes: number;
      content_type: 'video' | 'text' | 'interactive';
      video_url?: string;
      resources: Array<{
        title: string;
        url: string;
        type: 'pdf' | 'link' | 'download';
      }>;
      progress: {
        is_completed: boolean;
        progress_percentage: number;
        time_spent_minutes: number;
        last_accessed?: string;
      };
      quiz?: {
        id: string;
        title: string;
        is_completed: boolean;
        best_score?: number;
        attempts_remaining?: number;
      };
    }>(`/student/lessons/${lessonId}`, { requiresAuth: true });
  }

  /**
   * Mark a lesson as completed
   * @param lessonId - The ID of the lesson to mark complete
   * @returns Promise with updated progress
   */
  static async markLessonComplete(lessonId: string): Promise<ApiResponse<{
    lesson_id: string;
    completed_at: string;
    progress_percentage: number;
    time_spent_minutes: number;
  }>> {
    return this.post<{
      lesson_id: string;
      completed_at: string;
      progress_percentage: number;
      time_spent_minutes: number;
    }>(`/student/lessons/${lessonId}/complete`, {}, { requiresAuth: true });
  }

  /**
   * Update lesson progress (for tracking time spent, etc.)
   * @param lessonId - The ID of the lesson
   * @param progressData - Progress data to update
   * @returns Promise with updated progress
   */
  static async updateLessonProgress(lessonId: string, progressData: {
    progress_percentage?: number;
    time_spent_minutes?: number;
  }): Promise<ApiResponse<{
    lesson_id: string;
    progress_percentage: number;
    time_spent_minutes: number;
    last_accessed: string;
  }>> {
    return this.put<{
      lesson_id: string;
      progress_percentage: number;
      time_spent_minutes: number;
      last_accessed: string;
    }>(`/student/lessons/${lessonId}/progress`, progressData, { requiresAuth: true });
  }

  // ===========================================
  // QUIZ AND ASSESSMENT
  // ===========================================

  /**
   * Get quiz details for a lesson
   * @param lessonId - The ID of the lesson
   * @returns Promise with quiz data
   */
  static async getLessonQuiz(lessonId: string): Promise<ApiResponse<{
    id: string;
    title: string;
    description: string;
    time_limit_minutes?: number;
    passing_score: number;
    max_attempts?: number;
    attempts_used: number;
    best_score?: number;
    questions: Array<{
      id: string;
      question: string;
      type: 'multiple_choice' | 'true_false' | 'short_answer';
      options?: string[];
      points: number;
    }>;
  }>> {
    return this.get<{
      id: string;
      title: string;
      description: string;
      time_limit_minutes?: number;
      passing_score: number;
      max_attempts?: number;
      attempts_used: number;
      best_score?: number;
      questions: Array<{
        id: string;
        question: string;
        type: 'multiple_choice' | 'true_false' | 'short_answer';
        options?: string[];
        points: number;
      }>;
    }>(`/student/lessons/${lessonId}/quiz`, { requiresAuth: true });
  }

  /**
   * Submit quiz answers
   * @param quizId - The ID of the quiz
   * @param answers - Student's answers to quiz questions
   * @returns Promise with quiz results
   */
  static async submitQuizAnswers(quizId: string, answers: Record<string, string | number>): Promise<ApiResponse<{
    quiz_id: string;
    score: number;
    max_score: number;
    percentage: number;
    passed: boolean;
    completed_at: string;
    time_taken_minutes: number;
    attempt_number: number;
    correct_answers: Record<string, string | number>;
    explanations: Record<string, string>;
    can_retake: boolean;
  }>> {
    return this.post<{
      quiz_id: string;
      score: number;
      max_score: number;
      percentage: number;
      passed: boolean;
      completed_at: string;
      time_taken_minutes: number;
      attempt_number: number;
      correct_answers: Record<string, string | number>;
      explanations: Record<string, string>;
      can_retake: boolean;
    }>(`/student/quizzes/${quizId}/submit`, { answers }, { requiresAuth: true });
  }

  /**
   * Get quiz attempt history
   * @param quizId - The ID of the quiz
   * @returns Promise with quiz attempt history
   */
  static async getQuizHistory(quizId: string): Promise<ApiResponse<Array<{
    attempt_number: number;
    score: number;
    max_score: number;
    percentage: number;
    passed: boolean;
    completed_at: string;
    time_taken_minutes: number;
  }>>> {
    return this.get<Array<{
      attempt_number: number;
      score: number;
      max_score: number;
      percentage: number;
      passed: boolean;
      completed_at: string;
      time_taken_minutes: number;
    }>>(`/student/quizzes/${quizId}/history`, { requiresAuth: true });
  }

  // ===========================================
  // PROGRESS AND ANALYTICS
  // ===========================================

  /**
   * Get overall learning progress
   * @returns Promise with comprehensive progress data
   */
  static async getOverallProgress(): Promise<ApiResponse<{
    summary: {
      total_courses_enrolled: number;
      courses_completed: number;
      courses_in_progress: number;
      total_lessons_completed: number;
      total_time_spent_minutes: number;
      average_quiz_score: number;
    };
    recent_activity: Array<{
      date: string;
      activity_type: 'lesson_completed' | 'quiz_taken' | 'course_enrolled' | 'course_completed';
      lesson_title?: string;
      course_title?: string;
      score?: number;
    }>;
    current_streak: {
      days: number;
      started_at: string;
    };
    achievements: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      earned_at: string;
    }>;
  }>> {
    return this.get<{
      summary: {
        total_courses_enrolled: number;
        courses_completed: number;
        courses_in_progress: number;
        total_lessons_completed: number;
        total_time_spent_minutes: number;
        average_quiz_score: number;
      };
      recent_activity: Array<{
        date: string;
        activity_type: 'lesson_completed' | 'quiz_taken' | 'course_enrolled' | 'course_completed';
        lesson_title?: string;
        course_title?: string;
        score?: number;
      }>;
      current_streak: {
        days: number;
        started_at: string;
      };
      achievements: Array<{
        id: string;
        title: string;
        description: string;
        icon: string;
        earned_at: string;
      }>;
    }>('/student/progress/overall', { requiresAuth: true });
  }

  /**
   * Get detailed progress for a specific course
   * @param courseId - The ID of the course
   * @returns Promise with course progress details
   */
  static async getCourseProgress(courseId: string): Promise<ApiResponse<{
    course: {
      id: string;
      title: string;
      total_lessons: number;
    };
    progress: {
      completed_lessons: number;
      progress_percentage: number;
      time_spent_minutes: number;
      enrollment_date: string;
      last_activity: string;
      completion_date?: string;
    };
    lessons_progress: Array<{
      lesson_id: string;
      lesson_title: string;
      lesson_order: number;
      is_completed: boolean;
      progress_percentage: number;
      time_spent_minutes: number;
      quiz_score?: number;
      last_accessed?: string;
    }>;
  }>> {
    return this.get<{
      course: {
        id: string;
        title: string;
        total_lessons: number;
      };
      progress: {
        completed_lessons: number;
        progress_percentage: number;
        time_spent_minutes: number;
        enrollment_date: string;
        last_activity: string;
        completion_date?: string;
      };
      lessons_progress: Array<{
        lesson_id: string;
        lesson_title: string;
        lesson_order: number;
        is_completed: boolean;
        progress_percentage: number;
        time_spent_minutes: number;
        quiz_score?: number;
        last_accessed?: string;
      }>;
    }>(`/student/progress/courses/${courseId}`, { requiresAuth: true });
  }

  // ===========================================
  // RECOMMENDATIONS AND DISCOVERY
  // ===========================================

  /**
   * Get recommended courses based on learning history
   * @param limit - Maximum number of recommendations
   * @returns Promise with recommended courses
   */
  static async getRecommendedCourses(limit: number = 10): Promise<ApiResponse<Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty_level: string;
    professor: {
      id: string;
      first_name: string;
      last_name: string;
    };
    rating: number;
    estimated_duration_hours: number;
    recommendation_reason: string;
    similarity_score: number;
  }>>> {
    return this.get<Array<{
      id: string;
      title: string;
      description: string;
      category: string;
      difficulty_level: string;
      professor: {
        id: string;
        first_name: string;
        last_name: string;
      };
      rating: number;
      estimated_duration_hours: number;
      recommendation_reason: string;
      similarity_score: number;
    }>>(`/student/recommendations/courses?limit=${limit}`, { requiresAuth: true });
  }

  /**
   * Get recommended next lessons to continue learning
   * @param limit - Maximum number of recommendations
   * @returns Promise with recommended lessons
   */
  static async getRecommendedLessons(limit: number = 5): Promise<ApiResponse<Array<{
    id: string;
    title: string;
    course_title: string;
    course_id: string;
    order: number;
    duration_minutes: number;
    progress_percentage: number;
    recommendation_reason: string;
  }>>> {
    return this.get<Array<{
      id: string;
      title: string;
      course_title: string;
      course_id: string;
      order: number;
      duration_minutes: number;
      progress_percentage: number;
      recommendation_reason: string;
    }>>(`/student/recommendations/lessons?limit=${limit}`, { requiresAuth: true });
  }

  // ===========================================
  // CERTIFICATES AND ACHIEVEMENTS
  // ===========================================

  /**
   * Get student's certificates
   * @param pagination - Optional pagination parameters
   * @returns Promise with list of earned certificates
   */
  static async getCertificates(pagination?: PaginationRequest): Promise<ApiResponse<Array<{
    id: string;
    course_id: string;
    course_title: string;
    certificate_url: string;
    earned_at: string;
    completion_percentage: number;
    final_score: number;
    professor: {
      first_name: string;
      last_name: string;
    };
  }>>> {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    
    const queryString = params.toString();
    const url = queryString ? `/student/certificates?${queryString}` : '/student/certificates';
    
    return this.get<Array<{
      id: string;
      course_id: string;
      course_title: string;
      certificate_url: string;
      earned_at: string;
      completion_percentage: number;
      final_score: number;
      professor: {
        first_name: string;
        last_name: string;
      };
    }>>(url, { requiresAuth: true });
  }

  /**
   * Get student's achievements and badges
   * @returns Promise with list of earned achievements
   */
  static async getAchievements(): Promise<ApiResponse<Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'completion' | 'performance' | 'engagement' | 'streak' | 'special';
    earned_at: string;
    progress?: {
      current: number;
      required: number;
    };
  }>>> {
    return this.get<Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      category: 'completion' | 'performance' | 'engagement' | 'streak' | 'special';
      earned_at: string;
      progress?: {
        current: number;
        required: number;
      };
    }>>('/student/achievements', { requiresAuth: true });
  }

  /**
   * Download a certificate
   * @param certificateId - The ID of the certificate to download
   * @returns Promise with certificate download data
   */
  static async downloadCertificate(certificateId: string): Promise<ApiResponse<{
    download_url: string;
    expires_at: string;
  }>> {
    return this.get<{
      download_url: string;
      expires_at: string;
    }>(`/student/certificates/${certificateId}/download`, { requiresAuth: true });
  }
}
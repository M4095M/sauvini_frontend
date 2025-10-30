import { BaseApi } from "./base";
import type {
  ApiResponse,
  PaginationRequest,
  Professor,
  Student,
} from "@/types/api";

/**
 * Professor API class that handles all professor-specific functionality
 * Extends BaseApi to inherit common HTTP methods and token management
 *
 * This class provides professor functionality including:
 * - Profile management
 * - Student management and oversight
 * - Lesson and content creation
 * - Grade management
 * - Analytics and reporting for their classes
 *
 * All methods in this class require professor authentication
 */
export class ProfessorApi extends BaseApi {
  // ===========================================
  // PROFILE MANAGEMENT
  // ===========================================

  /**
   * Get current professor's profile information
   * @returns Promise with professor profile data
   */
  static async getProfile(): Promise<ApiResponse<Professor>> {
    return this.get<Professor>("/professor/profile", { requiresAuth: true });
  }

  /**
   * Update professor profile information
   * @param profileData - Updated profile data
   * @returns Promise with updated professor data
   */
  static async updateProfile(profileData: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    wilaya?: string;
    exp_school_years?: number;
    exp_off_school?: boolean;
    exp_online?: boolean;
  }): Promise<ApiResponse<Professor>> {
    return this.put<Professor>("/professor/profile", profileData, {
      requiresAuth: true,
    });
  }

  /**
   * Update professor profile picture
   * @param profilePicture - New profile picture file
   * @returns Promise with updated professor data
   */
  static async updateProfilePicture(profilePicture: File): Promise<
    ApiResponse<{
      profile_picture_path: string;
    }>
  > {
    const formData = new FormData();
    formData.append("profile_picture", profilePicture);

    return this.post<{
      profile_picture_path: string;
    }>("/professor/profile/picture", formData, { requiresAuth: true });
  }

  /**
   * Update professor CV document
   * @param cvFile - New CV file
   * @returns Promise with updated CV path
   */
  static async updateCV(cvFile: File): Promise<
    ApiResponse<{
      cv_path: string;
    }>
  > {
    const formData = new FormData();
    formData.append("cv_file", cvFile);

    return this.post<{
      cv_path: string;
    }>("/professor/profile/cv", formData, { requiresAuth: true });
  }

  /**
   * Download professor CV file
   * @param professorId - Professor ID
   * @returns Promise with file download
   */
  static async downloadCV(professorId: string): Promise<Blob> {
    const response = await this.get(
      `/auth/professor/${professorId}/cv/download`,
      {
        requiresAuth: true,
        responseType: "blob",
      }
    );
    return response as Blob;
  }

  /**
   * Get signed URL for professor CV download
   * @param professorId - Professor ID
   * @returns Promise with signed URL
   */
  static async getCVDownloadURL(professorId: string): Promise<
    ApiResponse<{
      professor_id: string;
      professor_name: string;
      cv_url: string;
      expires_in: number;
    }>
  > {
    return this.get<{
      professor_id: string;
      professor_name: string;
      cv_url: string;
      expires_in: number;
    }>(`/auth/professor/${professorId}/cv/url`, { requiresAuth: true });
  }

  /**
   * Change professor password
   * @param passwordData - Current and new password
   * @returns Promise with success confirmation
   */
  static async changePassword(passwordData: {
    current_password: string;
    new_password: string;
  }): Promise<ApiResponse<null>> {
    return this.post<null>("/professor/profile/change-password", passwordData, {
      requiresAuth: true,
    });
  }

  // ===========================================
  // STUDENT MANAGEMENT
  // ===========================================

  /**
   * Get students enrolled in professor's courses
   * @param pagination - Optional pagination parameters
   * @param filters - Optional filters for student data
   * @returns Promise with list of enrolled students
   */
  static async getEnrolledStudents(
    pagination?: PaginationRequest,
    filters?: {
      course_id?: string;
      module_id?: string;
      progress_status?: "not_started" | "in_progress" | "completed";
    }
  ): Promise<
    ApiResponse<
      Array<
        Student & {
          enrollment_date: string;
          progress: number;
          last_activity: string;
          completed_lessons: number;
          total_lessons: number;
        }
      >
    >
  > {
    const params = new URLSearchParams();

    if (pagination?.page) params.append("page", pagination.page.toString());
    if (pagination?.limit) params.append("limit", pagination.limit.toString());
    if (filters?.course_id) params.append("course_id", filters.course_id);
    if (filters?.module_id) params.append("module_id", filters.module_id);
    if (filters?.progress_status)
      params.append("progress_status", filters.progress_status);

    const queryString = params.toString();
    const url = queryString
      ? `/professor/students?${queryString}`
      : "/professor/students";

    return this.get<
      Array<
        Student & {
          enrollment_date: string;
          progress: number;
          last_activity: string;
          completed_lessons: number;
          total_lessons: number;
        }
      >
    >(url, { requiresAuth: true });
  }

  /**
   * Get detailed information about a specific student's progress
   * @param studentId - The ID of the student
   * @returns Promise with detailed student progress data
   */
  static async getStudentProgress(studentId: string): Promise<
    ApiResponse<{
      student: Student;
      courses: Array<{
        course_id: string;
        course_title: string;
        enrollment_date: string;
        progress: number;
        completed_lessons: number;
        total_lessons: number;
        last_activity: string;
        quiz_scores: Array<{
          quiz_id: string;
          quiz_title: string;
          score: number;
          max_score: number;
          completed_at: string;
        }>;
      }>;
      overall_stats: {
        total_time_spent: number;
        average_score: number;
        completion_rate: number;
      };
    }>
  > {
    return this.get<{
      student: Student;
      courses: Array<{
        course_id: string;
        course_title: string;
        enrollment_date: string;
        progress: number;
        completed_lessons: number;
        total_lessons: number;
        last_activity: string;
        quiz_scores: Array<{
          quiz_id: string;
          quiz_title: string;
          score: number;
          max_score: number;
          completed_at: string;
        }>;
      }>;
      overall_stats: {
        total_time_spent: number;
        average_score: number;
        completion_rate: number;
      };
    }>(`/professor/students/${studentId}/progress`, { requiresAuth: true });
  }

  /**
   * Send message to a student
   * @param studentId - The ID of the student
   * @param messageData - Message content
   * @returns Promise with message sending result
   */
  static async sendMessageToStudent(
    studentId: string,
    messageData: {
      subject: string;
      content: string;
      priority?: "low" | "normal" | "high";
    }
  ): Promise<
    ApiResponse<{
      message_id: string;
      sent_at: string;
    }>
  > {
    return this.post<{
      message_id: string;
      sent_at: string;
    }>(`/professor/students/${studentId}/message`, messageData, {
      requiresAuth: true,
    });
  }

  // ===========================================
  // COURSE AND CONTENT MANAGEMENT
  // ===========================================

  /**
   * Get courses created by the professor
   * @param pagination - Optional pagination parameters
   * @returns Promise with list of professor's courses
   */
  static async getCourses(pagination?: PaginationRequest): Promise<
    ApiResponse<
      Array<{
        id: string;
        title: string;
        description: string;
        created_at: string;
        updated_at: string;
        enrolled_students: number;
        total_lessons: number;
        status: "draft" | "published" | "archived";
      }>
    >
  > {
    const params = new URLSearchParams();
    if (pagination?.page) params.append("page", pagination.page.toString());
    if (pagination?.limit) params.append("limit", pagination.limit.toString());

    const queryString = params.toString();
    const url = queryString
      ? `/professor/courses?${queryString}`
      : "/professor/courses";

    return this.get<
      Array<{
        id: string;
        title: string;
        description: string;
        created_at: string;
        updated_at: string;
        enrolled_students: number;
        total_lessons: number;
        status: "draft" | "published" | "archived";
      }>
    >(url, { requiresAuth: true });
  }

  /**
   * Create a new course
   * @param courseData - Course creation data
   * @returns Promise with created course data
   */
  static async createCourse(courseData: {
    title: string;
    description: string;
    category: string;
    difficulty_level: "beginner" | "intermediate" | "advanced";
    estimated_duration_hours: number;
    prerequisites?: string[];
  }): Promise<
    ApiResponse<{
      id: string;
      title: string;
      description: string;
      category: string;
      difficulty_level: string;
      estimated_duration_hours: number;
      prerequisites: string[];
      status: string;
      created_at: string;
    }>
  > {
    return this.post<{
      id: string;
      title: string;
      description: string;
      category: string;
      difficulty_level: string;
      estimated_duration_hours: number;
      prerequisites: string[];
      status: string;
      created_at: string;
    }>("/professor/courses", courseData, { requiresAuth: true });
  }

  /**
   * Update an existing course
   * @param courseId - The ID of the course to update
   * @param updateData - Course update data
   * @returns Promise with updated course data
   */
  static async updateCourse(
    courseId: string,
    updateData: {
      title?: string;
      description?: string;
      category?: string;
      difficulty_level?: "beginner" | "intermediate" | "advanced";
      estimated_duration_hours?: number;
      prerequisites?: string[];
      status?: "draft" | "published" | "archived";
    }
  ): Promise<
    ApiResponse<{
      id: string;
      title: string;
      description: string;
      category: string;
      difficulty_level: string;
      estimated_duration_hours: number;
      prerequisites: string[];
      status: string;
      updated_at: string;
    }>
  > {
    return this.put<{
      id: string;
      title: string;
      description: string;
      category: string;
      difficulty_level: string;
      estimated_duration_hours: number;
      prerequisites: string[];
      status: string;
      updated_at: string;
    }>(`/professor/courses/${courseId}`, updateData, { requiresAuth: true });
  }

  /**
   * Delete a course
   * @param courseId - The ID of the course to delete
   * @returns Promise with deletion result
   */
  static async deleteCourse(courseId: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`/professor/courses/${courseId}`, {
      requiresAuth: true,
    });
  }

  // ===========================================
  // LESSON MANAGEMENT
  // ===========================================

  /**
   * Get lessons for a specific course
   * @param courseId - The ID of the course
   * @param pagination - Optional pagination parameters
   * @returns Promise with list of lessons
   */
  static async getCourseLessons(
    courseId: string,
    pagination?: PaginationRequest
  ): Promise<
    ApiResponse<
      Array<{
        id: string;
        title: string;
        description: string;
        order: number;
        duration_minutes: number;
        content_type: "video" | "text" | "interactive";
        is_published: boolean;
        created_at: string;
        updated_at: string;
      }>
    >
  > {
    const params = new URLSearchParams();
    if (pagination?.page) params.append("page", pagination.page.toString());
    if (pagination?.limit) params.append("limit", pagination.limit.toString());

    const queryString = params.toString();
    const url = queryString
      ? `/professor/courses/${courseId}/lessons?${queryString}`
      : `/professor/courses/${courseId}/lessons`;

    return this.get<
      Array<{
        id: string;
        title: string;
        description: string;
        order: number;
        duration_minutes: number;
        content_type: "video" | "text" | "interactive";
        is_published: boolean;
        created_at: string;
        updated_at: string;
      }>
    >(url, { requiresAuth: true });
  }

  /**
   * Create a new lesson
   * @param courseId - The ID of the course
   * @param lessonData - Lesson creation data
   * @returns Promise with created lesson data
   */
  static async createLesson(
    courseId: string,
    lessonData: {
      title: string;
      description: string;
      content: string;
      order: number;
      duration_minutes: number;
      content_type: "video" | "text" | "interactive";
      video_url?: string;
      resources?: Array<{
        title: string;
        url: string;
        type: "pdf" | "link" | "download";
      }>;
    }
  ): Promise<
    ApiResponse<{
      id: string;
      title: string;
      description: string;
      content: string;
      order: number;
      duration_minutes: number;
      content_type: string;
      video_url?: string;
      is_published: boolean;
      created_at: string;
    }>
  > {
    return this.post<{
      id: string;
      title: string;
      description: string;
      content: string;
      order: number;
      duration_minutes: number;
      content_type: string;
      video_url?: string;
      is_published: boolean;
      created_at: string;
    }>(`/professor/courses/${courseId}/lessons`, lessonData, {
      requiresAuth: true,
    });
  }

  /**
   * Update a lesson
   * @param lessonId - The ID of the lesson to update
   * @param updateData - Lesson update data
   * @returns Promise with updated lesson data
   */
  static async updateLesson(
    lessonId: string,
    updateData: {
      title?: string;
      description?: string;
      content?: string;
      order?: number;
      duration_minutes?: number;
      content_type?: "video" | "text" | "interactive";
      video_url?: string;
      is_published?: boolean;
    }
  ): Promise<
    ApiResponse<{
      id: string;
      title: string;
      description: string;
      content: string;
      order: number;
      duration_minutes: number;
      content_type: string;
      video_url?: string;
      is_published: boolean;
      updated_at: string;
    }>
  > {
    return this.put<{
      id: string;
      title: string;
      description: string;
      content: string;
      order: number;
      duration_minutes: number;
      content_type: string;
      video_url?: string;
      is_published: boolean;
      updated_at: string;
    }>(`/professor/lessons/${lessonId}`, updateData, { requiresAuth: true });
  }

  /**
   * Delete a lesson
   * @param lessonId - The ID of the lesson to delete
   * @returns Promise with deletion result
   */
  static async deleteLesson(lessonId: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`/professor/lessons/${lessonId}`, {
      requiresAuth: true,
    });
  }

  // ===========================================
  // QUIZ AND ASSESSMENT MANAGEMENT
  // ===========================================

  /**
   * Create a quiz for a lesson
   * @param lessonId - The ID of the lesson
   * @param quizData - Quiz creation data
   * @returns Promise with created quiz data
   */
  static async createQuiz(
    lessonId: string,
    quizData: {
      title: string;
      description: string;
      time_limit_minutes?: number;
      passing_score: number;
      max_attempts?: number;
      questions: Array<{
        question: string;
        type: "multiple_choice" | "true_false" | "short_answer";
        options?: string[];
        correct_answer: string | number;
        points: number;
        explanation?: string;
      }>;
    }
  ): Promise<
    ApiResponse<{
      id: string;
      title: string;
      description: string;
      time_limit_minutes?: number;
      passing_score: number;
      max_attempts?: number;
      questions_count: number;
      created_at: string;
    }>
  > {
    return this.post<{
      id: string;
      title: string;
      description: string;
      time_limit_minutes?: number;
      passing_score: number;
      max_attempts?: number;
      questions_count: number;
      created_at: string;
    }>(`/professor/lessons/${lessonId}/quiz`, quizData, { requiresAuth: true });
  }

  /**
   * Get quiz results for a specific quiz
   * @param quizId - The ID of the quiz
   * @param pagination - Optional pagination parameters
   * @returns Promise with quiz results
   */
  static async getQuizResults(
    quizId: string,
    pagination?: PaginationRequest
  ): Promise<
    ApiResponse<{
      quiz: {
        id: string;
        title: string;
        total_questions: number;
        passing_score: number;
      };
      results: Array<{
        student_id: string;
        student_name: string;
        score: number;
        percentage: number;
        passed: boolean;
        completed_at: string;
        time_taken_minutes: number;
        attempt_number: number;
      }>;
      stats: {
        total_attempts: number;
        average_score: number;
        pass_rate: number;
        completion_rate: number;
      };
    }>
  > {
    const params = new URLSearchParams();
    if (pagination?.page) params.append("page", pagination.page.toString());
    if (pagination?.limit) params.append("limit", pagination.limit.toString());

    const queryString = params.toString();
    const url = queryString
      ? `/professor/quizzes/${quizId}/results?${queryString}`
      : `/professor/quizzes/${quizId}/results`;

    return this.get<{
      quiz: {
        id: string;
        title: string;
        total_questions: number;
        passing_score: number;
      };
      results: Array<{
        student_id: string;
        student_name: string;
        score: number;
        percentage: number;
        passed: boolean;
        completed_at: string;
        time_taken_minutes: number;
        attempt_number: number;
      }>;
      stats: {
        total_attempts: number;
        average_score: number;
        pass_rate: number;
        completion_rate: number;
      };
    }>(url, { requiresAuth: true });
  }

  // ===========================================
  // ANALYTICS AND REPORTING
  // ===========================================

  /**
   * Get professor's teaching analytics
   * @param period - Time period for analytics
   * @returns Promise with teaching analytics
   */
  static async getTeachingAnalytics(
    period: "week" | "month" | "quarter" | "year" = "month"
  ): Promise<
    ApiResponse<{
      overview: {
        total_courses: number;
        total_students: number;
        total_lessons: number;
        average_completion_rate: number;
      };
      engagement: Array<{
        date: string;
        active_students: number;
        lessons_completed: number;
        quizzes_taken: number;
      }>;
      performance: {
        top_performing_courses: Array<{
          course_id: string;
          course_title: string;
          completion_rate: number;
          average_score: number;
        }>;
        student_progress: Array<{
          course_id: string;
          course_title: string;
          enrolled: number;
          completed: number;
          in_progress: number;
          not_started: number;
        }>;
      };
    }>
  > {
    return this.get<{
      overview: {
        total_courses: number;
        total_students: number;
        total_lessons: number;
        average_completion_rate: number;
      };
      engagement: Array<{
        date: string;
        active_students: number;
        lessons_completed: number;
        quizzes_taken: number;
      }>;
      performance: {
        top_performing_courses: Array<{
          course_id: string;
          course_title: string;
          completion_rate: number;
          average_score: number;
        }>;
        student_progress: Array<{
          course_id: string;
          course_title: string;
          enrolled: number;
          completed: number;
          in_progress: number;
          not_started: number;
        }>;
      };
    }>(`/professor/analytics?period=${period}`, { requiresAuth: true });
  }

  /**
   * Export course data and analytics
   * @param courseId - The ID of the course to export
   * @param format - Export format
   * @returns Promise with export data
   */
  static async exportCourseData(
    courseId: string,
    format: "csv" | "xlsx" | "pdf" = "csv"
  ): Promise<
    ApiResponse<{
      download_url: string;
      expires_at: string;
      file_size: number;
    }>
  > {
    return this.post<{
      download_url: string;
      expires_at: string;
      file_size: number;
    }>(
      `/professor/courses/${courseId}/export`,
      { format },
      { requiresAuth: true }
    );
  }
}

import { useState, useCallback } from 'react';
import { StudentApi } from '@/api/student';
import type { PaginationRequest } from '@/types/api';

/**
 * Custom hook for student operations
 * Provides state management and error handling for all student-related API calls
 */
export function useStudent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // ===========================================
  // PROFILE MANAGEMENT
  // ===========================================

  const getProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.getProfile();
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch profile');
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

  const updateProfile = useCallback(async (profileData: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    wilaya?: string;
    academic_stream?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.updateProfile(profileData);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to update profile');
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

  const updateProfilePicture = useCallback(async (profilePicture: File) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.updateProfilePicture(profilePicture);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to update profile picture');
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

  const changePassword = useCallback(async (passwordData: {
    current_password: string;
    new_password: string;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.changePassword(passwordData);
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Failed to change password');
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
  // COURSE ENROLLMENT AND MANAGEMENT
  // ===========================================

  const getAvailableCourses = useCallback(async (
    pagination?: PaginationRequest,
    filters?: {
      category?: string;
      difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
      professor_id?: string;
      search?: string;
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.getAvailableCourses(pagination, filters);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch available courses');
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

  const getEnrolledCourses = useCallback(async (
    pagination?: PaginationRequest,
    filters?: {
      status?: 'not_started' | 'in_progress' | 'completed';
      category?: string;
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.getEnrolledCourses(pagination, filters);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch enrolled courses');
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

  const enrollInCourse = useCallback(async (courseId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.enrollInCourse(courseId);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to enroll in course');
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

  const unenrollFromCourse = useCallback(async (courseId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.unenrollFromCourse(courseId);
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Failed to unenroll from course');
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
  // LESSON PROGRESS AND LEARNING
  // ===========================================

  const getCourseLessons = useCallback(async (courseId: string, pagination?: PaginationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.getCourseLessons(courseId, pagination);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch course lessons');
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

  const getLesson = useCallback(async (lessonId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.getLesson(lessonId);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch lesson');
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

  const markLessonComplete = useCallback(async (lessonId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.markLessonComplete(lessonId);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to mark lesson as complete');
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

  const updateLessonProgress = useCallback(async (lessonId: string, progressData: {
    progress_percentage?: number;
    time_spent_minutes?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.updateLessonProgress(lessonId, progressData);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to update lesson progress');
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
  // QUIZ AND ASSESSMENT
  // ===========================================

  const getLessonQuiz = useCallback(async (lessonId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.getLessonQuiz(lessonId);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch lesson quiz');
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

  const submitQuizAnswers = useCallback(async (quizId: string, answers: Record<string, string | number>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.submitQuizAnswers(quizId, answers);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to submit quiz answers');
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

  const getQuizHistory = useCallback(async (quizId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.getQuizHistory(quizId);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch quiz history');
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
  // PROGRESS AND ANALYTICS
  // ===========================================

  const getOverallProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.getOverallProgress();
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch overall progress');
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

  const getCourseProgress = useCallback(async (courseId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.getCourseProgress(courseId);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch course progress');
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
  // RECOMMENDATIONS AND DISCOVERY
  // ===========================================

  const getRecommendedCourses = useCallback(async (limit: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.getRecommendedCourses(limit);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch recommended courses');
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

  const getRecommendedLessons = useCallback(async (limit: number = 5) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.getRecommendedLessons(limit);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch recommended lessons');
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
  // CERTIFICATES AND ACHIEVEMENTS
  // ===========================================

  const getCertificates = useCallback(async (pagination?: PaginationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.getCertificates(pagination);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch certificates');
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

  const getAchievements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.getAchievements();
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch achievements');
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

  const downloadCertificate = useCallback(async (certificateId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.downloadCertificate(certificateId);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to download certificate');
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

  return {
    // State
    loading,
    error,
    
    // Actions
    clearError,
    
    // Profile Management
    getProfile,
    updateProfile,
    updateProfilePicture,
    changePassword,
    
    // Course Enrollment and Management
    getAvailableCourses,
    getEnrolledCourses,
    enrollInCourse,
    unenrollFromCourse,
    
    // Lesson Progress and Learning
    getCourseLessons,
    getLesson,
    markLessonComplete,
    updateLessonProgress,
    
    // Quiz and Assessment
    getLessonQuiz,
    submitQuizAnswers,
    getQuizHistory,
    
    // Progress and Analytics
    getOverallProgress,
    getCourseProgress,
    
    // Recommendations and Discovery
    getRecommendedCourses,
    getRecommendedLessons,
    
    // Certificates and Achievements
    getCertificates,
    getAchievements,
    downloadCertificate,
  };
}
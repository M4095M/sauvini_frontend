import { BaseApi } from "./base";
import type { ApiResponse } from "@/types/api";

// Quiz Types
export interface Quiz {
  id: string;
  title: string;
  description?: string;
  lesson_id: string;
  time_limit?: number; // in minutes
  passing_score: number; // 0-100
  max_attempts?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: "MultipleChoice" | "TrueFalse" | "ShortAnswer";
  options?: string[]; // For multiple choice questions
  correct_answer: string;
  points: number;
  explanation?: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface QuizWithQuestions {
  quiz: Quiz;
  questions: QuizQuestion[];
}

export interface QuizSubmission {
  id: string;
  quiz_id: string;
  student_id: string;
  answers: Record<string, string>; // question_id -> answer
  score?: number;
  passed?: boolean;
  time_spent?: number; // in minutes
  submitted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuizSubmissionWithDetails {
  submission: QuizSubmission;
  student_name: string;
  quiz_title: string;
}

export interface QuizSubmissionResult {
  score: number;
  passed: boolean;
  correct_answers: Record<string, string>;
  explanations: Record<string, string>;
}

// Request DTOs
export interface CreateQuizRequest {
  title: string;
  description?: string;
  lesson_id: string;
  time_limit?: number;
  passing_score: number;
  max_attempts?: number;
  questions: CreateQuestionRequest[];
}

export interface CreateQuestionRequest {
  quiz: string; // quiz_id
  question_text: string;
  question_type: "MultipleChoice" | "TrueFalse" | "ShortAnswer";
  options?: string[];
  correct_answer: string;
  points: number;
  explanation?: string;
  order: number;
}

export interface UpdateQuestionRequest {
  question_text?: string;
  question_type?: "MultipleChoice" | "TrueFalse" | "ShortAnswer";
  options?: string[];
  correct_answer?: string;
  points?: number;
  explanation?: string;
  order?: number;
}

export interface UpdateQuizRequest {
  id: string;
  title: string;
  description?: string;
  time_limit?: number;
  passing_score: number;
  max_attempts?: number;
  is_active: boolean;
}

export interface SubmitQuizRequest {
  answers: Record<string, string>;
  time_spent?: number;
}

export class QuizApi extends BaseApi {
  // Public routes - anyone can view quizzes and submit answers
  static async getQuizByLesson(
    lessonId: string
  ): Promise<ApiResponse<QuizWithQuestions>> {
    return this.get(`/assessments/quizzes/lesson/${lessonId}`, {
      requiresAuth: true,
    });
  }

  static async getQuizById(
    quizId: string
  ): Promise<ApiResponse<QuizWithQuestions>> {
    return this.get(`/assessments/quizzes/${quizId}/detail`, {
      requiresAuth: true,
    });
  }

  static async submitQuiz(
    quizId: string,
    request: SubmitQuizRequest
  ): Promise<ApiResponse<QuizSubmissionResult>> {
    return this.post(`/assessments/quizzes/${quizId}/submit`, request, {
      requiresAuth: true,
    });
  }

  // Professor protected routes - quiz management
  static async createQuiz(
    request: CreateQuizRequest
  ): Promise<ApiResponse<{ quiz: Quiz; questions_count: number }>> {
    return this.post(`/assessments/quizzes/create`, request, {
      requiresAuth: true,
    });
  }

  static async updateQuiz(
    quizId: string,
    request: UpdateQuizRequest
  ): Promise<ApiResponse<Quiz>> {
    return this.put(`/assessments/quizzes/${quizId}/update`, request, {
      requiresAuth: true,
    });
  }

  static async deleteQuiz(
    quizId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return this.delete(`/assessments/quizzes/${quizId}/delete`, {
      requiresAuth: true,
    });
  }

  static async getQuizSubmissions(
    quizId: string
  ): Promise<ApiResponse<QuizSubmissionWithDetails[]>> {
    return this.get(`/assessments/quizzes/${quizId}/submissions`, {
      requiresAuth: true,
    });
  }

  // ============================================
  // Question Management Endpoints (Professor)
  // ============================================

  static async createQuestion(
    request: CreateQuestionRequest
  ): Promise<ApiResponse<QuizQuestion>> {
    return this.post(`/assessments/questions/create`, request, {
      requiresAuth: true,
    });
  }

  static async updateQuestion(
    questionId: string,
    request: UpdateQuestionRequest
  ): Promise<ApiResponse<QuizQuestion>> {
    return this.put(`/assessments/questions/${questionId}/update`, request, {
      requiresAuth: true,
    });
  }

  static async deleteQuestion(
    questionId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return this.delete(`/assessments/questions/${questionId}/delete`, {
      requiresAuth: true,
    });
  }
}

export default QuizApi;

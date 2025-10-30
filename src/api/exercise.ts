import { BaseApi } from "./base";
import type { ApiResponse } from "./types";

// Exercise Types
export interface Exercise {
  id: string;
  title: string;
  description: string;
  lesson_id: string;
  chapter_id: string;
  module_id: string;
  total_marks: number;
  exercise_pdf_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ExerciseSubmission {
  id: string;
  exercise_id: string;
  student_id: string;
  solution_pdf_url: string;
  student_notes?: string;
  professor_notes?: string;
  professor_review_pdf_url?: string;
  grade?: number;
  status: "Submitted" | "Graded";
  submitted_at?: string;
  graded_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExerciseWithSubmission {
  exercise: Exercise;
  submission?: ExerciseSubmission;
}

export interface ExerciseSubmissionWithDetails {
  submission: ExerciseSubmission;
  student_name: string;
  exercise_title: string;
  module_name: string;
  chapter_name: string;
}

// Request DTOs
export interface CreateExerciseRequest {
  title: string;
  description: string;
  lesson_id: string;
  chapter_id: string;
  module_id: string;
  total_marks: number;
  exercise_pdf_url?: string;
}

export interface UpdateExerciseRequest {
  id: string;
  title: string;
  description: string;
  total_marks: number;
  exercise_pdf_url?: string;
  is_active: boolean;
}

export interface SubmitExerciseRequest {
  solution_pdf_url: string;
  student_notes?: string;
}

export interface GradeSubmissionRequest {
  grade: number;
  professor_notes?: string;
  professor_review_pdf_url?: string;
}

export class ExerciseApi extends BaseApi {
  // Public routes - anyone can view exercises
  async getExercisesByLesson(
    lessonId: string
  ): Promise<ApiResponse<Exercise[]>> {
    return this.get(`/exercises/lesson/${lessonId}`);
  }

  async getExercisesByChapter(
    chapterId: string
  ): Promise<ApiResponse<Exercise[]>> {
    return this.get(`/exercises/chapter/${chapterId}`);
  }

  async getExerciseById(exerciseId: string): Promise<ApiResponse<Exercise>> {
    return this.get(`/exercises/${exerciseId}`);
  }

  async getExerciseWithSubmission(
    exerciseId: string
  ): Promise<ApiResponse<ExerciseWithSubmission>> {
    return this.get(`/exercises/${exerciseId}/submission`);
  }

  async submitExercise(
    exerciseId: string,
    request: SubmitExerciseRequest
  ): Promise<ApiResponse<ExerciseWithSubmission>> {
    return this.post(`/exercises/${exerciseId}/submit`, request);
  }

  // Professor protected routes - exercise management and grading
  async createExercise(
    request: CreateExerciseRequest
  ): Promise<ApiResponse<{ exercise: Exercise }>> {
    return this.post(`/exercises`, request);
  }

  async updateExercise(
    exerciseId: string,
    request: UpdateExerciseRequest
  ): Promise<ApiResponse<Exercise>> {
    return this.put(`/exercises/${exerciseId}`, request);
  }

  async deleteExercise(
    exerciseId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return this.delete(`/exercises/${exerciseId}`);
  }

  async getExerciseSubmissions(
    exerciseId: string
  ): Promise<ApiResponse<ExerciseSubmissionWithDetails[]>> {
    return this.get(`/exercises/${exerciseId}/submissions`);
  }

  async gradeSubmission(
    submissionId: string,
    request: GradeSubmissionRequest
  ): Promise<ApiResponse<ExerciseWithSubmission>> {
    return this.put(`/exercises/submissions/${submissionId}/grade`, request);
  }
}

export const exerciseApi = new ExerciseApi();

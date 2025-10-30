import { BaseApi } from "./base";

// ============================================
// Types
// ============================================

export interface Exam {
  id: string;
  title: string;
  description: string;
  chapter_id: string;
  professor_id: string;
  professor_name: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExamQuestion {
  id: string;
  exam_id: string;
  question_text: string;
  question_type: ExamQuestionType;
  options?: string[];
  correct_answer?: string;
  correct_answers?: string[];
  marks: number;
  order: number;
  created_at: string;
  updated_at: string;
}

export enum ExamQuestionType {
  MultipleChoice = "MultipleChoice",
  SingleChoice = "SingleChoice",
  Text = "Text",
  Numeric = "Numeric",
  Essay = "Essay",
}

export interface ExamSubmission {
  id: string;
  exam_id: string;
  student_id: string;
  student_name: string;
  answers: Record<string, string>;
  total_marks: number;
  obtained_marks: number;
  percentage: number;
  status: ExamSubmissionStatus;
  submitted_at?: string;
  started_at: string;
  time_spent_minutes?: number;
  is_graded: boolean;
  graded_at?: string;
  graded_by?: string;
  feedback?: string;
}

export enum ExamSubmissionStatus {
  NotStarted = "NotStarted",
  InProgress = "InProgress",
  Submitted = "Submitted",
  Graded = "Graded",
  Expired = "Expired",
}

export interface ExamSubmissionWithDetails {
  id: string;
  exam_id: string;
  student_id: string;
  student_name: string;
  answers: Record<string, string>;
  total_marks: number;
  obtained_marks: number;
  percentage: number;
  status: ExamSubmissionStatus;
  submitted_at?: string;
  started_at: string;
  time_spent_minutes?: number;
  is_graded: boolean;
  graded_at?: string;
  graded_by?: string;
  feedback?: string;
  exam_title: string;
  chapter_name: string;
  module_name: string;
}

export interface ExamWithQuestions {
  exam: Exam;
  questions: ExamQuestion[];
}

// Request DTOs
export interface CreateExamRequest {
  title: string;
  description: string;
  chapter_id: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  start_date: string;
  end_date: string;
  is_active?: boolean;
  questions: CreateExamQuestionRequest[];
}

export interface CreateExamQuestionRequest {
  question_text: string;
  question_type: ExamQuestionType;
  options?: string[];
  correct_answer?: string;
  correct_answers?: string[];
  marks: number;
  order: number;
}

export interface UpdateExamRequest {
  title?: string;
  description?: string;
  duration_minutes?: number;
  total_marks?: number;
  passing_marks?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

export interface SubmitExamRequest {
  answers: Record<string, string>;
  time_spent_minutes?: number;
}

export interface GradeExamSubmissionRequest {
  obtained_marks: number;
  feedback?: string;
}

export interface ExamFilters {
  chapter_id?: string;
  professor_id?: string;
  is_active?: boolean;
  start_date_from?: string;
  start_date_to?: string;
  page?: number;
  per_page?: number;
}

// Response DTOs
export interface CreateExamResponse {
  exam: ExamWithQuestions;
}

export interface StartExamResponse {
  submission: ExamSubmission;
}

export interface ExamSubmissionResult {
  total_marks: number;
  obtained_marks: number;
  percentage: number;
  passed: boolean;
  correct_answers: Record<string, string>;
}

export interface ExamListResponse {
  exams: ExamWithQuestions[];
  total: number;
  page: number;
  per_page: number;
}

// ============================================
// API Client
// ============================================

class ExamsApi extends BaseApi {
  // Exam management
  static async getExams(
    filters: ExamFilters = {}
  ): Promise<ApiResponse<ExamListResponse>> {
    const params = new URLSearchParams();

    if (filters.chapter_id) params.append("chapter_id", filters.chapter_id);
    if (filters.professor_id)
      params.append("professor_id", filters.professor_id);
    if (filters.is_active !== undefined)
      params.append("is_active", filters.is_active.toString());
    if (filters.start_date_from)
      params.append("start_date_from", filters.start_date_from);
    if (filters.start_date_to)
      params.append("start_date_to", filters.start_date_to);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.per_page)
      params.append("per_page", filters.per_page.toString());

    const queryString = params.toString();
    const url = queryString ? `/exams/?${queryString}` : "/exams/";

    return BaseApi.get<ExamListResponse>(url);
  }

  static async getExamsByChapter(
    chapterId: string
  ): Promise<ApiResponse<ExamWithQuestions[]>> {
    // The backend expects the chapter ID in the format "Chapter:4zwddwtm2e0dcwgxo0es"
    const formattedChapterId = `Chapter:${chapterId}`;
    return BaseApi.get<ExamWithQuestions[]>(
      `/exams/chapter/${formattedChapterId}`
    );
  }

  static async getExamById(
    examId: string
  ): Promise<ApiResponse<ExamWithQuestions>> {
    return BaseApi.get<ExamWithQuestions>(`/exams/${examId}`);
  }

  static async createExam(
    request: CreateExamRequest
  ): Promise<ApiResponse<CreateExamResponse>> {
    return BaseApi.post<CreateExamResponse>("/exams/", request);
  }

  static async updateExam(
    examId: string,
    request: UpdateExamRequest
  ): Promise<ApiResponse<ExamWithQuestions>> {
    return BaseApi.put<ExamWithQuestions>(`/exams/${examId}`, request);
  }

  static async deleteExam(
    examId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return BaseApi.delete<{ success: boolean }>(`/exams/${examId}`);
  }

  // Exam taking
  static async startExam(
    examId: string
  ): Promise<ApiResponse<StartExamResponse>> {
    return BaseApi.post<StartExamResponse>(`/exams/${examId}/start`, {});
  }

  static async submitExam(
    submissionId: string,
    request: SubmitExamRequest
  ): Promise<ApiResponse<ExamSubmissionResult>> {
    return BaseApi.post<ExamSubmissionResult>(
      `/exams/submissions/${submissionId}/submit`,
      request
    );
  }

  // Exam submissions
  static async getExamSubmissions(
    examId: string
  ): Promise<ApiResponse<ExamSubmissionWithDetails[]>> {
    return BaseApi.get<ExamSubmissionWithDetails[]>(
      `/exams/${examId}/submissions`
    );
  }

  static async gradeExamSubmission(
    submissionId: string,
    request: GradeExamSubmissionRequest
  ): Promise<ApiResponse<ExamSubmission>> {
    return BaseApi.put<ExamSubmission>(
      `/exams/submissions/${submissionId}/grade`,
      request
    );
  }

  // Helper methods
  static transformExam(exam: Exam): Exam {
    return {
      ...exam,
      id: exam.id.replace("Exam:", ""),
    };
  }

  static transformExamQuestion(question: ExamQuestion): ExamQuestion {
    return {
      ...question,
      id: question.id.replace("ExamQuestion:", ""),
      exam_id: question.exam_id.replace("Exam:", ""),
    };
  }

  transformExamSubmission(submission: ExamSubmission): ExamSubmission {
    return {
      ...submission,
      id: submission.id.replace("ExamSubmission:", ""),
      exam_id: submission.exam_id.replace("Exam:", ""),
    };
  }

  static transformExamWithQuestions(
    examWithQuestions: ExamWithQuestions
  ): ExamWithQuestions {
    return {
      exam: ExamsApi.transformExam(examWithQuestions.exam),
      questions: examWithQuestions.questions.map((q) =>
        ExamsApi.transformExamQuestion(q)
      ),
    };
  }

  static transformExamSubmissionWithDetails(
    details: ExamSubmissionWithDetails
  ): ExamSubmissionWithDetails {
    return {
      ...details,
      id: details.id.replace("ExamSubmission:", ""),
      exam_id:
        details.exam_id?.replace("Exam:", "") ||
        details.examId?.replace("Exam:", "") ||
        details.exam_id ||
        details.examId,
    };
  }
}

export const examsApi = ExamsApi;

import { BaseApi } from "./base";

// ============================================
// Types
// ============================================

export interface Question {
  id: string;
  title: string;
  content: string;
  student_id: string;
  student_name: string;
  chapter_id?: string;
  module_id?: string;
  subject?: string;
  status: QuestionStatus;
  importance: ImportanceLevel;
  views: number;
  likes: number;
  created_at?: string;
  updated_at?: string;
}

export interface QuestionTag {
  id: string;
  name: string;
  color: TagColor;
  icon?: string;
  created_at?: string;
}

export interface QuestionReply {
  id: string;
  question_id: string;
  author_id: string;
  author_name: string;
  author_type: AuthorType;
  content: string;
  is_answer: boolean;
  likes: number;
  created_at?: string;
  updated_at?: string;
}

export interface QuestionAttachment {
  id: string;
  question_id?: string;
  reply_id?: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at?: string;
}

export interface QuestionWithDetails {
  question: Question;
  tags: QuestionTag[];
  replies: QuestionReply[];
  attachments: QuestionAttachment[];
  module_name?: string;
  chapter_name?: string;
}

export interface QuestionListResponse {
  questions: QuestionWithDetails[];
  total: number;
  page: number;
  per_page: number;
}

export enum QuestionStatus {
  Pending = "Pending",
  Answered = "Answered",
  Closed = "Closed",
}

export enum ImportanceLevel {
  Normal = "Normal",
  Important = "Important",
  MostImportant = "MostImportant",
}

export enum TagColor {
  Blue = "Blue",
  Green = "Green",
  Yellow = "Yellow",
  Red = "Red",
  Purple = "Purple",
  Gray = "Gray",
}

export enum AuthorType {
  Student = "Student",
  Professor = "Professor",
  Admin = "Admin",
}

// Request DTOs
export interface CreateQuestionRequest {
  title: string;
  content: string;
  chapter_id?: string;
  module_id?: string;
  subject?: string;
  tag_ids: string[];
  attachments: CreateAttachmentRequest[];
}

export interface CreateAttachmentRequest {
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
}

export interface UpdateQuestionRequest {
  id: string;
  title: string;
  content: string;
  subject?: string;
  status: QuestionStatus;
  tag_ids: string[];
}

export interface CreateReplyRequest {
  content: string;
  is_answer: boolean;
  attachments: CreateAttachmentRequest[];
}

export interface UpdateReplyRequest {
  id: string;
  content: string;
  is_answer: boolean;
}

export interface QuestionFilters {
  status?: QuestionStatus;
  importance?: ImportanceLevel;
  chapter_id?: string;
  module_id?: string;
  tag_ids?: string[];
  search?: string;
  author_type?: AuthorType;
  page?: number;
  per_page?: number;
}

// Response DTOs
export interface CreateQuestionResponse {
  question: QuestionWithDetails;
}

export interface CreateReplyResponse {
  reply: QuestionReply;
}

// ============================================
// API Client
// ============================================

class QuestionsApi extends BaseApi {
  // Question management
  static async getQuestions(
    filters: QuestionFilters = {}
  ): Promise<ApiResponse<QuestionListResponse>> {
    const params = new URLSearchParams();

    if (filters.status) params.append("status", filters.status);
    if (filters.importance) params.append("importance", filters.importance);
    if (filters.chapter_id) params.append("chapter_id", filters.chapter_id);
    if (filters.module_id) params.append("module_id", filters.module_id);
    if (filters.search) params.append("search", filters.search);
    if (filters.author_type) params.append("author_type", filters.author_type);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.per_page)
      params.append("per_page", filters.per_page.toString());

    if (filters.tag_ids && filters.tag_ids.length > 0) {
      filters.tag_ids.forEach((tagId) => params.append("tag_ids", tagId));
    }

    const queryString = params.toString();
    const url = queryString ? `/questions?${queryString}` : "/questions";

    return this.get<QuestionListResponse>(url);
  }

  static async getQuestionById(
    questionId: string
  ): Promise<ApiResponse<QuestionWithDetails>> {
    return this.get<QuestionWithDetails>(`/questions/${questionId}`);
  }

  static async createQuestion(
    request: CreateQuestionRequest
  ): Promise<ApiResponse<CreateQuestionResponse>> {
    return this.post<CreateQuestionResponse>("/questions", request);
  }

  static async updateQuestion(
    questionId: string,
    request: UpdateQuestionRequest
  ): Promise<ApiResponse<QuestionWithDetails>> {
    return this.put<QuestionWithDetails>(`/questions/${questionId}`, request);
  }

  static async deleteQuestion(
    questionId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return this.delete<{ success: boolean }>(`/questions/${questionId}`);
  }

  // Question replies
  static async getQuestionReplies(
    questionId: string
  ): Promise<ApiResponse<QuestionReply[]>> {
    return this.get<QuestionReply[]>(`/questions/${questionId}/replies`);
  }

  static async createReply(
    questionId: string,
    request: CreateReplyRequest
  ): Promise<ApiResponse<CreateReplyResponse>> {
    return this.post<CreateReplyResponse>(
      `/questions/${questionId}/replies`,
      request
    );
  }

  static async updateReply(
    replyId: string,
    request: UpdateReplyRequest
  ): Promise<ApiResponse<QuestionReply>> {
    return this.put<QuestionReply>(`/questions/replies/${replyId}`, request);
  }

  static async deleteReply(
    replyId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return this.delete<{ success: boolean }>(`/questions/replies/${replyId}`);
  }

  // Question tags
  static async getQuestionTags(): Promise<ApiResponse<QuestionTag[]>> {
    return this.get<QuestionTag[]>(`/questions/tags`);
  }

  // Helper methods
  static transformQuestion(question: Question): Question {
    return {
      ...question,
      id: question.id.replace("Question:", ""),
    };
  }

  static transformQuestionWithDetails(
    details: QuestionWithDetails
  ): QuestionWithDetails {
    return {
      ...details,
      question: this.transformQuestion(details.question),
      replies: details.replies.map((reply) => ({
        ...reply,
        id: reply.id.replace("QuestionReply:", ""),
        question_id: reply.question_id.replace("Question:", ""),
      })),
      attachments: details.attachments.map((attachment) => ({
        ...attachment,
        id: attachment.id.replace("QuestionAttachment:", ""),
        question_id: attachment.question_id?.replace("Question:", ""),
        reply_id: attachment.reply_id?.replace("QuestionReply:", ""),
      })),
    };
  }
}

export const questionsApi = {
  getQuestions: (filters?: QuestionFilters) =>
    QuestionsApi.getQuestions(filters),
  getQuestionById: (questionId: string) =>
    QuestionsApi.getQuestionById(questionId),
  createQuestion: (request: CreateQuestionRequest) =>
    QuestionsApi.createQuestion(request),
  updateQuestion: (questionId: string, request: UpdateQuestionRequest) =>
    QuestionsApi.updateQuestion(questionId, request),
  deleteQuestion: (questionId: string) =>
    QuestionsApi.deleteQuestion(questionId),
  getQuestionReplies: (questionId: string) =>
    QuestionsApi.getQuestionReplies(questionId),
  createReply: (questionId: string, request: CreateReplyRequest) =>
    QuestionsApi.createReply(questionId, request),
  updateReply: (replyId: string, request: UpdateReplyRequest) =>
    QuestionsApi.updateReply(replyId, request),
  deleteReply: (replyId: string) => QuestionsApi.deleteReply(replyId),
  getQuestionTags: () => QuestionsApi.getQuestionTags(),
  transformQuestion: (q: Question) => QuestionsApi.transformQuestion(q),
  transformQuestionWithDetails: (d: QuestionWithDetails) =>
    QuestionsApi.transformQuestionWithDetails(d),
};

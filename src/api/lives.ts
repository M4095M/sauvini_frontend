import { BaseApi } from "./base";
import type { ApiResponse } from "@/types/api";

// ============================================
// Types
// ============================================

export interface Live {
  id: string;
  title: string;
  description: string;
  module_id?: string;
  module_name?: string;
  chapter_id?: string;
  chapter_name?: string;
  academic_streams: string[];
  scheduled_datetime?: string;
  started_at?: string;
  ended_at?: string;
  status: LiveStatus;
  recording_url?: string;
  recording_file?: string;
  jitsi_room_name?: string; // Jitsi Meet room name
  viewer_count?: number;
  professor_id: string;
  professor_name?: string;
  created_at?: string;
  updated_at?: string;
}

export enum LiveStatus {
  Pending = "Pending", // Scheduled, awaiting admin approval
  Approved = "Approved", // Approved by admin, waiting to start
  Live = "Live", // Currently active
  Ended = "Ended", // Has ended
  Cancelled = "Cancelled", // Cancelled before start
}

export interface LiveListResponse {
  lives: Live[];
  total: number;
  page: number;
  per_page: number;
}

// Request DTOs
export interface CreateLiveRequest {
  title: string;
  description: string;
  module_id?: string;
  chapter_id?: string;
  academic_stream_ids?: string[]; // UUIDs of academic streams
  academic_streams?: string[]; // Deprecated: use academic_stream_ids instead
  scheduled_datetime: string; // ISO 8601 format
}

export interface UpdateLiveRequest {
  title?: string;
  description?: string;
  module_id?: string;
  chapter_id?: string;
  academic_streams?: string[];
  scheduled_datetime?: string;
}

export interface LiveFilters {
  status?: LiveStatus;
  academic_stream?: string;
  module_id?: string;
  chapter_id?: string;
  page?: number;
  per_page?: number;
}

// StartLiveRequest is deprecated - use liveId parameter directly
export interface StartLiveRequest {
  live_id: string; // For backward compatibility
}

export interface EndLiveRequest {
  live_id: string;
  recording_file?: File;
}

export interface EndLiveResponse {
  live: Live;
  recording_url?: string;
}

// Response DTOs
export interface CreateLiveResponse {
  live: Live;
}

// ============================================
// API Client
// ============================================

class LivesApi extends BaseApi {
  // Live management
  static async getLives(
    filters: LiveFilters = {}
  ): Promise<ApiResponse<LiveListResponse>> {
    const params = new URLSearchParams();

    if (filters.status) params.append("status", filters.status);
    if (filters.academic_stream)
      params.append("academic_stream", filters.academic_stream);
    if (filters.module_id) params.append("module_id", filters.module_id);
    if (filters.chapter_id) params.append("chapter_id", filters.chapter_id);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.per_page)
      params.append("per_page", filters.per_page.toString());

    const queryString = params.toString();
    const url = queryString ? `/lives?${queryString}` : "/lives";

    return this.get<LiveListResponse>(url, { requiresAuth: true });
  }

  static async getLiveById(liveId: string): Promise<ApiResponse<Live>> {
    return this.get<Live>(`/lives/${liveId}`, { requiresAuth: true });
  }

  static async createLive(
    request: CreateLiveRequest
  ): Promise<ApiResponse<CreateLiveResponse>> {
    return this.post<CreateLiveResponse>("/lives", request, {
      requiresAuth: true,
    });
  }

  static async updateLive(
    liveId: string,
    request: UpdateLiveRequest
  ): Promise<ApiResponse<Live>> {
    return this.put<Live>(`/lives/${liveId}`, request, {
      requiresAuth: true,
    });
  }

  static async cancelLive(
    liveId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return this.post<{ success: boolean }>(
      `/lives/${liveId}/cancel`,
      {},
      { requiresAuth: true }
    );
  }

  static async startLive(liveId: string): Promise<ApiResponse<Live>> {
    return this.post<Live>(
      `/lives/${liveId}/start`,
      {},
      { requiresAuth: true }
    );
  }

  static async endLive(
    liveId: string,
    recordingFile?: File
  ): Promise<ApiResponse<EndLiveResponse>> {
    const formData = new FormData();
    if (recordingFile) {
      formData.append("recording", recordingFile);
    }

    return this.post<EndLiveResponse>(`/lives/${liveId}/end`, formData, {
      requiresAuth: true,
    });
  }

  static async getScheduledLives(
    filters?: Omit<LiveFilters, "status">
  ): Promise<ApiResponse<LiveListResponse>> {
    return this.getLives({ ...filters, status: LiveStatus.Pending });
  }

  static async getRecordedLives(
    filters?: Omit<LiveFilters, "status">
  ): Promise<ApiResponse<LiveListResponse>> {
    return this.getLives({ ...filters, status: LiveStatus.Ended });
  }

  // Helper methods
  static transformLive(live: Live): Live {
    return {
      ...live,
      id: live.id?.replace("Live:", "") || live.id,
    };
  }
}

export const livesApi = {
  getLives: (filters?: LiveFilters) => LivesApi.getLives(filters),
  getLiveById: (liveId: string) => LivesApi.getLiveById(liveId),
  createLive: (request: CreateLiveRequest) => LivesApi.createLive(request),
  updateLive: (liveId: string, request: UpdateLiveRequest) =>
    LivesApi.updateLive(liveId, request),
  cancelLive: (liveId: string) => LivesApi.cancelLive(liveId),
  startLive: (liveId: string) => LivesApi.startLive(liveId),
  endLive: (liveId: string, recordingFile?: File) =>
    LivesApi.endLive(liveId, recordingFile),
  getScheduledLives: (filters?: Omit<LiveFilters, "status">) =>
    LivesApi.getScheduledLives(filters),
  getRecordedLives: (filters?: Omit<LiveFilters, "status">) =>
    LivesApi.getRecordedLives(filters),
  transformLive: (live: Live) => LivesApi.transformLive(live),
};

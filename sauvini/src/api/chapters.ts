import { BaseApi } from "./base";
import type { ApiResponse } from "@/types/api";

/**
 * Backend Chapter structure from the API
 */
export interface BackendChapter {
  id: {
    tb: string;
    id: {
      String: string;
    };
  };
  name: string;
  description: string;
}

/**
 * Backend Chapter with Module and Stream structure
 */
export interface BackendChapterWithModuleAndStream {
  id: {
    tb: string;
    id: {
      String: string;
    };
  };
  name: string;
  description: string;
  module: {
    id: {
      tb: string;
      id: {
        String: string;
      };
    };
    name: string;
    description: string;
    image_path: string | null;
    color: string;
    created_at: string | null;
    updated_at: string | null;
  };
  academic_stream: {
    id: {
      tb: string;
      id: {
        String: string;
      };
    };
    name: string;
    description: string | null;
  };
}

/**
 * Frontend Chapter structure (compatible with existing components)
 */
export interface FrontendChapter {
  id: string;
  title: string;
  description: string;
  image: string;
  moduleId: string;
  lessons: any[]; // Will be populated separately
  prerequisites: string[];
  price: number;
  isPurchased: boolean;
  isCompleted: boolean;
  isUnlocked: boolean;
  order: number;
  academicStreams: string[];
  totalLessons: number;
  completedLessons: number;
}

/**
 * Create Chapter Request
 */
export interface CreateChapterRequest {
  name: string;
  description: string;
}

/**
 * ChaptersApi class handles all chapter-related API calls
 */
export class ChaptersApi extends BaseApi {
  /**
   * Get chapter by ID
   * @param chapterId - The ID of the chapter to fetch
   * @returns Promise resolving to chapter details
   */
  static async getChapterById(
    chapterId: string
  ): Promise<ApiResponse<BackendChapter>> {
    try {
      return await this.get<BackendChapter>(`/chapters/${chapterId}`, {
        requiresAuth: false, // Public endpoint
      });
    } catch (error) {
      console.error(`Failed to fetch chapter ${chapterId}:`, error);
      throw error;
    }
  }

  /**
   * Get chapter with module and stream by ID
   * @param chapterId - The ID of the chapter to fetch
   * @returns Promise resolving to chapter with module and stream details
   */
  static async getChapterWithModuleAndStream(
    chapterId: string
  ): Promise<ApiResponse<BackendChapterWithModuleAndStream>> {
    try {
      return await this.get<BackendChapterWithModuleAndStream>(
        `/chapters/${chapterId}`,
        {
          requiresAuth: false,
        }
      );
    } catch (error) {
      console.error(
        `Failed to fetch chapter with module and stream ${chapterId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Create a new chapter
   * @param chapterData - Chapter data to create
   * @returns Promise resolving to created chapter
   */
  static async createChapter(
    chapterData: CreateChapterRequest
  ): Promise<ApiResponse<BackendChapter>> {
    try {
      return await this.post<BackendChapter>("/chapter", chapterData, {
        requiresAuth: true, // Requires authentication
      });
    } catch (error) {
      console.error("Failed to create chapter:", error);
      throw error;
    }
  }

  /**
   * Update a chapter
   * @param chapterId - The ID of the chapter to update
   * @param chapterData - Updated chapter data
   * @returns Promise resolving to updated chapter
   */
  static async updateChapter(
    chapterId: string,
    chapterData: Partial<CreateChapterRequest>
  ): Promise<ApiResponse<BackendChapter>> {
    try {
      return await this.put<BackendChapter>(
        `/chapter/${chapterId}`,
        chapterData,
        {
          requiresAuth: true,
        }
      );
    } catch (error) {
      console.error(`Failed to update chapter ${chapterId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a chapter
   * @param chapterId - The ID of the chapter to delete
   * @returns Promise resolving to success status
   */
  static async deleteChapter(
    chapterId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    try {
      return await this.delete<{ success: boolean }>(`/chapter/${chapterId}`, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error(`Failed to delete chapter ${chapterId}:`, error);
      throw error;
    }
  }

  /**
   * Add module to chapter
   * @param chapterId - The ID of the chapter
   * @param moduleId - The ID of the module to add
   * @returns Promise resolving to success status
   */
  static async addModuleToChapter(
    chapterId: string,
    moduleId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    try {
      return await this.post<{ success: boolean }>(
        `/chapter/${chapterId}/add-module/${moduleId}`,
        {},
        {
          requiresAuth: true,
        }
      );
    } catch (error) {
      console.error(
        `Failed to add module ${moduleId} to chapter ${chapterId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Add academic stream to chapter
   * @param chapterId - The ID of the chapter
   * @param streamId - The ID of the academic stream to add
   * @returns Promise resolving to success status
   */
  static async addStreamToChapter(
    chapterId: string,
    streamId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    try {
      return await this.post<{ success: boolean }>(
        `/chapter/${chapterId}/add-stream/${streamId}`,
        {},
        {
          requiresAuth: true,
        }
      );
    } catch (error) {
      console.error(
        `Failed to add stream ${streamId} to chapter ${chapterId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Transform backend chapter to frontend chapter format
   * @param backendChapter - Backend chapter data
   * @returns Frontend chapter format
   */
  static transformChapter(backendChapter: BackendChapter): FrontendChapter {
    return {
      id: backendChapter.id.id.String,
      title: backendChapter.name,
      description: backendChapter.description,
      image: "/placeholder.svg", // Default image
      moduleId: "", // Will be populated when module is loaded
      lessons: [], // Will be populated separately
      prerequisites: [], // Will be populated from backend
      price: 0, // Will be populated from backend
      isPurchased: false, // Will be populated from user data
      isCompleted: false, // Will be populated from user progress
      isUnlocked: true, // All chapters are unlocked for now
      order: 0, // Will be populated from backend
      academicStreams: [], // Will be populated when streams are loaded
      totalLessons: 0, // Will be populated when lessons are loaded
      completedLessons: 0, // Will be populated from user progress
    };
  }

  /**
   * Transform backend chapter with module and stream to frontend format
   * @param backendChapter - Backend chapter with module and stream data
   * @returns Frontend chapter format
   */
  static transformChapterWithModuleAndStream(
    backendChapter: BackendChapterWithModuleAndStream
  ): FrontendChapter {
    return {
      id: backendChapter.id.id.String,
      title: backendChapter.name,
      description: backendChapter.description,
      image: backendChapter.module.image_path || "/placeholder.svg",
      moduleId: backendChapter.module.id.id.String,
      lessons: [], // Will be populated separately
      prerequisites: [], // Will be populated from backend
      price: 0, // Will be populated from backend
      isPurchased: false, // Will be populated from user data
      isCompleted: false, // Will be populated from user progress
      isUnlocked: true, // All chapters are unlocked for now
      order: 0, // Will be populated from backend
      academicStreams: [backendChapter.academic_stream.name], // From the academic stream
      totalLessons: 0, // Will be populated when lessons are loaded
      completedLessons: 0, // Will be populated from user progress
    };
  }
}


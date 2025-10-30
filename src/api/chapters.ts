import { BaseApi } from "./base";
import type { ApiResponse } from "@/types/api";

/**
 * Backend Chapter structure from the API
 */
export interface BackendChapter {
  id: string; // Backend returns simple string ID
  name: string;
  description: string;
  price: string; // Backend returns price as string
  module: string; // Module ID as string
  academic_streams?: Array<{
    id: string;
    name: string;
    name_ar: string;
  }>; // Academic streams assigned to this chapter
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
  price: number; // Price in DZD (Algerian Dinar)
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
  module_id?: {
    tb: string;
    id: {
      String: string;
    };
  };
  price: number; // Price in DZD (Algerian Dinar)
  academic_streams?: string[]; // Array of academic stream IDs
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
      // Clean the chapter ID (remove "Chapter:" prefix if present)
      const cleanChapterId = chapterId.startsWith("Chapter:")
        ? chapterId.replace("Chapter:", "")
        : chapterId;

      return await this.get<BackendChapter>(
        `/courses/chapter/${cleanChapterId}`,
        {
          requiresAuth: false, // Public endpoint
        }
      );
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
  ): Promise<ApiResponse<BackendChapter>> {
    try {
      // Clean the chapter ID (remove "Chapter:" prefix if present)
      const cleanChapterId = chapterId.startsWith("Chapter:")
        ? chapterId.replace("Chapter:", "")
        : chapterId;

      // Use the same endpoint as getChapterById since the backend already includes module and stream data
      return await this.get<BackendChapter>(
        `/courses/chapter/${cleanChapterId}`,
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
   * Get chapters by module ID
   * @param moduleId - The ID of the module to fetch chapters for
   * @returns Promise resolving to array of frontend chapters with lessons count
   */
  static async getChaptersByModule(
    moduleId: string
  ): Promise<ApiResponse<FrontendChapter[]>> {
    try {
      // Django backend expects just the UUID, not the "Module:" prefix
      const cleanModuleId = moduleId.startsWith("Module:")
        ? moduleId.replace("Module:", "")
        : moduleId;

      const response = await this.get<BackendChapter[]>(
        `/courses/module/${cleanModuleId}/chapters`,
        {
          requiresAuth: false, // Public endpoint
        }
      );

      if (!response.success || !response.data) {
        return {
          success: false,
          data: null,
          message: response.message || "Failed to fetch chapters",
          request_id: response.request_id,
          timestamp: response.timestamp,
        };
      }

      // Transform backend chapters to frontend format with lessons count
      const frontendChapters = await this.transformChaptersWithLessonsCount(
        response.data
      );

      return {
        success: true,
        data: frontendChapters,
        message: "Chapters fetched successfully",
        request_id: response.request_id,
        timestamp: response.timestamp,
      };
    } catch (error) {
      console.error(`Failed to fetch chapters for module ${moduleId}:`, error);
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
   * Update an existing chapter (full chapter object)
   * @param chapterData - The complete chapter data to update
   * @returns Promise resolving to void
   */
  static async updateChapterFull(
    chapterData: BackendChapter
  ): Promise<ApiResponse<void>> {
    try {
      return await this.put<void>("/chapter", chapterData, {
        requiresAuth: true, // Requires authentication
      });
    } catch (error) {
      console.error("Failed to update chapter:", error);
      throw error;
    }
  }

  /**
   * Update a chapter with all related data (comprehensive update)
   * @param chapterData - The complete frontend chapter data to update
   * @returns Promise resolving to void
   */
  static async updateChapterComprehensive(
    chapterData: FrontendChapter
  ): Promise<ApiResponse<void>> {
    try {
      // Convert frontend chapter to backend format with all related data
      const backendData = {
        id: {
          tb: "Chapter",
          id: {
            String: chapterData.id,
          },
        },
        name: chapterData.title,
        description: chapterData.description,
        module_id: {
          tb: "Module",
          id: {
            String: chapterData.moduleId,
          },
        },
        // Include related data that will be handled by separate endpoints
        academic_streams: chapterData.academicStreams,
        prerequisites: chapterData.prerequisites,
        lessons: chapterData.lessons,
        price: chapterData.price,
        order: chapterData.order,
        is_unlocked: chapterData.isUnlocked,
      };

      console.log("Sending comprehensive chapter update:", backendData);

      return await this.put<void>("/chapter", backendData, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error("Failed to update chapter comprehensively:", error);
      throw error;
    }
  }

  /**
   * Update a chapter (partial update by ID)
   * @param chapterId - The ID of the chapter to update
   * @param chapterData - Updated chapter data (partial)
   * @returns Promise resolving to updated chapter
   */
  static async updateChapter(
    chapterId: string,
    chapterData: Partial<CreateChapterRequest>
  ): Promise<ApiResponse<void>> {
    try {
      // Clean the chapter ID (remove "Chapter:" prefix if present)
      const cleanChapterId = chapterId.startsWith("Chapter:")
        ? chapterId.replace("Chapter:", "")
        : chapterId;

      // Prepare the update data
      const updateData: any = {};
      if (chapterData.name !== undefined) updateData.name = chapterData.name;
      if (chapterData.description !== undefined)
        updateData.description = chapterData.description;
      if (chapterData.price !== undefined) updateData.price = chapterData.price;
      if (chapterData.academic_streams !== undefined)
        updateData.academic_streams = chapterData.academic_streams;

      // Update the chapter
      return await this.put<void>(
        `/courses/chapter/${cleanChapterId}/update`,
        updateData,
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
      return await this.delete<{ success: boolean }>(
        `/courses/chapter/${chapterId}`,
        {
          requiresAuth: true,
        }
      );
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
        `/courses/chapter/${chapterId}/add-module/${moduleId}`,
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
        `/courses/chapter/${chapterId}/add-stream/${streamId}`,
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
   * @param moduleId - Optional module ID to include
   * @returns Frontend chapter format
   */
  static transformChapter(
    backendChapter: BackendChapter,
    moduleId?: string
  ): FrontendChapter {
    return {
      id: backendChapter.id, // Backend returns simple string ID
      title: backendChapter.name,
      description: backendChapter.description,
      image: "/placeholder.svg", // Default image
      moduleId: moduleId || backendChapter.module || "", // Use provided module ID or backend module ID
      lessons: [], // Will be populated separately
      prerequisites: [], // Will be populated from backend
      price: parseFloat(backendChapter.price) || 0, // Convert string price to number
      isPurchased: false, // Will be populated from user data
      isCompleted: false, // Will be populated from user progress
      isUnlocked: true, // All chapters are unlocked for now
      order: 0, // Will be populated from backend
      academicStreams:
        backendChapter.academic_streams?.map((stream) => stream.id) || [], // Use actual academic streams from backend
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
      price: backendChapter.price || 0, // Use actual price from backend
      isPurchased: false, // Will be populated from user data
      isCompleted: false, // Will be populated from user progress
      isUnlocked: true, // All chapters are unlocked for now
      order: 0, // Will be populated from backend
      academicStreams: [backendChapter.academic_stream.name], // From the academic stream
      totalLessons: 0, // Will be populated when lessons are loaded
      completedLessons: 0, // Will be populated from user progress
    };
  }

  /**
   * Transform backend chapter with lessons count
   * @param backendChapter - Backend chapter data
   * @returns Frontend chapter format with lessons count
   */
  static async transformChapterWithLessonsCount(
    backendChapter: BackendChapter
  ): Promise<FrontendChapter> {
    const baseChapter = this.transformChapter(backendChapter);

    try {
      // Fetch lessons count for this chapter
      const lessonsResponse = await this.get(
        `/courses/chapter/${backendChapter.id}/lessons`,
        {
          requiresAuth: false,
        }
      );
      const lessonsCount = Array.isArray(lessonsResponse.data)
        ? lessonsResponse.data.length
        : 0;

      return {
        ...baseChapter,
        totalLessons: lessonsCount,
      };
    } catch (error) {
      console.warn(
        `Failed to fetch lessons count for chapter ${backendChapter.id}:`,
        error
      );
      return baseChapter; // Return with totalLessons: 0
    }
  }

  /**
   * Transform multiple backend chapters with lessons count
   * @param backendChapters - Array of backend chapter data
   * @returns Array of frontend chapter format with lessons count
   */
  static async transformChaptersWithLessonsCount(
    backendChapters: BackendChapter[]
  ): Promise<FrontendChapter[]> {
    return Promise.all(
      backendChapters.map((chapter) =>
        this.transformChapterWithLessonsCount(chapter)
      )
    );
  }
}

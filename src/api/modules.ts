import { BaseApi } from "./base";
import type { ApiResponse } from "@/types/api";

/**
 * Backend Module structure from the API
 */
export interface BackendModule {
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
}

/**
 * Frontend Module structure (compatible with existing components)
 */
export interface FrontendModule {
  id: string;
  name: string;
  description: string;
  illustration: string;
  color: string;
  totalLessons: number;
  completedLessons: number;
  lessonsCount: number;
  isUnlocked: boolean;
  hasPurchasedChapters: boolean;
  academicStreams: string[];
  chapters: any[]; // Will be populated separately
}

/**
 * ModulesApi class handles all module-related API calls
 */
export class ModulesApi extends BaseApi {
  /**
   * Get all available modules
   * @returns Promise resolving to array of modules
   */
  static async getAllModules(): Promise<ApiResponse<BackendModule[]>> {
    try {
      return await this.get<BackendModule[]>("/courses/module", {
        requiresAuth: false, // Public endpoint
      });
    } catch (error) {
      console.error("Failed to fetch modules:", error);
      throw error;
    }
  }

  /**
   * Get module by ID
   * @param moduleId - The ID of the module to fetch (just the ID part, not the full record ID)
   * @returns Promise resolving to module details
   */
  static async getModuleById(
    moduleId: string
  ): Promise<ApiResponse<BackendModule>> {
    try {
      // Django backend expects just the UUID, not the "Module:" prefix
      const cleanModuleId = moduleId.startsWith("Module:")
        ? moduleId.replace("Module:", "")
        : moduleId;
      return await this.get<BackendModule>(`/courses/module/${cleanModuleId}`, {
        requiresAuth: false,
      });
    } catch (error) {
      console.error(`Failed to fetch module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Get modules with academic streams
   * @returns Promise resolving to modules with academic streams
   */
  static async getModulesWithAcademicStreams(): Promise<ApiResponse<any[]>> {
    try {
      return await this.get<any[]>("/courses/module/with-academic-streams", {
        requiresAuth: false,
      });
    } catch (error) {
      console.error("Failed to fetch modules with academic streams:", error);
      throw error;
    }
  }

  /**
   * Transform backend module to frontend module format
   * @param backendModule - Backend module data
   * @returns Frontend module format
   */
  static transformModule(backendModule: BackendModule): FrontendModule {
    // Handle both old Rust backend structure (with nested id) and Django structure (simple UUID string)
    let moduleId: string;
    if (typeof backendModule.id === "string") {
      // Django backend returns simple UUID string
      moduleId = backendModule.id;
    } else if (
      backendModule.id &&
      typeof backendModule.id === "object" &&
      "id" in backendModule.id
    ) {
      // Rust backend returns nested structure
      moduleId =
        (backendModule.id as any).id?.String ||
        (backendModule.id as any).id ||
        String(backendModule.id);
    } else {
      moduleId = String(backendModule.id);
    }

    return {
      id: moduleId,
      name: backendModule.name,
      description: backendModule.description,
      illustration: backendModule.image_path || "/placeholder.svg",
      color: backendModule.color,
      totalLessons: 0, // Will be populated when chapters are loaded
      completedLessons: 0, // Will be populated from user progress
      lessonsCount: 0, // Will be populated when chapters are loaded
      isUnlocked: true, // All modules are unlocked for now
      hasPurchasedChapters: false, // Will be populated from user data
      academicStreams:
        backendModule.academic_streams?.map((stream) =>
          typeof stream === "string" ? stream : stream.name_ar || stream.name
        ) || [], // Map academic streams
      chapters: [], // Will be populated separately
    };
  }

  /**
   * Get modules in frontend format with chapters
   * @returns Promise resolving to frontend modules
   */
  static async getModulesForFrontend(): Promise<ApiResponse<FrontendModule[]>> {
    try {
      const response = await this.getAllModules();

      if (!response.success || !response.data) {
        return {
          success: false,
          data: null,
          message: response.message || "Failed to fetch modules",
          request_id: response.request_id,
          timestamp: response.timestamp,
        };
      }

      // Transform modules and fetch chapters for each
      const frontendModules = await Promise.all(
        response.data.map(async (module) => {
          const transformedModule = this.transformModule(module);

          try {
            // Fetch chapters for this module
            const moduleId = module.id;
            const chaptersResponse = await this.get<any[]>(
              `/courses/module/${moduleId}/chapters`,
              { requiresAuth: false }
            );

            if (chaptersResponse.success && chaptersResponse.data) {
              transformedModule.chapters = chaptersResponse.data;
              transformedModule.totalLessons = chaptersResponse.data.length;
              transformedModule.lessonsCount = chaptersResponse.data.length;
            }
          } catch (error) {
            console.warn(
              `Failed to fetch chapters for module ${module.id}:`,
              error
            );
            // Continue with empty chapters
          }

          return transformedModule;
        })
      );

      return {
        success: true,
        data: frontendModules,
        message: "Modules fetched successfully",
        request_id: response.request_id,
        timestamp: response.timestamp,
      };
    } catch (error) {
      console.error("Failed to fetch modules for frontend:", error);
      throw error;
    }
  }

  /**
   * Create a new module
   * @param moduleData - Module data to create
   * @param imageFile - Optional module image file
   * @returns Promise resolving to created module
   */
  static async createModule(
    moduleData: {
      name: string;
      description: string;
      color: string;
      custom_id?: string;
    },
    imageFile?: File
  ): Promise<ApiResponse<BackendModule>> {
    try {
      const formData = new FormData();
      formData.append("module", JSON.stringify(moduleData));

      if (imageFile) {
        formData.append("module_image", imageFile);
      }

      return await this.post<BackendModule>("/courses/module", formData, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error("Failed to create module:", error);
      throw error;
    }
  }
}

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
      return await this.get<BackendModule[]>("/module", {
        requiresAuth: false, // Public endpoint
      });
    } catch (error) {
      console.error("Failed to fetch modules:", error);
      throw error;
    }
  }

  /**
   * Get module by ID
   * @param moduleId - The ID of the module to fetch
   * @returns Promise resolving to module details
   */
  static async getModuleById(
    moduleId: string
  ): Promise<ApiResponse<BackendModule>> {
    try {
      return await this.get<BackendModule>(`/module/${moduleId}`, {
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
      return await this.get<any[]>("/module/with-academic-streams", {
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
    return {
      id: backendModule.id.id.String,
      name: backendModule.name,
      description: backendModule.description,
      illustration: backendModule.image_path || "/placeholder.svg",
      color: backendModule.color,
      totalLessons: 0, // Will be populated when chapters are loaded
      completedLessons: 0, // Will be populated from user progress
      isUnlocked: true, // All modules are unlocked for now
      hasPurchasedChapters: false, // Will be populated from user data
      academicStreams: [], // Will be populated when academic streams are loaded
      chapters: [], // Will be populated separately
    };
  }

  /**
   * Get modules in frontend format
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

      const frontendModules = response.data.map((module) =>
        this.transformModule(module)
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
}


import { BaseApi } from "./base";
import type { ApiResponse } from "@/types/api";

/**
 * Backend Academic Stream structure from the API
 */
export interface BackendAcademicStream {
  id: string; // Backend returns simple string ID
  name: string;
  name_ar: string;
}

/**
 * Frontend Academic Stream structure
 */
export interface FrontendAcademicStream {
  id: string;
  name: string;
  name_ar: string;
  value: string; // For form compatibility
  labelKey: string; // For translation compatibility
}

/**
 * AcademicStreamsApi class handles all academic stream-related API calls
 */
export class AcademicStreamsApi extends BaseApi {
  /**
   * Get all available academic streams
   * @returns Promise resolving to array of academic streams
   */
  static async getAllAcademicStreams(): Promise<
    ApiResponse<BackendAcademicStream[]>
  > {
    try {
      return await this.get<BackendAcademicStream[]>(
        "/courses/academic-streams",
        {
          requiresAuth: false, // Public endpoint
        }
      );
    } catch (error) {
      console.error("Failed to fetch academic streams:", error);
      throw error;
    }
  }

  /**
   * Get academic stream by name
   * @param name - The name of the academic stream to fetch
   * @returns Promise resolving to academic stream details
   */
  static async getAcademicStreamByName(
    name: string
  ): Promise<ApiResponse<BackendAcademicStream>> {
    try {
      return await this.get<BackendAcademicStream>(
        `/courses/academic-stream/${name}`,
        {
          requiresAuth: false,
        }
      );
    } catch (error) {
      console.error(`Failed to fetch academic stream ${name}:`, error);
      throw error;
    }
  }

  /**
   * Transform backend academic stream to frontend format
   * @param backendStream - Backend academic stream data
   * @returns Frontend academic stream format
   */
  static transformAcademicStream(
    backendStream: BackendAcademicStream
  ): FrontendAcademicStream {
    return {
      id: backendStream.id, // Backend returns simple string ID
      name: backendStream.name,
      name_ar: backendStream.name_ar,
      value: backendStream.name.toLowerCase().replace(/[^a-z0-9]/g, ""),
      labelKey: backendStream.name, // Use the actual name with proper capitalization and spaces
    };
  }

  /**
   * Get academic streams in frontend format
   * @returns Promise resolving to frontend academic streams
   */
  static async getAcademicStreamsForFrontend(): Promise<
    ApiResponse<FrontendAcademicStream[]>
  > {
    try {
      const response = await this.getAllAcademicStreams();

      if (!response.success || !response.data) {
        return {
          success: false,
          data: null,
          message: response.message || "Failed to fetch academic streams",
          request_id: response.request_id,
          timestamp: response.timestamp,
        };
      }

      const frontendStreams = response.data.map((stream) =>
        this.transformAcademicStream(stream)
      );

      return {
        success: true,
        data: frontendStreams,
        message: "Academic streams fetched successfully",
        request_id: response.request_id,
        timestamp: response.timestamp,
      };
    } catch (error) {
      console.error("Failed to fetch academic streams for frontend:", error);
      throw error;
    }
  }
}

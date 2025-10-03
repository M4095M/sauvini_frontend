import { BaseApi } from './base';
import type { ApiResponse } from '@/types/api';

/**
 * Module types
 */
export interface Module {
  id: string;
  name: string;
  description: string;
  image_path?: string;
  chaptersCount: number;
  lessonsCount: number;
  isCompleted?: boolean;
  progress?: number; // 0-100
  professorId?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateModuleData {
  title: string;
  description: string;
  imageUrl?: string;
  professorId?: string;
}

export interface UpdateModuleData {
  title?: string;
  description?: string;
  imageUrl?: string;
  professorId?: string;
}

export interface AssignModuleData {
  professorId: string;
}

/**
 * ModulesApi class handles all module management related API calls
 * 
 * Features:
 * - List all modules (public or authenticated)
 * - Get module by ID
 * - Create new modules (admin/professor)
 * - Update existing modules (admin/professor)
 * - Delete modules (admin)
 * - Assign modules to professors (admin)
 * - Automatic authentication handling via BaseApi
 */
export class ModulesApi extends BaseApi {
  
  // ===========================================
  // MODULE METHODS
  // ===========================================

  /**
   * Get all available modules
   * @param requiresAuth - Whether authentication is required (default: true)
   * @returns Promise resolving to array of modules
   */
  static async getModules(requiresAuth = true): Promise<ApiResponse<Module[]>> {
    try {
      return await this.get<Module[]>(`/module`, {
        requiresAuth: !requiresAuth,
      });
    } catch (error) {
      console.error('Failed to fetch modules:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific module
   * @param moduleId - The ID of the module to fetch
   * @param requiresAuth - Whether authentication is required (default: true)
   * @returns Promise resolving to module details
   */
  static async getModuleById(moduleId: string, requiresAuth = true): Promise<ApiResponse<Module>> {
    try {
      return await this.get<Module>(`/modules/${moduleId}`, {
        requiresAuth,
      });
    } catch (error) {
      console.error(`Failed to fetch module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new module
   * Requires authentication (admin or professor)
   * @param data - Module creation data
   * @returns Promise resolving to created module
   */
  static async createModule(data: CreateModuleData): Promise<ApiResponse<Module>> {
    try {
      return await this.post<Module>('/modules', data, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Failed to create module:', error);
      throw error;
    }
  }

  /**
   * Update an existing module
   * Requires authentication (admin or professor)
   * @param moduleId - The ID of the module to update
   * @param data - Module update data
   * @returns Promise resolving to updated module
   */
  static async updateModule(moduleId: string, data: UpdateModuleData): Promise<ApiResponse<Module>> {
    try {
      return await this.put<Module>(`/modules/${moduleId}`, data, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error(`Failed to update module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a module
   * Requires authentication (admin only)
   * @param moduleId - The ID of the module to delete
   * @returns Promise resolving to success response
   */
  static async deleteModule(moduleId: string): Promise<ApiResponse<void>> {
    try {
      return await this.delete<void>(`/modules/${moduleId}`, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error(`Failed to delete module ${moduleId}:`, error);
      throw error;
    }
  }

  // ===========================================
  // PROFESSOR MODULE METHODS
  // ===========================================

  /**
   * Get all modules assigned to a specific professor
   * Requires authentication
   * @param professorId - The ID of the professor
   * @returns Promise resolving to array of modules
   */
  static async getProfessorModules(professorId: string): Promise<ApiResponse<Module[]>> {
    try {
      return await this.get<Module[]>(`/professor/${professorId}/modules`, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error(`Failed to fetch modules for professor ${professorId}:`, error);
      throw error;
    }
  }

  /**
   * Assign a module to a professor
   * Requires authentication (admin only)
   * @param moduleId - The ID of the module to assign
   * @param data - Assignment data containing professorId
   * @returns Promise resolving to success response
   */
  static async assignModuleToProfessor(moduleId: string, data: AssignModuleData): Promise<ApiResponse<void>> {
    try {
      return await this.post<void>(`/modules/${moduleId}/assign`, data, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error(`Failed to assign module ${moduleId}:`, error);
      throw error;
    }
  }
}

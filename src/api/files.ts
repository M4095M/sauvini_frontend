/**
 * Secure File Management API Client
 * Handles secure file upload, access, and management
 */

import { BaseApi } from "./base";
import type { ApiResponse } from "@/types/api";

export interface FileAccessResponse {
  file_id: string;
  file_name: string;
  file_type: "video" | "pdf" | "document" | "image" | "audio";
  file_size: number;
  signed_url: string;
  expires_in: number;
  access_type: "read" | "download" | "stream";
}

export interface FileInfo {
  file_id: string;
  file_name: string;
  file_type: "video" | "pdf" | "document" | "image" | "audio";
  file_size: number;
  access_level: "public" | "student" | "professor" | "admin";
  checksum: string;
}

export interface UploadSession {
  upload_session_id: string;
  upload_token: string;
  upload_url: string;
  expires_at: string;
  max_file_size: number;
}

export interface CreateUploadSessionRequest {
  file_name: string;
  file_size: number;
  file_type: "video" | "pdf" | "document" | "image" | "audio";
  mime_type: string;
  access_level?: "public" | "student" | "professor" | "admin";
  course_id?: string;
  chapter_id?: string;
  lesson_id?: string;
}

export interface FileAccessRequest {
  access_type?: "read" | "download" | "stream";
  expires_in?: number; // seconds
}

export class FilesApi extends BaseApi {
  /**
   * Request secure access to a file
   */
  static async getFileAccess(
    fileId: string,
    accessRequest?: FileAccessRequest
  ): Promise<ApiResponse<FileAccessResponse>> {
    try {
      const params = new URLSearchParams();
      if (accessRequest?.access_type) {
        params.append("access_type", accessRequest.access_type);
      }
      if (accessRequest?.expires_in) {
        params.append("expires_in", accessRequest.expires_in.toString());
      }

      const queryString = params.toString();
      const url = `/files/${fileId}/access${
        queryString ? `?${queryString}` : ""
      }`;

      return await this.get<FileAccessResponse>(url, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error(`Failed to get file access for ${fileId}:`, error);
      throw error;
    }
  }

  /**
   * Create a secure upload session
   */
  static async createUploadSession(
    request: CreateUploadSessionRequest
  ): Promise<ApiResponse<UploadSession>> {
    try {
      return await this.post<UploadSession>("/files/upload/session", request, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error("Failed to create upload session:", error);
      throw error;
    }
  }

  /**
   * Upload file using secure token
   */
  static async uploadFile(
    uploadToken: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<FileInfo>> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Use the base URL from the parent class
      const response = await fetch(
        `${this.baseURL}/files/upload/${uploadToken}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.getTokens()?.access_token || ""}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to upload file:", error);
      throw error;
    }
  }

  /**
   * List user's uploaded files
   */
  static async listUserFiles(): Promise<ApiResponse<FileInfo[]>> {
    try {
      return await this.get<FileInfo[]>("/files/my-files", {
        requiresAuth: true,
      });
    } catch (error) {
      console.error("Failed to list user files:", error);
      throw error;
    }
  }

  /**
   * Delete a file (soft delete)
   */
  static async deleteFile(fileId: string): Promise<ApiResponse<void>> {
    try {
      return await this.delete<void>(`/files/${fileId}`, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error(`Failed to delete file ${fileId}:`, error);
      throw error;
    }
  }

  /**
   * Get file info without requesting access
   */
  static async getFileInfo(fileId: string): Promise<ApiResponse<FileInfo>> {
    try {
      return await this.get<FileInfo>(`/files/${fileId}/info`, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error(`Failed to get file info for ${fileId}:`, error);
      throw error;
    }
  }
}

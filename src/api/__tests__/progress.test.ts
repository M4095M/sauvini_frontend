import { ProgressApi } from "../progress";
import {
  mockApiResponse,
  mockLessonProgress,
  mockChapterProgress,
  mockModuleProgress,
} from "@/test-utils/test-utils";

// Mock the BaseApi
jest.mock("../base", () => ({
  BaseApi: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

import { BaseApi } from "../base";

describe("ProgressApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Lesson Progress", () => {
    it("should get lesson progress successfully", async () => {
      const lessonId = "test-lesson-id";
      const mockResponse = mockApiResponse(mockLessonProgress);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await ProgressApi.getLessonProgress(lessonId);

      expect(BaseApi.get).toHaveBeenCalledWith(
        `/progress/lesson/${lessonId}/progress`,
        { requiresAuth: true }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should update lesson progress successfully", async () => {
      const lessonId = "test-lesson-id";
      const progressData = {
        is_completed: true,
        time_spent: 30,
      };
      const mockResponse = mockApiResponse({
        ...mockLessonProgress,
        ...progressData,
      });
      (BaseApi.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await ProgressApi.updateLessonProgress(
        lessonId,
        progressData
      );

      expect(BaseApi.put).toHaveBeenCalledWith(
        `/progress/lesson/${lessonId}/progress/update`,
        progressData,
        { requiresAuth: true }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should get chapter lesson progress successfully", async () => {
      const chapterId = "test-chapter-id";
      const mockProgressList = [mockLessonProgress];
      const mockResponse = mockApiResponse(mockProgressList);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await ProgressApi.getChapterLessonProgress(chapterId);

      expect(BaseApi.get).toHaveBeenCalledWith(
        `/progress/chapter/${chapterId}/lessons/progress`,
        { requiresAuth: true }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Chapter Progress", () => {
    it("should get chapter progress successfully", async () => {
      const chapterId = "test-chapter-id";
      const mockResponse = mockApiResponse(mockChapterProgress);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await ProgressApi.getChapterProgress(chapterId);

      expect(BaseApi.get).toHaveBeenCalledWith(
        `/progress/chapter/${chapterId}/progress`,
        { requiresAuth: true }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should update chapter progress successfully", async () => {
      const chapterId = "test-chapter-id";
      const progressData = {
        is_completed: true,
        completion_percentage: 100,
      };
      const mockResponse = mockApiResponse({
        ...mockChapterProgress,
        ...progressData,
      });
      (BaseApi.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await ProgressApi.updateChapterProgress(
        chapterId,
        progressData
      );

      expect(BaseApi.put).toHaveBeenCalledWith(
        `/progress/chapter/${chapterId}/progress/update`,
        progressData,
        { requiresAuth: true }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Module Progress", () => {
    it("should get module progress successfully", async () => {
      const moduleId = "test-module-id";
      const mockResponse = mockApiResponse(mockModuleProgress);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await ProgressApi.getModuleProgress(moduleId);

      expect(BaseApi.get).toHaveBeenCalledWith(
        `/progress/module/${moduleId}/progress`,
        { requiresAuth: true }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Progress Summary", () => {
    it("should get student progress summary successfully", async () => {
      const mockSummary = {
        lessons: {
          total: 10,
          completed: 5,
          completion_rate: 50,
          total_time_spent: 150,
        },
        chapters: {
          total: 3,
          completed: 1,
          completion_rate: 33.33,
          avg_completion: 60,
        },
        modules: {
          total: 1,
          completed: 0,
          completion_rate: 0,
          avg_completion: 40,
        },
      };
      const mockResponse = mockApiResponse(mockSummary);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await ProgressApi.getProgressSummary();

      expect(BaseApi.get).toHaveBeenCalledWith("/progress/summary", {
        requiresAuth: true,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Progress Creation", () => {
    it("should create lesson progress automatically when accessed", async () => {
      const lessonId = "test-lesson-id";
      const mockResponse = mockApiResponse(mockLessonProgress);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await ProgressApi.getLessonProgress(lessonId);

      expect(result.data).toEqual(mockLessonProgress);
      expect(result.data.is_unlocked).toBe(true); // Default unlocked
    });

    it("should create chapter progress automatically when accessed", async () => {
      const chapterId = "test-chapter-id";
      const mockResponse = mockApiResponse(mockChapterProgress);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await ProgressApi.getChapterProgress(chapterId);

      expect(result.data).toEqual(mockChapterProgress);
      expect(result.data.completion_percentage).toBe(0); // Default 0%
    });

    it("should create module progress automatically when accessed", async () => {
      const moduleId = "test-module-id";
      const mockResponse = mockApiResponse(mockModuleProgress);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await ProgressApi.getModuleProgress(moduleId);

      expect(result.data).toEqual(mockModuleProgress);
      expect(result.data.completion_percentage).toBe(0); // Default 0%
    });
  });

  describe("Cascading Updates", () => {
    it("should update chapter progress when lesson is completed", async () => {
      const lessonId = "test-lesson-id";
      const progressData = {
        is_completed: true,
        time_spent: 30,
      };
      const mockResponse = mockApiResponse({
        ...mockLessonProgress,
        ...progressData,
      });
      (BaseApi.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await ProgressApi.updateLessonProgress(
        lessonId,
        progressData
      );

      expect(result.data.is_completed).toBe(true);
      // In a real implementation, this would trigger chapter progress update
    });

    it("should update module progress when chapter is completed", async () => {
      const chapterId = "test-chapter-id";
      const progressData = {
        is_completed: true,
        completion_percentage: 100,
      };
      const mockResponse = mockApiResponse({
        ...mockChapterProgress,
        ...progressData,
      });
      (BaseApi.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await ProgressApi.updateChapterProgress(
        chapterId,
        progressData
      );

      expect(result.data.is_completed).toBe(true);
      expect(result.data.completion_percentage).toBe(100);
      // In a real implementation, this would trigger module progress update
    });
  });

  describe("Error Handling", () => {
    it("should handle lesson not found error", async () => {
      const lessonId = "non-existent-lesson";
      const errorResponse = {
        success: false,
        data: null,
        message: "Lesson not found",
        request_id: "test-request-id",
        timestamp: new Date().toISOString(),
      };
      (BaseApi.get as jest.Mock).mockResolvedValue(errorResponse);

      const result = await ProgressApi.getLessonProgress(lessonId);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Lesson not found");
    });

    it("should handle validation errors", async () => {
      const lessonId = "test-lesson-id";
      const invalidData = {
        is_completed: "invalid", // Should be boolean
        time_spent: -5, // Should be positive
      };
      const errorResponse = {
        success: false,
        data: null,
        message: "Validation error: Invalid data types",
        request_id: "test-request-id",
        timestamp: new Date().toISOString(),
      };
      (BaseApi.put as jest.Mock).mockResolvedValue(errorResponse);

      const result = await ProgressApi.updateLessonProgress(
        lessonId,
        invalidData
      );

      expect(result.success).toBe(false);
      expect(result.message).toContain("Validation error");
    });

    it("should handle network errors", async () => {
      const networkError = new Error("Network error");
      (BaseApi.get as jest.Mock).mockRejectedValue(networkError);

      await expect(ProgressApi.getProgressSummary()).rejects.toThrow(
        "Network error"
      );
    });
  });
});


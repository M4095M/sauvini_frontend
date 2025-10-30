import { CoursesApi } from "../courses";
import {
  mockApiResponse,
  mockModule,
  mockChapter,
  mockLesson,
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

describe("CoursesApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Module Management", () => {
    it("should get all modules successfully", async () => {
      const mockModules = [mockModule];
      const mockResponse = mockApiResponse(mockModules);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await CoursesApi.getModules();

      expect(BaseApi.get).toHaveBeenCalledWith("/courses/module", {
        requiresAuth: false,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should get module by ID successfully", async () => {
      const moduleId = "test-module-id";
      const mockResponse = mockApiResponse(mockModule);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await CoursesApi.getModuleById(moduleId);

      expect(BaseApi.get).toHaveBeenCalledWith(`/courses/module/${moduleId}`, {
        requiresAuth: false,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Chapter Management", () => {
    it("should get chapters by module successfully", async () => {
      const moduleId = "test-module-id";
      const mockChapters = [mockChapter];
      const mockResponse = mockApiResponse(mockChapters);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await CoursesApi.getChaptersByModule(moduleId);

      expect(BaseApi.get).toHaveBeenCalledWith(
        `/courses/module/${moduleId}/chapters`,
        { requiresAuth: false }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should get chapter by ID successfully", async () => {
      const chapterId = "test-chapter-id";
      const mockResponse = mockApiResponse(mockChapter);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await CoursesApi.getChapterById(chapterId);

      expect(BaseApi.get).toHaveBeenCalledWith(
        `/courses/chapter/${chapterId}`,
        { requiresAuth: false }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Lesson Management", () => {
    it("should get lessons by chapter successfully", async () => {
      const chapterId = "test-chapter-id";
      const mockLessons = [mockLesson];
      const mockResponse = mockApiResponse(mockLessons);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await CoursesApi.getLessonsByChapter(chapterId);

      expect(BaseApi.get).toHaveBeenCalledWith(
        `/courses/chapter/${chapterId}/lessons`,
        { requiresAuth: false }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should get lesson by ID successfully", async () => {
      const lessonId = "test-lesson-id";
      const mockResponse = mockApiResponse(mockLesson);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await CoursesApi.getLessonById(lessonId);

      expect(BaseApi.get).toHaveBeenCalledWith(`/courses/lesson/${lessonId}`, {
        requiresAuth: false,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Enrollment Management", () => {
    it("should enroll in module successfully", async () => {
      const moduleId = "test-module-id";
      const mockEnrollment = {
        id: "enrollment-1",
        module: mockModule,
        student_name: "Test Student",
        enrolled_at: "2025-01-01T00:00:00Z",
        is_active: true,
      };
      const mockResponse = mockApiResponse(mockEnrollment);
      (BaseApi.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await CoursesApi.enrollInModule(moduleId);

      expect(BaseApi.post).toHaveBeenCalledWith(
        `/courses/module/${moduleId}/enroll`,
        {},
        { requiresAuth: true }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should unenroll from module successfully", async () => {
      const moduleId = "test-module-id";
      const mockResponse = mockApiResponse({
        message: "Successfully unenrolled from module",
      });
      (BaseApi.delete as jest.Mock).mockResolvedValue(mockResponse);

      const result = await CoursesApi.unenrollFromModule(moduleId);

      expect(BaseApi.delete).toHaveBeenCalledWith(
        `/courses/module/${moduleId}/unenroll`,
        { requiresAuth: true }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should get enrolled modules successfully", async () => {
      const mockEnrollments = [
        {
          id: "enrollment-1",
          module: mockModule,
          student_name: "Test Student",
          enrolled_at: "2025-01-01T00:00:00Z",
          is_active: true,
        },
      ];
      const mockResponse = mockApiResponse(mockEnrollments);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await CoursesApi.getEnrolledModules();

      expect(BaseApi.get).toHaveBeenCalledWith("/courses/enrollments", {
        requiresAuth: true,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should check enrollment status successfully", async () => {
      const moduleId = "test-module-id";
      const mockStatus = {
        is_enrolled: true,
        module_id: moduleId,
      };
      const mockResponse = mockApiResponse(mockStatus);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await CoursesApi.checkEnrollmentStatus(moduleId);

      expect(BaseApi.get).toHaveBeenCalledWith(
        `/courses/module/${moduleId}/enrollment-status`,
        { requiresAuth: true }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Academic Streams", () => {
    it("should get academic streams successfully", async () => {
      const mockStreams = [
        {
          id: "stream-1",
          name: "Mathematics",
          name_ar: "الرياضيات",
        },
      ];
      const mockResponse = mockApiResponse(mockStreams);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await CoursesApi.getAcademicStreams();

      expect(BaseApi.get).toHaveBeenCalledWith("/courses/academic-streams", {
        requiresAuth: false,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Error Handling", () => {
    it("should handle module not found error", async () => {
      const moduleId = "non-existent-module";
      const errorResponse = {
        success: false,
        data: null,
        message: "Module not found",
        request_id: "test-request-id",
        timestamp: new Date().toISOString(),
      };
      (BaseApi.get as jest.Mock).mockResolvedValue(errorResponse);

      const result = await CoursesApi.getModuleById(moduleId);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Module not found");
    });

    it("should handle enrollment already exists error", async () => {
      const moduleId = "test-module-id";
      const errorResponse = {
        success: false,
        data: null,
        message: "Student is already enrolled in this module",
        request_id: "test-request-id",
        timestamp: new Date().toISOString(),
      };
      (BaseApi.post as jest.Mock).mockResolvedValue(errorResponse);

      const result = await CoursesApi.enrollInModule(moduleId);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Student is already enrolled in this module");
    });

    it("should handle network errors", async () => {
      const networkError = new Error("Network error");
      (BaseApi.get as jest.Mock).mockRejectedValue(networkError);

      await expect(CoursesApi.getModules()).rejects.toThrow("Network error");
    });
  });
});


import { StudentApi } from "../student";
import { mockApiResponse, mockStudent } from "@/test-utils/test-utils";

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

describe("StudentApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Profile Management", () => {
    it("should get student profile successfully", async () => {
      const mockResponse = mockApiResponse(mockStudent);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await StudentApi.getProfile();

      expect(BaseApi.get).toHaveBeenCalledWith("/student/profile", {
        requiresAuth: true,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should get student by ID successfully", async () => {
      const studentId = "test-student-id";
      const mockResponse = mockApiResponse(mockStudent);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await StudentApi.getStudentById(studentId);

      expect(BaseApi.get).toHaveBeenCalledWith(`/student/${studentId}`, {
        requiresAuth: false,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should update student profile successfully", async () => {
      const updateData = {
        id: "test-student-id",
        first_name: "Updated",
        last_name: "Student",
        wilaya: "Oran",
        phone_number: "0555987654",
        academic_stream: "Physics",
      };
      const mockResponse = mockApiResponse({ ...mockStudent, ...updateData });
      (BaseApi.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await StudentApi.updateProfile(updateData);

      expect(BaseApi.put).toHaveBeenCalledWith(
        "/student/profile/update",
        updateData,
        { requiresAuth: true }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should upload profile picture successfully", async () => {
      const mockFile = new File(["test"], "profile.jpg", {
        type: "image/jpeg",
      });
      const mockResponse = mockApiResponse({
        message: "Profile picture uploaded successfully",
      });
      (BaseApi.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await StudentApi.uploadProfilePicture(mockFile);

      expect(BaseApi.post).toHaveBeenCalledWith(
        "/student/profile/picture",
        expect.any(FormData),
        { requiresAuth: true }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Course Enrollment", () => {
    it("should enroll in course successfully", async () => {
      const courseId = "test-course-id";
      const mockResponse = mockApiResponse({
        enrollment_date: "2025-01-01T00:00:00Z",
        course_id: courseId,
        student_id: "test-student-id",
      });
      (BaseApi.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await StudentApi.enrollInCourse(courseId);

      expect(BaseApi.post).toHaveBeenCalledWith(
        `/student/courses/${courseId}/enroll`,
        {},
        { requiresAuth: true }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should get enrolled courses successfully", async () => {
      const mockEnrollments = [
        {
          id: "enrollment-1",
          module: {
            id: "module-1",
            name: "Mathematics",
            description: "Math module",
            image_path: "/math.jpg",
            color: "#FF5733",
          },
          enrolled_at: "2025-01-01T00:00:00Z",
          is_active: true,
        },
      ];
      const mockResponse = mockApiResponse(mockEnrollments);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await StudentApi.getEnrolledCourses();

      expect(BaseApi.get).toHaveBeenCalledWith("/student/courses/enrolled", {
        requiresAuth: true,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should unenroll from course successfully", async () => {
      const courseId = "test-course-id";
      const mockResponse = mockApiResponse({
        message: "Successfully unenrolled from course",
      });
      (BaseApi.delete as jest.Mock).mockResolvedValue(mockResponse);

      const result = await StudentApi.unenrollFromCourse(courseId);

      expect(BaseApi.delete).toHaveBeenCalledWith(
        `/student/courses/${courseId}/unenroll`,
        { requiresAuth: true }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Progress Tracking", () => {
    it("should get lesson progress successfully", async () => {
      const lessonId = "test-lesson-id";
      const mockProgress = {
        id: "progress-1",
        lesson: {
          id: lessonId,
          title: "Test Lesson",
          duration: 30,
        },
        is_completed: false,
        is_unlocked: true,
        time_spent: 15,
      };
      const mockResponse = mockApiResponse(mockProgress);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await StudentApi.getLessonProgress(lessonId);

      expect(BaseApi.get).toHaveBeenCalledWith(
        `/student/lessons/${lessonId}/progress`,
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
        message: "Progress updated successfully",
      });
      (BaseApi.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await StudentApi.updateLessonProgress(
        lessonId,
        progressData
      );

      expect(BaseApi.put).toHaveBeenCalledWith(
        `/student/lessons/${lessonId}/progress`,
        progressData,
        { requiresAuth: true }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should get progress summary successfully", async () => {
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

      const result = await StudentApi.getProgressSummary();

      expect(BaseApi.get).toHaveBeenCalledWith("/student/progress/summary", {
        requiresAuth: true,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Quiz System", () => {
    it("should get lesson quiz successfully", async () => {
      const lessonId = "test-lesson-id";
      const mockQuiz = {
        quiz: {
          id: "quiz-1",
          title: "Test Quiz",
          questions: [
            {
              id: "q1",
              question: "What is 2+2?",
              options: ["3", "4", "5", "6"],
              correct_answer: 1,
            },
          ],
          passing_score: 70,
        },
      };
      const mockResponse = mockApiResponse(mockQuiz);
      (BaseApi.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await StudentApi.getLessonQuiz(lessonId);

      expect(BaseApi.get).toHaveBeenCalledWith(
        `/student/lessons/${lessonId}/quiz`,
        { requiresAuth: true }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should submit quiz answers successfully", async () => {
      const lessonId = "test-lesson-id";
      const answers = {
        answers: { q1: 1 },
        time_spent: 120,
      };
      const mockResult = {
        score: 100,
        passed: true,
        correct_answers: { q1: 1 },
        explanations: { q1: "Correct!" },
      };
      const mockResponse = mockApiResponse(mockResult);
      (BaseApi.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await StudentApi.submitQuizAnswers(lessonId, answers);

      expect(BaseApi.post).toHaveBeenCalledWith(
        `/student/lessons/${lessonId}/quiz/submit`,
        answers,
        { requiresAuth: true }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Error Handling", () => {
    it("should handle API errors gracefully", async () => {
      const errorResponse = {
        success: false,
        data: null,
        message: "Student profile not found",
        request_id: "test-request-id",
        timestamp: new Date().toISOString(),
      };
      (BaseApi.get as jest.Mock).mockResolvedValue(errorResponse);

      const result = await StudentApi.getProfile();

      expect(result.success).toBe(false);
      expect(result.message).toBe("Student profile not found");
    });

    it("should handle network errors", async () => {
      const networkError = new Error("Network error");
      (BaseApi.get as jest.Mock).mockRejectedValue(networkError);

      await expect(StudentApi.getProfile()).rejects.toThrow("Network error");
    });
  });
});


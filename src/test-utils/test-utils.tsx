import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { AuthContext } from "@/context/AuthContext";

// Mock auth context provider for testing
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const mockAuthValue = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    refreshToken: jest.fn(),
    hasRole: jest.fn(),
    isStudent: jest.fn(),
    isProfessor: jest.fn(),
    isAdmin: jest.fn(),
  };

  return (
    <AuthContext.Provider value={mockAuthValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: MockAuthProvider, ...options });

// Mock API responses
export const mockApiResponse = (data: any, success = true) => ({
  success,
  data,
  message: success ? "Success" : "Error",
  request_id: "test-request-id",
  timestamp: new Date().toISOString(),
});

// Mock student data
export const mockStudent = {
  id: "test-student-id",
  first_name: "Test",
  last_name: "Student",
  email: "test@example.com",
  wilaya: "Algiers",
  phone_number: "0555123456",
  academic_stream: "Mathematics",
  profile_picture_path: null,
  email_verified: true,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

// Mock module data
export const mockModule = {
  id: "test-module-id",
  name: "Test Module",
  description: "A test module",
  image_path: "/test-image.jpg",
  color: "#FF5733",
  academic_streams: [
    { id: "stream-1", name: "Mathematics", name_ar: "الرياضيات" },
  ],
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

// Mock chapter data
export const mockChapter = {
  id: "test-chapter-id",
  name: "Test Chapter",
  description: "A test chapter",
  price: 100.0,
  module: "test-module-id",
  academic_streams: [
    { id: "stream-1", name: "Mathematics", name_ar: "الرياضيات" },
  ],
};

// Mock lesson data
export const mockLesson = {
  id: "test-lesson-id",
  title: "Test Lesson",
  description: "A test lesson",
  image: "/test-lesson.jpg",
  duration: 30,
  order: 1,
  video_url: "/test-video.mp4",
  pdf_url: "/test-pdf.pdf",
  exercise_total_mark: 10,
  exercise_total_xp: 100,
  academic_streams: [
    { id: "stream-1", name: "Mathematics", labelKey: "Mathematics" },
  ],
  chapter: "test-chapter-id",
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

// Mock progress data
export const mockLessonProgress = {
  id: "test-progress-id",
  lesson: mockLesson,
  student_name: "Test Student",
  is_completed: false,
  is_unlocked: true,
  time_spent: 0,
  completed_at: null,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

export const mockChapterProgress = {
  id: "test-chapter-progress-id",
  chapter: mockChapter,
  student_name: "Test Student",
  is_completed: false,
  completion_percentage: 0,
  completed_at: null,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

export const mockModuleProgress = {
  id: "test-module-progress-id",
  module: mockModule,
  student_name: "Test Student",
  is_completed: false,
  completion_percentage: 0,
  completed_at: null,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

// Mock enrollment data
export const mockEnrollment = {
  id: "test-enrollment-id",
  module: mockModule,
  student_name: "Test Student",
  enrolled_at: "2025-01-01T00:00:00Z",
  is_active: true,
};

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };


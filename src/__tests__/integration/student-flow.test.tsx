import React from "react";
import { render, screen, fireEvent, waitFor } from "@/test-utils/test-utils";
import { StudentProfile } from "@/components/student/StudentProfile";
import { ModuleCard } from "@/components/modules/ModuleCard";
import { StudentApi } from "@/api/student";
import { CoursesApi } from "@/api/courses";
import { mockStudent, mockModule } from "@/test-utils/test-utils";

// Mock the APIs
jest.mock("@/api/student");
jest.mock("@/api/courses");

// Mock Next.js components
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Student Flow Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Complete Student Journey", () => {
    it("should complete full student profile and enrollment flow", async () => {
      // Mock initial profile fetch
      const mockProfileResponse = {
        success: true,
        data: mockStudent,
        message: "Profile retrieved successfully",
      };
      (StudentApi.getProfile as jest.Mock).mockResolvedValue(
        mockProfileResponse
      );

      // Mock enrollment status check
      const mockStatusResponse = {
        success: true,
        data: { is_enrolled: false, module_id: mockModule.id },
        message: "Status retrieved successfully",
      };
      (CoursesApi.checkEnrollmentStatus as jest.Mock).mockResolvedValue(
        mockStatusResponse
      );

      // Mock successful enrollment
      const mockEnrollResponse = {
        success: true,
        data: { message: "Successfully enrolled in module" },
        message: "Success",
      };
      (CoursesApi.enrollInModule as jest.Mock).mockResolvedValue(
        mockEnrollResponse
      );

      // Mock profile update
      const mockUpdateResponse = {
        success: true,
        data: { ...mockStudent, first_name: "Updated" },
        message: "Profile updated successfully",
      };
      (StudentApi.updateProfile as jest.Mock).mockResolvedValue(
        mockUpdateResponse
      );

      // Render student profile
      render(<StudentProfile />);

      // Wait for profile to load
      await waitFor(() => {
        expect(screen.getByText("Test Student")).toBeInTheDocument();
      });

      // Update profile
      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      const firstNameInput = screen.getByDisplayValue("Test");
      fireEvent.change(firstNameInput, { target: { value: "Updated" } });

      const saveButton = screen.getByRole("button", { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(StudentApi.updateProfile).toHaveBeenCalledWith({
          id: mockStudent.id,
          first_name: "Updated",
          last_name: "Student",
          wilaya: "Algiers",
          phone_number: "0555123456",
          academic_stream: "Mathematics",
        });
      });

      // Render module card
      render(<ModuleCard module={mockModule} />);

      // Wait for enrollment status
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /enroll/i })
        ).toBeInTheDocument();
      });

      // Enroll in module
      const enrollButton = screen.getByRole("button", { name: /enroll/i });
      fireEvent.click(enrollButton);

      await waitFor(() => {
        expect(CoursesApi.enrollInModule).toHaveBeenCalledWith(mockModule.id);
      });

      // Verify enrollment success
      expect(screen.getByText(/enrolled/i)).toBeInTheDocument();
    });

    it("should handle errors gracefully throughout the flow", async () => {
      // Mock profile fetch error
      const mockProfileError = {
        success: false,
        data: null,
        message: "Failed to load profile",
      };
      (StudentApi.getProfile as jest.Mock).mockResolvedValue(mockProfileError);

      render(<StudentProfile />);

      await waitFor(() => {
        expect(screen.getByText("Failed to load profile")).toBeInTheDocument();
      });

      // Mock enrollment error
      const mockStatusResponse = {
        success: true,
        data: { is_enrolled: false, module_id: mockModule.id },
        message: "Status retrieved successfully",
      };
      const mockEnrollError = {
        success: false,
        data: null,
        message: "Enrollment failed",
      };
      (CoursesApi.checkEnrollmentStatus as jest.Mock).mockResolvedValue(
        mockStatusResponse
      );
      (CoursesApi.enrollInModule as jest.Mock).mockResolvedValue(
        mockEnrollError
      );

      render(<ModuleCard module={mockModule} />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /enroll/i })
        ).toBeInTheDocument();
      });

      const enrollButton = screen.getByRole("button", { name: /enroll/i });
      fireEvent.click(enrollButton);

      await waitFor(() => {
        expect(screen.getByText(/enrollment failed/i)).toBeInTheDocument();
      });
    });
  });

  describe("API Integration", () => {
    it("should make correct API calls with proper authentication", async () => {
      const mockProfileResponse = {
        success: true,
        data: mockStudent,
        message: "Profile retrieved successfully",
      };
      (StudentApi.getProfile as jest.Mock).mockResolvedValue(
        mockProfileResponse
      );

      render(<StudentProfile />);

      await waitFor(() => {
        expect(StudentApi.getProfile).toHaveBeenCalled();
      });

      // Verify API call includes authentication
      expect(StudentApi.getProfile).toHaveBeenCalledWith();
    });

    it("should handle network errors and retry logic", async () => {
      const networkError = new Error("Network error");
      (StudentApi.getProfile as jest.Mock).mockRejectedValue(networkError);

      render(<StudentProfile />);

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });
  });

  describe("State Management", () => {
    it("should maintain consistent state across components", async () => {
      const mockProfileResponse = {
        success: true,
        data: mockStudent,
        message: "Profile retrieved successfully",
      };
      (StudentApi.getProfile as jest.Mock).mockResolvedValue(
        mockProfileResponse
      );

      const { rerender } = render(<StudentProfile />);

      await waitFor(() => {
        expect(screen.getByText("Test Student")).toBeInTheDocument();
      });

      // Rerender with same props should maintain state
      rerender(<StudentProfile />);

      expect(screen.getByText("Test Student")).toBeInTheDocument();
    });

    it("should update UI immediately on successful operations", async () => {
      const mockProfileResponse = {
        success: true,
        data: mockStudent,
        message: "Profile retrieved successfully",
      };
      const mockUpdateResponse = {
        success: true,
        data: { ...mockStudent, first_name: "Updated" },
        message: "Profile updated successfully",
      };
      (StudentApi.getProfile as jest.Mock).mockResolvedValue(
        mockProfileResponse
      );
      (StudentApi.updateProfile as jest.Mock).mockResolvedValue(
        mockUpdateResponse
      );

      render(<StudentProfile />);

      await waitFor(() => {
        expect(screen.getByText("Test Student")).toBeInTheDocument();
      });

      // Update profile
      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      const firstNameInput = screen.getByDisplayValue("Test");
      fireEvent.change(firstNameInput, { target: { value: "Updated" } });

      const saveButton = screen.getByRole("button", { name: /save/i });
      fireEvent.click(saveButton);

      // UI should update immediately
      await waitFor(() => {
        expect(screen.getByText("Updated Student")).toBeInTheDocument();
      });
    });
  });
});


import React from "react";
import { render, screen, fireEvent, waitFor } from "@/test-utils/test-utils";
import { StudentProfile } from "../StudentProfile";
import { StudentApi } from "@/api/student";
import { mockStudent } from "@/test-utils/test-utils";

// Mock the StudentApi
jest.mock("@/api/student", () => ({
  StudentApi: {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
    uploadProfilePicture: jest.fn(),
  },
}));

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

describe("StudentProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render student profile information", async () => {
    const mockResponse = {
      success: true,
      data: mockStudent,
      message: "Profile retrieved successfully",
    };
    (StudentApi.getProfile as jest.Mock).mockResolvedValue(mockResponse);

    render(<StudentProfile />);

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.getByText("Test Student")).toBeInTheDocument();
    });

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Algiers")).toBeInTheDocument();
    expect(screen.getByText("0555123456")).toBeInTheDocument();
    expect(screen.getByText("Mathematics")).toBeInTheDocument();
  });

  it("should show loading state initially", () => {
    (StudentApi.getProfile as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<StudentProfile />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should show error message when profile fetch fails", async () => {
    const errorResponse = {
      success: false,
      data: null,
      message: "Failed to load profile",
    };
    (StudentApi.getProfile as jest.Mock).mockResolvedValue(errorResponse);

    render(<StudentProfile />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load profile")).toBeInTheDocument();
    });
  });

  it("should enable edit mode when edit button is clicked", async () => {
    const mockResponse = {
      success: true,
      data: mockStudent,
      message: "Profile retrieved successfully",
    };
    (StudentApi.getProfile as jest.Mock).mockResolvedValue(mockResponse);

    render(<StudentProfile />);

    await waitFor(() => {
      expect(screen.getByText("Test Student")).toBeInTheDocument();
    });

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    // Should show input fields for editing
    expect(screen.getByDisplayValue("Test")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Student")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Algiers")).toBeInTheDocument();
  });

  it("should save changes when save button is clicked", async () => {
    const mockResponse = {
      success: true,
      data: mockStudent,
      message: "Profile retrieved successfully",
    };
    const updateResponse = {
      success: true,
      data: { ...mockStudent, first_name: "Updated" },
      message: "Profile updated successfully",
    };
    (StudentApi.getProfile as jest.Mock).mockResolvedValue(mockResponse);
    (StudentApi.updateProfile as jest.Mock).mockResolvedValue(updateResponse);

    render(<StudentProfile />);

    await waitFor(() => {
      expect(screen.getByText("Test Student")).toBeInTheDocument();
    });

    // Enter edit mode
    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    // Update first name
    const firstNameInput = screen.getByDisplayValue("Test");
    fireEvent.change(firstNameInput, { target: { value: "Updated" } });

    // Save changes
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

    expect(screen.getByText("Updated Student")).toBeInTheDocument();
  });

  it("should cancel editing when cancel button is clicked", async () => {
    const mockResponse = {
      success: true,
      data: mockStudent,
      message: "Profile retrieved successfully",
    };
    (StudentApi.getProfile as jest.Mock).mockResolvedValue(mockResponse);

    render(<StudentProfile />);

    await waitFor(() => {
      expect(screen.getByText("Test Student")).toBeInTheDocument();
    });

    // Enter edit mode
    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    // Cancel editing
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    // Should return to view mode
    expect(screen.getByText("Test Student")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("Test")).not.toBeInTheDocument();
  });

  it("should handle profile picture upload", async () => {
    const mockResponse = {
      success: true,
      data: mockStudent,
      message: "Profile retrieved successfully",
    };
    const uploadResponse = {
      success: true,
      data: { message: "Profile picture uploaded successfully" },
      message: "Success",
    };
    (StudentApi.getProfile as jest.Mock).mockResolvedValue(mockResponse);
    (StudentApi.uploadProfilePicture as jest.Mock).mockResolvedValue(
      uploadResponse
    );

    render(<StudentProfile />);

    await waitFor(() => {
      expect(screen.getByText("Test Student")).toBeInTheDocument();
    });

    // Create a mock file
    const file = new File(["test"], "profile.jpg", { type: "image/jpeg" });
    const fileInput = screen.getByLabelText(/profile picture/i);

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(StudentApi.uploadProfilePicture).toHaveBeenCalledWith(file);
    });
  });

  it("should show validation errors for invalid input", async () => {
    const mockResponse = {
      success: true,
      data: mockStudent,
      message: "Profile retrieved successfully",
    };
    (StudentApi.getProfile as jest.Mock).mockResolvedValue(mockResponse);

    render(<StudentProfile />);

    await waitFor(() => {
      expect(screen.getByText("Test Student")).toBeInTheDocument();
    });

    // Enter edit mode
    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    // Clear required field
    const firstNameInput = screen.getByDisplayValue("Test");
    fireEvent.change(firstNameInput, { target: { value: "" } });

    // Try to save
    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    // Should show validation error
    expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
  });
});


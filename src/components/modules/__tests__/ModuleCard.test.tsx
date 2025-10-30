import React from "react";
import { render, screen, fireEvent, waitFor } from "@/test-utils/test-utils";
import { ModuleCard } from "../ModuleCard";
import { CoursesApi } from "@/api/courses";
import { mockModule } from "@/test-utils/test-utils";

// Mock the CoursesApi
jest.mock("@/api/courses", () => ({
  CoursesApi: {
    enrollInModule: jest.fn(),
    unenrollFromModule: jest.fn(),
    checkEnrollmentStatus: jest.fn(),
  },
}));

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock Next.js Link component
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("ModuleCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render module information correctly", () => {
    render(<ModuleCard module={mockModule} />);

    expect(screen.getByText("Test Module")).toBeInTheDocument();
    expect(screen.getByText("A test module")).toBeInTheDocument();
    expect(screen.getByText("Mathematics")).toBeInTheDocument();
  });

  it("should show enroll button when not enrolled", async () => {
    const mockStatusResponse = {
      success: true,
      data: { is_enrolled: false, module_id: mockModule.id },
      message: "Status retrieved successfully",
    };
    (CoursesApi.checkEnrollmentStatus as jest.Mock).mockResolvedValue(
      mockStatusResponse
    );

    render(<ModuleCard module={mockModule} />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /enroll/i })
      ).toBeInTheDocument();
    });
  });

  it("should show enrolled state when enrolled", async () => {
    const mockStatusResponse = {
      success: true,
      data: { is_enrolled: true, module_id: mockModule.id },
      message: "Status retrieved successfully",
    };
    (CoursesApi.checkEnrollmentStatus as jest.Mock).mockResolvedValue(
      mockStatusResponse
    );

    render(<ModuleCard module={mockModule} />);

    await waitFor(() => {
      expect(screen.getByText(/enrolled/i)).toBeInTheDocument();
    });
  });

  it("should enroll in module when enroll button is clicked", async () => {
    const mockStatusResponse = {
      success: true,
      data: { is_enrolled: false, module_id: mockModule.id },
      message: "Status retrieved successfully",
    };
    const mockEnrollResponse = {
      success: true,
      data: { message: "Successfully enrolled in module" },
      message: "Success",
    };
    (CoursesApi.checkEnrollmentStatus as jest.Mock).mockResolvedValue(
      mockStatusResponse
    );
    (CoursesApi.enrollInModule as jest.Mock).mockResolvedValue(
      mockEnrollResponse
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
      expect(CoursesApi.enrollInModule).toHaveBeenCalledWith(mockModule.id);
    });

    // Should show enrolled state after successful enrollment
    expect(screen.getByText(/enrolled/i)).toBeInTheDocument();
  });

  it("should unenroll from module when unenroll button is clicked", async () => {
    const mockStatusResponse = {
      success: true,
      data: { is_enrolled: true, module_id: mockModule.id },
      message: "Status retrieved successfully",
    };
    const mockUnenrollResponse = {
      success: true,
      data: { message: "Successfully unenrolled from module" },
      message: "Success",
    };
    (CoursesApi.checkEnrollmentStatus as jest.Mock).mockResolvedValue(
      mockStatusResponse
    );
    (CoursesApi.unenrollFromModule as jest.Mock).mockResolvedValue(
      mockUnenrollResponse
    );

    render(<ModuleCard module={mockModule} />);

    await waitFor(() => {
      expect(screen.getByText(/enrolled/i)).toBeInTheDocument();
    });

    const unenrollButton = screen.getByRole("button", { name: /unenroll/i });
    fireEvent.click(unenrollButton);

    await waitFor(() => {
      expect(CoursesApi.unenrollFromModule).toHaveBeenCalledWith(mockModule.id);
    });

    // Should show enroll button after successful unenrollment
    expect(screen.getByRole("button", { name: /enroll/i })).toBeInTheDocument();
  });

  it("should handle enrollment errors gracefully", async () => {
    const mockStatusResponse = {
      success: true,
      data: { is_enrolled: false, module_id: mockModule.id },
      message: "Status retrieved successfully",
    };
    const mockErrorResponse = {
      success: false,
      data: null,
      message: "Student is already enrolled in this module",
    };
    (CoursesApi.checkEnrollmentStatus as jest.Mock).mockResolvedValue(
      mockStatusResponse
    );
    (CoursesApi.enrollInModule as jest.Mock).mockResolvedValue(
      mockErrorResponse
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
      expect(screen.getByText(/already enrolled/i)).toBeInTheDocument();
    });
  });

  it("should show loading state during enrollment", async () => {
    const mockStatusResponse = {
      success: true,
      data: { is_enrolled: false, module_id: mockModule.id },
      message: "Status retrieved successfully",
    };
    (CoursesApi.checkEnrollmentStatus as jest.Mock).mockResolvedValue(
      mockStatusResponse
    );
    (CoursesApi.enrollInModule as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<ModuleCard module={mockModule} />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /enroll/i })
      ).toBeInTheDocument();
    });

    const enrollButton = screen.getByRole("button", { name: /enroll/i });
    fireEvent.click(enrollButton);

    // Should show loading state
    expect(screen.getByText(/enrolling/i)).toBeInTheDocument();
  });

  it("should navigate to module details when card is clicked", () => {
    render(<ModuleCard module={mockModule} />);

    const moduleLink = screen.getByRole("link");
    expect(moduleLink).toHaveAttribute("href", `/modules/${mockModule.id}`);
  });

  it("should display module color correctly", () => {
    render(<ModuleCard module={mockModule} />);

    const cardElement = screen.getByTestId("module-card");
    expect(cardElement).toHaveStyle(`border-color: ${mockModule.color}`);
  });
});


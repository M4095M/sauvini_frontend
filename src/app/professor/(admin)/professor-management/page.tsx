"use client";

import AddOption from "@/components/input/addOption";
import DropDown from "@/components/input/dropDown";
import OptionCard from "@/components/input/optionCard";
import FileAttachement from "@/components/lesson/fileAttachment";
import BigTag from "@/components/professor/BigTags";
import Tag from "@/components/questions/tag";
import { DataTable } from "@/components/tables/data-table";
import {
  professor_columns,
  ProfessorColumn,
  returnProfessorColumns,
} from "@/components/tables/professors/professor_columns";
import Button from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronLast, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import ViewTeacherApplicationDetails from "./viewTeacherApplication";
import ManagePermission from "./managePermission";
import ChangeStatusPopup from "./changeStatusPopup";
import { useAdmin } from "@/hooks/api/useAdmin";
import { AdminApi } from "@/api/admin";
import { ProfessorApi } from "@/api/professor";
import type { Professor } from "@/types/api";

// Mock data removed - now using real API data

type PaginatedTableProps<TData> = {
  data?: TData;
  columns?: ColumnDef<TData, any>[];
  pageSizeOptions?: number[];
};

export default function ProfessorManagementPage({
  data,
  columns,
  pageSizeOptions = [10, 20, 50, 100],
}: PaginatedTableProps<ProfessorColumn[]>) {
  // API hooks
  const { getAllProfessors, loading, error } = useAdmin();

  // State for real data
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // control pop ups:
  const [showChangeStatusPopup, setShowChangeStatusPopup] = useState(false);
  const [showPermissionPopup, setShowPermissionPopup] = useState(false);
  const [showViewDetailsPopup, setShowViewDetailsPopup] = useState(false);

  // selected professor for viewing details
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    null
  );

  // selected professor for permission management
  const [selectedProfessorForPermission, setSelectedProfessorForPermission] =
    useState<Professor | null>(null);

  // Force re-render when status changes
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  // handlers for pop up
  const handleChangeStatusPopup = () => {
    window.scrollTo(0, 0);
    document.body.classList.add("no-scroll");
    setShowChangeStatusPopup(true);
  };

  const handlePermissionPopup = (professor: Professor) => {
    setSelectedProfessorForPermission(professor);
    window.scrollTo(0, 0);
    document.body.classList.add("no-scroll");
    setShowPermissionPopup(true);
  };

  const handleViewDetailsPopup = (professor: Professor) => {
    setSelectedProfessor(professor);
    window.scrollTo(0, 0);
    document.body.classList.add("no-scroll");
    setShowViewDetailsPopup(true);
  };

  // handler for different actions:
  const handleChangeStatus = async (
    professor: Professor,
    newStatus: string
  ) => {
    try {
      await handleStatusChange(professor, newStatus);
      setNotification({
        type: "success",
        message: `Professor status updated to ${newStatus}`,
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error changing status:", error);
      setNotification({
        type: "error",
        message: "Failed to update professor status",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleChangePermission = (professor: Professor) => {
    handlePermissionPopup(professor);
  };

  // Handler for accepting professor directly from table
  const handleAcceptProfessor = async (professor: Professor) => {
    try {
      await handleStatusChange(professor, "approved");
    } catch (error) {
      console.error("Error accepting professor:", error);
    }
  };

  // Handler for CV download
  const handleDownloadCV = async (professor: Professor) => {
    try {
      if (!professor.cv_path) {
        setNotification({
          type: "error",
          message: "No CV available for this professor",
        });
        return;
      }

      // Show loading notification
      setNotification({
        type: "success",
        message: "Downloading CV...",
      });

      // Get signed URL for CV download
      const response = await ProfessorApi.getCVDownloadURL(professor.id);

      if (response.success && response.data) {
        // Open the signed URL in a new tab for download
        const link = document.createElement("a");
        link.href = response.data.cv_url;
        link.download = `${professor.first_name}_${professor.last_name}_CV.pdf`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setNotification({
          type: "success",
          message: "CV download started successfully",
        });
      } else {
        setNotification({
          type: "error",
          message: response.message || "Failed to download CV",
        });
      }
    } catch (error) {
      console.error("Error downloading CV:", error);
      setNotification({
        type: "error",
        message: "An error occurred while downloading CV",
      });
    }
  };

  const handleStatusChange = async (
    professor: Professor,
    newStatus: string
  ) => {
    try {
      // Extract the correct ID format from the professor object
      let professorId: string;
      if (typeof professor.id === "string") {
        professorId = professor.id;
      } else if (
        professor.id &&
        typeof professor.id === "object" &&
        "id" in professor.id &&
        "String" in professor.id.id
      ) {
        // Construct the full RecordId format: "Professor:uyxlwuimgvbxe9hzfyuc"
        professorId = `Professor:${professor.id.id.String}`;
      } else {
        throw new Error("Invalid professor ID format");
      }

      // Call the appropriate API based on the new status
      if (newStatus === "approved") {
        await AdminApi.approveProfessor({ id: professorId });
      } else if (newStatus === "rejected") {
        await AdminApi.rejectProfessor({ id: professorId });
      } else {
        // For other status changes, we'll need to implement additional endpoints
        // For now, just update the local state
        console.warn(
          `Status change to ${newStatus} not yet implemented in backend`
        );
      }

      // Update local state
      setProfessors((prev) =>
        prev.map((prof) => {
          const profId =
            typeof prof.id === "string"
              ? prof.id
              : prof.id &&
                typeof prof.id === "object" &&
                "id" in prof.id &&
                "String" in prof.id.id
              ? prof.id.id.String
              : "";
          return profId === professorId ? { ...prof, status: newStatus } : prof;
        })
      );

      // Force a re-render by updating a timestamp
      setLastUpdate(Date.now());

      // Close the popup
      setShowViewDetailsPopup(false);
      document.body.classList.remove("no-scroll");
    } catch (error) {
      console.error("Error updating professor status:", error);
      // You might want to show a toast notification here
    }
  };

  // parameters for the query (use as query parameters)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "approved" | "accepted" | "rejected" | "deactivated" | undefined
  >();

  // Fetch professors data
  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const result = await getAllProfessors(
          { page, limit: pageSize },
          statusFilter ? { status: statusFilter } : undefined
        );
        if (result) {
          setProfessors(result);
          // For now, use result.length as total count since API doesn't return metadata
          // TODO: Update when backend provides proper pagination metadata
          setTotalCount(result.length);
        }
      } catch (error) {
        console.error("Error fetching professors:", error);
      }
    };

    fetchProfessors();
  }, [page, pageSize, getAllProfessors, statusFilter]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  // Update displayed status when professor status changes
  useEffect(() => {
    // The professorColumns useMemo will automatically recalculate when professors change
    // This effect is here to ensure proper re-rendering
  }, [professors]);

  // Force re-render when status changes occur
  useEffect(() => {
    // This effect ensures the UI updates immediately when status changes
    // The DataTable component will re-render with updated data
  }, [professors.map((p) => p.status).join(","), lastUpdate]);

  // Filter professors based on status filter (now handled by API)
  const filteredProfessors = useMemo(() => {
    // Since filtering is now handled by the API, just return the professors as-is
    return professors;
  }, [professors]);

  // Convert Professor data to ProfessorColumn format
  const professorColumns = useMemo(() => {
    return filteredProfessors.map((professor): ProfessorColumn => {
      const transformed = {
        profile_picture: professor.profile_picture_path || "/placeholder.svg",
        name: `${professor.first_name} ${professor.last_name}`,
        phone_number: professor.phone_number || "N/A",
        email: professor.email,
        status:
          professor.status === "pending" || professor.status === "new"
            ? "Pending"
            : professor.status === "approved" || professor.status === "accepted"
            ? "Accepted"
            : professor.status === "rejected"
            ? "Rejected"
            : professor.status === "deactivated"
            ? "Deactivated"
            : "Unknown",
        professor: professor, // Include the full professor object
      };
      return transformed;
    });
  }, [filteredProfessors, lastUpdate]);

  // totalPage needed for page navigation:
  const totalPage = Math.ceil(filteredProfessors.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return professorColumns.slice(start, start + pageSize);
  }, [professorColumns, page, pageSize]);

  // Define filter options
  const statusFilterOptions = [
    { id: "all", text: "All" },
    { id: "pending", text: "Pending" },
    { id: "approved", text: "Accepted" },
    { id: "rejected", text: "Rejected" },
    { id: "deactivated", text: "Deactivated" },
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="w-full flex flex-col gap-6">
        <div className="w-full bg-neutral-100 rounded-[52px] py-6 px-3 flex flex-col gap-4">
          <div className="flex justify-center items-center py-20">
            <div className="text-lg text-neutral-600">
              Loading professors...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full flex flex-col gap-6">
        <div className="w-full bg-neutral-100 rounded-[52px] py-6 px-3 flex flex-col gap-4">
          <div className="flex justify-center items-center py-20">
            <div className="text-lg text-red-600">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full flex flex-col gap-6 ${
        showChangeStatusPopup ? "ooverflow-hidden" : ""
      }`}
    >
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {notification.message}
        </div>
      )}
      <div className="w-full bg-neutral-100 rounded-[52px] py-6 px-3 flex flex-col gap-4">
        {/* header */}
        <div className="flex flex-col">
          {/* title */}
          <div className="font-medium px-4 text-2xl text-primary-600">
            Teachers
          </div>
          {/* filters */}
          <div className="flex flex-row justify-between items-center ">
            <DropDown
              placeholder="Teacher status"
              value={
                statusFilter
                  ? statusFilterOptions.find((opt) => opt.id === statusFilter)
                      ?.text
                  : "All"
              }
              options={statusFilterOptions}
              max_width="max-w-56"
              onChange={(value: string) => {
                const newFilter =
                  value === "all"
                    ? undefined
                    : (value as
                        | "new"
                        | "approved"
                        | "accepted"
                        | "rejected"
                        | "deactivated");
                setStatusFilter(newFilter);
                setPage(1); // Reset to first page when filtering
              }}
            />
            <DropDown
              placeholder="Show"
              options={[
                { id: "1", text: "10 elements per page" },
                { id: "2", text: "20 elements per page" },
              ]}
              max_width="max-w-56"
              onChange={(size: number) => {
                setPageSize(size);
              }}
            />
          </div>
        </div>
        {/* table content */}
        <div className="">
          <DataTable
            columns={returnProfessorColumns(
              handlePermissionPopup,
              handleViewDetailsPopup,
              handleAcceptProfessor,
              handleDownloadCV
            )}
            data={paginatedData}
          />
        </div>

        {/* Show count */}
        <div className="px-4 text-sm text-neutral-500">
          Showing {paginatedData.length} of {totalCount} professors
        </div>
      </div>
      {/* pagination */}
      <div className="w-full flex justify-center items-center">
        <div className="rounded-full w-fit bg-white btn-elevation-1 pw-4 py-2 flex flex-row gap-7 items-center">
          {/* prev */}
          <div className="">
            <Button
              state={"text"}
              size={"XS"}
              icon_position={"icon-only"}
              icon={<ChevronLeft />}
              onClick={() => {
                setPage((prev) => (prev > 1 ? prev - 1 : prev));
              }}
            />
          </div>
          {/* page */}
          <div className="flex items-center gap-5">
            {[...Array(totalPage)].map((_, i) => {
              // show number for last page
              if (i + 1 === totalPage) {
                return (
                  <div
                    className={`w-7 aspect-square rounded-full select-none cursor-pointer flex justify-center items-center${
                      page === i + 1
                        ? "text-neutral-100 bg-primary-200"
                        : "bg-white text-neutral-400"
                    }`}
                    onClick={() => {
                      setPage(i + 1);
                    }}
                    key={i}
                  >
                    {i + 1}
                  </div>
                );
              }

              // skip
              if (i > page + 4 || i < page - 5) {
                return <div className="hidden" key={i}></div>;
              }

              // show ellipses:
              if (i === page + 4 || i === page - 5) {
                return (
                  <div className="text-neutral-400" key={i}>
                    ...
                  </div>
                );
              }

              return (
                <div
                  className={`w-7 aspect-square rounded-full select-none cursor-pointer flex justify-center items-center${
                    page === i + 1
                      ? "text-white bg-primary-200"
                      : "bg-white text-neutral-400"
                  }`}
                  onClick={() => {
                    setPage(i + 1);
                  }}
                  key={i}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
          {/* next */}
          <div className="">
            <Button
              state={"text"}
              size={"XS"}
              icon_position={"icon-only"}
              icon={<ChevronRight />}
              onClick={() => {
                setPage((prev) => (prev < totalPage ? prev + 1 : prev));
              }}
            />
          </div>
        </div>
      </div>

      {/* pop ups: confirm accept */}
      {showChangeStatusPopup && selectedProfessor && (
        <div className="w-full h-screen flex justify-center items-center bg-black/40 absolute top-0 left-0 z-100000">
          {/* change status pop up */}
          <div className="">
            <ChangeStatusPopup
              onAccept={() => {
                if (selectedProfessor) {
                  handleChangeStatus(selectedProfessor, "approved");
                }
                document.body.classList.remove("no-scroll");
                setShowChangeStatusPopup(false);
                setSelectedProfessor(null);
              }}
              onCancel={() => {
                document.body.classList.remove("no-scroll");
                setShowChangeStatusPopup(false);
                setSelectedProfessor(null);
              }}
            />
          </div>
        </div>
      )}

      {/* pop ups: view details: */}
      {showViewDetailsPopup && selectedProfessor && (
        <div className="w-full overflow-y-auto h-screen flex justify-center bg-black/40 absolute top-0 left-0 z-100000">
          <div className="m-20">
            <ViewTeacherApplicationDetails
              professor={selectedProfessor}
              onClose={() => {
                document.body.classList.remove("no-scroll");
                setShowViewDetailsPopup(false);
                setSelectedProfessor(null);
              }}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      )}

      {/* pop up: manage permission */}
      {showPermissionPopup && selectedProfessorForPermission && (
        <div className="w-full overflow-y-auto h-screen flex justify-center bg-black/40 absolute top-0 left-0 z-100000">
          <div className="m-20">
            <ManagePermission
              professor={selectedProfessorForPermission}
              onClose={() => {
                document.body.classList.remove("no-scroll");
                setShowPermissionPopup(false);
                setSelectedProfessorForPermission(null);
              }}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

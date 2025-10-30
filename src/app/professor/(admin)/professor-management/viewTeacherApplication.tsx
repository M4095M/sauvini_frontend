import FileAttachement from "@/components/lesson/fileAttachment";
import BigTag from "@/components/professor/BigTags";
import Tag from "@/components/questions/tag";
import Button from "@/components/ui/button";
import { AdminApi } from "@/api/admin";
import { ProfessorApi } from "@/api/professor";
import type { Professor } from "@/types/api";
import { useState } from "react";

type ViewTeacherApplicationDetailsProps = {
  professor: Professor;
  onClose: () => void;
  onStatusChange?: (professor: Professor, newStatus: string) => void;
};

export default function ViewTeacherApplicationDetails({
  professor,
  onClose,
  onStatusChange,
}: ViewTeacherApplicationDetailsProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);

  const handleDownloadCv = async () => {
    if (!professor.id || !professor.cv_path) {
      console.error("No professor ID or CV path available");
      alert("CV file not available for this professor");
      return;
    }

    setIsDownloading(true);
    try {
      // Get signed URL for CV download using the secure API
      const response = await ProfessorApi.getCVDownloadURL(professor.id);

      if (response.success && response.data) {
        // Create download link with proper filename
        const link = document.createElement("a");
        link.href = response.data.cv_url;
        link.download = `${professor.first_name}_${professor.last_name}_CV.pdf`;
        link.target = "_blank";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setDownloadMessage("CV download started successfully");
        // Clear message after 3 seconds
        setTimeout(() => setDownloadMessage(null), 3000);
      } else {
        throw new Error(response.message || "Failed to get download URL");
      }
    } catch (error) {
      console.error("Error downloading CV:", error);
      setDownloadMessage(
        `Failed to download CV: ${error.message || "Unknown error"}`
      );
      // Clear error message after 5 seconds
      setTimeout(() => setDownloadMessage(null), 5000);
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <div className="w-full bg-neutral-100 rounded-[52px] pt-20 pb-11 px-10 flex flex-col gap-12 ">
      {/* close button */}
      <div
        className="w-full flex justify-end text-neutral-400 cursor-pointer"
        onClick={() => {
          onClose();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="29"
          viewBox="0 0 28 29"
          fill="none"
        >
          <path
            d="M7 21.5L21 7.5M7 7.5L21 21.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {/* teacher */}
      <div className="flex flex-col gap-3">
        {/* title */}
        <div className="font-semibold text-5xl text-neutral-600">
          {professor.first_name} {professor.last_name} Application Details
        </div>
        {/* status info + action */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-5">
            <div className="text-2xl text-neutral-400 font-normal">Status:</div>
            <div className="">
              <Tag
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="29"
                    viewBox="0 0 28 29"
                    fill="none"
                  >
                    <path
                      d="M13.9992 10.1446V14.5002L17.2659 17.7669M23.7992 14.5002C23.7992 19.9126 19.4116 24.3002 13.9992 24.3002C8.58683 24.3002 4.19922 19.9126 4.19922 14.5002C4.19922 9.0878 8.58683 4.7002 13.9992 4.7002C19.4116 4.7002 23.7992 9.0878 23.7992 14.5002Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                text={
                  professor.status === "pending" || professor.status === "new"
                    ? "Pending"
                    : professor.status === "approved" ||
                      professor.status === "accepted"
                    ? "Accepted"
                    : professor.status === "rejected"
                    ? "Rejected"
                    : professor.status === "deactivated"
                    ? "Deactivated"
                    : "Unknown"
                }
                className={
                  professor.status === "pending" || professor.status === "new"
                    ? "bg-second01-100 text-second01-200"
                    : professor.status === "approved" ||
                      professor.status === "accepted"
                    ? "bg-success-100 text-success-400"
                    : professor.status === "rejected"
                    ? "bg-error-100 text-error-400"
                    : professor.status === "deactivated"
                    ? "bg-neutral-100 text-neutral-400"
                    : "bg-neutral-100 text-neutral-400"
                }
              />
            </div>
          </div>
          {/* action */}
          {(professor.status === "pending" || professor.status === "new") && (
            <div className="">
              <Button
                state={"filled"}
                size={"M"}
                icon_position={"none"}
                text="Accept Application"
                onClick={() => {
                  if (onStatusChange) {
                    onStatusChange(professor, "approved");
                  }
                }}
              />
            </div>
          )}
          {(professor.status === "approved" ||
            professor.status === "accepted") && (
            <div className="">
              <Button
                state={"filled"}
                size={"M"}
                icon_position={"none"}
                text="Reject Application"
                onClick={() => {
                  if (onStatusChange) {
                    onStatusChange(professor, "rejected");
                  }
                }}
              />
            </div>
          )}
          {professor.status === "rejected" && (
            <div className="">
              <Button
                state={"filled"}
                size={"M"}
                icon_position={"none"}
                text="Accept Application"
                onClick={() => {
                  if (onStatusChange) {
                    onStatusChange(professor, "approved");
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
      {/* personal info */}
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-4xl text-neutral-600">
          Personal Information
        </div>
        {/* gender */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">Gender</div>
          <div className="font-normal text-base text-neutral-400 capitalize">
            {professor.gender}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            Date of Birth
          </div>
          <div className="font-normal text-base text-neutral-400">
            {new Date(professor.date_of_birth).toLocaleDateString()}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">Wilaya </div>
          <div className="font-normal text-base text-neutral-400">
            {professor.wilaya}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">Email </div>
          <div className="font-normal text-base text-neutral-400">
            {professor.email}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            Phone Number{" "}
          </div>
          <div className="font-normal text-base text-neutral-400">
            {professor.phone_number}
          </div>
        </div>
      </div>
      {/* Professional experience */}
      <div className="flex flex-col gap-6">
        {/* headline */}
        <div className="font-semibold text-4xl text-neutral-600">
          Professional Experience
        </div>
        {/* info */}
        <div className="flex flex-col gap-6">
          {/* experience */}
          <div className="flex flex-col gap-3">
            <div className="font-medium text-2xl text-neutral-600">
              Teaching in High School
            </div>
            {/* experience */}
            <div className="flex items-center gap-2">
              <span
                className={
                  professor.exp_school ? "text-success-400" : "text-error-400"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  {professor.exp_school ? (
                    <path
                      d="M3 11L7 15L17 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d="M5 15L15 5M5 5L15 15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </span>
              <span className="text-neutral-400 text-base font-normal">
                {professor.exp_school
                  ? `Yes${
                      professor.exp_school_years
                        ? ` (${professor.exp_school_years} Year${
                            professor.exp_school_years > 1 ? "s" : ""
                          })`
                        : ""
                    }`
                  : "No"}
              </span>
            </div>
          </div>
          {/* off school */}
          <div className="flex flex-col gap-3">
            <div className="font-medium text-2xl text-neutral-600">
              Experience in Off - School Courses
            </div>
            {/* experience */}
            <div className="flex items-center gap-2">
              <span
                className={
                  professor.exp_off_school
                    ? "text-success-400"
                    : "text-error-400"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  {professor.exp_off_school ? (
                    <path
                      d="M3 11L7 15L17 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d="M5 15L15 5M5 5L15 15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </span>
              <span className="text-neutral-400 text-base font-normal">
                {professor.exp_off_school ? "Yes" : "No"}
              </span>
            </div>
          </div>
          {/* online courses */}
          <div className="flex flex-col gap-3">
            <div className="font-medium text-2xl text-neutral-600">
              Experience in Online Courses
            </div>
            {/* experience */}
            <div className="flex items-center gap-2">
              <span
                className={
                  professor.exp_online ? "text-success-400" : "text-error-400"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  {professor.exp_online ? (
                    <path
                      d="M3 11L7 15L17 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d="M5 15L15 5M5 5L15 15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </span>
              <span className="text-neutral-400 text-base font-normal">
                {professor.exp_online ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* attached CV */}
      <div className="flex flex-col gap-3">
        <div className="text-neutral-600 font-medium text-2xl">CV file</div>
        {professor.cv_path ? (
          <div className="flex flex-col gap-2">
            <div className="text-neutral-400 text-base">
              CV File: {professor.cv_path.split("/").pop() || "CV.pdf"}
            </div>
            <FileAttachement
              isRTL={false}
              downloadable
              fileName={professor.cv_path.split("/").pop() || "CV.pdf"}
              onDownload={handleDownloadCv}
            />
            {isDownloading && (
              <div className="text-sm text-neutral-500">Downloading...</div>
            )}
            {downloadMessage && (
              <div
                className={`text-sm p-2 rounded-md ${
                  downloadMessage.includes("successfully")
                    ? "text-green-600 bg-green-50"
                    : "text-red-600 bg-red-50"
                }`}
              >
                {downloadMessage}
              </div>
            )}
          </div>
        ) : (
          <div className="text-neutral-400 text-base">No CV file attached</div>
        )}
      </div>
      {/* SHOW THIS SECTION ONLY TO ACCEPTED TEACHERS */}
      {(professor.status === "approved" ||
        professor.status === "accepted" ||
        professor.status === "deactivated") && (
        <div className="flex flex-col gap-6">
          {/* header */}
          <div className="flex justify-between items-center gap-4">
            <div className="font-semibold text-4xl text-neutral-600 grow">
              Permission
            </div>
            <div className="">
              <Button
                state={"filled"}
                size={"M"}
                icon_position={"none"}
                text="Update Permission"
              />
            </div>
          </div>
          {/* other sections: */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="font-medium text-2xl text-neutral-600">
                Module Name
              </div>
              <div className="flex gap-3">
                <BigTag icon={undefined} text={"Content Creation"} />
                <BigTag icon={undefined} text={"Content Creation"} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="font-medium text-2xl text-neutral-600">
                Module Name
              </div>
              <div className="flex gap-3">
                <BigTag icon={undefined} text={"Content Creation"} />
                <BigTag icon={undefined} text={"Content Creation"} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

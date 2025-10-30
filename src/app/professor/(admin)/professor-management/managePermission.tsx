"use client";

import Button from "@/components/ui/button";
import Tag from "@/components/questions/tag";
import { useState, useEffect } from "react";
import { AdminApi } from "@/api/admin";
import type { Professor } from "@/types/api";

type ManagePermissionProps = {
  professor: Professor;
  onClose: () => void;
  onStatusChange: (professor: Professor, newStatus: string) => void;
};

export default function ManagePermission({
  professor,
  onClose,
  onStatusChange,
}: ManagePermissionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [modulesList, setModulesList] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<{
    [module: string]: string[];
  }>({});

  // Available modules - TODO: Fetch from API when available
  const availableModules = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "English Literature",
    "History",
    "Geography",
  ];

  const availablePermissions = [
    "View Content",
    "Edit Content",
    "Create Lessons",
    "Grade Assignments",
    "Manage Students",
    "View Analytics",
  ];

  useEffect(() => {
    // Initialize with professor's current permissions if available
    // For now, we'll start with empty selections
    setModulesList(availableModules);
    setPermissions(availablePermissions);
  }, [professor]);

  const handleModuleToggle = (module: string) => {
    setSelectedModules((prev) =>
      prev.includes(module)
        ? prev.filter((m) => m !== module)
        : [...prev, module]
    );
  };

  const handlePermissionToggle = (module: string, permission: string) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [module]: prev[module]?.includes(permission)
        ? prev[module].filter((p) => p !== permission)
        : [...(prev[module] || []), permission],
    }));
  };

  const handleDeactivate = async () => {
    setIsLoading(true);
    try {
      await onStatusChange(professor, "deactivated");
      onClose();
    } catch (error) {
      console.error("Error deactivating professor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivate = async () => {
    setIsLoading(true);
    try {
      await onStatusChange(professor, "accepted");
      onClose();
    } catch (error) {
      console.error("Error reactivating professor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePermissions = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save permissions when backend endpoint is available
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, just close the modal
      onClose();
    } catch (error) {
      console.error("Error saving permissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDeactivated = professor.status === "deactivated";

  return (
    <div className="w-full bg-neutral-100 rounded-[52px] pt-20 pb-11 px-10 flex flex-col gap-12">
      {/* close button */}
      <div
        className="w-full flex justify-end text-neutral-400 cursor-pointer"
        onClick={onClose}
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

      {/* header */}
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-5xl text-neutral-600">
          {professor.first_name} {professor.last_name} - Permissions
        </div>
        <div className="flex items-center gap-4">
          <Tag
            icon={undefined}
            text={professor.status === "deactivated" ? "Deactivated" : "Active"}
            className={
              professor.status === "deactivated"
                ? "bg-error-100 text-error-400"
                : "bg-success-100 text-success-400"
            }
          />
          <span className="text-lg text-neutral-500">{professor.email}</span>
        </div>
      </div>

      {/* Status Management */}
      <div className="flex flex-col gap-6">
        <div className="text-4xl font-semibold text-neutral-600">
          Account Status
        </div>
        <div className="flex gap-4">
          {!isDeactivated ? (
            <Button
              state="filled"
              size="M"
              icon_position="none"
              text="Deactivate Account"
              onClick={handleDeactivate}
              disabled={isLoading}
              className="bg-error-500 hover:bg-error-600"
            />
          ) : (
            <Button
              state="filled"
              size="M"
              icon_position="none"
              text="Reactivate Account"
              onClick={handleReactivate}
              disabled={isLoading}
              className="bg-success-500 hover:bg-success-600"
            />
          )}
        </div>
        <div className="text-sm text-neutral-500">
          {isDeactivated
            ? "This professor's account is deactivated. They cannot access the platform."
            : "Deactivating will prevent this professor from accessing the platform, but you can reactivate them later."}
        </div>
      </div>

      {/* Modules Assignment */}
      <div className="flex flex-col gap-6">
        <div className="text-4xl font-semibold text-neutral-600">
          Assigned Modules
        </div>
        <div className="grid grid-cols-2 gap-4">
          {availableModules.map((module) => (
            <div
              key={module}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedModules.includes(module)
                  ? "border-blue-500 bg-blue-50"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
              onClick={() => handleModuleToggle(module)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded border-2 ${
                    selectedModules.includes(module)
                      ? "bg-blue-500 border-blue-500"
                      : "border-neutral-300"
                  }`}
                >
                  {selectedModules.includes(module) && (
                    <div className="w-full h-full flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                  )}
                </div>
                <span className="font-medium text-neutral-700">{module}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions per Module */}
      {selectedModules.length > 0 && (
        <div className="flex flex-col gap-6">
          <div className="font-semibold text-4xl text-neutral-600">
            Permissions per Module
          </div>
          <div className="flex flex-col gap-6">
            {selectedModules.map((module) => (
              <div
                key={module}
                className="flex flex-col gap-4 p-4 bg-white rounded-lg"
              >
                <div className="font-medium text-2xl text-neutral-600">
                  {module}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {availablePermissions.map((permission) => (
                    <div
                      key={permission}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPermissions[module]?.includes(permission)
                          ? "border-green-500 bg-green-50"
                          : "border-neutral-200 bg-white hover:border-neutral-300"
                      }`}
                      onClick={() => handlePermissionToggle(module, permission)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded border-2 ${
                            selectedPermissions[module]?.includes(permission)
                              ? "bg-green-500 border-green-500"
                              : "border-neutral-300"
                          }`}
                        >
                          {selectedPermissions[module]?.includes(
                            permission
                          ) && (
                            <div className="w-full h-full flex items-center justify-center text-white text-xs">
                              ✓
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-neutral-700">
                          {permission}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="w-full flex justify-end gap-4">
        <Button
          state="text"
          size="M"
          icon_position="none"
          text="Cancel"
          onClick={onClose}
          disabled={isLoading}
        />
        <Button
          state="filled"
          size="M"
          icon_position="none"
          text="Save Changes"
          onClick={handleSavePermissions}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}

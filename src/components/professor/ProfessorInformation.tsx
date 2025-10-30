"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useSafeTranslation } from "@/hooks/useSafeTranslation";
import type { ProfessorUser } from "@/types/professor";
import ProfessorEditModal from "./ProfessorEditModal";
import Tag from "./tag";

interface Props {
  professor: ProfessorUser;
  className?: string;
  onSave?: (payload: Partial<ProfessorUser>) => Promise<void> | void;
}

export default function ProfessorInformation({
  professor,
  className = "",
  onSave,
}: Props) {
  const { safeTranslate, isRTL } = useSafeTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  // Check if user is admin
  const isAdmin = professor.academicTitle === "Admin";

  const titleText = isAdmin
    ? safeTranslate("admin.profile.title", "Account Information")
    : safeTranslate("professor.profile.title", "Professor Information");

  // Permissions data - show assigned modules for professors, or admin permissions for admins
  const professorPermissions = isAdmin
    ? [
        {
          moduleName: safeTranslate(
            "admin.permissions.title",
            "Administrative Permissions"
          ),
          permissions: professor.permissions.map((perm) => {
            // Map permission keys to readable names
            const permissionMap: Record<string, string> = {
              manage_professors: safeTranslate(
                "admin.permissions.manageProfessors",
                "Manage Professors"
              ),
              manage_students: safeTranslate(
                "admin.permissions.manageStudents",
                "Manage Students"
              ),
              manage_purchases: safeTranslate(
                "admin.permissions.managePurchases",
                "Manage Purchases"
              ),
              manage_modules: safeTranslate(
                "admin.permissions.manageModules",
                "Manage Modules"
              ),
              manage_chapters: safeTranslate(
                "admin.permissions.manageChapters",
                "Manage Chapters"
              ),
              manage_lessons: safeTranslate(
                "admin.permissions.manageLessons",
                "Manage Lessons"
              ),
              view_account: safeTranslate(
                "admin.permissions.viewAccount",
                "View Account"
              ),
            };
            return permissionMap[perm] || perm;
          }),
        },
      ]
    : [
        {
          moduleName: professor.assignedModules?.[0]?.name || "Mathematics",
          permissions: [
            safeTranslate(
              "professor.permissions.contentCreation",
              "Content Creation"
            ),
            safeTranslate(
              "professor.permissions.questionAnswering",
              "Question Answering"
            ),
            safeTranslate(
              "professor.permissions.exerciseExamCorrection",
              "Exercise and Exam Correction"
            ),
          ],
        },
        // Add more modules if professor has multiple assignments
        ...(professor.assignedModules?.slice(1).map((module) => ({
          moduleName: module.name,
          permissions: [
            safeTranslate(
              "professor.permissions.contentCreation",
              "Content Creation"
            ),
            safeTranslate(
              "professor.permissions.questionAnswering",
              "Question Answering"
            ),
            safeTranslate(
              "professor.permissions.exerciseExamCorrection",
              "Exercise and Exam Correction"
            ),
          ],
        })) || []),
      ];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className={`w-full self-stretch rounded-[60px] bg-[var(--Surface-Level-2,#F8F8F8)] dark:bg-[#1A1A1A] px-10 py-11 flex flex-col items-start gap-8 ${className}`}
      aria-label={titleText}
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white">
          {titleText}
        </h2>

        <div className="flex items-center gap-2">
          <Button
            state="outlined"
            size="S"
            text={safeTranslate("professor.profile.edit", "Edit Details")}
            icon={<Edit className="w-4 h-4" />}
            icon_position={isRTL ? "right" : "left"}
            onClick={() => setModalOpen(true)}
            optionalStyles="!px-4 !py-2"
          />
        </div>
      </div>

      {/* Information Fields */}
      <div className="w-full flex flex-col items-start gap-6 self-stretch">
        {/* Full Name */}
        <div className="w-full flex flex-col items-start gap-2">
          <div className="text-lg font-medium text-neutral-900 dark:text-neutral-300">
            {safeTranslate("professor.profile.fullName", "Full Name")}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            {professor.firstName} {professor.lastName}
          </div>
        </div>

        {/* Gender - Only show for non-admin */}
        {!isAdmin && professor.gender && (
          <div className="w-full flex flex-col items-start gap-2">
            <div className="text-lg font-medium text-neutral-900 dark:text-neutral-300">
              {safeTranslate("professor.profile.gender", "Gender")}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400 capitalize">
              {safeTranslate(
                `common.gender.${professor.gender}`,
                professor.gender
              )}
            </div>
          </div>
        )}

        {/* Date of Birth - Only show for non-admin or if admin has it */}
        {(!isAdmin || professor.birthdate) && professor.birthdate && (
          <div className="w-full flex flex-col items-start gap-2">
            <div className="text-lg font-medium text-neutral-900 dark:text-neutral-300">
              {safeTranslate("professor.profile.dateOfBirth", "Date of Birth")}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              {new Date(professor.birthdate).toLocaleDateString()}
            </div>
          </div>
        )}

        {/* Phone Number - Only show if exists */}
        {professor.phone && (
          <div className="w-full flex flex-col items-start gap-2">
            <div className="text-lg font-medium text-neutral-900 dark:text-neutral-300">
              {safeTranslate("professor.profile.phoneNumber", "Phone Number")}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              {professor.phone}
            </div>
          </div>
        )}

        {/* Email Address */}
        <div className="w-full flex flex-col items-start gap-2">
          <div className="text-lg font-medium text-neutral-900 dark:text-neutral-300">
            {safeTranslate("professor.profile.emailAddress", "Email Address")}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            {professor.email || "—"}
          </div>
        </div>

        {/* Wilaya - Only show for non-admin or if admin has it */}
        {(!isAdmin || professor.wilaya) && professor.wilaya && (
          <div className="w-full flex flex-col items-start gap-2">
            <div className="text-lg font-medium text-neutral-900 dark:text-neutral-300">
              {safeTranslate("professor.profile.wilaya", "Wilaya")}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              {professor.wilaya}
            </div>
          </div>
        )}

        {/* Permissions */}
        <div className="w-full flex flex-col items-start gap-4">
          <div className="text-lg font-medium text-neutral-900 dark:text-neutral-300">
            {safeTranslate("professor.profile.permissions", "Permissions")}
          </div>

          <div className="w-full flex flex-col gap-6">
            {professorPermissions.map((modulePermission, index) => (
              <div key={index} className="w-full">
                {/* Module Name */}
                <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-3">
                  {modulePermission.moduleName}
                </div>

                {/* Permission Tags */}
                <div className="flex flex-wrap gap-2">
                  {modulePermission.permissions.map((permission, permIndex) => (
                    <Tag
                      key={permIndex}
                      icon={null}
                      text={permission}
                      className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 py-1.5"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <ProfessorEditModal
        open={modalOpen}
        professor={professor}
        onClose={() => setModalOpen(false)}
        onSave={onSave}
      />
    </section>
  );
}

"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { UserProfile } from "@/types/modules";
import StudentEditModal from "./StudentEditModal";

interface Props {
  user: UserProfile;
  className?: string;
  onSave?: (payload: Partial<UserProfile>) => Promise<void> | void; 
}

export default function StudentInformation({ user, className = "", onSave }: Props) {
  const { t, isRTL } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const titleText = t("profile.title") ?? "Student Information";

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className={`w-full self-stretch rounded-[60px] bg-[var(--Surface-Level-2,#F8F8F8)] dark:bg-[#1A1A1A] px-10 py-11 flex flex-col items-start gap-8 ${className}`}
      aria-label={titleText}
    >
      <div className="flex items-center justify-between w-full">
        <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white">{titleText}</h2>

        <div className="flex items-center gap-2">
          <Button
            state="outlined"
            size="S"
            text={t("profile.edit") ?? "Edit Details"}
            icon={<Edit className="w-4 h-4" />}
            icon_position={isRTL ? "right" : "left"}
            onClick={() => setModalOpen(true)}
            optionalStyles="!px-4 !py-2"
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-start gap-6 self-stretch">
        <div className="w-full flex flex-col items-start gap-2">
          <div className="text-lg text-neutral-900 dark:text-neutral-300">{t("admin.manageStudents.fullName") ?? "Full Name"}</div>
          <div className="mt-1 text-sm text-neutral-800 dark:text-neutral-100">{user.name} {user.lastname}</div>
        </div>

        <div className="w-full flex flex-col items-start gap-2">
          <div className="text-lg text-neutral-900 dark:text-neutral-300">{t("admin.manageStudents.phoneNumber") ?? "Phone Number"}</div>
          <div className="mt-1 text-sm text-neutral-800 dark:text-neutral-100">{user.phoneNumber ?? "—"}</div>
        </div>

        <div className="w-full flex flex-col items-start gap-2">
          <div className="text-lg text-neutral-900 dark:text-neutral-300">{t("admin.manageStudents.email") ?? "Email Address"}</div>
          <div className="mt-1 text-sm text-neutral-800 dark:text-neutral-100">{user.email ?? "—"}</div>
        </div>

        <div className="w-full flex flex-col items-start gap-2">
          <div className="text-lg text-neutral-900 dark:text-neutral-300">{t("admin.manageStudents.wilaya") ?? "Wilaya"}</div>
          <div className="mt-1 text-sm text-neutral-800 dark:text-neutral-100">{user.wilaya ?? "—"}</div>
        </div>

        <div className="w-full flex flex-col items-start gap-2">
          <div className="text-lg text-neutral-900 dark:text-neutral-300">{t("admin.manageStudents.academicStream") ?? "Academic Stream"}</div>
          <div className="mt-1 text-sm text-neutral-800 dark:text-neutral-100">{user.academicStream ?? "—"}</div>
        </div>
      </div>

      <StudentEditModal open={modalOpen} user={user} onClose={() => setModalOpen(false)} onSave={onSave} />
    </section>
  );
}
"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Student } from "@/data/students";
import { useLanguage } from "@/hooks/useLanguage";

interface StudentInformationProps {
  student: Student;
  className?: string;
}

export default function StudentInformation({ student, className = "" }: StudentInformationProps) {
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  const backText = t("admin.manageStudents.backToStudents") ?? "Back to Students";
  const titleText = t("admin.manageStudents.titleTwo") ?? "Student Information";

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className={`w-full self-stretch rounded-[60px] bg-[var(--Surface-Level-2,#F8F8F8)] dark:bg-[#1A1A1A] px-10 py-11 flex flex-col items-start gap-8 ${className}`}
      aria-label={titleText}
    >
      {/* Back button area */}
      <div className={`flex items-start gap-4 ${isRTL ? "self-end" : "self-start"}`}>
        <Button
          state="outlined"
          size="S"
          icon_position={isRTL ? "right" : "left"}
          icon={isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          text={backText}
          onClick={() => router.push("/professor/manage-students")}
          optionalStyles="flex items-center gap-3 px-4 py-2 rounded-full border border-neutral-200 dark:border-gray-700 text-sm bg-white/0 dark:bg-transparent hover:bg-neutral-50 dark:hover:bg-gray-800"
        />
      </div>

      {/* title + informations */}
      <div className="w-full flex flex-col items-start gap-6 self-stretch">
        {/* Title */}
        <div className={`w-full flex items-start gap-4 self-stretch ${isRTL ? "justify-end" : "justify-start"}`}>
          <h2
            className={`text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white ${isRTL ? "text-right" : "text-left"}`}
          >
            {titleText}
          </h2>
        </div>

        {/* Informations */}
        <div className="w-full flex flex-col items-start gap-6 self-stretch">
          <div className="w-full flex flex-col items-start gap-2">
            <div className="text-lg text-neutral-900 dark:text-neutral-300">
              {t("admin.manageStudents.fullName") ?? "Full Name"}
            </div>
            <div className="mt-1 text-sm text-neutral-800 dark:text-neutral-100">{student.name}</div>
          </div>

          <div className="w-full flex flex-col items-start gap-2">
            <div className="text-lg text-neutral-900 dark:text-neutral-300">
              {t("admin.manageStudents.phoneNumber") ?? "Phone Number"}
            </div>
            <div className="mt-1 text-sm text-neutral-800 dark:text-neutral-100">{student.phone ?? "—"}</div>
          </div>

          <div className="w-full flex flex-col items-start gap-2">
            <div className="text-lg text-neutral-900 dark:text-neutral-300">
              {t("admin.manageStudents.email") ?? "Email Address"}
            </div>
            <div className="mt-1 text-sm text-neutral-800 dark:text-neutral-100">{student.email ?? "—"}</div>
          </div>

          <div className="w-full flex flex-col items-start gap-2">
            <div className="text-lg text-neutral-900 dark:text-neutral-300">
              {t("admin.manageStudents.wilaya") ?? "Wilaya"}
            </div>
            <div className="mt-1 text-sm text-neutral-800 dark:text-neutral-100">{student.wilaya ?? "—"}</div>
          </div>

          <div className="w-full flex flex-col items-start gap-2">
            <div className="text-lg text-neutral-900 dark:text-neutral-300">
              {t("admin.manageStudents.academicStream") ?? "Academic Stream"}
            </div>
            <div className="mt-1 text-sm text-neutral-800 dark:text-neutral-100">{student.academic_stream ?? "—"}</div>
          </div>

          <div className="w-full flex flex-col items-start gap-2">
            <div className="text-lg text-neutral-900 dark:text-neutral-300">
              {t("admin.manageStudents.status") ?? "Status"}
            </div>
            <div className="mt-1 text-sm text-neutral-800 dark:text-neutral-100 capitalize">{student.status ?? "active"}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
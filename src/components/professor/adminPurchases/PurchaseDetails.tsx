"use client";

import Tag from "@/components/professor/tag";
import Button from "@/components/ui/button";
import { X } from "lucide-react";
import type { FrontendPurchase } from "@/types/purchases";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";

type Props = {
  purchase: FrontendPurchase | null;
  open: boolean;
  onClose: () => void;
  onChangeStatus?: (status: string) => void;
};

export default function PurchaseDetails({
  purchase,
  open,
  onClose,
  onChangeStatus,
}: Props) {
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  if (!open || !purchase) return null;

  const isValidated = String(purchase.status).toLowerCase() === "validated";
  const statusKey = String(purchase.status).toLowerCase();

  const tagClass =
    statusKey === "new"
      ? "bg-warning-100 text-warning-400"
      : isValidated
      ? "bg-success-100 text-success-400"
      : "bg-error-100 text-error-400";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/50"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex flex-col bg-neutral-100 dark:bg-[#1A1A1A] rounded-[60px]"
        style={{
          width: 868,
          height: "80vh",
        }}
      >
        {/* Fixed header: date, title, status + action */}
        <div
          className="flex-shrink-0"
          style={{
            padding: "44px 40px 24px 40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div className="flex items-start justify-between w-full">
            <div>
              <div className="text-xs text-neutral-500">
                {purchase.date} - {purchase.time}
              </div>
              <div
                className="text-xs text-neutral-500 dark:text-neutral-400"
                aria-hidden
              />
              <h3 className="text-3xl font-semibold text-neutral-900 dark:text-white">
                {t("admin.managePurchases.details.title") ?? "Purchase Details"}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <Button
                state="text"
                size="S"
                icon_position="icon-only"
                icon={<X />}
                onClick={onClose}
                optionalStyles="p-2"
              />
            </div>
          </div>

          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="text-sm text-neutral-700 dark:text-neutral-300">
                {t("admin.managePurchases.details.statusLabel") ?? "Status :"}
              </div>
              <Tag
                icon={null}
                text={
                  t(`admin.managePurchases.status.${statusKey}`) ??
                  purchase.status
                }
                className={tagClass + " px-3 py-1 rounded-full"}
              />
            </div>

            <div>
              {!isValidated && (
                <Button
                  text={
                    t("admin.managePurchases.details.changeToValidated") ??
                    "Change to Validated"
                  }
                  state="filled"
                  size="S"
                  icon_position="none"
                  onClick={() => onChangeStatus?.("Validated")}
                />
              )}
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            padding: "0 40px 44px 40px",
            scrollbarWidth: "thin",
            scrollbarColor: isRTL
              ? "rgba(0,0,0,0.2) transparent"
              : "rgba(0,0,0,0.2) transparent",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 52,
            }}
          >
            {/* Student information (+ View Profile) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 24,
                alignSelf: "stretch",
                width: "100%",
              }}
            >
              <div className="flex items-center justify-between w-full">
                <h4 className="text-2xl font-semibold text-neutral-800 dark:text-white">
                  {t("admin.managePurchases.details.studentInformation") ??
                    "Student Information"}
                </h4>
                <div>
                  <Button
                    text={
                      t("admin.managePurchases.details.viewProfile") ??
                      "View Profile"
                    }
                    state="outlined"
                    size="S"
                    icon_position="none"
                    onClick={() =>
                      router.push(`/manage-students/${purchase.studentId}`)
                    }
                    optionalStyles="!px-4 !py-2"
                  />
                </div>
              </div>

              <div className="w-full text-sm text-neutral-600 dark:text-neutral-300 flex flex-col gap-6">
                <div>
                  <div className="text-lg text-neutral-900 dark:text-neutral-100">
                    {t("admin.managePurchases.details.fullName") ?? "Full Name"}
                  </div>
                  <div className="mt-1 text-base text-neutral-400 dark:text-neutral-200">
                    {purchase.studentName}
                  </div>
                </div>

                <div>
                  <div className="text-lg text-neutral-900 dark:text-neutral-100">
                    {t("admin.managePurchases.details.phoneNumber") ??
                      "Phone Number"}
                  </div>
                  <div
                    className="mt-1 text-base text-neutral-400 dark:text-neutral-200"
                    dir="ltr"
                  >
                    {purchase.studentPhone}
                  </div>
                </div>

                <div>
                  <div className="text-lg text-neutral-900 dark:text-neutral-100">
                    {t("admin.managePurchases.details.emailAddress") ??
                      "Email Address"}
                  </div>
                  <div className="mt-1 text-base text-neutral-400 dark:text-neutral-200">
                    {purchase.studentEmail}
                  </div>
                </div>

                <div>
                  <div className="text-lg text-neutral-900 dark:text-neutral-100">
                    {t("admin.managePurchases.details.academicStream") ??
                      "Academic Stream"}
                  </div>
                  <div className="mt-1 text-base text-neutral-400 dark:text-neutral-200">
                    {purchase.studentStream}
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase info */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 24,
                alignSelf: "stretch",
                width: "100%",
              }}
            >
              <h4 className="text-2xl font-semibold text-neutral-800 dark:text-white">
                {t("admin.managePurchases.details.purchaseInfoTitle") ??
                  "Purchase info"}
              </h4>

              <div className="w-full text-sm text-neutral-600 dark:text-neutral-300 flex flex-col gap-6">
                <div>
                  <div className="text-lg text-neutral-900 dark:text-neutral-100">
                    {t("admin.managePurchases.details.module") ?? "Module"}
                  </div>
                  <div className="mt-1 text-base text-neutral-500 dark:text-neutral-200">
                    {purchase.moduleName}
                  </div>
                </div>

                <div>
                  <div className="text-lg text-neutral-900 dark:text-neutral-100">
                    {t("admin.managePurchases.details.chapter") ?? "Chapter"}
                  </div>
                  <div className="mt-1 text-base text-neutral-500 dark:text-neutral-200">
                    {purchase.chapterName}
                  </div>
                </div>

                <div>
                  <div className="text-lg text-neutral-900 dark:text-neutral-100">
                    {t("admin.managePurchases.details.price") ?? "Price"}
                  </div>
                  <div className="mt-1 text-base text-neutral-500 dark:text-neutral-200">
                    {purchase.price}
                  </div>
                </div>

                <div>
                  <div className="text-lg text-neutral-900 dark:text-neutral-100">
                    {t("admin.managePurchases.details.receipt") ??
                      "Receipt file"}
                  </div>
                  <div className="mt-2 flex items-center gap-2 bg-neutral-50 dark:bg-[#111112] px-3 py-2 rounded">
                    <div className="text-sm text-primary-600 dark:text-primary-300 underline">
                      {purchase.receipt.split("/").pop()}
                    </div>
                    <a
                      href={purchase.receipt}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto text-xs text-neutral-500 dark:text-neutral-400"
                    >
                      {t("common.downloadShort") ?? "Download"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

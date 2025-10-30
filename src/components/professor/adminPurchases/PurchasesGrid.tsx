"use client";

import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DataTable } from "@/components/tables/data-table";
import { purchases_columns } from "@/components/tables/purchases/purchases_columns";
import Button from "@/components/ui/button";
import DropDown from "@/components/input/dropDown";
import { useLanguage } from "@/hooks/useLanguage";
import PurchaseDetails from "./PurchaseDetails";
import Loader from "@/components/ui/Loader";
import { PurchasesApi } from "@/api/purchases";
import type { FrontendPurchase } from "@/types/purchases";
import { mapApiPurchaseToFrontend } from "@/types/purchases";

interface PurchasesGridProps {
  initialPageSize?: number;
  className?: string;
}

export default function PurchasesGrid({
  initialPageSize = 10,
  className = "",
}: PurchasesGridProps) {
  const { t, isRTL } = useLanguage();
  const [pageSize, setPageSize] = useState<number>(initialPageSize ?? 10);
  const [page, setPage] = useState<number>(1);
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);

  const [selectedPurchase, setSelectedPurchase] =
    useState<FrontendPurchase | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // API state
  const [purchases, setPurchases] = useState<FrontendPurchase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("old");

  // Fetch purchases from API
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        setError(null);

        const statusMap: Record<string, string | undefined> = {
          all: undefined,
          new: "pending",
          validated: "approved",
          rejected: "rejected",
        };

        const response = await PurchasesApi.getAllPurchases({
          page,
          per_page: pageSize,
          status: statusMap[statusFilter],
        });

        if (response.success && response.data) {
          const frontendPurchases = response.data.purchases.map(
            mapApiPurchaseToFrontend
          );

          // Apply client-side sorting if needed
          if (sortOrder === "new") {
            frontendPurchases.reverse();
          }

          setPurchases(frontendPurchases);
          setTotal(response.data.total);
          setTotalPages(response.data.total_pages);
        } else {
          setError(response.message || "Failed to fetch purchases");
        }
      } catch (err) {
        console.error("Error fetching purchases:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [page, pageSize, statusFilter, sortOrder]);

  const filtered = useMemo(() => purchases, [purchases]);
  const visible = filtered;

  const toggleMenu = (id: string) =>
    setOpenMenuFor((p) => (p === id ? null : id));
  const menuPositionStyle = isRTL ? { left: 0 } : { right: 0 };

  const handleView = (p: FrontendPurchase) => {
    setSelectedPurchase(p);
    setDetailsOpen(true);
    setOpenMenuFor(null);
  };

  const handleValidate = async (p: FrontendPurchase) => {
    try {
      const response = await PurchasesApi.updatePurchaseStatus(p.id, {
        status: "approved",
      });

      if (response.success) {
        // Refresh purchases list
        setPurchases((prev) =>
          prev.map((purchase) =>
            purchase.id === p.id
              ? { ...purchase, status: "Validated" }
              : purchase
          )
        );
      } else {
        alert(
          t("admin.managePurchases.error.updateFailed") ||
            "Failed to update purchase status"
        );
      }
    } catch (err) {
      console.error("Error validating purchase:", err);
      alert(
        t("admin.managePurchases.error.updateFailed") ||
          "Failed to update purchase status"
      );
    }
    setOpenMenuFor(null);
  };

  const handleReject = async (p: FrontendPurchase) => {
    const reason = prompt(
      t("admin.managePurchases.prompt.rejectionReason") ||
        "Rejection reason (optional):"
    );

    try {
      const response = await PurchasesApi.updatePurchaseStatus(p.id, {
        status: "rejected",
        rejection_reason: reason || undefined,
      });

      if (response.success) {
        // Refresh purchases list
        setPurchases((prev) =>
          prev.map((purchase) =>
            purchase.id === p.id
              ? { ...purchase, status: "Rejected" }
              : purchase
          )
        );
      } else {
        alert(
          t("admin.managePurchases.error.updateFailed") ||
            "Failed to update purchase status"
        );
      }
    } catch (err) {
      console.error("Error rejecting purchase:", err);
      alert(
        t("admin.managePurchases.error.updateFailed") ||
          "Failed to update purchase status"
      );
    }
    setOpenMenuFor(null);
  };

  const columns = purchases_columns(
    toggleMenu,
    openMenuFor,
    menuPositionStyle,
    setOpenMenuFor,
    t,
    { onView: handleView, onValidate: handleValidate, onReject: handleReject }
  );

  const prevIcon = isRTL ? <ChevronRight /> : <ChevronLeft />;
  const nextIcon = isRTL ? <ChevronLeft /> : <ChevronRight />;

  const perPageOptions = [5, 10, 20, 50];

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`w-full ${className} flex flex-col min-h-[560px]`}
    >
      <div className="w-full bg-neutral-100 dark:bg-[#1A1A1A] rounded-[52px] py-6 px-4 flex flex-col gap-4 flex-grow">
        {/* Title */}
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-semibold text-neutral-800 dark:text-white">
            {t("admin.managePurchases.title") ?? "Purchases"}
          </h2>
        </div>

        {/* Error display */}
        {error && (
          <div className="px-2">
            <div className="bg-error-100 text-error-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* ✅ STANDARDIZED: Filters with flex-wrap */}
        <div className="mt-2 px-2">
          <div className="flex flex-wrap items-start sm:items-center justify-between gap-4 w-full">
            {/* Filter dropdowns group with flex-wrap and min-w-0 */}
            <div className="flex flex-wrap gap-3 min-w-0">
              <div className="w-full sm:w-auto min-w-0">
                <DropDown
                  placeholder={
                    t("admin.managePurchases.filter") ?? "Purchase Status: New"
                  }
                  options={[
                    { id: "all", text: t("common.all") ?? "All" },
                    {
                      id: "new",
                      text: t("admin.managePurchases.status.new") ?? "New",
                    },
                    {
                      id: "validated",
                      text:
                        t("admin.managePurchases.status.validated") ??
                        "Validated",
                    },
                    {
                      id: "rejected",
                      text:
                        t("admin.managePurchases.status.rejected") ??
                        "Rejected",
                    },
                  ]}
                  onChange={(id: string | number) => {
                    setStatusFilter(String(id));
                    setPage(1);
                  }}
                  max_width="max-w-48"
                />
              </div>

              <div className="w-full sm:w-auto min-w-0">
                <DropDown
                  placeholder={
                    t("admin.managePurchases.sort") ?? "Sort: Oldest first"
                  }
                  options={[
                    {
                      id: "old",
                      text:
                        t("admin.managePurchases.sortTwo.old") ??
                        "Oldest first",
                    },
                    {
                      id: "new",
                      text:
                        t("admin.managePurchases.sortTwo.new") ??
                        "Newest first",
                    },
                  ]}
                  onChange={(id: string | number) => {
                    setSortOrder(String(id));
                  }}
                  max_width="max-w-48"
                />
              </div>
            </div>

            {/* Show count dropdown - flex-shrink-0 to prevent crushing */}
            <div className="w-full sm:w-auto flex-shrink-0">
              <DropDown
                placeholder={t("common.show") ?? "Show"}
                options={perPageOptions.map((n) => ({
                  id: String(n),
                  text: `${(
                    t("common.showCount") || "Show {count} elements"
                  ).replace(/\{count\}/g, String(n))}`,
                }))}
                onChange={(id: string | number) => {
                  const size = Number(id);
                  if (!Number.isNaN(size)) {
                    setPageSize(size);
                    setPage(1);
                  }
                }}
                max_width="max-w-80"
              />
            </div>
          </div>
        </div>

        <div className="w-full border-t border-transparent px-2" />

        <div className="px-2">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader />
            </div>
          ) : (
            <DataTable columns={columns} data={visible} />
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="w-full flex justify-center items-center mt-4">
        <div className="rounded-full w-fit bg-white btn-elevation-1 px-4 py-2 flex flex-row gap-7 items-center dark:bg-[#0B0B0B]">
          <div>
            <Button
              state={"text"}
              size={"XS"}
              icon_position={"icon-only"}
              icon={prevIcon}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              optionalStyles="p-1"
            />
          </div>

          <div
            className={`flex items-center gap-5 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {[...Array(totalPages)].map((_, i) => {
              if (i > page + 4 || i < page - 5)
                return <div className="hidden" key={i} />;
              if (i === page + 4 || i === page - 5) {
                return (
                  <div
                    className="text-neutral-400 dark:text-neutral-500"
                    key={i}
                  >
                    ...
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-7 aspect-square rounded-full select-none cursor-pointer flex justify-center items-center ${
                    page === i + 1
                      ? "bg-primary-100 text-primary-600"
                      : "bg-white text-neutral-400 dark:bg-[#111112] dark:text-neutral-500"
                  }`}
                  aria-current={page === i + 1 ? "page" : undefined}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>

          <div>
            <Button
              state={"text"}
              size={"XS"}
              icon_position={"icon-only"}
              icon={nextIcon}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              optionalStyles="p-1"
            />
          </div>
        </div>
      </div>

      {/* Details modal */}
      <PurchaseDetails
        purchase={selectedPurchase}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onChangeStatus={async (newStatus) => {
          if (!selectedPurchase) return;

          const statusMap: Record<string, "pending" | "approved" | "rejected"> =
            {
              New: "pending",
              Validated: "approved",
              Rejected: "rejected",
            };

          try {
            const response = await PurchasesApi.updatePurchaseStatus(
              selectedPurchase.id,
              { status: statusMap[newStatus] || "pending" }
            );

            if (response.success) {
              // Update local state
              setPurchases((prev) =>
                prev.map((purchase) =>
                  purchase.id === selectedPurchase.id
                    ? { ...purchase, status: newStatus }
                    : purchase
                )
              );
              setDetailsOpen(false);
            } else {
              alert(
                t("admin.managePurchases.error.updateFailed") ||
                  "Failed to update purchase status"
              );
            }
          } catch (err) {
            console.error("Error updating purchase status:", err);
            alert(
              t("admin.managePurchases.error.updateFailed") ||
                "Failed to update purchase status"
            );
          }
        }}
      />
    </div>
  );
}

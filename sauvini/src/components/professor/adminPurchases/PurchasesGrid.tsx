"use client";

import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DataTable } from "@/components/tables/data-table";
import { purchases_columns } from "@/components/tables/purchases/purchases_columns";
import Button from "@/components/ui/button";
import DropDown from "@/components/input/dropDown";
import { useLanguage } from "@/hooks/useLanguage";
import { Purchase } from "@/data/purchases";
import PurchaseDetails from "./PurchaseDetails";

interface PurchasesGridProps {
  purchases?: Purchase[];
  initialPageSize?: number;
  className?: string;
}

export default function PurchasesGrid({
  purchases = [],
  initialPageSize = 10,
  className = "",
}: PurchasesGridProps) {
  const { t, isRTL } = useLanguage();
  const [pageSize, setPageSize] = useState<number>(initialPageSize ?? 10);
  const [page, setPage] = useState<number>(1);
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);

  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filtered = useMemo(() => purchases, [purchases]);

  const total = filtered.length;
  const safePageSize = Math.max(1, pageSize || 1);
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  const start = (page - 1) * safePageSize;
  const visible = filtered.slice(start, start + safePageSize);

  const toggleMenu = (id: string) => setOpenMenuFor((p) => (p === id ? null : id));
  const menuPositionStyle = isRTL ? { left: 0 } : { right: 0 };

  // dummy handlers
  const handleView = (p: Purchase) => {
    setSelectedPurchase(p);
    setDetailsOpen(true);
    setOpenMenuFor(null);
  };

  const handleValidate = (p: Purchase) => {
    console.log("validate purchase", p.id);
    setOpenMenuFor(null);
  };

  const handleReject = (p: Purchase) => {
    console.log("reject purchase", p.id);
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
    <div dir={isRTL ? "rtl" : "ltr"} className={`w-full ${className} flex flex-col min-h-[560px]`}>
      <div className="w-full bg-neutral-100 dark:bg-[#1A1A1A] rounded-[52px] py-6 px-4 flex flex-col gap-4 flex-grow">
        {/* Title */}
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-semibold text-neutral-800 dark:text-white">
            {t("admin.managePurchases.title") ?? "Purchases"}
          </h2>
        </div>

        {/* Filters */}
        <div className="mt-2 px-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
              <div className="w-full sm:w-auto">
                <DropDown
                  placeholder={t("admin.managePurchases.filter") ?? "Purchase Status: New"}
                  options={[
                    { id: "all", text: t("common.all") ?? "All" },
                    { id: "new", text: t("admin.managePurchases.status.new") ?? "New" },
                    { id: "validated", text: t("admin.managePurchases.status.validated") ?? "Validated" },
                    { id: "rejected", text: t("admin.managePurchases.status.rejected") ?? "Rejected" },
                  ]}
                  onChange={() => {}}
                  max_width="max-w-48"
                />
              </div>

              <div className="w-full sm:w-auto">
                <DropDown
                  placeholder={t("admin.managePurchases.sort") ?? "Sort: Oldest first"}
                  options={[
                    { id: "old", text: t("admin.managePurchases.sortTwo.old") ?? "Oldest first" },
                    { id: "new", text: t("admin.managePurchases.sortTwo.new") ?? "Newest first" },
                  ]}
                  onChange={() => {}}
                  max_width="max-w-48"
                />
              </div>
            </div>

            {/* show-count */}
            <div className="w-full sm:w-auto min-w-0 sm:min-w-[220px]">
              <DropDown
                placeholder={t("common.show") ?? "Show"}
                options={perPageOptions.map((n) => ({
                  id: String(n),
                  text: `${(t("common.showCount") || "Show {count} elements").replace(/\{count\}/g, String(n))}`,
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
          <DataTable columns={columns} data={visible} />
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

          <div className={`flex items-center gap-5 ${isRTL ? "flex-row-reverse" : ""}`}>
            {[...Array(totalPages)].map((_, i) => {
              if (i > page + 4 || i < page - 5) return <div className="hidden" key={i} />;
              if (i === page + 4 || i === page - 5) {
                return (
                  <div className="text-neutral-400 dark:text-neutral-500" key={i}>
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
        onChangeStatus={(newStatus) => {
          console.log("change status to", newStatus);
          setDetailsOpen(false);
        }}
      />
    </div>
  );
}
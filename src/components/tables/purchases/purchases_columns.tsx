"use client";

import { ColumnDef } from "@tanstack/react-table";
import Button from "@/components/ui/button";
import { MoreHorizontal, Eye, CheckCircle, XCircle } from "lucide-react";
import Tag from "@/components/professor/tag";
import type { FrontendPurchase } from "@/types/purchases";

type Handlers = {
  onView: (p: FrontendPurchase) => void;
  onValidate: (p: FrontendPurchase) => void;
  onReject: (p: FrontendPurchase) => void;
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const purchases_columns = (
  toggleMenu: (id: string) => void,
  openMenuFor: string | null,
  menuPositionStyle: any,
  setOpenMenuFor: (id: string | null) => void,
  t: any,
  handlers: Handlers
): ColumnDef<FrontendPurchase>[] => [
  {
    accessorKey: "moduleName",
    header: "Module Name",
    size: 180,
    cell: ({ row }) => (
      <div
        className="w-[180px] text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate px-2"
        title={row.getValue("moduleName") as string}
      >
        {row.getValue("moduleName")}
      </div>
    ),
  },
  {
    accessorKey: "chapterName",
    header: "Chapter Name",
    size: 180,
    cell: ({ row }) => (
      <div
        className="w-[180px] text-sm text-neutral-500 dark:text-neutral-400 truncate px-2"
        title={row.getValue("chapterName") as string}
      >
        {row.getValue("chapterName")}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    size: 120,
    cell: ({ row }) => (
      <div className="w-[120px] text-sm text-neutral-600 dark:text-neutral-300 truncate px-2">
        {row.getValue("price")}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    size: 140,
    cell: ({ row }) => (
      <div
        dir="ltr"
        className="w-[140px] text-sm text-neutral-500 dark:text-neutral-400 truncate px-2"
      >
        {row.getValue("phone")}
      </div>
    ),
  },
  {
    accessorKey: "receipt",
    header: "Receipt",
    size: 110,
    cell: ({ row }) => {
      const receiptUrl = row.getValue("receipt") as string;
      const fileName = receiptUrl.split("/").pop() || "Receipt.pdf";
      return (
        <div className="w-[110px] px-2">
          <a
            className="text-sm text-primary-600 dark:text-primary-300 underline truncate block"
            href={receiptUrl}
            target="_blank"
            rel="noreferrer"
            title={fileName}
          >
            {t("admin.managePurchases.receipt") ?? "Receipt.pdf"}
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    size: 110,
    cell: ({ row }) => (
      <div className="w-[110px] text-sm text-neutral-500 dark:text-neutral-400 truncate px-2">
        {row.getValue("date")}
      </div>
    ),
  },
  {
    accessorKey: "time",
    header: "Time",
    size: 90,
    cell: ({ row }) => (
      <div className="w-[90px] text-sm text-neutral-500 dark:text-neutral-400 truncate px-2">
        {row.getValue("time")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 110,
    cell: ({ row }) => {
      const statusRaw = (row.getValue("status") as string) || "";
      const status = statusRaw.toLowerCase();
      const statusClass =
        {
          new: "bg-warning-100 text-warning-400",
          validated: "bg-success-100 text-success-400",
          rejected: "bg-error-100 text-error-400",
        }[status] ?? "bg-neutral-100 text-neutral-600";

      return (
        <div className="w-[110px] px-2">
          <Tag
            icon={null}
            text={t(`admin.managePurchases.status.${status}`) ?? statusRaw}
            className={`${statusClass} px-3 py-1 rounded-full`}
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    size: 80,
    cell: ({ row }) => {
      const id = row.original.id;
      const purchase = row.original as FrontendPurchase;
      return (
        <div className="w-[80px] flex items-center justify-end relative px-2">
          <Button
            state="text"
            size="S"
            icon_position="icon-only"
            icon={
              <MoreHorizontal className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
            }
            onClick={() => toggleMenu(id)}
            optionalStyles="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-haspopup="menu"
            aria-expanded={openMenuFor === id}
          />

          {openMenuFor === id && (
            <div
              role="menu"
              className="absolute mt-2 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-10"
              style={{ top: "100%", ...menuPositionStyle, minWidth: 160 }}
              onMouseLeave={() => setOpenMenuFor(null)}
            >
              <Button
                state="text"
                size="S"
                icon_position="left"
                icon={
                  <Eye className="w-4 h-4 text-neutral-600 dark:text-neutral-200" />
                }
                text={t("admin.managePurchases.viewDetails") ?? "View Details"}
                onClick={() => {
                  handlers.onView(purchase);
                }}
                optionalStyles="w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded mb-1"
              />

              {String(purchase.status).toLowerCase() === "new" && (
                <>
                  <Button
                    state="text"
                    size="S"
                    icon_position="left"
                    icon={<CheckCircle className="w-4 h-4 text-success-500" />}
                    text={t("admin.managePurchases.validate") ?? "Validate"}
                    onClick={() => handlers.onValidate(purchase)}
                    optionalStyles="w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded mb-1"
                  />

                  <Button
                    state="text"
                    size="S"
                    icon_position="left"
                    icon={<XCircle className="w-4 h-4 text-error-500" />}
                    text={t("admin.managePurchases.reject") ?? "Reject"}
                    onClick={() => handlers.onReject(purchase)}
                    optionalStyles="w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                  />
                </>
              )}
            </div>
          )}
        </div>
      );
    },
  },
];

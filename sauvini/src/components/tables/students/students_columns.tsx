"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye } from "lucide-react";
import Button from "@/components/ui/button";
import { Student } from "@/data/students";

export const student_columns = (
  toggleMenu: (id: string) => void,
  openMenuFor: string | null,
  menuPositionStyle: any,
  setOpenMenuFor: (id: string | null) => void,
  router: any,
  t: any
): ColumnDef<Student>[] => [
  {
    accessorKey: "profile_picture",
    header: "Profile",
    cell: ({ row }) => {
      const profile = row.getValue("profile_picture");
      const name = row.getValue("name");
      return (
        <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
          {profile ? (
            <Image src={profile as string} alt={name as string} width={48} height={48} className="object-cover" />
          ) : (
            <div className="w-full h-full bg-neutral-300 flex items-center justify-center text-white">
              {(name as string || "U").split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="text-sm font-medium text-neutral-800 dark:text-white truncate">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div className="text-sm text-neutral-500 dark:text-neutral-400">{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="text-sm text-neutral-500 dark:text-neutral-400 truncate">{row.getValue("email")}</div>,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <div className="flex items-center justify-end relative">
          <Button
            state="text"
            size="S"
            icon_position="icon-only"
            icon={<MoreHorizontal className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />}
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
                icon={<Eye className="w-4 h-4" />}
                text={t("admin.manageStudents.viewProfile") ?? "View Profile"}
                onClick={() => {
                  setOpenMenuFor(null);
                  router.push(`/professor/manage-students/${id}`);
                }}
                optionalStyles="w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
              />
            </div>
          )}
        </div>
      );
    },
  },
];
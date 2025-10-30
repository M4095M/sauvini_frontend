"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye } from "lucide-react";
import Button from "@/components/ui/button";
import Tag from "@/components/questions/tag";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    header: "Profile Picture",
    size: 100,
    cell: ({ row }) => {
      const profilePicture = row.getValue("profile_picture") as string;
      const name = row.getValue("name") as string;
      return (
        <div className="w-[100px] flex items-center px-2">
          <div className="w-14 aspect-square rounded-full bg-neutral-300 overflow-hidden">
            {profilePicture && profilePicture !== "/placeholder.svg" ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden"
                  );
                }}
              />
            ) : null}
            <div
              className={`w-full h-full bg-neutral-300 flex items-center justify-center text-neutral-500 text-xs ${
                profilePicture && profilePicture !== "/placeholder.svg"
                  ? "hidden"
                  : ""
              }`}
            >
              {name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "?"}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
    cell: ({ row }) => {
      return (
        <div
          className="w-[200px] text-sm font-medium text-neutral-600 dark:text-neutral-200 truncate px-2"
          title={row.getValue("name")}
        >
          {row.getValue("name")}
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
    size: 150,
    cell: ({ row }) => {
      return (
        <div className="w-[150px] text-sm font-normal text-neutral-400 dark:text-neutral-400 truncate px-2">
          {row.getValue("phone")}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 220,
    cell: ({ row }) => {
      return (
        <div
          className="w-[220px] text-sm font-normal text-neutral-400 dark:text-neutral-400 truncate px-2"
          title={row.getValue("email")}
        >
          {row.getValue("email")}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="w-[120px] px-2">
          <Tag
            icon={undefined}
            text={status || "Active"}
            className={`${
              status === "Active" || !status
                ? "bg-success-100 text-success-400"
                : "bg-warning-100 text-warning-200"
            }`}
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
      return (
        <div className="w-[80px] flex items-center justify-end px-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="">
                <Button
                  state={"text"}
                  size={"S"}
                  icon_position={"icon-only"}
                  icon={<MoreHorizontal />}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem>
                <div
                  className="px-9 py-2 flex gap-3 items-center justify-start"
                  onClick={() =>
                    router.push(`/professor/manage-students/${id}`)
                  }
                >
                  <div className="text-neutral-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M14.6401 12C14.6401 13.4585 13.4577 14.6409 11.9992 14.6409C10.5407 14.6409 9.35831 13.4585 9.35831 12C9.35831 10.5415 10.5407 9.35909 11.9992 9.35909C13.4577 9.35909 14.6401 10.5415 14.6401 12Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3.59961 12C4.72135 8.42851 8.05794 5.83789 11.9996 5.83789C15.9413 5.83789 19.2779 8.42854 20.3996 12C19.2779 15.5715 15.9413 18.1621 11.9996 18.1621C8.05794 18.1621 4.72133 15.5715 3.59961 12Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="text-base text-neutral-600 font-normal">
                    View details
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

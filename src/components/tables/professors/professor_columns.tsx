"use client";

import Tag from "@/components/questions/tag";
import Button from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export type ProfessorColumn = {
  profile_picture: string;
  name: string;
  phone_number: string;
  email: string;
  status: string;
  professor?: any; // Add the full professor object for callbacks
};

export function returnProfessorColumns(
  ManagePermissionCallback: (professor: any) => void,
  ViewDetailsCallback: (professor: any) => void,
  AcceptProfessorCallback: (professor: any) => void,
  DownloadCVCallback: (professor: any) => void
): ColumnDef<ProfessorColumn>[] {
  const result: ColumnDef<ProfessorColumn>[] = [
    {
      accessorKey: "profile_picture",
      header: "Profile Picture",
      size: 100,
      cell: ({ row }) => {
        const profilePicture = row.getValue("profile_picture") as string;
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
                {row.original.name
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
      accessorKey: "phone_number",
      header: "Phone Number",
      size: 150,
      cell: ({ row }) => {
        return (
          <div className="w-[150px] text-sm font-normal text-neutral-400 dark:text-neutral-400 truncate px-2">
            {row.getValue("phone_number")}
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
              text={row.getValue("status")}
              className={`${
                status === "Accepted"
                  ? "bg-success-100 text-success-400"
                  : "bg-warning-100 text-warning-200 "
              }`}
            />
          </div>
        );
      },
    },
    {
      id: "actions",
      size: 80,
      cell: ({ row }) => {
        const payment = row.original;

        const status = row.getValue("status") as string;
        const isAccepted = status === "Accepted";

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
                    onClick={() => ViewDetailsCallback(row.original.professor)}
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
                <DropdownMenuItem>
                  <div
                    className="px-9 py-2 flex gap-3 items-center justify-start"
                    onClick={() => DownloadCVCallback(row.original.professor)}
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
                          d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 10L12 15L17 10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 15V3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="text-base text-neutral-600 font-normal">
                      Download CV
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    if (!isAccepted) {
                      AcceptProfessorCallback(row.original.professor);
                    }
                  }}
                >
                  <div className="px-9 py-2 flex gap-3 items-center justify-start">
                    {/* show if the status is pending */}
                    {!isAccepted ? (
                      <div className="flex flex-row gap-3 items-center cursor-pointer">
                        <div className="text-success-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M7.19961 10.0001L9.06628 11.8668L12.7996 8.13343M18.3996 10.0001C18.3996 14.6393 14.6388 18.4001 9.99961 18.4001C5.36042 18.4001 1.59961 14.6393 1.59961 10.0001C1.59961 5.36091 5.36042 1.6001 9.99961 1.6001C14.6388 1.6001 18.3996 5.36091 18.3996 10.0001Z"
                              stroke="#00A844"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="text-base text-success-400 font-normal">
                          Accept
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex flex-row gap-3 items-center"
                        onClick={() =>
                          ManagePermissionCallback(row.original.professor)
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
                              d="M9 12.7496L11.25 14.9996L15 9.7496M12 2.71387C9.8495 4.75049 6.94563 5.99962 3.75 5.99962C3.69922 5.99962 3.64852 5.9993 3.59789 5.99867C3.2099 7.17878 3 8.43971 3 9.74966C3 15.3412 6.82432 20.0395 12 21.3716C17.1757 20.0395 21 15.3412 21 9.74966C21 8.43971 20.7901 7.17878 20.4021 5.99867C20.3515 5.9993 20.3008 5.99962 20.25 5.99962C17.0544 5.99962 14.1505 4.75049 12 2.71387Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="text-base text-neutral-600 font-normal">
                          Manage permission
                        </div>
                      </div>
                    )}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  return result;
}

export const professor_columns: ColumnDef<ProfessorColumn>[] = [
  {
    accessorKey: "profile_picture",
    header: "Profile Picture",
    cell: ({ row }) => {
      return (
        <div className="w-14 aspect-square rounded-full bg-neutral-300"></div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="text-xl font-medium text-neutral-600">
          {row.getValue("name")}
        </div>
      );
    },
  },
  {
    accessorKey: "phone_number",
    header: "Phone Number",
    cell: ({ row }) => {
      return (
        <div className="text-base font-normal text-neutral-400">
          {row.getValue("phone_number")}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return (
        <div className="text-base font-normal text-neutral-400">
          {row.getValue("email")}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="">
          {/* replace later the text with the language translator */}
          {/* same here set the className relevant to the status value */}
          <Tag
            icon={undefined}
            text={row.getValue("status")}
            className={`${
              status === "Accepted"
                ? "bg-success-100 text-success-400"
                : "bg-warning-100 text-warning-200 "
            }`}
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      const isAccepted = (row.getValue("status") as string) === "Accepted";

      return (
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
              <div className="px-9 py-2 flex gap-3 items-center justify-start">
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
            <DropdownMenuItem>
              <div className="px-9 py-2 flex gap-3 items-center justify-start">
                {/* show if the status is pending */}
                {!isAccepted ? (
                  <div className="flex flex-row gap-3 items-center">
                    <div className="text-success-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M7.19961 10.0001L9.06628 11.8668L12.7996 8.13343M18.3996 10.0001C18.3996 14.6393 14.6388 18.4001 9.99961 18.4001C5.36042 18.4001 1.59961 14.6393 1.59961 10.0001C1.59961 5.36091 5.36042 1.6001 9.99961 1.6001C14.6388 1.6001 18.3996 5.36091 18.3996 10.0001Z"
                          stroke="#00A844"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="text-base text-success-400 font-normal">
                      Accept
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-row gap-3 items-center">
                    <div className="text-neutral-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 12.7496L11.25 14.9996L15 9.7496M12 2.71387C9.8495 4.75049 6.94563 5.99962 3.75 5.99962C3.69922 5.99962 3.64852 5.9993 3.59789 5.99867C3.2099 7.17878 3 8.43971 3 9.74966C3 15.3412 6.82432 20.0395 12 21.3716C17.1757 20.0395 21 15.3412 21 9.74966C21 8.43971 20.7901 7.17878 20.4021 5.99867C20.3515 5.9993 20.3008 5.99962 20.25 5.99962C17.0544 5.99962 14.1505 4.75049 12 2.71387Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="text-base text-neutral-600 font-normal">
                      Manage permission
                    </div>
                  </div>
                )}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

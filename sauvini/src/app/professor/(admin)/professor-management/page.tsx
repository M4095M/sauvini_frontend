"use client";

import AddOption from "@/components/input/addOption";
import DropDown from "@/components/input/dropDown";
import OptionCard from "@/components/input/optionCard";
import FileAttachement from "@/components/lesson/fileAttachment";
import BigTag from "@/components/professor/BigTags";
import Tag from "@/components/questions/tag";
import { DataTable } from "@/components/tables/data-table";
import {
  professor_columns,
  ProfessorColumn,
  returnProfessorColumns,
} from "@/components/tables/professors/professor_columns";
import Button from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronLast, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import ViewTeacherApplicationDetails from "./viewTeacherApplication";
import ProfessorPermission from "./professorPermission";
import ChangeStatusPopup from "./changeStatusPopup";

const professors: ProfessorColumn[] = [
  {
    profile_picture: "https://randomuser.me/api/portraits/men/11.jpg",
    name: "Dr. Ahmed Benali",
    phone_number: "+213 550 123 456",
    email: "ahmed.benali@example.com",
    status: "Accepted",
  },
  {
    profile_picture: "https://randomuser.me/api/portraits/women/12.jpg",
    name: "Prof. Samira Belkacem",
    phone_number: "+213 661 987 654",
    email: "samira.belkacem@example.com",
    status: "Pending",
  },
  {
    profile_picture: "https://randomuser.me/api/portraits/men/15.jpg",
    name: "Dr. Mourad Ait",
    phone_number: "+213 540 555 222",
    email: "mourad.ait@example.com",
    status: "Accepted",
  },
  {
    profile_picture: "https://randomuser.me/api/portraits/women/18.jpg",
    name: "Prof. Nadia Cherif",
    phone_number: "+213 790 444 333",
    email: "nadia.cherif@example.com",
    status: "Accepted",
  },
  {
    profile_picture: "https://randomuser.me/api/portraits/men/21.jpg",
    name: "Dr. Yassine Boudiaf",
    phone_number: "+213 660 777 888",
    email: "yassine.boudiaf@example.com",
    status: "Accepted",
  },
];

type PaginatedTableProps<TData> = {
  data: TData;
  columns: ColumnDef<TData, any>[];
  pageSizeOptions: number[];
};

export default function ProfessorManagementPage({
  data = professors,
  columns,
  pageSizeOptions = [10, 20, 50, 100],
}: PaginatedTableProps<ProfessorColumn[]>) {
  // control pop ups:
  const [showChangeStatusPopup, setShowChangeStatusPopup] = useState(false);
  const [showPermissionPopup, setShowPermissionPopup] = useState(false);
  const [showViewDetailsPopup, setShowViewDetailsPopup] = useState(false);

  // handlers for pop up
  const handleChangeStatusPopup = () => {
    window.scrollTo(0, 0);
    document.body.classList.add("no-scroll");
    setShowChangeStatusPopup(true);
  };

  const handlePermissionPopup = () => {
    window.scrollTo(0, 0);
    document.body.classList.add("no-scroll");
    setShowPermissionPopup(true);
  };

  const handleViewDetailsPopup = () => {
    window.scrollTo(0, 0);
    document.body.classList.add("no-scroll");
    setShowViewDetailsPopup(true);
  };

  // handler for different actions:
  const handleChangeStatus = () => {};
  const handleChangePermission = () => {};

  // parameters for the query (use as query parameters)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);

  // totalPage needed for page navigation:
  // const totalPage = Math.ceil(professors.length / pageSize);
  const totalPage = 7;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  return (
    <div
      className={`w-full flex flex-col gap-6 ${
        showChangeStatusPopup ? "ooverflow-hidden" : ""
      }`}
    >
      <div className="w-full bg-neutral-100 rounded-[52px] py-6 px-3 flex flex-col gap-4">
        {/* header */}
        <div className="flex flex-col">
          {/* title */}
          <div className="font-medium px-4 text-2xl text-primary-600">
            Teachers
          </div>
          {/* filters */}
          <div className="flex flex-row justify-between items-center ">
            <DropDown
              placeholder="Teacher status"
              options={[
                { id: "1", text: "Active" },
                { id: "2", text: "Inactive" },
              ]}
              max_width="max-w-56"
            />
            <DropDown
              placeholder="Show"
              options={[
                { id: "1", text: "10 elements per page" },
                { id: "2", text: "20 elements per page" },
              ]}
              max_width="max-w-56"
              onChange={(size: number) => {
                setPageSize(size);
              }}
            />
          </div>
        </div>
        {/* table content */}
        <div className="">
          <DataTable
            columns={returnProfessorColumns(
              handlePermissionPopup,
              handleViewDetailsPopup,
              handleChangeStatusPopup
            )}
            data={paginatedData}
          />
        </div>
      </div>
      {/* pagination */}
      <div className="w-full flex justify-center items-center">
        <div className="rounded-full w-fit bg-white btn-elevation-1 pw-4 py-2 flex flex-row gap-7 items-center">
          {/* prev */}
          <div className="">
            <Button
              state={"text"}
              size={"XS"}
              icon_position={"icon-only"}
              icon={<ChevronLeft />}
              onClick={() => {
                setPage((prev) => (prev > 1 ? prev - 1 : prev));
              }}
            />
          </div>
          {/* page */}
          <div className="flex items-center gap-5">
            {[...Array(totalPage)].map((_, i) => {
              // show number for last page
              if (i + 1 === totalPage) {
                return (
                  <div
                    className={`w-7 aspect-square rounded-full select-none cursor-pointer flex justify-center items-center${
                      page === i + 1
                        ? "text-neutral-100 bg-primary-200"
                        : "bg-white text-neutral-400"
                    }`}
                    onClick={() => {
                      setPage(i + 1);
                    }}
                    key={i}
                  >
                    {i + 1}
                  </div>
                );
              }

              // skip
              if (i > page + 4 || i < page - 5) {
                return <div className="hidden" key={i}></div>;
              }

              // show ellipses:
              if (i === page + 4 || i === page - 5) {
                return (
                  <div className="text-neutral-400" key={i}>
                    ...
                  </div>
                );
              }

              return (
                <div
                  className={`w-7 aspect-square rounded-full select-none cursor-pointer flex justify-center items-center${
                    page === i + 1
                      ? "text-white bg-primary-200"
                      : "bg-white text-neutral-400"
                  }`}
                  onClick={() => {
                    setPage(i + 1);
                  }}
                  key={i}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
          {/* next */}
          <div className="">
            <Button
              state={"text"}
              size={"XS"}
              icon_position={"icon-only"}
              icon={<ChevronRight />}
              onClick={() => {
                setPage((prev) => (prev < totalPage ? prev + 1 : prev));
              }}
            />
          </div>
        </div>
      </div>

      {/* pop ups: confirm accept */}
      {showChangeStatusPopup && (
        <div className="w-full h-screen flex justify-center items-center bg-black/40 absolute top-0 left-0 z-100000">
          {/* change status pop up */}
          <div className="">
            <ChangeStatusPopup
              onAccept={() => {
                handleChangeStatus();
              }}
              onCancel={() => {
                document.body.classList.remove("no-scroll");
                setShowChangeStatusPopup(false);
              }}
            />
          </div>
        </div>
      )}

      {/* pop ups: view details: */}
      {showViewDetailsPopup && (
        <div className="w-full overflow-y-auto h-screen flex justify-center bg-black/40 absolute top-0 left-0 z-100000">
          <div className="m-20">
            <ViewTeacherApplicationDetails
              applicationsDetails={{}}
              onClose={() => {
                document.body.classList.remove("no-scroll");
                setShowViewDetailsPopup(false);
              }}
            />
          </div>
        </div>
      )}

      {/* pop up: manage permission */}
      {showPermissionPopup && (
        <div className="w-full overflow-y-auto h-screen flex justify-center bg-black/40 absolute top-0 left-0 z-100000">
          <div className="m-20">
            <ProfessorPermission
            handleChangePermission={handleChangePermission}
              onClose={() => {
                document.body.classList.remove("no-scroll");
                setShowPermissionPopup(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

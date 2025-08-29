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
} from "@/components/tables/professors/professor_columns";
import Button from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronLast, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo, useState } from "react";

const professors: ProfessorColumn[] = [
  {
    profile_picture: "https://randomuser.me/api/portraits/men/11.jpg",
    name: "Dr. Ahmed Benali",
    phone_number: "+213 550 123 456",
    email: "ahmed.benali@example.com",
    status: "Active",
  },
  {
    profile_picture: "https://randomuser.me/api/portraits/women/12.jpg",
    name: "Prof. Samira Belkacem",
    phone_number: "+213 661 987 654",
    email: "samira.belkacem@example.com",
    status: "On Leave",
  },
  {
    profile_picture: "https://randomuser.me/api/portraits/men/15.jpg",
    name: "Dr. Mourad Ait",
    phone_number: "+213 540 555 222",
    email: "mourad.ait@example.com",
    status: "Inactive",
  },
  {
    profile_picture: "https://randomuser.me/api/portraits/women/18.jpg",
    name: "Prof. Nadia Cherif",
    phone_number: "+213 790 444 333",
    email: "nadia.cherif@example.com",
    status: "Active",
  },
  {
    profile_picture: "https://randomuser.me/api/portraits/men/21.jpg",
    name: "Dr. Yassine Boudiaf",
    phone_number: "+213 660 777 888",
    email: "yassine.boudiaf@example.com",
    status: "Retired",
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
    <div className="w-full flex flex-col gap-6">
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
          <DataTable columns={professor_columns} data={paginatedData} />
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
                        ? "bg-red-300  text-red-500"
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
                      ? "bg-red-300  text-red-500"
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
            />
          </div>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div className="w-full bg-neutral-100 rounded-[52px] pt-20 pb-11 px-10 flex flex-col gap-12">
  //     {/* teacher */}
  //     <div className="flex flex-col gap-3">
  //       {/* title */}
  //       <div className="font-semibold text-5xl text-neutral-600">
  //         [Teacher’s Name] Application Details
  //       </div>
  //       {/* status info + action */}
  //       <div className="flex flex-row justify-between items-center">
  //         <div className="flex flex-row gap-5">
  //           <div className="text-2xl text-neutral-400 font-normal">Status:</div>
  //           <div className="">
  //             <Tag
  //               icon={
  //                 <svg
  //                   xmlns="http://www.w3.org/2000/svg"
  //                   width="28"
  //                   height="29"
  //                   viewBox="0 0 28 29"
  //                   fill="none"
  //                 >
  //                   <path
  //                     d="M13.9992 10.1446V14.5002L17.2659 17.7669M23.7992 14.5002C23.7992 19.9126 19.4116 24.3002 13.9992 24.3002C8.58683 24.3002 4.19922 19.9126 4.19922 14.5002C4.19922 9.0878 8.58683 4.7002 13.9992 4.7002C19.4116 4.7002 23.7992 9.0878 23.7992 14.5002Z"
  //                     stroke="currentColor"
  //                     strokeWidth="2"
  //                     strokeLinecap="round"
  //                     strokeLinejoin="round"
  //                   />
  //                 </svg>
  //               }
  //               text={"Pending"}
  //               className={"bg-second01-100 text-second01-200"}
  //             />
  //           </div>
  //         </div>
  //         {/* action */}
  //         <div className="">
  //           <Button
  //             state={"filled"}
  //             size={"M"}
  //             icon_position={"none"}
  //             text="Change to accepted"
  //           />
  //         </div>
  //       </div>
  //     </div>
  //     {/* personal info */}
  //     <div className="flex flex-col gap-4">
  //       <div className="font-semibold text-4xl text-neutral-600">
  //         Personal Information
  //       </div>
  //       {/* gender */}
  //       <div className="flex flex-col gap-3">
  //         <div className="font-medium text-2xl text-neutral-600">Gender</div>
  //         <div className="font-normal text-base text-neutral-400">Female</div>
  //       </div>
  //       <div className="flex flex-col gap-3">
  //         <div className="font-medium text-2xl text-neutral-600">
  //           Date of Birth
  //         </div>
  //         <div className="font-normal text-base text-neutral-400">
  //           15/08/1978
  //         </div>
  //       </div>
  //       <div className="flex flex-col gap-3">
  //         <div className="font-medium text-2xl text-neutral-600">Wilaya </div>
  //         <div className="font-normal text-base text-neutral-400">Skikda </div>
  //       </div>
  //       <div className="flex flex-col gap-3">
  //         <div className="font-medium text-2xl text-neutral-600">Email </div>
  //         <div className="font-normal text-base text-neutral-400">
  //           professor.lorem.ipsum@gmail.com{" "}
  //         </div>
  //       </div>
  //     </div>
  //     {/* Professional experience */}
  //     <div className="flex flex-col gap-6">
  //       {/* headline */}
  //       <div className="font-semibold text-4xl text-neutral-600">
  //         Professional Experience
  //       </div>
  //       {/* info */}
  //       <div className="flex flex-col gap-6">
  //         {/* experience */}
  //         <div className="flex flex-col gap-3">
  //           <div className="font-medium text-2xl text-neutral-600">
  //             Teaching in High School
  //           </div>
  //           {/* experience */}
  //           <div className="flex items-center gap-2">
  //             <span className="text-success-400">
  //               <svg
  //                 xmlns="http://www.w3.org/2000/svg"
  //                 width="20"
  //                 height="20"
  //                 viewBox="0 0 20 20"
  //                 fill="none"
  //               >
  //                 <path
  //                   d="M3 11L7 15L17 5"
  //                   stroke="currentColor"
  //                   strokeWidth="1.5"
  //                   strokeLinecap="round"
  //                   strokeLinejoin="round"
  //                 />
  //               </svg>
  //             </span>
  //             <span className="text-neutral-400 text-base font-normal">
  //               Yes (5 Year)
  //             </span>
  //           </div>
  //         </div>
  //         {/* off school */}
  //         <div className="flex flex-col gap-3">
  //           <div className="font-medium text-2xl text-neutral-600">
  //             Experience in Off - School Courses
  //           </div>
  //           {/* experience */}
  //           <div className="flex items-center gap-2">
  //             <span className="text-success-400">
  //               <svg
  //                 xmlns="http://www.w3.org/2000/svg"
  //                 width="20"
  //                 height="20"
  //                 viewBox="0 0 20 20"
  //                 fill="none"
  //               >
  //                 <path
  //                   d="M3 11L7 15L17 5"
  //                   stroke="currentColor"
  //                   strokeWidth="1.5"
  //                   strokeLinecap="round"
  //                   strokeLinejoin="round"
  //                 />
  //               </svg>
  //             </span>
  //             <span className="text-neutral-400 text-base font-normal">
  //               Yes
  //             </span>
  //           </div>
  //         </div>
  //         {/* on school */}
  //         <div className="flex flex-col gap-3">
  //           <div className="font-medium text-2xl text-neutral-600">
  //             Experience in Off - School Online Courses
  //           </div>
  //           {/* experience */}
  //           <div className="flex items-center gap-2">
  //             <span className="text-error-400">
  //               <svg
  //                 xmlns="http://www.w3.org/2000/svg"
  //                 width="20"
  //                 height="20"
  //                 viewBox="0 0 20 20"
  //                 fill="none"
  //               >
  //                 <path
  //                   d="M5 15L15 5M5 5L15 15"
  //                   stroke="currentColor"
  //                   strokeWidth="1.5"
  //                   strokeLinecap="round"
  //                   strokeLinejoin="round"
  //                 />
  //               </svg>
  //             </span>
  //             <span className="text-neutral-400 text-base font-normal">
  //               Yes (5 Year)
  //             </span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //     {/* attached CV */}
  //     <div className="flex flex-col gap-3">
  //       <div className="text-neutral-600 font-medium text-2xl">CV file</div>
  //       <FileAttachement isRTL={false} downloadable />
  //     </div>
  //     {/* SHOW THIS SECTION ONLY TO ACCEPTED TEACHERS */}
  //     <div className="flex flex-col gap-6">
  //       {/* header */}
  //       <div className="flex justify-between items-center gap-4">
  //         <div className="font-semibold text-4xl text-neutral-600 grow">
  //           Permission
  //         </div>
  //         <div className="">
  //           <Button
  //             state={"filled"}
  //             size={"M"}
  //             icon_position={"none"}
  //             text="Update Permission"
  //           />
  //         </div>
  //       </div>
  //       {/* other sections: */}
  //       <div className="flex flex-col gap-6">
  //         <div className="flex flex-col gap-3">
  //           <div className="font-medium text-2xl text-neutral-600">
  //             Module Name
  //           </div>
  //           <div className="flex gap-3">
  //             <BigTag icon={undefined} text={"Content Creation"} />
  //             <BigTag icon={undefined} text={"Content Creation"} />
  //           </div>
  //         </div>
  //         <div className="flex flex-col gap-3">
  //           <div className="font-medium text-2xl text-neutral-600">
  //             Module Name
  //           </div>
  //           <div className="flex gap-3">
  //             <BigTag icon={undefined} text={"Content Creation"} />
  //             <BigTag icon={undefined} text={"Content Creation"} />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  // const handleAddOption = () => {};
  // const handleRemoveOption = () => {};
  // return (
  //   <div className="w-full bg-neutral-100 rounded-[52px] pt-20 pb-11 px-10 flex flex-col gap-12">
  //     {/* header name */}
  //     <div className="font-semibold text-5xl text-neutral-600">
  //       [Prof name] Permissons
  //     </div>
  //     {/* info section */}
  //     <div className="flex flex-col gap-6">
  //       {/* header */}
  //       <div className="text-4xl font-semibold text-neutral-600">Modules</div>
  //       {/* add option */}
  //       <div className="">
  //         <AddOption
  //           placeholder="Add Option"
  //           icon={<Plus />}
  //           onClick={handleAddOption}
  //         />
  //       </div>
  //       {/* options */}
  //       <div className="flex flex-col gap-4">
  //         <OptionCard option={"Option 1"} onClick={handleRemoveOption} />
  //         <OptionCard option={"Option 2"} onClick={handleRemoveOption} />
  //         <OptionCard option={"Option 3"} onClick={handleRemoveOption} />
  //       </div>
  //     </div>
  //     {/* Permission per module */}
  //     <div className="flex flex-col gap-6">
  //       {/* header */}
  //       <div className="font-semibold text-4xl text-neutral-600">
  //         Permissions per Module
  //       </div>
  //       {/* content */}
  //       <div className="flex flex-col gap-6">
  //         {/* module name */}
  //         <div className="flex flex-col gap-6">
  //           {/* title */}
  //           <div className="font-medium text-2xl text-neutral-600">
  //             Module name
  //           </div>
  //           {/* permissions */}
  //           <div className="flex flex-col gap-3">
  //             Add here the checkbox comoponents
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //     {/* actions */}
  //     <div className="w-fill flex justify-end">
  //       <div className="">
  //         <Button
  //           state={"filled"}
  //           size={"M"}
  //           icon_position={"none"}
  //           text="Save Changes"
  //         />
  //       </div>
  //     </div>
  //   </div>
  // );
  // return (
  //   <div className="w-full max-w-3xl py-11 px-10 rounded-[52px] flex flex-col gap-12">
  //     {/* header */}
  //     <div className="flex flex-col gap-4">
  //       <div className="font-semibold text-neutral-600 text-5xl">
  //         Change Status to Accepted?
  //       </div>
  //       <div className="font-medium text-neutral-400 text-xl">
  //         Are you sure you want to accept this professor’s application? This
  //         action will grant them access to the platform as a professor.
  //       </div>
  //     </div>
  //     {/* actions */}
  //     <div className="flex items-center gap-5">
  //       <Button
  //         state={"tonal"}
  //         size={"M"}
  //         icon_position={"none"}
  //         text="Cancel"
  //       />
  //       <Button
  //         state={"filled"}
  //         size={"M"}
  //         icon_position={"none"}
  //         text="Accepted Professor"
  //       />
  //     </div>
  //   </div>
  // );
}

import FileAttachement from "@/components/lesson/fileAttachment";
import BigTag from "@/components/professor/BigTags";
import Tag from "@/components/questions/tag";
import Button from "@/components/ui/button";

export default function ViewTeacherApplicationDetails() {
  return (
    <div className="w-full bg-neutral-100 rounded-[52px] pt-20 pb-11 px-10 flex flex-col gap-12">
      {/* teacher */}
      <div className="flex flex-col gap-3">
        {/* title */}
        <div className="font-semibold text-5xl text-neutral-600">
          [Teacher’s Name] Application Details
        </div>
        {/* status info + action */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-5">
            <div className="text-2xl text-neutral-400 font-normal">Status:</div>
            <div className="">
              <Tag
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="29"
                    viewBox="0 0 28 29"
                    fill="none"
                  >
                    <path
                      d="M13.9992 10.1446V14.5002L17.2659 17.7669M23.7992 14.5002C23.7992 19.9126 19.4116 24.3002 13.9992 24.3002C8.58683 24.3002 4.19922 19.9126 4.19922 14.5002C4.19922 9.0878 8.58683 4.7002 13.9992 4.7002C19.4116 4.7002 23.7992 9.0878 23.7992 14.5002Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                text={"Pending"}
                className={"bg-second01-100 text-second01-200"}
              />
            </div>
          </div>
          {/* action */}
          <div className="">
            <Button
              state={"filled"}
              size={"M"}
              icon_position={"none"}
              text="Change to accepted"
            />
          </div>
        </div>
      </div>
      {/* personal info */}
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-4xl text-neutral-600">
          Personal Information
        </div>
        {/* gender */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">Gender</div>
          <div className="font-normal text-base text-neutral-400">Female</div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            Date of Birth
          </div>
          <div className="font-normal text-base text-neutral-400">
            15/08/1978
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">Wilaya </div>
          <div className="font-normal text-base text-neutral-400">Skikda </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">Email </div>
          <div className="font-normal text-base text-neutral-400">
            professor.lorem.ipsum@gmail.com{" "}
          </div>
        </div>
      </div>
      {/* Professional experience */}
      <div className="flex flex-col gap-6">
        {/* headline */}
        <div className="font-semibold text-4xl text-neutral-600">
          Professional Experience
        </div>
        {/* info */}
        <div className="flex flex-col gap-6">
          {/* experience */}
          <div className="flex flex-col gap-3">
            <div className="font-medium text-2xl text-neutral-600">
              Teaching in High School
            </div>
            {/* experience */}
            <div className="flex items-center gap-2">
              <span className="text-success-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M3 11L7 15L17 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-neutral-400 text-base font-normal">
                Yes (5 Year)
              </span>
            </div>
          </div>
          {/* off school */}
          <div className="flex flex-col gap-3">
            <div className="font-medium text-2xl text-neutral-600">
              Experience in Off - School Courses
            </div>
            {/* experience */}
            <div className="flex items-center gap-2">
              <span className="text-success-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M3 11L7 15L17 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-neutral-400 text-base font-normal">
                Yes
              </span>
            </div>
          </div>
          {/* on school */}
          <div className="flex flex-col gap-3">
            <div className="font-medium text-2xl text-neutral-600">
              Experience in Off - School Online Courses
            </div>
            {/* experience */}
            <div className="flex items-center gap-2">
              <span className="text-error-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M5 15L15 5M5 5L15 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-neutral-400 text-base font-normal">
                Yes (5 Year)
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* attached CV */}
      <div className="flex flex-col gap-3">
        <div className="text-neutral-600 font-medium text-2xl">CV file</div>
        <FileAttachement isRTL={false} downloadable />
      </div>
      {/* SHOW THIS SECTION ONLY TO ACCEPTED TEACHERS */}
      <div className="flex flex-col gap-6">
        {/* header */}
        <div className="flex justify-between items-center gap-4">
          <div className="font-semibold text-4xl text-neutral-600 grow">
            Permission
          </div>
          <div className="">
            <Button
              state={"filled"}
              size={"M"}
              icon_position={"none"}
              text="Update Permission"
            />
          </div>
        </div>
        {/* other sections: */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="font-medium text-2xl text-neutral-600">
              Module Name
            </div>
            <div className="flex gap-3">
              <BigTag icon={undefined} text={"Content Creation"} />
              <BigTag icon={undefined} text={"Content Creation"} />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="font-medium text-2xl text-neutral-600">
              Module Name
            </div>
            <div className="flex gap-3">
              <BigTag icon={undefined} text={"Content Creation"} />
              <BigTag icon={undefined} text={"Content Creation"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

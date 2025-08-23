import Tag from "./tag";
import { IconMissingQuiz, IconReady, IconUploading } from "./tagIcons";

type LessonCardPros = {
  id: string;
  title: string;
  description: string;
  created_date: Date;
  isQuizAvailable: boolean;
  number: number;
  isUploading: boolean;
  uploadProgress?: number;
  isDisabled: boolean;
};

export default function LessonCard({
  created_date,
  id,
  title,
  description,
  isQuizAvailable,
  number,
  isUploading,
  uploadProgress,
  isDisabled,
}: LessonCardPros) {
  return (
    <div className="w-full flex flex-col items-center gap-6 p-6 rounded-3xl border bg-white border-neutral-300">
      <div className="w-full flex justify-between items-center">
        {/* left */}
        <div className="flex justify-start items-center gap-3 w-full">
          {/* number */}
          <div
            className={`w-8 h-8  rounded-full  flex justify-center items-center
            ${
              isDisabled
                ? "bg-neutral-200 text-neutral-300"
                : "bg-primary-50 text-primary-300"
            }`}
          >
            {number}
          </div>
          {/* info */}
          <div className="flex flex-col gap-1">
            <div className="font-normal text-xs text-neutral-300">
              Created on: {created_date.toString()}
            </div>
            <div className="flex gap-2">
              <div
                className={`text-xl font-medium 
                ${isDisabled ? "text-neutral-300" : "text-neutral-600 "}`}
              >
                {title}
              </div>
              {isUploading ? (
                <Tag
                  icon={
                    <IconUploading
                      className={"text-primary-300"}
                      width={"12"}
                      height={"12"}
                    />
                  }
                  text={"Uploading ..."}
                  className={"bg-primary-50 text-primary-300"}
                />
              ) : isQuizAvailable ? (
                <Tag
                  icon={
                    <IconReady
                      className={"bg-success-100 text-success-400"}
                      width={"12"}
                      height={"12"}
                    />
                  }
                  text={"Ready"}
                  className={"text-success-400"}
                />
              ) : (
                <Tag
                  icon={
                    <IconMissingQuiz
                      className={"text-second01-200"}
                      width={"12"}
                      height={"12"}
                    />
                  }
                  text={"missing quiz"}
                  className={"text-second01-200 bg-second01-100"}
                />
              )}
            </div>

            <div className="text-sm font-normal text-neutral-400">
              {description}
            </div>
          </div>
        </div>
        {/* right */}
        <div
          className={`${isDisabled ? "text-primary-50" : "text-primary-300"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M10 14.0996C10.6351 14.0996 11.1504 14.6149 11.1504 15.25C11.1504 15.8851 10.6351 16.4004 10 16.4004C9.36487 16.4004 8.84961 15.8851 8.84961 15.25C8.84961 14.6149 9.36487 14.0996 10 14.0996ZM10 8.84961C10.6351 8.84961 11.1504 9.36487 11.1504 10C11.1504 10.6351 10.6351 11.1504 10 11.1504C9.36487 11.1504 8.84961 10.6351 8.84961 10C8.84961 9.36487 9.36487 8.84961 10 8.84961ZM10 3.59961C10.6351 3.59961 11.1504 4.11487 11.1504 4.75C11.1504 5.38513 10.6351 5.90039 10 5.90039C9.36487 5.90039 8.84961 5.38513 8.84961 4.75C8.84961 4.11487 9.36487 3.59961 10 3.59961Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        </div>
      </div>
      {/* show progress bar only if uploading */}
      {isUploading && (
        <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden flex justify-start  items-center">
          <div
            className={`h-2 bg-primary-300 rounded-full`}
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {/* show only if no quize  */}
      {!isQuizAvailable && (
        <div className={`font-normal text-base text-neutral-300`}>
          You can add a quiz by updating the lesson
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import AttachementField from "@/components/input/attachementField";
import DropDown from "@/components/input/dropDown";
import InputButton from "@/components/input/InputButton";
import SimpleInput from "@/components/input/simpleInput";
import FileAttachement from "@/components/lesson/fileAttachment";
import { SecureFileUpload, FileInfo } from "@/components/files";
import {
  AcademicStreamsApi,
  type FrontendAcademicStream,
} from "@/api/academicStreams";
import { createLesson, CreateLessonRequest } from "@/api/lesson";
import BigTag from "@/components/professor/BigTags";
import Button from "@/components/ui/button";

type CreateLessonPopupProps = {
  onClose: () => void;
  t: any;
  language?: string;
  chapterId?: string;
  moduleId?: string;
};

export default function CreateLessonPopup({
  onClose,
  t,
  language = "en",
  chapterId,
  moduleId,
}: CreateLessonPopupProps) {
  // File upload state
  const [uploadedVideo, setUploadedVideo] = useState<FileInfo | null>(null);
  const [uploadedAttachments, setUploadedAttachments] = useState<FileInfo[]>(
    []
  );
  const [uploadedExercisePDF, setUploadedExercisePDF] =
    useState<FileInfo | null>(null);

  // Academic streams state
  const [academicStreams, setAcademicStreams] = useState<
    FrontendAcademicStream[]
  >([]);
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [isStreamsLoading, setIsStreamsLoading] = useState(false);
  const [streamsError, setStreamsError] = useState<string | null>(null);

  // Form state
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [exerciseTotalMark, setExerciseTotalMark] = useState(100);
  const [exerciseTotalXP, setExerciseTotalXP] = useState(100);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Load academic streams from database
  useEffect(() => {
    const fetchAcademicStreams = async () => {
      try {
        setIsStreamsLoading(true);
        setStreamsError(null);
        const response =
          await AcademicStreamsApi.getAcademicStreamsForFrontend();

        if (response.success && response.data) {
          setAcademicStreams(response.data);
          console.log("Loaded academic streams for lesson:", response.data);
        } else {
          const errorMsg =
            response.message || "Failed to fetch academic streams";
          setStreamsError(errorMsg);
          console.warn("Failed to fetch academic streams:", errorMsg);
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";
        setStreamsError(errorMsg);
        console.error("Error fetching academic streams:", error);
      } finally {
        setIsStreamsLoading(false);
      }
    };

    fetchAcademicStreams();
  }, []);

  // Handle adding a stream
  const handleAddStream = (streamId: string) => {
    console.log("Adding stream to lesson:", streamId);
    const stream = academicStreams.find((s) => s.id === streamId);
    const displayName = stream
      ? language === "ar"
        ? stream.name_ar
        : stream.name
      : streamId;

    setSelectedStreams((prev) => {
      const newStreams = [...prev, streamId];
      console.log("Updated selectedStreams after addition:", newStreams);
      return newStreams;
    });
  };

  // Handle removing a stream
  const handleRemoveStream = (streamToRemove: string) => {
    console.log("Removing stream from lesson:", streamToRemove);
    setSelectedStreams((prev) => {
      const newStreams = prev.filter((stream) => stream !== streamToRemove);
      console.log("Updated selectedStreams after removal:", newStreams);
      return newStreams;
    });
  };

  // Handle lesson creation
  const handleCreateLesson = async () => {
    console.log("Create lesson clicked with props:", { chapterId, moduleId });

    if (!lessonTitle.trim()) {
      setCreateError(t("errors.lesson.titleRequired"));
      return;
    }

    if (!lessonDescription.trim()) {
      setCreateError(t("errors.lesson.descriptionRequired"));
      return;
    }

    if (selectedStreams.length === 0) {
      setCreateError(t("errors.lesson.academicStreamRequired"));
      return;
    }

    if (!chapterId) {
      setCreateError(t("errors.lesson.chapterIdRequired"));
      return;
    }

    try {
      setIsCreating(true);
      setCreateError(null);

      // Prepare lesson data for API
      const lessonData: CreateLessonRequest = {
        chapter_id: chapterId,
        title: lessonTitle,
        description: lessonDescription,
        duration: 30, // Default duration
        order: 1, // Default order
        exercise_total_mark: exerciseTotalMark,
        exercise_total_xp: exerciseTotalXP,
        academic_streams: selectedStreams,
        video_url: uploadedVideo?.url,
        pdf_url: uploadedExercisePDF?.url,
        image: uploadedAttachments[0]?.url, // Use first attachment as image
      };

      console.log("Creating lesson with data:", lessonData);

      // Call the real API
      const createdLesson = await createLesson(lessonData);

      console.log("Lesson created successfully:", createdLesson);
      onClose();
    } catch (error) {
      console.error("Error creating lesson:", error);
      setCreateError("Failed to create lesson. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full rounded-[60px] bg-neutral-100 py-11 px-10 flex flex-col justify-center gap-14">
      {/* header */}
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-4xl text-neutral-600">
          {t("professor.lessons.CreateLessonTitle")}
        </div>
        <div className="text-neutral-400 text-xl font-medium">
          {t("professor.lessons.CreateLessonDesc")}
        </div>
      </div>
      {/* input fields */}
      <div className="flex flex-col gap-10">
        {/* lesson name */}
        <div className="flex flex-col gap-2">
          <div className="font-work-sans text-neutral-600 font-normal px-4">
            {t("professor.lessons.LessonName")}
          </div>
          <input
            type="text"
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            className="appearance-none outline-[var(--primary-200)] p-0 m-0 shadow-none bg-white border border-neutral-200 px-5 py-3 rounded-3xl w-full focus:border-2 focus:border-[var(--primary-200)]"
            placeholder={t("common.enterLessonName")}
          />
        </div>
        {/* lesson description */}
        <div className="flex flex-col gap-2">
          <div className="font-work-sans text-neutral-600 font-normal px-4">
            {t("professor.lessons.LessonDescription")}
          </div>
          <textarea
            value={lessonDescription}
            onChange={(e) => setLessonDescription(e.target.value)}
            className="appearance-none outline-[var(--primary-200)] p-0 m-0 shadow-none bg-white border border-neutral-200 px-5 py-3 rounded-3xl w-full h-32 focus:border-2 focus:border-[var(--primary-200)] resize-none"
            placeholder={t("common.enterLessonDescription")}
          />
        </div>
        {/* Lesson video */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            {t("professor.lessons.LessonVideo")}
          </div>
          <SecureFileUpload
            onUploadComplete={(fileInfo) => setUploadedVideo(fileInfo)}
            onUploadError={(error) =>
              console.error("Video upload failed:", error)
            }
            acceptedTypes={["video/*"]}
            maxSizeMB={500}
            accessLevel="student"
            courseId={moduleId}
            chapterId={chapterId}
            className="w-full"
          />
          {uploadedVideo && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ Video uploaded: {uploadedVideo.name} (
                {(uploadedVideo.file_size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            </div>
          )}
        </div>
        {/* attachements */}
        <div className="flex flex-col gap-5">
          <div className="font-medium text-2xl text-neutral-600">
            {t("professor.lessons.LessonAttachment")}
          </div>
          <SecureFileUpload
            onUploadComplete={(fileInfo) =>
              setUploadedAttachments((prev) => [...prev, fileInfo])
            }
            onUploadError={(error) =>
              console.error("Attachment upload failed:", error)
            }
            acceptedTypes={[
              "image/*",
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ]}
            maxSizeMB={50}
            accessLevel="student"
            courseId={moduleId}
            chapterId={chapterId}
            className="w-full"
          />
          {/* uploaded attachments */}
          {uploadedAttachments.length > 0 && (
            <div className="flex flex-col gap-2">
              {uploadedAttachments.map((file, index) => (
                <div
                  key={index}
                  className="p-2 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <p className="text-sm text-blue-800">
                    ✓ {file.name} ({(file.file_size / (1024 * 1024)).toFixed(2)}{" "}
                    MB)
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Exercise PDF */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            {t("professor.lessons.ExercicePDF")}
          </div>
          <SecureFileUpload
            onUploadComplete={(fileInfo) => setUploadedExercisePDF(fileInfo)}
            onUploadError={(error) =>
              console.error("Exercise PDF upload failed:", error)
            }
            acceptedTypes={["application/pdf"]}
            maxSizeMB={20}
            accessLevel="student"
            courseId={moduleId}
            chapterId={chapterId}
            className="w-full"
          />
          {uploadedExercisePDF && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ Exercise PDF uploaded: {uploadedExercisePDF.name} (
                {(uploadedExercisePDF.file_size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            </div>
          )}
        </div>
        {/* Exercises Total Marks */}
        <div className="flex flex-col gap-2">
          <div className="font-work-sans text-neutral-600 font-normal px-4">
            {t("professor.lessons.ExerciceTotalMark")}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setExerciseTotalMark(Math.max(0, exerciseTotalMark - 1))
              }
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold"
            >
              -
            </button>
            <input
              type="number"
              value={exerciseTotalMark}
              onChange={(e) =>
                setExerciseTotalMark(parseInt(e.target.value) || 0)
              }
              className="w-20 text-center appearance-none outline-[var(--primary-200)] p-0 m-0 shadow-none bg-white border border-neutral-200 px-3 py-2 rounded-3xl focus:border-2 focus:border-[var(--primary-200)]"
              min="0"
            />
            <button
              type="button"
              onClick={() => setExerciseTotalMark(exerciseTotalMark + 1)}
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold"
            >
              +
            </button>
          </div>
        </div>
        {/* Exercises Total XP */}
        <div className="flex flex-col gap-2">
          <div className="font-work-sans text-neutral-600 font-normal px-4">
            {t("professor.lessons.ExerciceTotalXP")}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setExerciseTotalXP(Math.max(0, exerciseTotalXP - 1))
              }
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold"
            >
              -
            </button>
            <input
              type="number"
              value={exerciseTotalXP}
              onChange={(e) =>
                setExerciseTotalXP(parseInt(e.target.value) || 0)
              }
              className="w-20 text-center appearance-none outline-[var(--primary-200)] p-0 m-0 shadow-none bg-white border border-neutral-200 px-3 py-2 rounded-3xl focus:border-2 focus:border-[var(--primary-200)]"
              min="0"
            />
            <button
              type="button"
              onClick={() => setExerciseTotalXP(exerciseTotalXP + 1)}
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold"
            >
              +
            </button>
          </div>
        </div>
        {/* Supported Academic Streams */}
        <div className="flex flex-col gap-4">
          <div className="font-medium text-2xl text-neutral-600">
            {t("professor.lessons.SupportedStreams")}
          </div>

          {/* Error State */}
          {streamsError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">
                    Error loading academic streams:
                  </p>
                  <p>{streamsError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isStreamsLoading && !streamsError && (
            <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <div className="text-sm text-blue-800">
                  Loading academic streams...
                </div>
              </div>
            </div>
          )}

          {/* Dropdown for adding streams */}
          {!isStreamsLoading && !streamsError && (
            <DropDown
              label=""
              placeholder="Choose an academic stream to add..."
              options={academicStreams
                .filter((stream) => !selectedStreams.includes(stream.id))
                .map((stream) => ({
                  id: stream.id,
                  text: stream.labelKey,
                }))}
              max_width=""
              onChange={(value) => {
                if (value) {
                  handleAddStream(value);
                }
              }}
            />
          )}

          {/* Selected streams tags */}
          {selectedStreams.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {selectedStreams.map((streamId) => {
                const stream = academicStreams.find((s) => s.id === streamId);
                const displayName = stream?.labelKey || streamId;
                return (
                  <BigTag
                    key={streamId}
                    text={displayName}
                    isRTL={false}
                    onRemove={() => handleRemoveStream(streamId)}
                    removable
                  />
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!isStreamsLoading &&
            !streamsError &&
            selectedStreams.length === 0 && (
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-600">
                  No academic streams selected. Choose streams from the dropdown
                  above.
                </div>
              </div>
            )}
        </div>

        {/* Error Display */}
        {createError && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">Error creating lesson:</p>
                <p>{createError}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* buttons */}
      <div className="flex gap-5">
        <Button
          state={"tonal"}
          size={"M"}
          icon_position={"none"}
          text={t("professor.lessons.Cancel")}
          onClick={() => {
            onClose();
          }}
        />
        <Button
          state={"filled"}
          size={"M"}
          icon_position={"none"}
          text={
            isCreating ? "Creating..." : t("professor.lessons.CreateLesson")
          }
          onClick={handleCreateLesson}
          disabled={isCreating}
        />
      </div>
    </div>
  );
}

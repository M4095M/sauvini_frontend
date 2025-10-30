import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SecureFileUpload } from "@/components/files/SecureFileUpload";
import DropDown from "@/components/input/dropDown";
import InputButton from "@/components/input/InputButton";
import SimpleInput from "@/components/input/simpleInput";
import FileAttachement from "@/components/lesson/fileAttachment";
import {
  AcademicStreamsApi,
  type FrontendAcademicStream,
} from "@/api/academicStreams";
import { updateLesson, getLesson, type Lesson } from "@/api/lesson";
import QuizApi from "@/api/quiz";
import BigTag from "@/components/professor/BigTags";
import { IconMissingQuiz } from "@/components/professor/tagIcons";
import Tag from "@/components/questions/tag";
import Button from "@/components/ui/button";
import type { FileInfo } from "@/api/files";

type UpdateLessonPopUProps = {
  onClose: () => void;
  t: any;
  isRTL: boolean;
  lessonId?: string;
  onLessonUpdated?: () => void;
};

export default function UpdateLessonPopUp({
  onClose,
  t,
  isRTL,
  lessonId,
  onLessonUpdated,
}: UpdateLessonPopUProps) {
  const router = useRouter();

  // Academic streams state
  const [academicStreams, setAcademicStreams] = useState<
    FrontendAcademicStream[]
  >([]);
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [isStreamsLoading, setIsStreamsLoading] = useState(false);
  const [streamsError, setStreamsError] = useState<string | null>(null);

  // Lesson data state
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quiz state
  const [quizId, setQuizId] = useState<string | null>(null);
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  // Form state
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonDuration, setLessonDuration] = useState(30);
  const [exerciseTotalMark, setExerciseTotalMark] = useState(0);
  const [exerciseTotalXP, setExerciseTotalXP] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // File upload state
  const [uploadedVideo, setUploadedVideo] = useState<FileInfo | null>(null);
  const [uploadedPDF, setUploadedPDF] = useState<FileInfo | null>(null);
  const [uploadedAttachments, setUploadedAttachments] = useState<FileInfo[]>(
    []
  );

  // Track file changes
  const [fileChanges, setFileChanges] = useState({
    video: false,
    pdf: false,
    attachments: false,
  });

  // Load lesson data
  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const lessonResponse = await getLesson(lessonId);
        if (!lessonResponse.success || !lessonResponse.data) {
          throw new Error("Lesson not found");
        }
        const lessonData = lessonResponse.data;
        setLesson(lessonData);
        setLessonTitle(lessonData.title);
        setLessonDescription(lessonData.description);
        setLessonDuration(lessonData.duration);
        setExerciseTotalMark(lessonData.exercise_total_mark || 0);
        setExerciseTotalXP(lessonData.exercise_total_xp || 0);

        // Load file data if available
        if (lessonData.video_url) {
          setUploadedVideo({
            file_id: lessonData.video_url,
            file_name: "Video",
            file_type: "video",
            file_size: 0,
            access_level: "student",
            checksum: "",
          });
        }
        if (lessonData.pdf_url) {
          setUploadedPDF({
            file_id: lessonData.pdf_url,
            file_name: "PDF",
            file_type: "pdf",
            file_size: 0,
            access_level: "student",
            checksum: "",
          });
        }
        if (lessonData.image) {
          setUploadedAttachments([
            {
              file_id: lessonData.image,
              file_name: "Image",
              file_type: "image",
              file_size: 0,
              access_level: "student",
              checksum: "",
            },
          ]);
        }

        // Load academic streams for the lesson (if any)
        if (
          lessonData.academic_streams &&
          lessonData.academic_streams.length > 0
        ) {
          // Extract stream IDs from the academic streams
          const streamIds = lessonData.academic_streams.map((stream) => {
            if (typeof stream === "string") {
              return stream;
            } else if (stream && stream.id) {
              return stream.id;
            }
            return stream;
          });
          setSelectedStreams(streamIds);
        }
      } catch (error) {
        console.error("Error fetching lesson:", error);
        setError(t("errors.lesson.failedToLoad"));
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  // Fetch quiz for the lesson
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!lessonId) return;

      try {
        setIsQuizLoading(true);
        const quizResponse = await QuizApi.getQuizByLesson(lessonId);
        if (
          quizResponse.success &&
          quizResponse.data &&
          quizResponse.data.quiz
        ) {
          setQuizId(quizResponse.data.quiz.id);
        }
      } catch (error) {
        console.log("No quiz found for this lesson");
        setQuizId(null);
      } finally {
        setIsQuizLoading(false);
      }
    };

    if (lessonId) {
      fetchQuiz();
    }
  }, [lessonId]);

  // Handle Update Quiz button click
  const handleUpdateQuiz = () => {
    if (!lessonId) return;

    // Build URL with lessonId and optional quizId
    const url = quizId
      ? `/professor/quiz-builder?lessonId=${lessonId}&quizId=${quizId}`
      : `/professor/quiz-builder?lessonId=${lessonId}`;

    router.push(url);
  };

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
        } else {
          const errorMsg =
            response.message || t("errors.lesson.failedToFetchStreams");
          setStreamsError(errorMsg);
          console.warn("Failed to fetch academic streams:", errorMsg);
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : t("errors.lesson.unknownError");
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
    setSelectedStreams((prev) => {
      const newStreams = [...prev, streamId];
      return newStreams;
    });
  };

  // Handle removing a stream
  const handleRemoveStream = (streamToRemove: string) => {
    setSelectedStreams((prev) => {
      const newStreams = prev.filter((stream) => stream !== streamToRemove);
      return newStreams;
    });
  };

  // Handle file uploads
  const handleVideoUpload = (fileInfo: FileInfo) => {
    setUploadedVideo(fileInfo);
    setFileChanges((prev) => ({ ...prev, video: true }));
  };

  const handlePDFUpload = (fileInfo: FileInfo) => {
    setUploadedPDF(fileInfo);
    setFileChanges((prev) => ({ ...prev, pdf: true }));
  };

  const handleAttachmentUpload = (fileInfo: FileInfo) => {
    setUploadedAttachments((prev) => [...prev, fileInfo]);
    setFileChanges((prev) => ({ ...prev, attachments: true }));
  };

  const handleRemoveAttachment = (index: number) => {
    setUploadedAttachments((prev) => prev.filter((_, i) => i !== index));
    setFileChanges((prev) => ({ ...prev, attachments: true }));
  };

  const handleRemoveVideo = () => {
    setUploadedVideo(null);
    setFileChanges((prev) => ({ ...prev, video: true }));
  };

  const handleRemovePDF = () => {
    setUploadedPDF(null);
    setFileChanges((prev) => ({ ...prev, pdf: true }));
  };

  // Reset form to initial state
  const resetForm = () => {
    setLessonTitle("");
    setLessonDescription("");
    setLessonDuration(30);
    setSelectedStreams([]);
    setUploadedVideo(null);
    setUploadedPDF(null);
    setUploadedAttachments([]);
    setFileChanges({ video: false, pdf: false, attachments: false });
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  // Handle lesson update
  const handleUpdateLesson = async () => {
    if (!lessonId) {
      setUpdateError(t("errors.lesson.idRequired"));
      return;
    }

    if (!lessonTitle.trim()) {
      setUpdateError(t("errors.lesson.titleRequired"));
      return;
    }

    if (!lessonDescription.trim()) {
      setUpdateError(t("errors.lesson.descriptionRequired"));
      return;
    }

    try {
      setIsUpdating(true);
      setUpdateError(null);
      setUpdateSuccess(false);

      const updateData = {
        title: lessonTitle,
        description: lessonDescription,
        duration: lessonDuration,
        exercise_total_mark: exerciseTotalMark,
        exercise_total_xp: exerciseTotalXP,
        academic_streams: selectedStreams,
        video_url: uploadedVideo?.file_id,
        pdf_url: uploadedPDF?.file_id,
        image: uploadedAttachments[0]?.file_id,
      };

      await updateLesson(lessonId, updateData);

      setUpdateSuccess(true);

      // Show success message for 2 seconds, then close and reset
      setTimeout(() => {
        resetForm();
        onLessonUpdated?.();
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error updating lesson:", error);
      setUpdateError("Failed to update lesson. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="w-full rounded-[60px] bg-neutral-100 py-11 px-10 flex flex-col justify-center gap-14">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full rounded-[60px] bg-neutral-100 py-11 px-10 flex flex-col justify-center gap-14">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-2">⚠️</div>
          <p className="text-red-600 font-medium mb-2">Failed to load lesson</p>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <Button
            state="outlined"
            size="M"
            icon_position="none"
            text="Retry"
            onClick={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-[60px] bg-neutral-100 py-11 px-10 flex flex-col justify-center gap-14 relative ${
        isUpdating ? "pointer-events-none" : ""
      }`}
    >
      {/* Loading Overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-[60px] flex items-center justify-center z-10">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600 font-medium">
              Updating lesson...
            </p>
          </div>
        </div>
      )}
      {/* header */}
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-4xl text-neutral-600">
          {t("professor.lessons.UpdateLesson")}
        </div>
        <div className="text-neutral-400 text-xl font-medium">
          {t("professor.lessons.UpdateLessonDesc")}
        </div>
      </div>

      {/* Success Message */}
      {updateSuccess && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="text-sm text-green-800">
              <p className="font-medium">Lesson updated successfully!</p>
              <p>Closing in a moment...</p>
            </div>
          </div>
        </div>
      )}

      {/* File Changes Summary */}
      {(fileChanges.video || fileChanges.pdf || fileChanges.attachments) && (
        <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium">Files Modified:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {fileChanges.video && (
                  <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full">
                    Video
                  </span>
                )}
                {fileChanges.pdf && (
                  <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full">
                    PDF
                  </span>
                )}
                {fileChanges.attachments && (
                  <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full">
                    Attachments
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {updateError && (
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
              <p className="font-medium">Update failed</p>
              <p>{updateError}</p>
            </div>
          </div>
        </div>
      )}

      {/* input fields */}
      <div className="flex flex-col gap-10">
        {/* lesson name */}
        <SimpleInput
          label={t("professor.lessons.LessonName")}
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
          type={"text"}
          max_width=""
        />
        {/* lesson description */}
        <SimpleInput
          label={t("professor.lessons.LessonDescription")}
          value={lessonDescription}
          onChange={(e) => setLessonDescription(e.target.value)}
          type={"text"}
          long
          max_width=""
          max_hight="h-32"
        />
        {/* lesson duration */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            Duration (minutes)
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLessonDuration(Math.max(1, lessonDuration - 5))}
              className="w-10 h-10 rounded-full bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center text-neutral-600 font-bold text-lg"
            >
              -
            </button>
            <div className="w-20 h-10 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-neutral-600 font-medium">
              {lessonDuration}
            </div>
            <button
              type="button"
              onClick={() => setLessonDuration(lessonDuration + 5)}
              className="w-10 h-10 rounded-full bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center text-neutral-600 font-bold text-lg"
            >
              +
            </button>
          </div>
        </div>
        {/* Lesson video */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            {t("professor.lessons.LessonVideo")}
          </div>
          <SecureFileUpload
            onUploadComplete={handleVideoUpload}
            onUploadError={(error) =>
              console.error("Video upload failed:", error)
            }
            acceptedTypes={["video/*"]}
            maxSizeMB={100}
            accessLevel="student"
            lessonId={lessonId}
            className="w-full"
          />
          {uploadedVideo && (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl shadow-sm">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-green-800 truncate">
                    {uploadedVideo.file_name}
                  </p>
                  <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full font-medium">
                    Video
                  </span>
                  {fileChanges.video && (
                    <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full font-medium animate-pulse">
                      Modified
                    </span>
                  )}
                </div>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Ready to upload
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Click to replace or remove
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRemoveVideo}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove video"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
        {/* attachements */}
        <div className="flex flex-col gap-5">
          <div className="font-medium text-2xl text-neutral-600">
            {t("professor.lessons.LessonAttachment")}
          </div>
          {/* attach compo */}
          <SecureFileUpload
            onUploadComplete={handleAttachmentUpload}
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
            lessonId={lessonId}
            className="w-full"
          />
          {/* attached files */}
          {uploadedAttachments.length > 0 && (
            <div className="flex flex-col gap-3">
              {uploadedAttachments.map((attachment, index) => {
                const isImage = attachment.file_name
                  .toLowerCase()
                  .match(/\.(jpg|jpeg|png|gif|webp)$/);
                const isDocument = attachment.file_name
                  .toLowerCase()
                  .match(/\.(pdf|doc|docx)$/);

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-4 rounded-xl shadow-sm ${
                      isImage
                        ? "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200"
                        : isDocument
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200"
                        : "bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isImage
                            ? "bg-purple-100"
                            : isDocument
                            ? "bg-blue-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <svg
                          className={`w-6 h-6 ${
                            isImage
                              ? "text-purple-600"
                              : isDocument
                              ? "text-blue-600"
                              : "text-gray-600"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {isImage ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          ) : isDocument ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          )}
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p
                          className={`font-semibold truncate ${
                            isImage
                              ? "text-purple-800"
                              : isDocument
                              ? "text-blue-800"
                              : "text-gray-800"
                          }`}
                        >
                          {attachment.file_name}
                        </p>
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            isImage
                              ? "bg-purple-200 text-purple-800"
                              : isDocument
                              ? "bg-blue-200 text-blue-800"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {isImage ? "Image" : isDocument ? "Document" : "File"}
                        </span>
                        {fileChanges.attachments && (
                          <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full font-medium animate-pulse">
                            Modified
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm flex items-center gap-1 ${
                          isImage
                            ? "text-purple-600"
                            : isDocument
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Ready to upload
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Click to replace or remove
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRemoveAttachment(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove file"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Exercise PDF */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            {t("professor.lessons.ExercicePDF")}
          </div>
          <SecureFileUpload
            onUploadComplete={handlePDFUpload}
            onUploadError={(error) =>
              console.error("PDF upload failed:", error)
            }
            acceptedTypes={["application/pdf"]}
            maxSizeMB={50}
            accessLevel="student"
            lessonId={lessonId}
            className="w-full"
          />
          {uploadedPDF && (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl shadow-sm">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-red-800 truncate">
                    {uploadedPDF.file_name}
                  </p>
                  <span className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded-full font-medium">
                    PDF
                  </span>
                  {fileChanges.pdf && (
                    <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full font-medium animate-pulse">
                      Modified
                    </span>
                  )}
                </div>
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Ready to upload
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Click to replace or remove
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRemovePDF}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove PDF"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
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
                    isRTL={isRTL}
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
        {/* SHOW IF MISSING QUIZES */}
        <div className="flex flex-row justify-between items-center ">
          {/* left part */}
          <div className="flex flex-row gap-3">
            <div className="font-normal text-neutral-600 text-base">
              {t("professor.lessons.Quiz")}
            </div>
            <Tag
              icon={
                <IconMissingQuiz
                  className={"text-warning-400"}
                  width={"12"}
                  height={"12"}
                />
              }
              text={"missing quiz"}
              className={"bg-warning-100 text-warning-400"}
            />
          </div>
          {/* right part */}
          <div className="">
            <Button
              state={"filled"}
              size={"M"}
              icon_position={"none"}
              text={
                isQuizLoading ? "Loading..." : t("professor.lessons.UpdateQuiz")
              }
              onClick={handleUpdateQuiz}
              disabled={isQuizLoading}
            />
          </div>
        </div>
      </div>
      {/* buttons */}
      <div className="flex gap-5">
        <Button
          state={"tonal"}
          size={"M"}
          icon_position={"none"}
          text={t("professor.lessons.Cancel")}
          onClick={() => {
            resetForm();
            onClose();
          }}
        />
        {/* Error display */}
        {updateError && (
          <div className="text-red-600 text-sm text-center mb-4">
            {updateError}
          </div>
        )}

        <Button
          state={"filled"}
          size={"M"}
          icon_position={"none"}
          text={
            isUpdating ? "Updating..." : t("professor.lessons.UpdateLesson")
          }
          onClick={handleUpdateLesson}
          disabled={isUpdating}
        />
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_PROFESSOR_MODULES } from "@/data/mockProfessor";
import { chaptersApi, modulesApi } from "@/api";
import type { FrontendChapter } from "@/api/chapters";
import type { FrontendModule } from "@/api/modules";
import { getLessonsByChapter, type LessonWithRelations } from "@/api/lesson";
import {
  AcademicStreamsApi,
  type FrontendAcademicStream,
} from "@/api/academicStreams";
import DropDown from "@/components/input/dropDown";
import InputButton from "@/components/input/InputButton";
import FileAttachement from "@/components/lesson/fileAttachment";
import { SecureFileUpload, SecureFileAccess } from "@/components/files";
import BigTag from "@/components/professor/BigTags";
import Button from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateLessonPopup from "../create-lesson/createLessonPopup";
import ChapterDependencyPopup from "../create-lesson/chapterDependencyPopup";
import LessonCard from "@/components/professor/lessonCard";
import UpdateLessonPopUp from "../create-lesson/updateLessonPopup";
import ViewLessonPopup from "../create-lesson/viewLessonPopup";
import { useLanguage } from "@/context/LanguageContext";
import Loader from "@/components/ui/Loader";

export default function ProfessorManageChapter() {
  const { t, language, isRTL } = useLanguage();
  const searchParams = useSearchParams();
  const chapterId = searchParams?.get("chapterId") || undefined;
  const moduleId = searchParams?.get("moduleId") || undefined;

  console.log("URL parameters - chapterId:", chapterId, "moduleId:", moduleId);

  const [module, setModule] = useState<FrontendModule | null>(null);
  const [chapter, setChapter] = useState<FrontendChapter | null>(null);
  const [lessons, setLessons] = useState<LessonWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [lessonsError, setLessonsError] = useState<string | null>(null);
  const [academicStreams, setAcademicStreams] = useState<
    FrontendAcademicStream[]
  >([]);
  const [streamsLoading, setStreamsLoading] = useState(true);

  // Chapter dependencies state
  const [availableChapters, setAvailableChapters] = useState<FrontendChapter[]>(
    []
  );
  const [selectedDependencies, setSelectedDependencies] = useState<string[]>(
    []
  );

  // Additional form state for comprehensive updates
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [dropdownValue, setDropdownValue] = useState<string>("");
  const [isStreamsLoading, setIsStreamsLoading] = useState(false);
  const [streamsError, setStreamsError] = useState<string | null>(null);

  // Exam section state
  const [examTotalMark, setExamTotalMark] = useState(100);
  const [examMinimumScore, setExamMinimumScore] = useState(50);
  const [examTotalXP, setExamTotalXP] = useState(100);
  const [examFile, setExamFile] = useState<File | null>(null);
  const [examFileName, setExamFileName] = useState<string>("");
  const [uploadedExamFile, setUploadedExamFile] = useState<any>(null);

  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // manage popupss states
  const [showCreateLessonPopup, setShowCreateLessonPopup] = useState(false);
  const [showChapterDependencyPopup, setShowChapterDependencyPopup] =
    useState(false);
  const [showUpdateChapterPopup, setShowUpdateChapterPopup] = useState(false);
  const [showUpdateLessonPopup, setShowUpdateLessonPopup] = useState(false);
  const [showLessonDetailsPopup, setShowLessonDetailsPopup] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log(
        "fetchData called with chapterId:",
        chapterId,
        "moduleId:",
        moduleId
      );
      if (!chapterId || !moduleId) {
        console.log("Missing chapterId or moduleId, returning");
        return;
      }

      try {
        console.log("Setting loading to true");
        setLoading(true);
        setError(null);

        // Try to fetch module data, but create fallback if it fails
        let moduleData = null;
        try {
          // Construct full RecordId format for the API call
          const fullModuleId = moduleId.includes(":")
            ? moduleId
            : `Module:${moduleId}`;
          console.log("Fetching module with ID:", fullModuleId);
          const moduleResponse = await modulesApi.getModuleById(fullModuleId);
          if (moduleResponse.success && moduleResponse.data) {
            moduleData = modulesApi.transformModule(moduleResponse.data);
          } else {
            throw new Error("Module API failed");
          }
        } catch (error) {
          console.warn("Failed to fetch module data:", error);
          // Create a basic module object as fallback
          moduleData = {
            id: moduleId,
            name: "Module",
            description: "Module description not available",
            illustration: "/placeholder.svg",
            color: "blue",
            totalLessons: 0,
            completedLessons: 0,
            lessonsCount: 0,
            isUnlocked: true,
            hasPurchasedChapters: false,
            academicStreams: [],
            chapters: [],
          };
        }
        setModule(moduleData);

        // Try to get real chapter data from the module's chapters
        let chapterData = null;

        try {
          // Try to get the specific chapter with its module and stream data
          const fullChapterId = chapterId.includes("Chapter:")
            ? chapterId
            : `Chapter:${chapterId}`;
          const chapterResponse =
            await chaptersApi.getChapterWithModuleAndStream(fullChapterId);

          if (chapterResponse.success && chapterResponse.data) {
            chapterData = chaptersApi.transformChapter(
              chapterResponse.data,
              moduleId
            );
            console.log("Fetched chapter:", chapterData);
          } else {
            console.warn(
              "Failed to fetch chapter with module and stream:",
              chapterResponse.message
            );
            // Fallback to getting chapters by module
            const fullModuleId = `Module:${moduleId}`;
            const chaptersResponse = await chaptersApi.getChaptersByModule(
              fullModuleId
            );

            if (chaptersResponse.success && chaptersResponse.data) {
              const chapters = chaptersResponse.data.map((chapter) => ({
                ...chapter,
                moduleId: moduleId, // Ensure moduleId is set
              }));

              console.log("Fetched chapters from backend:", chapters);
              console.log("Looking for chapterId:", chapterId);

              // Find the specific chapter
              chapterData = chapters.find((ch) => {
                const matches =
                  ch.id === chapterId ||
                  ch.id === chapterId.replace("Chapter:", "") ||
                  `Chapter:${ch.id}` === chapterId;
                console.log(
                  `Checking chapter ${ch.id} against ${chapterId}:`,
                  matches
                );
                return matches;
              });

              console.log("Found chapter data:", chapterData);
            }
          }
        } catch (error) {
          console.warn("Failed to fetch chapter data:", error);
        }

        // If we found the chapter, use it; otherwise try localStorage fallback
        if (chapterData) {
          setChapter(chapterData);
          // Initialize selected streams and dependencies from chapter data
          if (chapterData.academicStreams) {
            setSelectedStreams(chapterData.academicStreams);
          }
          if (chapterData.prerequisites) {
            setSelectedDependencies(chapterData.prerequisites);
          }
        } else {
          // Try to load from localStorage as fallback
          try {
            const savedChapter = localStorage.getItem(`chapter_${chapterId}`);
            if (savedChapter) {
              const parsedChapter = JSON.parse(savedChapter);
              console.log("Loaded chapter from localStorage:", parsedChapter);
              setChapter(parsedChapter);
            } else {
              // Create a basic chapter if not found anywhere
              console.log("No chapter data found, creating basic chapter");
              const basicChapter = {
                id: chapterId,
                title: t("professor.chapters.management"),
                description:
                  "Manage this chapter's content, lessons, and settings",
                image: "/placeholder.svg",
                moduleId: moduleId,
                lessons: [],
                prerequisites: [],
                price: 0,
                isPurchased: false,
                isCompleted: false,
                isUnlocked: true,
                order: 0,
                academicStreams: [],
                totalLessons: 0,
                completedLessons: 0,
              };
              setChapter(basicChapter);
            }
          } catch (error) {
            console.warn("Failed to load from localStorage:", error);
            // Create a basic chapter as final fallback
            const basicChapter = {
              id: chapterId,
              title: "Chapter Management",
              description:
                "Manage this chapter's content, lessons, and settings",
              image: "/placeholder.svg",
              moduleId: moduleId,
              lessons: [],
              prerequisites: [],
              price: 0,
              isPurchased: false,
              isCompleted: false,
              isUnlocked: true,
              order: 0,
              academicStreams: [],
              totalLessons: 0,
              completedLessons: 0,
            };
            setChapter(basicChapter);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load chapter data. Please try again.");
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };

    fetchData();
  }, [chapterId, moduleId]);

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
          console.log("Loaded academic streams:", response.data);
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

  // Load lessons for the chapter
  const fetchLessons = async () => {
    if (!chapterId) {
      console.log("No chapterId, skipping lessons fetch");
      setLessons([]);
      return;
    }

    try {
      setLessonsLoading(true);
      setLessonsError(null);
      console.log("Fetching lessons for chapter:", chapterId);
      const lessonsData = await getLessonsByChapter(chapterId);
      setLessons(lessonsData);
      console.log("Loaded lessons:", lessonsData);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      setLessonsError(
        error instanceof Error ? error.message : "Failed to load lessons"
      );
      setLessons([]);
    } finally {
      setLessonsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [chapterId]);

  // Keyboard shortcut for Select All (Ctrl/Cmd + A)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "a") {
        // Only trigger if we're in the academic streams section
        const target = event.target as HTMLElement;
        if (target.closest("[data-academic-streams-section]")) {
          event.preventDefault();
          handleSelectAllStreams();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [academicStreams, selectedStreams]);

  // Load available chapters for dependencies
  useEffect(() => {
    const fetchAvailableChapters = async () => {
      if (!moduleId) return;

      try {
        const fullModuleId = `Module:${moduleId}`;
        const chaptersResponse = await chaptersApi.getChaptersByModule(
          fullModuleId
        );

        if (chaptersResponse.success && chaptersResponse.data) {
          const chapters = chaptersResponse.data.map((chapter) => ({
            ...chapter,
            moduleId: moduleId, // Ensure moduleId is set
          }));
          // Filter out current chapter from dependencies
          const filteredChapters = chapters.filter((ch) => ch.id !== chapterId);
          setAvailableChapters(filteredChapters);
        }
      } catch (error) {
        console.error("Error fetching available chapters:", error);
      }
    };

    fetchAvailableChapters();
  }, [moduleId, chapterId]);

  // Update dependencies when chapter data changes
  useEffect(() => {
    if (chapter?.prerequisites) {
      setSelectedDependencies(chapter.prerequisites);
    }
  }, [chapter?.prerequisites]);

  // Initialize selectedStreams with chapter's existing academic streams
  useEffect(() => {
    console.log("Chapter academic streams:", chapter?.academicStreams);
    if (
      chapter?.academicStreams &&
      Array.isArray(chapter.academicStreams) &&
      chapter.academicStreams.length > 0
    ) {
      console.log("Setting selectedStreams to:", chapter.academicStreams);
      setSelectedStreams(chapter.academicStreams);
    } else {
      console.log("No academic streams found, clearing selectedStreams");
      setSelectedStreams([]);
    }
  }, [chapter?.academicStreams]);

  const resolveChapterTitle = (id?: string) => {
    if (!id) return id;
    // For now, return the ID as we don't have a way to fetch all chapters
    return id;
  };

  // Show only the streams that are currently selected for this chapter
  const displayedStreams = selectedStreams;

  // Debug logging
  console.log("Current state:");
  console.log("- selectedStreams:", selectedStreams);
  console.log("- displayedStreams:", displayedStreams);
  console.log("- chapter?.academicStreams:", chapter?.academicStreams);

  const dependencies = chapter?.prerequisites ?? [];

  if (loading) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="w-full flex flex-col gap-12 py-11 px-3 rounded-[52px] bg-neutral-100">
          <div className="flex justify-center items-center py-8">
            <Loader label="Loading chapter..." />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="w-full flex flex-col gap-12 py-11 px-3 rounded-[52px] bg-neutral-100">
          <div className="flex justify-center items-center py-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!chapter || !module) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="w-full flex flex-col gap-12 py-11 px-3 rounded-[52px] bg-neutral-100">
          <div className="flex justify-center items-center py-8">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Chapter not found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // callback function for form elements:
  const handleAddStream = (streamId: string) => {
    console.log("Adding stream:", streamId);

    if (!streamId) {
      console.warn("No stream ID provided");
      return;
    }

    if (selectedStreams.includes(streamId)) {
      console.warn("Stream already selected:", streamId);
      setSaveMessage("⚠️ This stream is already assigned to the chapter");
      setTimeout(() => setSaveMessage(null), 2000);
      return;
    }

    // Find the stream details for display
    const stream = academicStreams.find((s) => s.id === streamId);
    const displayName = stream?.labelKey || streamId;

    // Add the stream with animation
    setSelectedStreams((prev: string[]) => {
      const newStreams = [...prev, streamId];
      console.log("Updated selectedStreams:", newStreams);
      return newStreams;
    });

    setDropdownValue(""); // Clear the dropdown after selection

    // Show success feedback
    setSaveMessage(`✓ Added "${displayName}" to chapter`);
    setTimeout(() => setSaveMessage(null), 2000);
  };

  // Handle removing a stream
  const handleRemoveStream = (streamToRemove: string) => {
    console.log("Removing stream:", streamToRemove);

    // Find the stream details for display
    const stream = academicStreams.find((s) => s.id === streamToRemove);
    const displayName = stream?.labelKey || streamToRemove;

    setSelectedStreams((prev: string[]) => {
      const newStreams = prev.filter((stream) => stream !== streamToRemove);
      console.log("Updated selectedStreams after removal:", newStreams);
      return newStreams;
    });

    // Show feedback
    setSaveMessage(`✓ Removed "${displayName}" from chapter`);
    setTimeout(() => setSaveMessage(null), 2000);
  };

  // Handle clearing all streams
  const handleClearAllStreams = () => {
    console.log("Clearing all streams");
    setSelectedStreams([]);
    setSaveMessage("✓ Cleared all academic streams");
    setTimeout(() => setSaveMessage(null), 2000);
  };

  // Handle selecting all available streams
  const handleSelectAllStreams = () => {
    console.log("Selecting all streams");
    const allStreamIds = academicStreams.map((stream) => stream.id);

    setSelectedStreams(allStreamIds);
    setSaveMessage(
      `✓ Added all ${allStreamIds.length} academic streams to chapter`
    );
    setTimeout(() => setSaveMessage(null), 3000);
  };

  // Handle dependency selection
  const handleDependencyToggle = (chapterId: string) => {
    setSelectedDependencies((prev) => {
      if (prev.includes(chapterId)) {
        return prev.filter((id) => id !== chapterId);
      } else {
        return [...prev, chapterId];
      }
    });
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setExamFile(file);
      setExamFileName(file.name);
    } else {
      alert("Please select a PDF file");
    }
  };

  // Validation function
  const validateChapterData = () => {
    if (!chapter?.title?.trim()) {
      return t("errors.chapter.titleRequired");
    }
    if (!chapter?.description?.trim()) {
      return t("errors.chapter.descriptionRequired");
    }
    if (examMinimumScore > examTotalMark) {
      return t("errors.chapter.minScoreExceedsTotal");
    }
    return null;
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!chapter || !module) return;

    // Validate data
    const validationError = validateChapterData();
    if (validationError) {
      setSaveMessage(`Validation Error: ${validationError}`);
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Single comprehensive update
      const updateData = {
        name: chapter.title,
        description: chapter.description,
        price: chapter.price,
        academic_streams: selectedStreams,
      };

      console.log("Updating chapter with data:", updateData);
      console.log("Selected streams being saved:", selectedStreams);

      const updateResponse = await chaptersApi.updateChapter(
        chapterId!,
        updateData
      );

      if (!updateResponse.success) {
        throw new Error(updateResponse.message || "Failed to update chapter");
      }

      // Update local state with the saved data
      const updatedChapter = {
        ...chapter,
        title: chapter.title,
        description: chapter.description,
        price: chapter.price,
        academicStreams: selectedStreams, // Use the current selectedStreams
        prerequisites: selectedDependencies,
      };
      setChapter(updatedChapter);

      // Show success message with details
      const streamCount = selectedStreams.length;
      const streamText = streamCount === 1 ? "stream" : "streams";
      setSaveMessage(
        `✓ Chapter saved successfully with ${streamCount} academic ${streamText}!`
      );
      setTimeout(() => setSaveMessage(null), 3000);

      // Save to localStorage as backup
      try {
        localStorage.setItem(
          `chapter_${chapterId}`,
          JSON.stringify(updatedChapter)
        );
      } catch (error) {
        console.warn("Failed to save to localStorage:", error);
      }
    } catch (error) {
      console.error("Error saving chapter:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setSaveMessage(`❌ Error: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete chapter
  const handleDeleteChapter = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this chapter? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await chaptersApi.deleteChapter(chapterId!);

      if (response.success) {
        setSaveMessage("✓ Chapter deleted successfully!");
        // Redirect to module page after 1 second
        setTimeout(() => {
          window.location.href = `/professor/manage-content/${moduleId}`;
        }, 1000);
      } else {
        throw new Error(response.message || "Failed to delete chapter");
      }
    } catch (error) {
      console.error("Error deleting chapter:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setSaveMessage(`❌ Error: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* manage chapter */}
      <div className="w-full flex flex-col gap-12 py-11 px-3 rounded-[52px] bg-neutral-100">
        {/* header */}
        <div className="flex justify-between gap-3">
          {/* info */}
          <div className="flex flex-col px-6 gap-1">
            <span className="font-semibold text-5xl text-neutral-600">
              {chapter?.title ?? "Chapter title"}
            </span>
            <span className="font-medium text-2xl text-neutral-400">
              {module?.name ?? "Module name"}
            </span>
          </div>
          {/* action buttons */}
          <div className="flex flex-col items-end gap-2">
            {saveMessage && (
              <div
                className={`text-sm px-3 py-1 rounded ${
                  saveMessage.includes("Error") || saveMessage.includes("❌")
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {saveMessage}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                state={"outlined"}
                size={"M"}
                icon_position={"right"}
                text={"Delete Chapter"}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                }
                onClick={handleDeleteChapter}
                disabled={isSaving}
              />
              <Button
                state={"filled"}
                size={"M"}
                icon_position={"right"}
                text={
                  isSaving ? "Saving..." : t("professor.chapters.SaveChanges")
                }
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                  >
                    <path
                      d="M9.69961 12.0001L11.5663 13.8668L15.2996 10.1334M20.8996 12.0001C20.8996 16.6393 17.1388 20.4001 12.4996 20.4001C7.86042 20.4001 4.09961 16.6393 4.09961 12.0001C4.09961 7.36091 7.86042 3.6001 12.4996 3.6001C17.1388 3.6001 20.8996 7.36091 20.8996 12.0001Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                onClick={handleSaveChanges}
                disabled={isSaving}
              />
            </div>
          </div>
        </div>
        {/* input fields */}
        <div className="flex flex-col gap-12">
          {/* Chapter Title and Description */}
          <div className="flex flex-col gap-5">
            <div className="px-8 text-2xl font-medium text-neutral-600">
              Chapter Information
            </div>
            <div className="px-8 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-600">
                  Chapter Title
                </label>
                <input
                  type="text"
                  value={chapter?.title || ""}
                  onChange={(e) =>
                    setChapter((prev) =>
                      prev ? { ...prev, title: e.target.value } : null
                    )
                  }
                  disabled={isSaving}
                  className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isSaving ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  placeholder={t("common.enterChapterTitle")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-600">
                  Chapter Description
                </label>
                <textarea
                  value={chapter?.description || ""}
                  onChange={(e) =>
                    setChapter((prev) =>
                      prev ? { ...prev, description: e.target.value } : null
                    )
                  }
                  disabled={isSaving}
                  className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none ${
                    isSaving ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  placeholder={t("common.enterChapterDescription")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-600">
                  Chapter Price (DA)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={chapter?.price || 0}
                  onChange={(e) =>
                    setChapter((prev) =>
                      prev
                        ? { ...prev, price: parseFloat(e.target.value) || 0 }
                        : null
                    )
                  }
                  disabled={isSaving}
                  className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isSaving ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  placeholder={t("common.enterChapterPrice")}
                />
              </div>
            </div>
          </div>
          {/* Academic Streams Section */}
          <div className="flex flex-col gap-5" data-academic-streams-section>
            <div className="px-8 text-2xl font-medium text-neutral-600">
              {t("professor.chapters.supportedStreams")}
            </div>
            <div className="px-8 flex flex-col gap-4">
              {/* Error State */}
              {streamsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-red-600 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
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

              {/* Stream Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <DropDown
                      label="Add Academic Stream"
                      placeholder={
                        isStreamsLoading
                          ? "Loading streams..."
                          : streamsError
                          ? "Error loading streams"
                          : "Choose an academic stream to add..."
                      }
                      options={academicStreams
                        .filter(
                          (stream) => !selectedStreams.includes(stream.id)
                        )
                        .map((stream) => ({
                          id: stream.id,
                          text: stream.labelKey,
                        }))}
                      max_width="max-w-md"
                      value={dropdownValue}
                      onChange={handleAddStream}
                    />
                  </div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {isStreamsLoading ? (
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Loading...
                      </span>
                    ) : (
                      <>
                        {
                          academicStreams.filter(
                            (stream) => !selectedStreams.includes(stream.id)
                          ).length
                        }{" "}
                        available
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSelectAllStreams}
                      disabled={
                        isStreamsLoading ||
                        !!streamsError ||
                        selectedStreams.length === academicStreams.length
                      }
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      title="Select all available academic streams (Ctrl/Cmd + A)"
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
                      Select All
                    </button>

                    {selectedStreams.length > 0 && (
                      <button
                        onClick={handleClearAllStreams}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                        title="Clear all selected streams"
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
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* Progress Indicator */}
                  {!isStreamsLoading && !streamsError && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{selectedStreams.length} selected</span>
                      </div>
                      <div className="text-gray-300">•</div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <span>
                          {academicStreams.length - selectedStreams.length}{" "}
                          remaining
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Streams */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">
                      Assigned Academic Streams ({displayedStreams.length})
                    </h4>
                  </div>

                  {displayedStreams.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {displayedStreams.map((streamId, index) => {
                        const stream = academicStreams.find(
                          (s) => s.id === streamId
                        );
                        const displayName = stream?.labelKey || streamId;
                        return (
                          <div
                            key={streamId}
                            className="group relative inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-green-100 hover:border-green-300 animate-in slide-in-from-top-2 fade-in"
                            style={{
                              animationDelay: `${index * 50}ms`,
                              animationFillMode: "both",
                            }}
                          >
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {displayName}
                            </span>
                            <button
                              onClick={() => handleRemoveStream(streamId)}
                              className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-red-600 hover:text-red-800 hover:bg-red-100 rounded p-1"
                              title="Remove stream"
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
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {/* Chapter dependencies */}
          <div className="px-8 flex flex-row justify-between items-center gap-3">
            {/* info */}
            <div className="flex flex-col gap-5">
              <div className="text-2xl font-medium text-neutral-600">
                {t("professor.chapters.ChapterDepencies")}
              </div>
              <div className="flex flex-row gap-3 flex-wrap">
                {selectedDependencies.length > 0 ? (
                  selectedDependencies.map((depId) => {
                    const depChapter = availableChapters.find(
                      (ch) => ch.id === depId
                    );
                    return (
                      <BigTag
                        key={depId}
                        icon={undefined}
                        text={depChapter?.title || depId}
                        onClick={() => handleDependencyToggle(depId)}
                        className="cursor-pointer hover:bg-red-100"
                      />
                    );
                  })
                ) : (
                  <div className="text-sm text-neutral-400 px-4">
                    No dependencies
                  </div>
                )}
              </div>
            </div>
            {/* action buttons */}
            <div className="">
              <Button
                state={"outlined"}
                size={"M"}
                text={t("professor.chapters.AddDepencies")}
                icon_position={"left"}
                icon={<Plus />}
                onClick={() => {
                  window.scrollTo(0, 0);
                  document.body.classList.add("no-scroll");
                  setShowChapterDependencyPopup(true);
                }}
              />
            </div>
          </div>
          {/* Chapter exam */}
          <div className="flex flex-col gap-5 px-8">
            {/* title */}
            <div className="text-2xl font-medium text-neutral-600">
              {t("professor.chapters.ChapterExams")}
            </div>
            {/* input fields */}
            <div className="flex flex-col gap-6">
              {/* upload pdf exam */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between items-center">
                  <div className="text-neutral-600 font-normal text-base px-4">
                    {t("professor.chapters.UploadExamPDF")}
                  </div>
                  <div className="">
                    <Button
                      state={"outlined"}
                      size={"M"}
                      icon_position={"none"}
                      text={t("professor.chapters.Upload")}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <SecureFileUpload
                    onUploadComplete={(fileInfo) => {
                      setUploadedExamFile(fileInfo);
                      setSaveMessage(`✓ Exam PDF uploaded: ${fileInfo.name}`);
                      setTimeout(() => setSaveMessage(null), 3000);
                    }}
                    onUploadError={(error) => {
                      setSaveMessage(`❌ Upload failed: ${error}`);
                      setTimeout(() => setSaveMessage(null), 3000);
                    }}
                    acceptedTypes={["application/pdf"]}
                    maxSizeMB={50}
                    accessLevel="student"
                    courseId={moduleId || undefined}
                    chapterId={chapterId || undefined}
                    className="w-full"
                  />
                  {uploadedExamFile && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        ✓ Uploaded: {uploadedExamFile.name} (
                        {(uploadedExamFile.file_size / (1024 * 1024)).toFixed(
                          2
                        )}{" "}
                        MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {/* total score */}
              {/* Exam Total Mark */}
              <div className="flex flex-col gap-2">
                <div className="font-work-sans text-neutral-600 font-normal px-4">
                  {t("professor.chapters.ExamTotalMark")}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setExamTotalMark(Math.max(0, examTotalMark - 1))
                    }
                    className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={examTotalMark}
                    onChange={(e) =>
                      setExamTotalMark(parseInt(e.target.value) || 0)
                    }
                    className="w-20 text-center appearance-none outline-[var(--primary-200)] p-0 m-0 shadow-none bg-white border border-neutral-200 px-3 py-2 rounded-3xl focus:border-2 focus:border-[var(--primary-200)]"
                    min="0"
                  />
                  <button
                    type="button"
                    onClick={() => setExamTotalMark(examTotalMark + 1)}
                    className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Exam Min Score */}
              <div className="flex flex-col gap-2">
                <div className="font-work-sans text-neutral-600 font-normal px-4">
                  {t("professor.chapters.ExamMinScore")}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setExamMinimumScore(Math.max(0, examMinimumScore - 1))
                    }
                    className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={examMinimumScore}
                    onChange={(e) =>
                      setExamMinimumScore(parseInt(e.target.value) || 0)
                    }
                    className="w-20 text-center appearance-none outline-[var(--primary-200)] p-0 m-0 shadow-none bg-white border border-neutral-200 px-3 py-2 rounded-3xl focus:border-2 focus:border-[var(--primary-200)]"
                    min="0"
                  />
                  <button
                    type="button"
                    onClick={() => setExamMinimumScore(examMinimumScore + 1)}
                    className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Exam Total XP */}
              <div className="flex flex-col gap-2">
                <div className="font-work-sans text-neutral-600 font-normal px-4">
                  {t("professor.chapters.ExamTotalXP")}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setExamTotalXP(Math.max(0, examTotalXP - 1))}
                    className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={examTotalXP}
                    onChange={(e) =>
                      setExamTotalXP(parseInt(e.target.value) || 0)
                    }
                    className="w-20 text-center appearance-none outline-[var(--primary-200)] p-0 m-0 shadow-none bg-white border border-neutral-200 px-3 py-2 rounded-3xl focus:border-2 focus:border-[var(--primary-200)]"
                    min="0"
                  />
                  <button
                    type="button"
                    onClick={() => setExamTotalXP(examTotalXP + 1)}
                    className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* lessons section */}
      <div className="w-full py-6 px-4 flex flex-col gap-4 rounded-[52px] bg-neutral-100">
        {/* header */}
        <div className="px-4 flex justify-between items-center">
          {/* title */}
          <div className="text-2xl font-medium grow">
            {t("professor.chapters.Lessons")}
            {lessons.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                ({lessons.length} lesson{lessons.length !== 1 ? "s" : ""})
              </span>
            )}
          </div>
          {/* action buttons */}
          <div className="flex gap-3">
            <Button
              state={"tonal"}
              size={"M"}
              icon_position={"left"}
              text="Refresh"
              icon={
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              }
              onClick={fetchLessons}
              disabled={lessonsLoading}
            />
            <Button
              state={"outlined"}
              size={"M"}
              icon_position={"left"}
              text={t("professor.chapters.AddLesson")}
              icon={<Plus />}
              onClick={() => {
                window.scrollTo(0, 0);
                document.body.classList.add("no-scroll");
                setShowCreateLessonPopup(true);
              }}
            />
          </div>
        </div>
        {/* content */}
        <div className="w-full flex flex-col gap-4">
          {/* Loading State */}
          {lessonsLoading && (
            <div className="w-full flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600">Loading lessons...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {lessonsError && !lessonsLoading && (
            <div className="w-full flex justify-center items-center py-12">
              <div className="text-center">
                <div className="text-red-500 text-2xl mb-2">⚠️</div>
                <p className="text-red-600 font-medium mb-2">
                  Failed to load lessons
                </p>
                <p className="text-sm text-gray-600 mb-4">{lessonsError}</p>
                <Button
                  state="outlined"
                  size="M"
                  icon_position="none"
                  text="Retry"
                  onClick={fetchLessons}
                />
              </div>
            </div>
          )}

          {/* Lessons List */}
          {!lessonsLoading &&
            !lessonsError &&
            lessons.length > 0 &&
            lessons.map((lesson, index) => (
              <LessonCard
                key={lesson.id || `lesson-${index}`}
                id={lesson.id || `lesson-${index}`}
                title={lesson.title || "Untitled Lesson"}
                description={lesson.description || "No description available"}
                created_date={
                  lesson.created_at ? new Date(lesson.created_at) : new Date()
                }
                isQuizAvailable={true}
                number={index + 1}
                isUploading={false}
                isDisabled={false}
                viewDetailsCallback={() => {
                  window.scrollTo(0, 0);
                  document.body.classList.add("no-scroll");
                  setSelectedLessonId(lesson.id || null);
                  setShowUpdateLessonPopup(true);
                }}
                viewLessonDetailsCallback={() => {
                  window.scrollTo(0, 0);
                  document.body.classList.add("no-scroll");
                  setSelectedLessonId(lesson.id || null);
                  setShowLessonDetailsPopup(true);
                }}
              />
            ))}

          {/* Empty State */}
          {!lessonsLoading && !lessonsError && lessons.length === 0 && (
            <div className="w-full flex justify-center items-center text-2xl text-neutral-400 font-medium my-12">
              <div className="text-center">
                <div className="text-6xl mb-4">📚</div>
                <p className="mb-4">{t("professor.chapters.NoLessonYet")}</p>
                <p className="text-sm text-gray-500 mb-6">
                  Click "Add Lesson" to create your first lesson
                </p>
                <Button
                  state="filled"
                  size="M"
                  icon_position="none"
                  text="Create First Lesson"
                  onClick={() => {
                    window.scrollTo(0, 0);
                    document.body.classList.add("no-scroll");
                    setShowCreateLessonPopup(true);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* pop ups */}
      {showCreateLessonPopup && (
        <div className="w-full overflow-y-auto h-screen flex justify-center bg-black/40 absolute top-0 left-0 z-100000">
          <div className="m-20 max-w-4xl w-full">
            <CreateLessonPopup
              onClose={() => {
                document.body.classList.remove("no-scroll");
                setShowCreateLessonPopup(false);
                // Refresh lessons after closing popup
                fetchLessons();
              }}
              t={t}
              chapterId={chapterId || undefined}
              moduleId={moduleId || undefined}
            />
          </div>
        </div>
      )}

      {showChapterDependencyPopup && (
        <div className="w-full overflow-y-auto h-screen flex justify-center bg-black/40 absolute top-0 left-0 z-100000">
          <div className="m-20">
            <ChapterDependencyPopup
              onClose={() => {
                document.body.classList.remove("no-scroll");
                setShowChapterDependencyPopup(false);
              }}
              t={t}
              isRTL={isRTL}
              availableChapters={availableChapters}
              selectedDependencies={selectedDependencies}
              onDependenciesChange={setSelectedDependencies}
            />
          </div>
        </div>
      )}

      {showUpdateLessonPopup && (
        <div className="w-full overflow-y-auto h-screen flex justify-center bg-black/40 absolute top-0 left-0 z-100000">
          <div className="m-20 max-w-4xl w-full">
            <UpdateLessonPopUp
              onClose={() => {
                document.body.classList.remove("no-scroll");
                setShowUpdateLessonPopup(false);
                setSelectedLessonId(null);
              }}
              onLessonUpdated={() => {
                fetchLessons(); // Refresh lessons after update
              }}
              t={t}
              isRTL={isRTL}
              lessonId={selectedLessonId || undefined}
            />
          </div>
        </div>
      )}

      {showUpdateChapterPopup && (
        <div className="w-full overflow-y-auto h-screen flex justify-center bg-black/40 absolute top-0 left-0 z-100000">
          <div className="m-20 max-w-4xl w-full">
            <UpdateLessonPopUp
              onClose={() => {
                document.body.classList.remove("no-scroll");
                setShowUpdateChapterPopup(false);
              }}
              t={t}
              isRTL={isRTL}
            />
          </div>
        </div>
      )}

      {showLessonDetailsPopup && (
        <div className="w-full overflow-y-auto h-screen flex justify-center bg-black/40 absolute top-0 left-0 z-100000">
          <div className="m-20 max-w-4xl w-full">
            <ViewLessonPopup
              onClose={() => {
                document.body.classList.remove("no-scroll");
                setShowLessonDetailsPopup(false);
                setSelectedLessonId(null);
              }}
              t={t}
              isRTL={isRTL}
              lessonId={selectedLessonId || undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
}

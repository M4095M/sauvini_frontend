"use client";

import { useState, useEffect, useRef } from "react";
import { X, Plus, Minus, Calendar } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSafeTranslation } from "@/hooks/useSafeTranslation";
import Button from "@/components/ui/button";
import ControlledInput from "@/components/input/ControlledInput";
import DropDown from "@/components/input/dropDown";
import Tag from "@/components/professor/tag";
import { livesApi, type CreateLiveRequest } from "@/api/lives";
import { ChaptersApi, type FrontendChapter } from "@/api/chapters";
import { type FrontendModule } from "@/api/modules";
import { type FrontendAcademicStream } from "@/api/academicStreams";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  modules: FrontendModule[];
  chapters: FrontendChapter[];
  academicStreams: FrontendAcademicStream[];
}

export default function ScheduleLiveModal({
  onClose,
  onSuccess,
  modules,
  chapters,
  academicStreams,
}: Props) {
  const { t, isRTL } = useLanguage();
  const { safeTranslate } = useSafeTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]); // Store stream IDs or names
  const [date, setDate] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSubmittingRef = useRef(false); // Prevent multiple concurrent submissions
  const [availableChapters, setAvailableChapters] = useState<FrontendChapter[]>(
    []
  );

  // Load chapters when module is selected
  useEffect(() => {
    const loadChapters = async () => {
      if (!selectedModuleId) {
        setAvailableChapters([]);
        setSelectedChapterId("");
        return;
      }

      try {
        const fullModuleId = `Module:${selectedModuleId}`;
        const response = await ChaptersApi.getChaptersByModule(fullModuleId);
        if (response.success && response.data) {
          setAvailableChapters(response.data);
        }
      } catch (error) {
        console.error("Error loading chapters:", error);
      }
    };

    loadChapters();
  }, [selectedModuleId]);

  const handleAddStream = (streamValue: string) => {
    // streamValue is the transformed value (e.g., "literature"), find the actual stream object
    const stream = academicStreams.find((s) => s.value === streamValue);
    if (stream) {
      // Verify we have a valid UUID
      if (!stream.id || typeof stream.id !== "string") {
        console.error("Invalid stream ID:", stream);
        setError(`Invalid academic stream selected. Please try again.`);
        return;
      }

      // Validate UUID format
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(stream.id)) {
        console.error("Stream ID is not a valid UUID:", stream.id);
        setError(`Invalid academic stream ID format. Please try again.`);
        return;
      }

      // Store the stream ID (UUID) to use as foreign key
      if (!selectedStreams.includes(stream.id)) {
        setSelectedStreams([...selectedStreams, stream.id]);
      }
    } else {
      console.error("Stream not found for value:", streamValue);
      setError(`Academic stream not found. Please try selecting again.`);
    }
  };

  const handleRemoveStream = (streamId: string) => {
    setSelectedStreams(selectedStreams.filter((id) => id !== streamId));
  };

  const incrementHours = () => {
    setHours((prev) => (prev >= 23 ? 0 : prev + 1));
  };

  const decrementHours = () => {
    setHours((prev) => (prev <= 0 ? 23 : prev - 1));
  };

  const incrementMinutes = () => {
    setMinutes((prev) => (prev >= 59 ? 0 : prev + 1));
  };

  const decrementMinutes = () => {
    setMinutes((prev) => (prev <= 0 ? 59 : prev - 1));
  };

  const handleSubmit = async () => {
    // Prevent multiple concurrent submissions
    if (isSubmittingRef.current || loading) {
      console.warn("Submission already in progress, ignoring duplicate call");
      return;
    }

    // Validation
    if (!title.trim()) {
      setError("Live title is required");
      return;
    }
    if (!description.trim()) {
      setError("Live description is required");
      return;
    }
    if (selectedStreams.length === 0) {
      setError("Please select at least one academic stream");
      return;
    }
    if (!date) {
      setError("Please select a date");
      return;
    }

    try {
      isSubmittingRef.current = true; // Mark as submitting
      setLoading(true);
      setError(null);

      // Combine date and time
      const dateTime = new Date(date);
      dateTime.setHours(hours);
      dateTime.setMinutes(minutes);
      const scheduledDatetime = dateTime.toISOString();

      // Validate that all selected streams are valid UUIDs
      const validStreamIds = selectedStreams.filter((id) => {
        // Basic UUID validation (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
      });

      if (validStreamIds.length !== selectedStreams.length) {
        setError("Invalid academic stream IDs. Please select streams again.");
        setLoading(false);
        return;
      }

      const request: CreateLiveRequest = {
        title: title.trim(),
        description: description.trim(),
        module_id: selectedModuleId || undefined,
        chapter_id: selectedChapterId || undefined,
        academic_stream_ids: validStreamIds, // Send as academic_stream_ids
        scheduled_datetime: scheduledDatetime,
      };

      const response = await livesApi.createLive(request);
      if (response.success && response.data) {
        // Only call success handlers once
        isSubmittingRef.current = false;
        setLoading(false);
        onSuccess();
        onClose();
        return; // Explicit return to prevent further execution
      } else {
        // Parse Django validation error format
        let errorMessage = response.message || "Failed to schedule live";
        if (
          typeof errorMessage === "string" &&
          errorMessage.includes("ErrorDetail")
        ) {
          // Try to extract meaningful error from Django's ErrorDetail format
          try {
            // Django validation errors can come as strings like "[ErrorDetail(string='message', code='invalid')]"
            const match = errorMessage.match(/string='([^']+)'/);
            if (match && match[1]) {
              errorMessage = match[1];
            }
          } catch (e) {
            // Keep original message if parsing fails
          }
        }
        setError(errorMessage);
      }
    } catch (err: any) {
      console.error("Error scheduling live:", err);
      isSubmittingRef.current = false; // Reset on error
      // Check if it's a permission error (403)
      if (
        err?.status === 403 ||
        err?.message?.includes("professor") ||
        err?.message?.includes("permission") ||
        err?.message?.includes("Only professors")
      ) {
        setError(
          err?.message ||
            "You don't have permission to create live sessions. Please ensure you're logged in with a professor or admin account."
        );
      } else {
        setError(
          err?.message || "An unexpected error occurred. Please try again."
        );
      }
    } finally {
      isSubmittingRef.current = false; // Always reset on completion
      setLoading(false);
    }
  };

  const moduleOptions = modules.map((m) => ({
    id: m.id,
    text: m.name,
  }));

  const chapterOptions = availableChapters.map((c) => ({
    id: c.id,
    text: c.title,
  }));

  // Get the selected module and chapter text for display
  const selectedModuleText =
    moduleOptions.find((m) => m.id === selectedModuleId)?.text || "";
  const selectedChapterText =
    chapterOptions.find((c) => c.id === selectedChapterId)?.text || "";

  const availableStreamOptions = academicStreams
    .filter((s) => !selectedStreams.includes(s.id)) // Filter by stream ID
    .map((s) => ({
      id: s.value, // Use value for dropdown option ID (to identify selection)
      text: safeTranslate(
        `professor.academicStreams.${s.labelKey}`,
        s.name // Use actual name as fallback
      ),
    }));

  // Set today's date as default and minimum
  const today = new Date().toISOString().split("T")[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 bg-white dark:bg-[#1A1A1A] rounded-[52px] p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h2
              className={`text-3xl font-bold text-gray-900 dark:text-white mb-2 ${
                isRTL ? "font-arabic text-right" : "font-sans text-left"
              }`}
            >
              {safeTranslate(
                "professor.lives.scheduleModal.title",
                "Schedule a live"
              )}
            </h2>
            <p
              className={`text-gray-600 dark:text-gray-400 ${
                isRTL ? "font-arabic text-right" : "font-sans text-left"
              }`}
            >
              {safeTranslate(
                "professor.lives.scheduleModal.description",
                "The scheduled live will be reviewed by an admin before validation"
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          <ControlledInput
            label={safeTranslate(
              "professor.lives.scheduleModal.liveTitle",
              "Live Title"
            )}
            value={title}
            onChange={setTitle}
            type="text"
            placeholder="Enter live title"
            max_width=""
          />

          {/* Description */}
          <ControlledInput
            label={safeTranslate(
              "professor.lives.scheduleModal.liveDescription",
              "Live Description"
            )}
            value={description}
            onChange={setDescription}
            type="text"
            long
            max_height="h-32"
            max_width=""
            placeholder="Enter live description"
          />

          {/* Module and Chapter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <DropDown
                label={safeTranslate(
                  "professor.lives.scheduleModal.module",
                  "Module"
                )}
                placeholder={safeTranslate(
                  "professor.lives.scheduleModal.selectModule",
                  "Select a module"
                )}
                options={moduleOptions}
                value={selectedModuleText}
                onChange={(value) => setSelectedModuleId(value)}
                t={t}
                isRTL={isRTL}
                max_width=""
              />
              <select
                value={selectedModuleId}
                onChange={(e) => setSelectedModuleId(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              >
                <option value="">
                  {safeTranslate(
                    "professor.lives.scheduleModal.selectModule",
                    "Select a module"
                  )}
                </option>
                {moduleOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.text}
                  </option>
                ))}
              </select>
            </div>

            <div
              className={`relative ${
                !selectedModuleId ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <DropDown
                label={safeTranslate(
                  "professor.lives.scheduleModal.chapter",
                  "Chapter"
                )}
                placeholder={
                  !selectedModuleId
                    ? safeTranslate(
                        "professor.lives.scheduleModal.selectModuleFirst",
                        "Select a module first"
                      )
                    : safeTranslate(
                        "professor.lives.scheduleModal.selectChapter",
                        "Select a chapter"
                      )
                }
                options={chapterOptions}
                value={selectedChapterText}
                onChange={(value) => {
                  if (selectedModuleId) {
                    setSelectedChapterId(value);
                  }
                }}
                t={t}
                isRTL={isRTL}
                max_width=""
              />
              <select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(e.target.value)}
                disabled={!selectedModuleId}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              >
                <option value="">
                  {safeTranslate(
                    "professor.lives.scheduleModal.selectChapter",
                    "Select a chapter"
                  )}
                </option>
                {chapterOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.text}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Academic Streams */}
          <div className="flex flex-col gap-4">
            <div className="relative">
              <DropDown
                label={safeTranslate(
                  "professor.lives.scheduleModal.supportedAcademicStreams",
                  "Supported Academic Streams"
                )}
                placeholder={safeTranslate(
                  "professor.lives.scheduleModal.selectStream",
                  "Select a stream"
                )}
                options={availableStreamOptions}
                onChange={handleAddStream}
                t={t}
                isRTL={isRTL}
                max_width=""
              />
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) handleAddStream(e.target.value);
                  e.target.value = "";
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              >
                <option value="">
                  {safeTranslate(
                    "professor.lives.scheduleModal.selectStream",
                    "Select a stream"
                  )}
                </option>
                {availableStreamOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.text}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Streams Tags */}
            {selectedStreams.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {selectedStreams.map((streamId) => {
                  const stream = academicStreams.find((s) => s.id === streamId);
                  return (
                    <Tag
                      key={streamId}
                      icon={
                        <X
                          size={16}
                          className="cursor-pointer"
                          onClick={() => handleRemoveStream(streamId)}
                        />
                      }
                      text={
                        stream
                          ? isRTL
                            ? stream.name_ar
                            : stream.name
                          : streamId
                      }
                      className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date */}
            <div className="flex flex-col gap-2">
              <label
                className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${
                  isRTL ? "font-arabic text-right" : "font-sans text-left"
                }`}
              >
                {safeTranslate("professor.lives.scheduleModal.date", "Date")}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Hours */}
            <div className="flex flex-col gap-2">
              <label
                className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${
                  isRTL ? "font-arabic text-right" : "font-sans text-left"
                }`}
              >
                {safeTranslate("professor.lives.scheduleModal.time", "Time")} (
                {safeTranslate("professor.lives.scheduleModal.hours", "h")})
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={decrementHours}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setHours(Math.max(0, Math.min(23, val)));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
                />
                <button
                  type="button"
                  onClick={incrementHours}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Minutes */}
            <div className="flex flex-col gap-2">
              <label
                className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${
                  isRTL ? "font-arabic text-right" : "font-sans text-left"
                }`}
              >
                ({safeTranslate("professor.lives.scheduleModal.minutes", "min")}
                )
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={decrementMinutes}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setMinutes(Math.max(0, Math.min(59, val)));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
                />
                <button
                  type="button"
                  onClick={incrementMinutes}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={`flex gap-4 pt-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button
              state="tonal"
              size="M"
              icon_position="none"
              text={safeTranslate(
                "professor.lives.scheduleModal.cancel",
                "Cancel"
              )}
              onClick={onClose}
              disabled={loading}
              optionalStyles="flex-1"
            />
            <Button
              state="filled"
              size="M"
              icon_position="none"
              text={
                loading
                  ? "Submitting..."
                  : safeTranslate(
                      "professor.lives.scheduleModal.submit",
                      "Submit"
                    )
              }
              onClick={handleSubmit}
              disabled={loading}
              optionalStyles="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

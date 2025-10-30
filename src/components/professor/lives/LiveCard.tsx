"use client";

import { useState } from "react";
import { Video, Clock, Play, X, ChevronRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSafeTranslation } from "@/hooks/useSafeTranslation";
import Button from "@/components/ui/button";
import Tag from "@/components/professor/tag";
import CancelLiveModal from "./CancelLiveModal";
import type { Live, LiveStatus } from "@/api/lives";
import { livesApi } from "@/api/lives";
import { useRouter } from "next/navigation";

type TabType = "scheduled" | "recorded";

interface Props {
  live: Live;
  isRTL?: boolean;
  isMobile?: boolean;
  activeTab: TabType;
  onRefresh: () => void;
}

export default function LiveCard({
  live,
  isRTL = false,
  isMobile = false,
  activeTab,
  onRefresh,
}: Props) {
  const { safeTranslate } = useSafeTranslation();
  const router = useRouter();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isActioning, setIsActioning] = useState(false);

  const handleStartLive = async () => {
    setIsActioning(true);
    try {
      const response = await livesApi.startLive(live.id);
      if (response.success && response.data) {
        // Navigate to live streaming interface
        // Refresh to update status, then navigate
        onRefresh();
        setTimeout(() => {
          router.push(`/professor/lives/${live.id}/stream`);
        }, 500);
      } else {
        const errorMessage =
          response.message || "Failed to start live. Please try again.";
        alert(errorMessage);
      }
    } catch (error: any) {
      console.error("Error starting live:", error);
      const errorMessage =
        error?.message || "Failed to start live. Please try again.";
      alert(errorMessage);
    } finally {
      setIsActioning(false);
    }
  };

  const handleCancelLive = async () => {
    setIsActioning(true);
    try {
      const response = await livesApi.cancelLive(live.id);
      if (response.success) {
        setShowCancelModal(false);
        onRefresh();
      } else {
        alert("Failed to cancel live. Please try again.");
      }
    } catch (error) {
      console.error("Error cancelling live:", error);
      alert("Failed to cancel live. Please try again.");
    } finally {
      setIsActioning(false);
    }
  };

  const handleViewRecording = () => {
    router.push(`/professor/lives/${live.id}/recording`);
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return `${date.toLocaleDateString("en-GB")} - ${date.toLocaleTimeString(
        "en-GB",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )}`;
    } catch {
      return dateString;
    }
  };

  const formatTimeRemaining = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const now = new Date();
      const scheduled = new Date(dateString);
      const diff = scheduled.getTime() - now.getTime();

      if (diff <= 0) return "00:00";

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    } catch {
      return "00:00";
    }
  };

  // Can start if status is Approved or Pending (backend allows both)
  // The backend will handle any additional validation
  const canStartLive = live.status === "Approved" || live.status === "Pending";

  const isPending = live.status === "Pending";
  const isLive = live.status === "Live";
  const showPendingBadge = activeTab === "scheduled" && isPending;

  return (
    <div
      className={`rounded-[26px] bg-white dark:bg-gray-800 p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      {/* Header with Icon and Title */}
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            live.status === "Live"
              ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300"
              : "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300"
          }`}
        >
          <Video className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`font-semibold text-gray-900 dark:text-white truncate ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
            >
              {live.title}
            </h3>
            {showPendingBadge && (
              <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">
                  {safeTranslate("professor.lives.status.pending", "Pending")}
                </span>
              </div>
            )}
          </div>
          <p
            className={`text-sm text-gray-500 dark:text-gray-400 line-clamp-2 ${
              isRTL ? "font-arabic" : "font-sans"
            }`}
          >
            {safeTranslate(
              "professor.lives.card.moduleChapter",
              "Module / Chapter"
            )}
          </p>
        </div>
      </div>

      {/* Description */}
      <p
        className={`text-sm text-gray-600 dark:text-gray-300 line-clamp-3 ${
          isRTL ? "font-arabic" : "font-sans"
        }`}
      >
        {live.description ||
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero."}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {live.academic_streams && live.academic_streams.length > 0 ? (
          live.academic_streams.map((stream, idx) => (
            <Tag
              key={idx}
              text={stream}
              className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300"
            />
          ))
        ) : (
          <Tag
            text={safeTranslate("professor.academicStreams.all", "All")}
            className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300"
          />
        )}
      </div>

      {/* Time/Status Info */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        {isLive && live.viewer_count !== undefined ? (
          <span className={`${isRTL ? "font-arabic" : "font-sans"}`}>
            {live.viewer_count}{" "}
            {safeTranslate("professor.lives.streaming.viewers", "viewers")}
          </span>
        ) : live.status === "Live" && live.started_at ? (
          <span className={`${isRTL ? "font-arabic" : "font-sans"}`}>
            {safeTranslate("professor.lives.streaming.liveNow", "Live Now")}
          </span>
        ) : live.scheduled_datetime ? (
          canStartLive ? (
            <span className={`${isRTL ? "font-arabic" : "font-sans"}`}>
              {safeTranslate(
                "professor.lives.card.remainingTime",
                "Remaining time"
              )}{" "}
              : {formatTimeRemaining(live.scheduled_datetime)}
            </span>
          ) : (
            <span className={`${isRTL ? "font-arabic" : "font-sans"}`}>
              {safeTranslate(
                "professor.lives.card.dateAndTime",
                "Date and Time"
              )}{" "}
              : {formatDateTime(live.scheduled_datetime)}
            </span>
          )
        ) : null}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-2">
        {activeTab === "scheduled" && (
          <>
            <div className="flex gap-2">
              <Button
                state="tonal"
                size="XS"
                icon_position="none"
                text={safeTranslate(
                  "professor.lives.card.cancelLive",
                  "Cancel Live"
                )}
                onClick={() => setShowCancelModal(true)}
                disabled={isActioning || isLive}
                optionalStyles="flex-1"
              />
              {canStartLive || isLive ? (
                <Button
                  state="filled"
                  size="XS"
                  icon_position="left"
                  icon={<Play className="w-4 h-4" />}
                  text={safeTranslate(
                    "professor.lives.card.startLive",
                    "Start Live"
                  )}
                  onClick={handleStartLive}
                  disabled={isActioning || !canStartLive}
                  optionalStyles="flex-1"
                />
              ) : (
                <Button
                  state="tonal"
                  size="XS"
                  icon_position="left"
                  icon={<Play className="w-4 h-4" />}
                  text={safeTranslate(
                    "professor.lives.card.startLive",
                    "Start Live"
                  )}
                  disabled={true}
                  optionalStyles="flex-1"
                />
              )}
            </div>
          </>
        )}
        {activeTab === "recorded" && (
          <Button
            state="filled"
            size="XS"
            icon_position="right"
            icon={<ChevronRight className="w-4 h-4" />}
            text={safeTranslate(
              "professor.lives.card.viewRecording",
              "View Recording"
            )}
            onClick={handleViewRecording}
            optionalStyles="w-full"
          />
        )}
      </div>

      {/* Cancel Live Modal */}
      {showCancelModal && (
        <CancelLiveModal
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelLive}
        />
      )}
    </div>
  );
}

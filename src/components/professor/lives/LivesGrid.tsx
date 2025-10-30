"use client";

import { useState, useEffect } from "react";
import { Plus, Video as VideoIcon } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSafeTranslation } from "@/hooks/useSafeTranslation";
import Button from "@/components/ui/button";
import DropDown from "@/components/input/dropDown";
import LiveCard from "./LiveCard";
import ScheduleLiveModal from "./ScheduleLiveModal";
import type { Live, LiveStatus } from "@/api/lives";
import { ModulesApi, type FrontendModule } from "@/api/modules";
import { ChaptersApi, type FrontendChapter } from "@/api/chapters";
import {
  AcademicStreamsApi,
  type FrontendAcademicStream,
} from "@/api/academicStreams";

type TabType = "scheduled" | "recorded";

interface Props {
  lives: Live[];
  isMobile?: boolean;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  academicStreamFilter: string;
  onAcademicStreamFilterChange: (stream: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onRefresh: () => void;
}

export default function LivesGrid({
  lives,
  isMobile = false,
  activeTab,
  onTabChange,
  academicStreamFilter,
  onAcademicStreamFilterChange,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
}: Props) {
  const { t, isRTL } = useLanguage();
  const { safeTranslate } = useSafeTranslation();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [modules, setModules] = useState<FrontendModule[]>([]);
  const [chapters, setChapters] = useState<FrontendChapter[]>([]);
  const [academicStreams, setAcademicStreams] = useState<
    FrontendAcademicStream[]
  >([]);

  // Load modules, chapters, and academic streams
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load modules
        const modulesResponse = await ModulesApi.getAllModules();
        if (modulesResponse.success && modulesResponse.data) {
          const transformed = modulesResponse.data.map((m) =>
            ModulesApi.transformModule(m)
          );
          setModules(transformed);
        }

        // Load academic streams
        const streamsResponse =
          await AcademicStreamsApi.getAcademicStreamsForFrontend();
        if (streamsResponse.success && streamsResponse.data) {
          setAcademicStreams(streamsResponse.data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  const handleScheduleSuccess = () => {
    setShowScheduleModal(false);
    onRefresh();
  };

  const academicStreamOptions = [
    { id: "All", text: safeTranslate("professor.lives.filters.all", "All") },
    ...academicStreams.map((stream) => ({
      id: stream.value,
      text: safeTranslate(
        `professor.academicStreams.${stream.labelKey}`,
        stream.labelKey
      ),
    })),
  ];

  const statusOptions = [
    { id: "All", text: safeTranslate("professor.lives.filters.all", "All") },
    {
      id: "Pending",
      text: safeTranslate("professor.lives.status.pending", "Pending"),
    },
    {
      id: "Approved",
      text: safeTranslate("professor.lives.status.approved", "Approved"),
    },
    {
      id: "Live",
      text: safeTranslate("professor.lives.status.live", "Live"),
    },
  ];

  if (activeTab === "recorded") {
    statusOptions.push({
      id: "Ended",
      text: safeTranslate("professor.lives.status.ended", "Ended"),
    });
  }

  return (
    <section
      className="w-full self-stretch flex flex-col items-start rounded-[52px] bg-[#F8F8F8] dark:bg-[#1A1A1A] p-6 md:p-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Title */}
      <div className={`w-full mb-4 ${isRTL ? "text-right" : "text-left"}`}>
        <h2
          className={`text-2xl md:text-3xl font-bold text-gray-900 dark:text-white ${
            isRTL ? "font-arabic" : "font-sans"
          }`}
        >
          {safeTranslate("professor.lives.title", "Lives")}
        </h2>
      </div>

      {/* Tabs */}
      <div className="w-full mb-4 flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onTabChange("scheduled")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "scheduled"
              ? "border-b-2 border-[#324C72] text-[#324C72] dark:text-[#90B0E0]"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          } ${isRTL ? "font-arabic" : "font-sans"}`}
        >
          {safeTranslate("professor.lives.scheduledLives", "Scheduled Lives")}
        </button>
        <button
          onClick={() => onTabChange("recorded")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "recorded"
              ? "border-b-2 border-[#324C72] text-[#324C72] dark:text-[#90B0E0]"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          } ${isRTL ? "font-arabic" : "font-sans"}`}
        >
          {safeTranslate("professor.lives.recordedLives", "Recorded Lives")}
        </button>
      </div>

      {/* Filters and Action Button */}
      <div className="w-full mb-4 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-3 flex-1">
          {/* Academic Stream Filter */}
          <div className="relative w-full md:w-auto">
            <DropDown
              label=""
              placeholder={`${safeTranslate(
                "professor.lives.filters.academicStream",
                "Academic Stream"
              )}: ${
                academicStreamFilter === "All"
                  ? safeTranslate("professor.lives.filters.all", "All")
                  : academicStreamOptions.find(
                      (o) => o.id === academicStreamFilter
                    )?.text || academicStreamFilter
              }`}
              options={academicStreamOptions}
              t={t}
              isRTL={isRTL}
              max_width="max-w-full"
            />
            <select
              aria-label={safeTranslate(
                "professor.lives.filters.academicStream",
                "Academic Stream"
              )}
              value={academicStreamFilter}
              onChange={(e) => onAcademicStreamFilterChange(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              {academicStreamOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.text}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative w-full md:w-auto">
            <DropDown
              label=""
              placeholder={`${safeTranslate(
                "professor.lives.filters.status",
                "Status"
              )}: ${
                statusFilter === "All"
                  ? safeTranslate("professor.lives.filters.all", "All")
                  : statusOptions.find((o) => o.id === statusFilter)?.text ||
                    statusFilter
              }`}
              options={statusOptions}
              t={t}
              isRTL={isRTL}
              max_width="max-w-full"
            />
            <select
              aria-label={safeTranslate(
                "professor.lives.filters.status",
                "Status"
              )}
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              {statusOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.text}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Schedule Live Button */}
        {activeTab === "scheduled" && (
          <Button
            state="filled"
            size="M"
            icon_position="left"
            icon={<Plus className="w-4 h-4" />}
            text={safeTranslate(
              "professor.lives.scheduleLiveButton",
              "Schedule a live"
            )}
            onClick={() => setShowScheduleModal(true)}
            optionalStyles={isMobile ? "w-full" : ""}
          />
        )}
      </div>

      {/* Lives Cards Grid */}
      <div className="flex flex-col gap-4 w-full">
        {lives.length === 0 ? (
          <div
            className={`py-12 text-center text-gray-500 dark:text-gray-400 ${
              isRTL ? "font-arabic" : "font-sans"
            }`}
          >
            {safeTranslate("professor.lives.noLivesYet", "No Lives Yet")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lives.map((live) => (
              <LiveCard
                key={live.id}
                live={live}
                isRTL={isRTL}
                isMobile={isMobile}
                activeTab={activeTab}
                onRefresh={onRefresh}
              />
            ))}
          </div>
        )}
      </div>

      {/* Schedule Live Modal */}
      {showScheduleModal && (
        <ScheduleLiveModal
          onClose={() => setShowScheduleModal(false)}
          onSuccess={handleScheduleSuccess}
          modules={modules}
          chapters={chapters}
          academicStreams={academicStreams}
        />
      )}
    </section>
  );
}

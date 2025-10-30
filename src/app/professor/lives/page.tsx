"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import Loader from "@/components/ui/Loader";
import LivesGrid from "@/components/professor/lives/LivesGrid";
import { livesApi, type Live, type LiveStatus, LiveFilters } from "@/api/lives";

type TabType = "scheduled" | "recorded";

export default function LivesPage() {
  const { t, isRTL } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("scheduled");
  const [lives, setLives] = useState<Live[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [academicStreamFilter, setAcademicStreamFilter] =
    useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    setLoaded(true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const fetchLives = async () => {
      try {
        setLoading(true);
        setError(null);

        const filters: LiveFilters = {
          page: 1,
          per_page: 50,
        };

        if (academicStreamFilter !== "All") {
          filters.academic_stream = academicStreamFilter;
        }

        if (activeTab === "scheduled") {
          // For scheduled, we want pending and approved statuses
          filters.status = undefined; // We'll filter client-side
        } else {
          filters.status = "Ended" as LiveStatus;
        }

        const response = await livesApi.getLives(filters);
        if (response.success && response.data) {
          let transformedLives = response.data.lives.map(
            livesApi.transformLive
          );

          // Filter for scheduled tab (Pending, Approved, Live)
          if (activeTab === "scheduled") {
            transformedLives = transformedLives.filter(
              (live) =>
                live.status === "Pending" ||
                live.status === "Approved" ||
                live.status === "Live"
            );
          }

          // Apply status filter if not "All"
          if (statusFilter !== "All") {
            transformedLives = transformedLives.filter(
              (live) => live.status === statusFilter
            );
          }

          setLives(transformedLives);
        } else {
          // Check if it's a 404 - backend endpoint doesn't exist yet
          if (
            response.message?.includes("404") ||
            response.message?.includes("Not Found")
          ) {
            setError(
              "Lives feature is not yet available. Backend endpoint needs to be implemented."
            );
          } else {
            setError(response.message || "Failed to load lives");
          }
        }
      } catch (err: any) {
        console.error("Error fetching lives:", err);
        // Handle 404 specifically
        if (
          err?.status === 404 ||
          err?.message?.includes("404") ||
          err?.message?.includes("Not Found")
        ) {
          setError(
            "Lives feature is not yet available. The backend endpoint needs to be implemented."
          );
        } else {
          setError("Failed to load lives. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (loaded) {
      fetchLives();
    }
  }, [loaded, activeTab, academicStreamFilter, statusFilter]);

  const handleRefresh = () => {
    setLoaded(false);
    setTimeout(() => setLoaded(true), 100);
  };

  if (!loaded || loading) {
    return (
      <div className="self-stretch w-full">
        <Loader label={t("professor.lives.title") ?? "Loading lives..."} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="self-stretch w-full flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Unable to Load Lives
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>
          {error.includes("Backend endpoint") ? (
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              <p>
                Note: The backend API endpoint for Lives needs to be
                implemented.
              </p>
            </div>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <LivesGrid
      lives={lives}
      isMobile={isMobile}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      academicStreamFilter={academicStreamFilter}
      onAcademicStreamFilterChange={setAcademicStreamFilter}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      onRefresh={handleRefresh}
    />
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProfessorChaptersSection from "@/components/professor/chapters/ChaptersSection";
import Loader from "@/components/ui/Loader";
import { ModulesApi, type FrontendModule } from "@/api/modules";
import { ChaptersApi } from "@/api/chapters";

export default function ProfessorChaptersPage() {
  const params = useParams();
  const moduleId = params.moduleId as string;
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [module, setModule] = useState<FrontendModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to refresh chapter data
  const refreshChapters = async () => {
    if (!moduleId) return;

    try {
      const chaptersResponse = await ChaptersApi.getChaptersByModule(moduleId);

      if (chaptersResponse.success && chaptersResponse.data) {
        // Chapters are already transformed with lessons count
        const frontendChapters = chaptersResponse.data.map((chapter) => ({
          ...chapter,
          moduleId: moduleId, // Ensure moduleId is set
        }));

        setModule((prevModule) => {
          if (prevModule) {
            return {
              ...prevModule,
              chapters: frontendChapters,
            };
          }
          return prevModule;
        });
      }
    } catch (error) {
      console.warn("Error refreshing chapters:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    setIsLoaded(true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        setLoading(true);
        setError(null);

        // The moduleId from URL might be:
        // 1. "module:math101" (custom_id)
        // 2. Just the ID like "8h329yr2k3nnpdyqw05a"
        // 3. Full RecordId like "Module:8h329yr2k3nnpdyqw05a"

        let fullModuleId = moduleId;

        // If it doesn't contain a colon, prepend "Module:"
        if (!moduleId.includes(":")) {
          fullModuleId = `Module:${moduleId}`;
        }

        // Fetch module data
        const moduleResponse = await ModulesApi.getModuleById(fullModuleId);

        if (moduleResponse.success && moduleResponse.data) {
          const frontendModule = ModulesApi.transformModule(
            moduleResponse.data
          );

          // Fetch chapters for this module
          try {
            const chaptersResponse = await ChaptersApi.getChaptersByModule(
              moduleId // This will be cleaned inside getChaptersByModule
            );

            if (chaptersResponse.success && chaptersResponse.data) {
              // Chapters are already transformed with lessons count
              const frontendChapters = chaptersResponse.data.map((chapter) => ({
                ...chapter,
                moduleId: moduleId, // Ensure moduleId is set
              }));

              // Add chapters to the module
              frontendModule.chapters = frontendChapters;
            } else {
              console.warn(
                "Failed to fetch chapters:",
                chaptersResponse.message
              );
              // Continue with empty chapters array
            }
          } catch (chapterError) {
            console.warn("Error fetching chapters:", chapterError);
            // Continue with empty chapters array
          }

          setModule(frontendModule);
        } else {
          setError(moduleResponse.message || "Failed to fetch module");
        }
      } catch (err) {
        console.error("Error fetching module:", err);
        setError("Failed to load module. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) {
      fetchModule();
    }
  }, [moduleId]);

  if (!isLoaded || loading) {
    return (
      <div className="self-stretch w-full">
        <Loader label="Loading module..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="self-stretch w-full flex items-center justify-center py-16">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="self-stretch w-full flex items-center justify-center py-16">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Module not found
        </p>
      </div>
    );
  }

  return (
    <ProfessorChaptersSection
      module={module}
      isMobile={isMobile}
      onChapterCreated={refreshChapters}
    />
  );
}

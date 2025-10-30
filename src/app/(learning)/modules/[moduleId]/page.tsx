"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import ContentHeader from "@/components/modules/ContentHeader";
import ChaptersSection from "@/components/modules/ChaptersSection";
import { ModulesApi, type FrontendModule } from "@/api/modules";
import { ChaptersApi } from "@/api/chapters";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/hooks/useAuth";

export default function ModuleChaptersPage() {
  const params = useParams();
  const moduleId = params.moduleId as string;
  const [isMobile, setIsMobile] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentModule, setCurrentModule] = useState<FrontendModule | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    setIsLoaded(true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch module details
        const moduleResponse = await ModulesApi.getModuleById(moduleId);
        if (!moduleResponse.success || !moduleResponse.data) {
          setError("Module not found");
          return;
        }

        // Transform module to frontend format
        const frontendModule = ModulesApi.transformModule(moduleResponse.data);

        // Fetch chapters for this module
        try {
          const chaptersResponse = await ChaptersApi.getChaptersByModule(
            moduleId
          );
          if (chaptersResponse.success && chaptersResponse.data) {
            frontendModule.chapters = chaptersResponse.data;
            frontendModule.totalLessons = chaptersResponse.data.length;
            frontendModule.lessonsCount = chaptersResponse.data.length;
          }
        } catch (error) {
          console.warn("Failed to fetch chapters:", error);
        }

        setCurrentModule(frontendModule);
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

  // Handle not found module
  if (isLoaded && !loading && !currentModule) {
    notFound();
  }

  if (!isLoaded || loading) {
    return (
      <div className="self-stretch w-full">
        <Loader label="Loading module..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="self-stretch w-full flex items-center justify-center p-8">
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
    );
  }

  return (
    <>
      {/* Desktop header */}
      {!isMobile && (
        <ContentHeader
          content={currentModule}
          contentType="module"
          pageType="chapters"
        />
      )}

      <ChaptersSection
        chapters={currentModule.chapters}
        isMobile={isMobile}
        userLevel={(user as any)?.level || 1}
        moduleData={currentModule} // for mobile summary
      />
    </>
  );
}

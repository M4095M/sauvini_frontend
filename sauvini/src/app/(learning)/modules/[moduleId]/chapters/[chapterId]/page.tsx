"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import ContentHeader from "@/components/modules/ContentHeader";
import LessonsSection from "@/components/modules/LessonsSection";
import { MOCK_MODULES_DATA } from "@/data/mockModules";
import { ChaptersApi, type FrontendChapter } from "@/api/chapters";
import { ModulesApi, type FrontendModule } from "@/api/modules";
import type { Module, Chapter } from "@/types/modules";
import Loader from "@/components/ui/Loader";

export default function ChapterLessonsPage() {
  const params = useParams();
  const moduleId = params.moduleId as string;
  const chapterId = params.chapterId as string;
  const [isMobile, setIsMobile] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentModule, setCurrentModule] = useState<FrontendModule | null>(
    null
  );
  const [currentChapter, setCurrentChapter] = useState<FrontendChapter | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    setIsLoaded(true);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch module data
        const moduleResponse = await ModulesApi.getModuleById(moduleId);
        if (!moduleResponse.success || !moduleResponse.data) {
          throw new Error("Module not found");
        }
        const module = ModulesApi.transformModule(moduleResponse.data);
        setCurrentModule(module);

        // Fetch chapter data
        const chapterResponse = await ChaptersApi.getChapterWithModuleAndStream(
          chapterId
        );
        if (!chapterResponse.success || !chapterResponse.data) {
          throw new Error("Chapter not found");
        }
        const chapter = ChaptersApi.transformChapterWithModuleAndStream(
          chapterResponse.data
        );
        setCurrentChapter(chapter);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load chapter. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (moduleId && chapterId) {
      fetchData();
    }
  }, [moduleId, chapterId]);

  // Handle not found module or chapter
  if (isLoaded && !loading && (!currentModule || !currentChapter)) {
    notFound();
  }

  if (!isLoaded || loading) {
    return (
      <div className="self-stretch w-full">
        <Loader label="Loading chapter..." />
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
          content={currentChapter}
          contentType="chapter"
          parentModule={currentModule}
          pageType="lessons"
        />
      )}

      <LessonsSection
        lessons={currentChapter.lessons || []}
        isMobile={isMobile}
        userLevel={MOCK_MODULES_DATA.userProfile?.level || 1}
        chapterData={currentChapter}
        moduleData={currentModule}
      />
    </>
  );
}

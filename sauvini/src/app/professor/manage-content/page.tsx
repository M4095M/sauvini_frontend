"use client";

import { useState, useEffect } from "react";
import ProfessorModulesSection from "@/components/professor/modules/ModulesSection";
import Loader from "@/components/ui/Loader";
import { ModulesApi, type FrontendModule } from "@/api/modules";

export default function ProfessorModulesPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [modules, setModules] = useState<FrontendModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const fetchModules = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ModulesApi.getModulesForFrontend();

        if (response.success && response.data) {
          setModules(response.data);
        } else {
          setError(response.message || "Failed to fetch modules");
        }
      } catch (err) {
        console.error("Error fetching modules:", err);
        setError("Failed to load modules. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  if (!isLoaded || loading) {
    return (
      <div className="self-stretch w-full">
        <Loader label="Loading modules..." />
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

  return <ProfessorModulesSection modules={modules} isMobile={isMobile} />;
}

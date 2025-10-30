"use client";

import { useState, useEffect } from "react";
import ModulesSection from "@/components/modules/ModulesSection";
import Loader from "@/components/ui/Loader";
import { ModulesApi, type FrontendModule } from "@/api/modules";
import { useAuth } from "@/hooks/useAuth";

export default function ModulesPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [modules, setModules] = useState<FrontendModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  // Use real user data
  const userProfile = user
    ? {
        id: user.id || "",
        name: (user as any)?.first_name || "Student",
        lastname: (user as any)?.last_name || "",
        email: (user as any)?.email || "",
        academicStream: (user as any)?.academic_stream || "",
        level: (user as any)?.level || 1,
      }
    : {
        id: "",
        name: "Student",
        lastname: "",
        email: "",
        academicStream: "",
        level: 1,
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

  // Filter modules by user's academic stream if available
  const userModules = userProfile?.academicStream
    ? modules.filter(
        (module) =>
          module.academicStreams.length === 0 || // If no streams specified, show to all
          module.academicStreams.includes(userProfile.academicStream)
      )
    : modules;

  return (
    <ModulesSection
      modules={userModules}
      isMobile={isMobile}
      userLevel={userProfile?.level || 1}
    />
  );
}

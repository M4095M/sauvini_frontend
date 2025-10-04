"use client";

import { useState, useEffect } from "react";
import DropDown from "@/components/input/dropDown";
import ModuleCard from "./ModuleCard";
import { useLanguage } from "@/context/LanguageContext";
import { ModulesApi, type FrontendModule } from "@/api/modules";
import Loader from "@/components/ui/Loader";

export default function PulicModules() {
  const { isRTL, t, language } = useLanguage();
  const [modules, setModules] = useState<FrontendModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="px-3 py-6 rounded-[52px] bg-neutral-100 flex flex-col">
        <div className="font-medium text-neutral-600 text-2xl px-4">
          {t("public.modules")}
        </div>
        <div className="flex justify-center items-center py-8">
          <Loader label="Loading modules..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-3 py-6 rounded-[52px] bg-neutral-100 flex flex-col">
        <div className="font-medium text-neutral-600 text-2xl px-4">
          {t("public.modules")}
        </div>
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
    );
  }

  return (
    <div className="px-3 py-6 rounded-[52px] bg-neutral-100 flex flex-col">
      {/* header */}
      <div className="font-medium text-neutral-600 text-2xl px-4">
        {t("public.modules")}
      </div>
      {/* main content */}
      <div className="flex flex-col gap-6">
        {/* filter */}
        <div className="w-fit">
          <DropDown placeholder={t("public.AcademicStream")} />
        </div>
        {/* grid */}
        <div className="flex flex-wrap gap-4">
          {modules.map((module) => (
            <ModuleCard key={module.id} t={t} isRTL={isRTL} module={module} />
          ))}
        </div>
      </div>
    </div>
  );
}

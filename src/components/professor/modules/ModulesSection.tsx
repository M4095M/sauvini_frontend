"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Bell, Menu, Plus } from "lucide-react";
import Image from "next/image";
import type { Module } from "@/types/modules";
import ProfessorModuleCard from "./ModuleCard";
import { useLanguage } from "@/hooks/useLanguage";
import { RTL_LANGUAGES } from "@/lib/language";
import { useSidebar } from "@/context/SideBarContext";
import Button from "@/components/ui/button";
import {
  AcademicStreamsApi,
  type FrontendAcademicStream,
} from "@/api/academicStreams";

import AddModulePopup from "./addModulePopup";
import EditModulePopup from "./EditModulePopup";

interface ProfessorModulesSectionProps {
  modules: Module[];
  isMobile?: boolean;
  onModuleCreated?: () => void;
}

// Academic streams will be loaded from database

export default function ProfessorModulesSection({
  modules,
  isMobile = false,
  onModuleCreated,
}: ProfessorModulesSectionProps) {
  const { t, language } = useLanguage();
  const { open } = useSidebar();
  const isRTL = RTL_LANGUAGES.includes(language);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [academicStreams, setAcademicStreams] = useState<
    FrontendAcademicStream[]
  >([]);
  const [streamsLoading, setStreamsLoading] = useState(true);

  // state for add module popup (only for admin)
  const [addModulePopup, setaddModulePopup] = useState(false);
  // show popup state:
  const [showEditDetailsPopup, setShowEditDetailsPopup] = useState(false);

  // Load academic streams from database
  useEffect(() => {
    const fetchAcademicStreams = async () => {
      try {
        setStreamsLoading(true);
        const response =
          await AcademicStreamsApi.getAcademicStreamsForFrontend();

        if (response.success && response.data) {
          setAcademicStreams(response.data);
        } else {
          console.warn("Failed to fetch academic streams:", response.message);
          // Fallback to empty array, will show "All" option only
        }
      } catch (error) {
        console.error("Error fetching academic streams:", error);
        // Fallback to empty array, will show "All" option only
      } finally {
        setStreamsLoading(false);
      }
    };

    fetchAcademicStreams();
  }, []);

  // Filter modules based on selected academic stream
  const filteredModules = modules.filter((module) => {
    if (!selectedStream) return true;
    return module.academicStreams.some(
      (stream) =>
        stream.toLowerCase().replace(/[^a-z0-9]/g, "") === selectedStream
    );
  });

  const selectedStreamLabel =
    academicStreams.find((stream) => stream.value === selectedStream)
      ?.labelKey || "All Streams";

  return (
    <div
      className="flex flex-col items-start self-stretch bg-neutral-100 dark:bg-neutral-600"
      style={{
        display: "flex",
        padding: "24px 12px",
        flexDirection: "column",
        alignItems: "flex-start",
        alignSelf: "stretch",
        borderRadius: 52,
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      {/* Mobile Top Bar */}
      {isMobile && (
        <div
          className={`flex justify-between items-end w-full px-4 mb-4 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <Image
            src="/S_logo.svg"
            alt="Sauvini S Logo"
            width={40}
            height={40}
            className="dark:brightness-150"
          />
          <div
            className={`flex items-center gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <button className="flex items-center justify-center w-10 h-10 bg-[#DCE6F5] dark:bg-[#2B3E5A] rounded-full">
              <Bell className="w-5 h-5 text-[#324C72] dark:text-[#90B0E0]" />
            </button>
            <button
              className="flex items-center justify-center w-10 h-10 bg-[#DCE6F5] dark:bg-[#2B3E5A] rounded-full"
              onClick={open}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-[#324C72] dark:text-[#90B0E0]" />
            </button>
          </div>
        </div>
      )}

      {/* Module Title Frame */}
      <div
        className={`w-full ${isMobile ? "px-4" : ""}`}
        style={{
          display: "flex",
          padding: isMobile ? "0" : "0 16px",
          alignItems: "center",
          alignSelf: "stretch",
        }}
      >
        <h1
          className={`text-2xl font-bold text-gray-900 dark:text-white ${
            isRTL ? "font-arabic text-right" : "font-sans text-left"
          }`}
        >
          {t("professor.modules.title")}
        </h1>
      </div>

      {/* Academic Streams Filter and Modules Cards Frame */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 24,
          alignSelf: "stretch",
        }}
      >
        {/* Academic Streams Filter */}
        <div className="flex justify-between items-center w-full">
          {/* filters */}
          <div
            className={`${isMobile ? "px-4" : ""}`}
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "stretch",
              marginTop: 16,
            }}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Custom Dropdown */}
            <div className={`relative ${isMobile ? "w-full" : ""}`}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${
                  isRTL ? "flex-row-reverse" : ""
                } ${isMobile ? "w-full justify-between" : ""}`}
                style={{ minWidth: isMobile ? "auto" : 200 }}
              >
                <span
                  className={`text-sm text-gray-900 dark:text-white ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {t("professor.modules.academicStream")} :{" "}
                  {t(`professor.academicStreams.${selectedStreamLabel}`)}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className={`absolute top-full mt-1 w-full bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10 ${
                    isRTL ? "right-0" : "left-0"
                  }`}
                >
                  {academicStreams.map((stream) => (
                    <button
                      key={stream.value}
                      onClick={() => {
                        setSelectedStream(stream.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        selectedStream === stream.value
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-900 dark:text-white"
                      } ${
                        isRTL ? "text-right font-arabic" : "text-left font-sans"
                      }`}
                    >
                      {t(`professor.academicStreams.${stream.labelKey}`)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* actions button */}
          <div className="">
            <Button
              state={"filled"}
              size={"S"}
              icon_position={"left"}
              icon={<Plus />}
              text="Add Module"
              onClick={() => {
                window.scrollTo(0, 0);
                document.body.classList.add("no-scroll");
                setaddModulePopup(true);
              }}
            />
          </div>
        </div>

        {/* Modules Cards Frame */}
        <div
          className={`${isMobile ? "px-4" : ""}`}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 12,
            alignSelf: "stretch",
          }}
        >
          {filteredModules.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full py-16">
              <p
                className={`text-lg text-gray-500 dark:text-gray-400 text-center ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                {t("professor.modules.noModulesFound")}
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-6 w-full ${
                isMobile
                  ? "grid-cols-1"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {filteredModules.map((module) => (
                <ProfessorModuleCard
                  key={module.id}
                  module={module}
                  isMobile={isMobile}
                  isRTL={isRTL}
                  showEditDetailsPopup={() => {
                    document.body.classList.add("no-scroll");
                    window.scrollTo(0, 0);
                    setShowEditDetailsPopup(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Module Popup (only for admin) */}
      {addModulePopup && (
        <div className="w-full h-screen absolute top-0 left-0 bg-black/30 z-10000 flex justify-center overflow-y-auto">
          <div className="m-20  w-4xl">
            <AddModulePopup
              onClose={() => {
                document.body.classList.remove("no-scroll");
                window.scrollTo(0, 0);
                setaddModulePopup(false);
              }}
              onSuccess={() => {
                document.body.classList.remove("no-scroll");
                window.scrollTo(0, 0);
                setaddModulePopup(false);
                onModuleCreated?.();
              }}
            />
          </div>
        </div>
      )}

      {/* Edit Module Popup (only for admin) */}
      {showEditDetailsPopup && (
        <div className="w-full h-screen absolute top-0 left-0 bg-black/30 z-10000 flex justify-center overflow-y-auto">
          <div className="m-20  w-4xl">
            <EditModulePopup
              onClose={() => {
                document.body.classList.remove("no-scroll");
                window.scrollTo(0, 0);
                setShowEditDetailsPopup(false);
              }}
              iniatialData={{
                moduleName: "Calculus 101",
                moduleDescription:
                  "An introductory course to calculus covering limits, derivatives, and integrals.",
                academicStreams: ["Mathematics", "Experimental Sciences"],
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

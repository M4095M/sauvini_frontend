"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, MoreVertical } from "lucide-react";
import { useState } from "react";
import type { Module } from "@/types/modules";
import { useLanguage } from "@/hooks/useLanguage";
import { RTL_LANGUAGES } from "@/lib/language";
import Tag from "@/components/professor/tag";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import Button from "@/components/ui/button";

interface ProfessorModuleCardProps {
  module: Module;
  isRTL?: boolean;
  isMobile?: boolean;
  className?: string;

  // callback:
  showEditDetailsPopup: () => void;
}

// Module color mapping
const COLOR_MAP: Record<string, string> = {
  yellow: "#FFD427",
  blue: "#27364D",
  purple: "#9663FE",
  green: "#22C55E",
  red: "#EF4444",
} as const;

// Card styling constants
const CARD_STYLES = {
  desktop: {
    width: 373,
    height: 220,
    padding: "20px 24px 30px 24px",
  },
  mobile: {
    height: 220,
    padding: "20px 20px 30px 24px",
  },
} as const;

const ILLUSTRATION_SIZE = {
  width: 114,
  height: 120,
} as const;

// Configuration
const MAIN_ACADEMIC_STREAMS = [
  "Mathematics",
  "Experimental Sciences",
  "Literature",
  "Math-Technique",
];

export default function ProfessorModuleCard({
  module,
  isRTL: propIsRTL,
  isMobile = false,
  className = "",
  showEditDetailsPopup,
}: ProfessorModuleCardProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const isRTL =
    propIsRTL !== undefined ? propIsRTL : RTL_LANGUAGES.includes(language);
  const [showAllStreams, setShowAllStreams] = useState(false);

  // show drop down with more options for admin:
  const [isAdmin, setIsAdmin] = useState(true); // For demo purposes, set to true

  // Computed values
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;
  const numberOfChapters = module.chapters?.length || 0;
  const coversAllStreams = MAIN_ACADEMIC_STREAMS.every((stream) =>
    module.academicStreams.includes(stream)
  );
  const cardStyles = isMobile ? CARD_STYLES.mobile : CARD_STYLES.desktop;
  const moduleColor = COLOR_MAP[module.color] || "#6B7280";

  // Event handlers
  const handleModuleClick = () => {
    router.push(`/professor/manage-content/${module.id}`);
  };

  // Utility functions
  const truncateDescription = (text: string, maxLength = 90): string => {
    return text.length > maxLength
      ? `${text.slice(0, maxLength - 3)}...`
      : text;
  };

  return (
    <div
      className={`
        relative flex items-center justify-center
        rounded-[28px] border border-gray-300 bg-white
        dark:border-[#7C7C7C] dark:bg-[#1A1A1A]
        transition-all duration-200  cursor-pointer hover:shadow-md
        ${isMobile ? "self-stretch" : ""}
        ${className}
      `}
      style={cardStyles}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleModuleClick();
      }}
    >
      <div
        className="flex flex-col items-start gap-2"
        style={{
          width: 325,
          flexShrink: 0,
          height: "100%",
          paddingTop: 2,
          paddingBottom: 6,
        }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Illustration + Module Info */}
        <div
          className={`flex w-full items-start gap-4`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Module Illustration */}
          <div
            className="relative flex-shrink-0 flex items-center justify-center"
            style={{
              width: ILLUSTRATION_SIZE.width,
              height: ILLUSTRATION_SIZE.height,
              padding: "3px 0 3.458px 0",
            }}
          >
            <Image
              src={module.illustration || "/placeholder.svg"}
              alt={`${module.name} illustration`}
              fill
              className="object-contain"
              sizes="114px"
            />
          </div>

          {/* Module Content */}
          <div
            className="flex-1 min-w-0 flex flex-col justify-between"
            style={{ height: ILLUSTRATION_SIZE.height }}
          >
            <div>
              {/* Title + Action Icon */}
              <div
                className={`flex items-start justify-between gap-2`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <h3
                  className={`
                    text-xl font-semibold text-gray-900 dark:text-white leading-tight
                    ${isRTL ? "text-right font-arabic" : "text-left font-sans"}
                  `}
                >
                  {module.name}
                </h3>
                <div className="flex-shrink-0 mt-1">
                  {isAdmin ? (
                    <div className="">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <div className="cursor-pointer select-none aspect-square rounded-full hover:bg-neutral-200 p-1">
                            <MoreVertical fill="text-neutral-400" />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            className="hover:border-0 hover:bg-neutral-200 cursor-pointer select-none"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleModuleClick();
                            }}
                          >
                            <div className="flex gap-2 items-center px-9 py-5">
                              <div className="text-neutral-600">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="14"
                                  viewBox="0 0 20 14"
                                  fill="none"
                                >
                                  <path
                                    d="M12.6421 6.99999C12.6421 8.45852 11.4597 9.6409 10.0012 9.6409C8.54264 9.6409 7.36027 8.45852 7.36027 6.99999C7.36027 5.54146 8.54264 4.35909 10.0012 4.35909C11.4597 4.35909 12.6421 5.54146 12.6421 6.99999Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M1.60156 6.99996C2.72331 3.42851 6.05989 0.837891 10.0016 0.837891C13.9432 0.837891 17.2798 3.42854 18.4016 7.00003C17.2798 10.5715 13.9432 13.1621 10.0016 13.1621C6.05989 13.1621 2.72329 10.5715 1.60156 6.99996Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <div className="text-neutral-600 text-base font-normal">
                                View chapters
                              </div>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <div
                              className="flex gap-2 items-center px-9 py-5 hover:bg-neutral-200 cursor-pointer select-none"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                // show pop up
                                showEditDetailsPopup();
                              }}
                            >
                              <div className="text-neutral-600">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M16.8617 4.48667L18.5492 2.79917C19.2814 2.06694 20.4686 2.06694 21.2008 2.79917C21.9331 3.53141 21.9331 4.71859 21.2008 5.45083L10.5822 16.0695C10.0535 16.5981 9.40144 16.9868 8.68489 17.2002L6 18L6.79978 15.3151C7.01323 14.5986 7.40185 13.9465 7.93052 13.4178L16.8617 4.48667ZM16.8617 4.48667L19.5 7.12499M18 14V18.75C18 19.9926 16.9926 21 15.75 21H5.25C4.00736 21 3 19.9926 3 18.75V8.24999C3 7.00735 4.00736 5.99999 5.25 5.99999H10"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <div className="text-neutral-600 text-base font-normal">
                                Edit details
                              </div>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <ChevronIcon
                      className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>

              {/* Description */}
              <p
                className={`
                  text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed
                  ${isRTL ? "text-right font-arabic" : "text-left font-sans"}
                `}
              >
                {truncateDescription(module.description)}
              </p>
            </div>
          </div>
        </div>

        {/* Chapter Count */}
        <div className="w-full mt-2">
          <p
            className={`text-sm text-gray-500 dark:text-gray-400 font-medium ${
              isRTL ? "text-right font-arabic" : "text-left font-sans"
            }`}
          >
            {t("professor.numberOfChapters")} {numberOfChapters}
          </p>
        </div>

        {/*Academic Stream */}
        <div className="w-full mt-auto mb-4">
          <div
            className={`relative flex flex-wrap items-center gap-1`}
            style={{
              maxWidth: "100%",
              lineHeight: 1.2,
            }}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {coversAllStreams ? (
              // Show "All" tag when module covers all streams
              <span
                className="inline-flex rounded-full"
                style={{ backgroundColor: moduleColor }}
              >
                <Tag
                  icon={null}
                  text={t("professor.academicStreams.all")}
                  className={`text-[11px] font-medium text-white px-2 py-0.5 ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                />
              </span>
            ) : (
              <>
                {/* Show first 2 streams */}
                {module.academicStreams.slice(0, 2).map((stream) => (
                  <span
                    key={stream}
                    className="inline-flex rounded-full"
                    style={{ backgroundColor: moduleColor }}
                  >
                    <Tag
                      icon={null}
                      text={t(
                        `professor.academicStreams.${stream
                          .toLowerCase()
                          .replace(/[^a-z0-9]/g, "")}`
                      )}
                      className={`text-[11px] font-medium text-white px-2 py-0.5 ${
                        isRTL ? "font-arabic" : "font-sans"
                      }`}
                    />
                  </span>
                ))}

                {/* Show +x indicator if more than 2 streams */}
                {module.academicStreams.length > 2 && (
                  <div
                    className="relative inline-flex"
                    onMouseEnter={() => setShowAllStreams(true)}
                    onMouseLeave={() => setShowAllStreams(false)}
                    onClick={(e) => e.stopPropagation()} // Prevent card click
                  >
                    <span
                      className={`text-[11px] font-medium text-gray-300 dark:text-gray-400 cursor-pointer ${
                        isRTL ? "font-arabic" : "font-sans"
                      }`}
                    >
                      +{module.academicStreams.length - 2}
                    </span>

                    {/* Tooltip showing all streams */}
                    {showAllStreams && (
                      <div
                        className={`
                          absolute z-50 bottom-full mb-1 p-2 bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-lg
                          min-w-max max-w-48 text-xs
                          ${isRTL ? "right-0" : "left-0"}
                        `}
                      >
                        <div
                          className={`flex flex-wrap gap-1 ${
                            isRTL ? "justify-end" : "justify-start"
                          }`}
                        >
                          {module.academicStreams.map((stream) => (
                            <span
                              key={stream}
                              className={`inline-block px-1.5 py-0.5 bg-gray-700 dark:bg-gray-600 rounded text-[10px] ${
                                isRTL ? "font-arabic" : "font-sans"
                              }`}
                            >
                              {t(
                                `professor.academicStreams.${stream
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]/g, "")}`
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

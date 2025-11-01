"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { RTL_LANGUAGES } from "@/lib/language";

interface TeamMember {
  id: string;
  name: string;
  description: string;
  avatar?: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Ahmed Hassan",
    description:
      "Founder & CEO, Passionate educator with 15+ years of experience in Natural Sciences",
  },
  {
    id: "2",
    name: "Fatima Al-Zahra",
    description:
      "Head of Technology, Expert in educational technology and digital learning platforms",
  },
  {
    id: "3",
    name: "Mohamed El-Amin",
    description:
      "Lead Developer, Full-stack developer specializing in scalable educational solutions",
  },
  {
    id: "4",
    name: "Aisha Benali",
    description:
      "Content Director, Curriculum specialist with expertise in interactive learning design",
  },
  {
    id: "5",
    name: "Omar Khadra",
    description:
      "UX/UI Designer, Creating intuitive and engaging learning experiences",
  },
  {
    id: "6",
    name: "Layla Mansouri",
    description:
      "Student Success Manager, Ensuring every student reaches their full potential",
  },
];

export default function MeetOurTeam() {
  const { t, language } = useLanguage();
  const isRTL = RTL_LANGUAGES.includes(language);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<
    "left" | "right" | "initial"
  >("initial");
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection("right");
    setCurrentIndex((prev) => (prev + 1) % TEAM_MEMBERS.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection("left");
    setCurrentIndex((prev) =>
      prev === 0 ? TEAM_MEMBERS.length - 1 : prev - 1
    );
    setTimeout(() => setIsAnimating(false), 800);
  };

  const getVisibleMembers = () => {
    const members = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % TEAM_MEMBERS.length;
      members.push(TEAM_MEMBERS[index]);
    }
    return members;
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes slideOutRight {
          0% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(-30px) scale(0.95);
          }
        }

        @keyframes slideOutLeft {
          0% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(30px) scale(0.95);
          }
        }
      `}</style>
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 sm:mb-10 md:mb-12 text-center">
            {t("landing.team.title") || "Meet our team"}
          </h2>

          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 md:left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl hover:scale-110 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group"
              aria-label="Previous team members"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 md:right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl hover:scale-110 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group"
              aria-label="Next team members"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
            </button>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-8 md:px-12 transition-opacity duration-300">
              {getVisibleMembers().map((member, index) => (
                <div
                  key={`${member.id}-${currentIndex}`}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 group cursor-pointer"
                  style={{
                    animation:
                      slideDirection === "right"
                        ? "slideInRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards"
                        : slideDirection === "left"
                        ? "slideInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards"
                        : "fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  {/* Avatar */}
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-all duration-300">
                      <User className="w-10 h-10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {member.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-center text-sm leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {TEAM_MEMBERS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (isAnimating || index === currentIndex) return;
                    setIsAnimating(true);
                    setSlideDirection(
                      index > currentIndex
                        ? "right"
                        : index < currentIndex
                        ? "left"
                        : "initial"
                    );
                    setCurrentIndex(index);
                    setTimeout(() => setIsAnimating(false), 800);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                    index === currentIndex
                      ? "bg-blue-600 dark:bg-blue-400 scale-125"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-blue-400 dark:hover:bg-blue-500"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

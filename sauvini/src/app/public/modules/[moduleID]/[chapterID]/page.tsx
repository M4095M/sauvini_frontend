"use client";

import DropDown from "@/components/input/dropDown";
import LessonCard from "@/components/modules/LessonCard";
import { useLanguage } from "@/context/LanguageContext";
import { Lesson } from "@/types/modules";

export const lessons: Lesson[] = [
  {
    id: "lesson-1",
    title: "Introduction to Algebra",
    description:
      "Learn the basics of algebra including variables, equations, and expressions.",
    image: "/images/algebra.jpg",
    duration: 45,
    isCompleted: false,
    isUnlocked: false,
    order: 1,
    academicStreams: ["Mathematics"],
  },
  {
    id: "lesson-2",
    title: "Newton’s Laws of Motion",
    description: "Understand the fundamental laws governing motion and forces.",
    image: "/images/newton-laws.jpg",
    duration: 50,
    isCompleted: false,
    isUnlocked: false,
    order: 2,
    academicStreams: ["Experimental Sciences"],
  },
  {
    id: "lesson-3",
    title: "Engineering Drawing Basics",
    description: "Introduction to technical drawing and design principles.",
    image: "/images/eng-drawing.jpg",
    duration: 60,
    isCompleted: false,
    isUnlocked: false,
    order: 3,
    academicStreams: ["Math-Technique"],
  },
  {
    id: "lesson-4",
    title: "French Romantic Literature",
    description:
      "Explore the key authors and works of the Romantic literary movement.",
    image: "/images/romantic-lit.jpg",
    duration: 40,
    isCompleted: false,
    isUnlocked: false,
    order: 4,
    academicStreams: ["Literature"],
  },
  {
    id: "lesson-5",
    title: "Advanced Geometry",
    description: "Dive deeper into complex geometric concepts and theorems.",
    image: "/images/geometry.jpg",
    duration: 55,
    isCompleted: false,
    isUnlocked: false,
    order: 5,
    academicStreams: ["Mathematics", "Math-Technique"],
  },
];

export default function LessonsPage() {
  const { isRTL, t, language } = useLanguage();

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
        <div className="flex flex-col gap-7">
          {lessons.map((lesson, index) => {
            return <LessonCard key={lesson.id} lesson={lesson} lessonNumber={0} />;
          })}
        </div>
      </div>
    </div>
  );
}

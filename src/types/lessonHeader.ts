import { Chapter, Lesson, Module } from "./modules";

export type LessonHeaderProps = {
  chapter_name: string;
  lesson_name: string;
  callback: unknown;
  lessonData?: Lesson;
  chapterData?: Chapter;
  moduleData?: Module;
  isRTL: boolean
};

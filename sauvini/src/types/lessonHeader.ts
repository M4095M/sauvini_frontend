import { Chapter, Lesson, Module } from "./modules";

export type LessonHeaderProps = {
  chapter_name: string;
  lesson_name: string;
  callback: any;
  lessonData?: Lesson;
  chapterData?: Chapter;
  moduleData?: Module;
};

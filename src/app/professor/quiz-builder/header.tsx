import InputButton from "@/components/input/InputButton";
import Button from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import QuizApi, { type QuizWithQuestions } from "@/api/quiz";
import { getLesson, type LessonWithRelations } from "@/api/lesson";
import type { CreateQuizRequest } from "@/api/quiz";

type QuizHeaderProps = {
  t: any;
  isRLT?: boolean;
  quizId?: string; // Optional: if updating existing quiz
  lessonId: string; // Required: the lesson this quiz belongs to
};

export default function QuizBuilderHeader({
  t,
  isRLT,
  quizId,
  lessonId,
}: QuizHeaderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Quiz state
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);
  const [minScore, setMinScore] = useState(60);

  // Lesson data for display
  const [lessonData, setLessonData] = useState<LessonWithRelations | null>(
    null
  );

  // ! tempo: should be replaced with ref from Form hook
  const inputRef = useRef<HTMLInputElement>(null);

  // Set initial values for InputButtons and keep them synced
  useEffect(() => {
    // Add a delay to ensure DOM is ready and InputButton useEffect has run
    const timer = setTimeout(() => {
      const totalPointsInput = document.querySelector(
        'input[name="totalPoints"]'
      ) as HTMLInputElement;
      const minScoreInput = document.querySelector(
        'input[name="minScore"]'
      ) as HTMLInputElement;

      if (totalPointsInput) {
        totalPointsInput.value = totalPoints.toString();
        // Manually trigger the onChange if provided to sync InputButton internal state
        totalPointsInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
      if (minScoreInput) {
        minScoreInput.value = minScore.toString();
        minScoreInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [totalPoints, minScore, isLoading]);

  // Load quiz and lesson data from backend
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        // Load lesson data
        if (lessonId) {
          const lessonResponse = await getLesson(lessonId);
          if (lessonResponse.success && lessonResponse.data) {
            setLessonData(lessonResponse.data);
          }
        }

        // Load quiz data if editing existing quiz
        if (lessonId) {
          const quizResponse = await QuizApi.getQuizByLesson(lessonId);
          if (quizResponse.success && quizResponse.data) {
            const quiz = quizResponse.data.quiz;
            const questions = quizResponse.data.questions || [];

            // Calculate total points from questions
            const calculatedPoints = questions.reduce(
              (sum, q) => sum + (q.points || 0),
              0
            );

            setQuizTitle(quiz.title || "");
            setQuizDescription(quiz.description || "");
            setMinScore(quiz.passing_score || 60);
            setTotalPoints(calculatedPoints || 100);
          }
        }
      } catch (error) {
        console.error("Error loading quiz data:", error);
        setSaveMessage("Error loading quiz data");
        setTimeout(() => setSaveMessage(null), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [quizId, lessonId]);

  const handleSaveQuiz = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      if (quizId) {
        // Update existing quiz
        const updateData = {
          id: quizId,
          title: quizTitle || "Untitled Quiz",
          description: quizDescription || "",
          time_limit: 30,
          passing_score: minScore,
          max_attempts: 3,
          is_active: true,
        };
        const response = await QuizApi.updateQuiz(quizId, updateData);

        if (response.success) {
          setSaveMessage("✓ Quiz updated successfully!");
          setTimeout(() => setSaveMessage(null), 3000);
        } else {
          setSaveMessage(`❌ Error: ${response.message}`);
        }
      } else {
        // Create new quiz
        const createData: CreateQuizRequest = {
          lesson_id: lessonId,
          title: quizTitle || "Untitled Quiz",
          description: quizDescription || "",
          time_limit: 30,
          passing_score: minScore,
          max_attempts: 3,
          questions: [], // Questions will be added separately
        };

        const response = await QuizApi.createQuiz(createData);

        if (response.success) {
          setSaveMessage("✓ Quiz created successfully!");
          setTimeout(() => setSaveMessage(null), 3000);
        } else {
          setSaveMessage(`❌ Error: ${response.message}`);
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setSaveMessage(`❌ Error saving quiz: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full bg-neutral-100 px-3 py-11 rounded-[52px] flex flex-col gap-8">
      {/* header */}
      <div className="flex flex-row justify-between items-center gap-3">
        <div className="flex flex-col grow gap-1 px-6">
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Enter Quiz Title"
            className="font-semibold text-5xl text-neutral-600 bg-transparent border-none outline-none"
          />
          <div className="font-medium text-2xl text-neutral-400">
            {lessonData?.chapter_title || ""}
          </div>
        </div>
        <div className="">
          <Button
            state={"filled"}
            size={"M"}
            icon_position={"right"}
            text={isSaving ? "Saving..." : t("professor.quizes.SaveQuiz")}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
              >
                <path
                  d="M9.7001 12L11.5668 13.8666L15.3001 10.1333M20.9001 12C20.9001 16.6392 17.1393 20.4 12.5001 20.4C7.86091 20.4 4.1001 16.6392 4.1001 12C4.1001 7.36078 7.86091 3.59998 12.5001 3.59998C17.1393 3.59998 20.9001 7.36078 20.9001 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            onClick={handleSaveQuiz}
            disabled={isSaving}
          />
        </div>
        {saveMessage && (
          <div
            className={`px-4 py-2 rounded-lg text-sm ${
              saveMessage.includes("✓")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {saveMessage}
          </div>
        )}
        <div className=""></div>
      </div>
      {/* quiz total xp points */}
      <div className="px-8">
        <InputButton
          label={t("professor.quizes.QuizTotalPoints")}
          type={"plus-minus"}
          max_width=""
          name="totalPoints"
          onChange={(e) => setTotalPoints(parseInt(e.target.value) || 0)}
        />
      </div>
      {/* min score */}
      <div className="px-8">
        <InputButton
          label={t("professor.quizes.QuizMinScore")}
          type={"plus-minus"}
          max_width=""
          name="minScore"
          onChange={(e) => setMinScore(parseInt(e.target.value) || 0)}
        />
      </div>
    </div>
  );
}

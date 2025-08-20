"use client"

// ...existing imports...
import { useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Button from "@/components/ui/button"
import Question from "@/components/quizes/question"
import { MOCK_QUIZZES, MOCK_USER_PROFILE, findLessonContext } from "@/data/mockModules"
import { useLanguage } from "@/hooks/useLanguage"

export default function LessonQuizPage() {
  const router = useRouter()
  const { isRTL } = useLanguage()
  const params = useParams() as { lessonId: string }
  const lessonId = params.lessonId

  const quiz = useMemo(() => MOCK_QUIZZES[lessonId], [lessonId])
  const questions = quiz?.questions || []

  // Warn user that answers won't be saved if they leave
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", beforeUnload)
    return () => window.removeEventListener("beforeunload", beforeUnload)
  }, [])

  const onSubmit = () => {
    // Deterministic simulation (no UI changes): even-ending lessonId -> pass, odd -> fail
    const lastDigits = lessonId.match(/\d+$/)?.[0] ?? "0"
    const isEven = parseInt(lastDigits, 10) % 2 === 0
    const total = questions.length || 1
    const percent = isEven ? 85 : Math.max((quiz?.threshold ?? 70) - 10, 0)
    const score = Math.round((percent / 100) * total)
    const threshold = quiz?.threshold ?? 70
    const passed = percent >= threshold

    const ctx = findLessonContext(lessonId)
    const submissionKey = `quizSubmission:${MOCK_USER_PROFILE.id}:${lessonId}`
    const submission = {
      lessonId,
      userId: MOCK_USER_PROFILE.id,
      moduleId: ctx.module?.id,
      chapterId: ctx.chapter?.id,
      score,
      total,
      threshold,
      percent,
      passed,
      submittedAt: new Date().toISOString(),
    }
    try {
      localStorage.setItem(submissionKey, JSON.stringify(submission))
    } catch {}

    router.push(`/quizes/${lessonId}/result`)
  }

  return (
    <div className="bg-neutral-100 py-8 rounded-[60px] overflow-hidden w-full flex flex-col justify-center items-center">
      <div className="flex flex-col w-fit">
        {questions.map((q, idx) => (
          <Question
            key={q.id}
            number={String(idx + 1)}
            question={q.leadIn}
            options={q.options}
            checkbox={q.type === "multiple"}
            image={q.image}
            isRTL={isRTL}
          />
        ))}

        <div className="w-fill self-end flex w-3xs items-end justify-end">
          <Button
            state={"filled"}
            size={"M"}
            icon_position={"none"}
            text="submit"
            onClick={onSubmit}
          />
        </div>
      </div>
    </div>
  )
}
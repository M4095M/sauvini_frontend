"use client"

import { useMemo } from "react"
import { useLanguage } from "@/hooks/useLanguage"
import { NavBarGuest, NavBarAuthed, Hero, WhySauvini, ForWhom } from "@/components/landing"

export default function LandingPage() {
  const { t } = useLanguage()

  // TODO: wire with auth 
  const isAuthenticated = true

  const cards = useMemo(
    () => [
      { id: "c1", title: t("landing.why.cards.c1.title") || "Adaptive Learning", desc: t("landing.why.cards.c1.desc") || "Personalized paths for faster progress." },
      { id: "c2", title: t("landing.why.cards.c2.title") || "Expert Support", desc: t("landing.why.cards.c2.desc") || "Real mentors and guided help." },
      { id: "c3", title: t("landing.why.cards.c3.title") || "Rich Content", desc: t("landing.why.cards.c3.desc") || "Videos, notes, and interactive quizzes." },
      { id: "c4", title: t("landing.why.cards.c4.title") || "Track Progress", desc: t("landing.why.cards.c4.desc") || "Keep an eye on your growth." },
    ],
    [t]
  )

  return (
    <div className="flex flex-col gap-8">
      {isAuthenticated ? (
        <NavBarAuthed
          userProfile={{
            id: "1",
            name: "John",
            lastname: "Doe",
            avatar: "/placeholder.svg",
            userType: "student",
            title: "Level 6"
          }}
        />
      ) : (
        <NavBarGuest />
      )}

      <Hero/>

      <WhySauvini/>

      {/* <ForWhom
        students={{
          title: t("landing.for.students.title") || "For Students",
          desc: t("landing.for.students.desc") || "Master subjects with structured modules and quizzes."
        }}
        professors={{
          title: t("landing.for.professors.title") || "For Professors",
          desc: t("landing.for.professors.desc") || "Create, manage, and track learning content at scale."
        }}
      /> */}
    </div>
  )
}
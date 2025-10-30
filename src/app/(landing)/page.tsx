"use client";

import { useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import {
  NavBarGuest,
  NavBarAuthed,
  Hero,
  WhySauvini,
  ForWhom,
  AboutSauvini,
  MeetOurTeam,
  ContactUs,
  SendMessage,
} from "@/components/landing";

export default function LandingPage() {
  const { t } = useLanguage();
  const { isAuthenticated, user, getUserRole } = useAuth();

  const cards = useMemo(
    () => [
      {
        id: "c1",
        title: t("landing.why.cards.c1.title") || "Adaptive Learning",
        desc:
          t("landing.why.cards.c1.desc") ||
          "Personalized paths for faster progress.",
      },
      {
        id: "c2",
        title: t("landing.why.cards.c2.title") || "Expert Support",
        desc: t("landing.why.cards.c2.desc") || "Real mentors and guided help.",
      },
      {
        id: "c3",
        title: t("landing.why.cards.c3.title") || "Rich Content",
        desc:
          t("landing.why.cards.c3.desc") ||
          "Videos, notes, and interactive quizzes.",
      },
      {
        id: "c4",
        title: t("landing.why.cards.c4.title") || "Track Progress",
        desc: t("landing.why.cards.c4.desc") || "Keep an eye on your growth.",
      },
    ],
    [t]
  );

  return (
    <div className="flex flex-col gap-8">
      {isAuthenticated ? (
        <NavBarAuthed
          userProfile={{
            id: user?.id || "1",
            name: (user as any)?.first_name || (user as any)?.name || "User",
            lastname: (user as any)?.last_name || (user as any)?.lastname || "",
            avatar: (user as any)?.profile_picture_path || "/placeholder.svg",
            userType: getUserRole() || "student",
            title: "Level 6",
          }}
        />
      ) : (
        <NavBarGuest />
      )}

      <section id="hero">
        <Hero />
      </section>

      <section id="why-sauvini">
        <WhySauvini />
      </section>

      <section id="for-whom">
        <ForWhom
          students={{
            title: t("landing.for.students.title") || "For Students",
            desc:
              t("landing.for.students.desc") ||
              "Master subjects with structured modules and quizzes.",
          }}
          professors={{
            title: t("landing.for.professors.title") || "For Professors",
            desc:
              t("landing.for.professors.desc") ||
              "Create, manage, and track learning content at scale.",
          }}
        />
      </section>

      <section id="about-sauvini">
        <AboutSauvini />
      </section>

      <section id="meet-our-team">
        <MeetOurTeam />
      </section>

      <section id="contact-us">
        <ContactUs />
      </section>

      <section id="send-message">
        <SendMessage />
      </section>
    </div>
  );
}

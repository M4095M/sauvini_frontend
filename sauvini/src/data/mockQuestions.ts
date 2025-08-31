export type QuestionSubmission = {
  id: string;
  student?: { name?: string; avatar?: string };
  moduleName?: string;
  chapterName?: string;
  lessonName?: string;
  title?: string;
  details?: string;
  studentNotes?: string;
  status?: "waiting" | "answered" | "corrected";
  createdAt?: string | Date;
  answerFileUrl?: string | null;
  visibility?: "public" | "private";
  professorNotes?: string;
  professorFileUrl?: string | null;
};

export const MOCK_QUESTION_SUBMISSIONS: QuestionSubmission[] = [
  {
    id: "q_001",
    student: { name: "Amina Zahra", avatar: "/profile.png" },
    moduleName: "Mathematics",
    chapterName: "Calculus Fundamentals",
    lessonName: "Limits & Continuity",
    title: "Question about limit step",
    details:
      "I don't understand how to use L'Hôpital rule in this step. The expression is 0/0 and I tried factoring but I'm lost.",
    studentNotes: "Please explain with a simple example.",
    status: "waiting",
    createdAt: new Date("2025-06-14T10:15:00"),
  },
  {
    id: "q_002",
    student: { name: "Hassan Ali", avatar: "/profile2.png" },
    moduleName: "Physics",
    chapterName: "Mechanics",
    lessonName: "Newton's Laws",
    title: "Friction direction confusion",
    details: "When an object slides down an incline, why is kinetic friction opposite motion, not opposite component of weight?",
    status: "answered",
    visibility: "private",
    createdAt: new Date("2025-06-13T12:30:00"),
    answerFileUrl: null,
    professorNotes: "Explained direction of kinetic friction and added a small diagram.",
    professorFileUrl: "/mock-files/explanation-hassan.pdf",
  },
  {
    id: "q_003",
    student: { name: "Omar Ben", avatar: "/profile3.png" },
    moduleName: "English",
    chapterName: "Grammar Fundamentals",
    lessonName: "Tenses",
    title: "Past perfect vs simple past",
    details: "When should I use past perfect instead of simple past? Examples please.",
    status: "waiting",
    createdAt: new Date("2025-06-12T09:50:00"),
  },
];
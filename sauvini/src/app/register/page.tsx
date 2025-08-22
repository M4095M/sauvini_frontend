"use client";

import Logo from "@/components/logo/logo";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useLanguage } from "@/context/LanguageContext";
import { JSX, useState } from "react";
import ChooseRole from "./chooseRole";
import RegisterPart1 from "./student1";
import RegisterPart2 from "./student2";
import ApplicationSubmitted from "./submit";
import TeacherPart1 from "./teacher1";
import TeacherPart2 from "./teacher2";
import TeacherPart3 from "./teacher3";
import OTP from "./otp";

import { motion } from "motion/react";

type ElementMap = Record<string, JSX.Element[]>;

export default function RegisterPage() {
  const { t, isRTL, language } = useLanguage();
  const [step, setStep] = useState(0);

  const BeginRegister = (role: string) => {
    setChoosenList(elementMap[role]);
    setStep(1);
  };

  const NextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const PreviousStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const [choosenList, setChoosenList] = useState<JSX.Element[]>([
    <ChooseRole
      t={t}
      isRTL={isRTL}
      language={language}
      NextStep={BeginRegister}
      PreviousStep={PreviousStep}
    />,
  ]); // this will define if we use StudenteRegister or teacherRegister

  const StudentRegister = [
    <ChooseRole
      t={t}
      isRTL={isRTL}
      language={language}
      NextStep={BeginRegister}
      PreviousStep={PreviousStep}
    />,
    <RegisterPart1
      t={t}
      isRTL={isRTL}
      language={language}
      NextStep={NextStep}
      PreviousStep={PreviousStep}
    />,
    <RegisterPart2
      t={t}
      isRTL={isRTL}
      language={language}
      NextStep={NextStep}
      PreviousStep={PreviousStep}
    />,
    <ApplicationSubmitted
      t={t}
      isRTL={isRTL}
      language={language}
      NextStep={NextStep}
      PreviousStep={PreviousStep}
    />,
  ];

  const TeacherRegister = [
    <ChooseRole
      t={t}
      isRTL={isRTL}
      language={language}
      NextStep={BeginRegister}
      PreviousStep={PreviousStep}
    />,
    <TeacherPart1
      t={t}
      isRTL={isRTL}
      language={language}
      NextStep={NextStep}
      PreviousStep={PreviousStep}
    />,
    <TeacherPart2
      t={t}
      isRTL={isRTL}
      language={language}
      NextStep={NextStep}
      PreviousStep={PreviousStep}
    />,
    <TeacherPart3
      t={t}
      isRTL={isRTL}
      language={language}
      NextStep={NextStep}
      PreviousStep={PreviousStep}
    />,
    <OTP
      t={t}
      isRTL={isRTL}
      language={language}
      NextStep={NextStep}
      PreviousStep={PreviousStep}
    />,
  ];

  const elementMap: ElementMap = {
    student: StudentRegister,
    teacher: TeacherRegister,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // start slightly below and invisible
      animate={{ opacity: 1, y: 0 }} // fade in & move to normal position
      transition={{
        duration: 0.6, // smooth timing
        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for natural easing
      }}
    >
      {choosenList[step]}
    </motion.div>
  );
}

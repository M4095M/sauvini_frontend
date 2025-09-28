"use client";

import { useLanguage } from "@/context/LanguageContext";
import { JSX, useEffect, useRef, useState } from "react";
import ChooseRole from "./chooseRole";
import RegisterPart1 from "./student1";
import RegisterPart2 from "./student2";
import ApplicationSubmitted from "./submit";
import TeacherPart1 from "./teacher1";
import TeacherPart2 from "./teacher2";
import TeacherPart3 from "./teacher3";
import { motion } from "motion/react";
import { useForm } from "@/hooks/useForm";
import { FormErrors } from "@/types/api";
import { StringOrTemplateHeader } from "@tanstack/react-table";
import OTP from "./otp";
import { useAuth } from "@/context/AuthContext";

type ElementMap = Record<string, JSX.Element[]>;

export type RegisterRequest = {
  // !important: fields of student registration and teacher registration are grouped together to simply the logic only
  // student fields
  first_name: string;
  last_name: string;
  phone_number: string;
  email:string;
  password: string;
  confirmPassword: string;
  // student_email: string;
  // student_password: string;
  // student_confirmPassword: string;
  academic_stream: string;
  wilaya: string;

  // teacher fields
  gender: "male" | "female";
  date_of_birth: Date;
  highSchool_experience: boolean;
  highSchool_experience_num: number;
  offSchool_experience: boolean;
  onlineSchool_experience: boolean;
  // teacher_email: string;
  // teacher_password: string;
  // teacher_confirmPassword: string;

  // input forms:
  cv: File | null;
};

export default function RegisterPage() {
  const { t, isRTL, language } = useLanguage();
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const {registerStudent, registerProfessor} = useAuth()

  // Define submission handlers first
  const handleTeacherRegister = async (values: RegisterRequest) => {
    // Add your teacher registration logic here
    await registerProfessor({
      first_name: values.first_name,
      last_name: values.last_name,
      wilaya: values.wilaya,
      phone_number: values.phone_number,
      email: values.email,
      gender: values.gender,
      date_of_birth: values.date_of_birth.toISOString(),
      exp_school: values.highSchool_experience,
      exp_school_years: values.highSchool_experience_num,
      exp_off_school: values.offSchool_experience,
      exp_online: values.onlineSchool_experience,
      password: values.password,
    }, values.cv as File);
    console.log("Teacher registered with values: ", values);
  };
  const handleStudentRegister = async (values: RegisterRequest) => {
    // Add your student registration logic here
    await registerStudent({
      first_name: values.first_name,
      last_name: values.last_name,
      phone_number: values.phone_number,
      email: values.email,
      password: values.password,
      academic_stream: values.academic_stream,
      wilaya: values.wilaya,
    });
    console.log("Student registered with values: ", values);

  };

  // define validation functions:

  // student Validation functions
  const StudentvalidateStep1 = (values: Partial<RegisterRequest>) => {
    const errors: Partial<Record<keyof RegisterRequest, string>> = {};

    // Validate first_name
    if (!values.first_name || values.first_name.trim() === "") {
      errors.first_name = "First name is required";
    } else if (values.first_name.trim().length < 2) {
      errors.first_name = "First name must be at least 2 characters";
    }

    // Validate last_name
    if (!values.last_name || values.last_name.trim() === "") {
      errors.last_name = "Last name is required";
    } else if (values.last_name.trim().length < 2) {
      errors.last_name = "Last name must be at least 2 characters";
    }

    // Validate phone number
    if (!values.phone_number || values.phone_number.trim() === "") {
      errors.phone_number = "Phone number is required";
    } else if (!/^[\+]?[0-9\-\(\)\s]{10,15}$/.test(values.phone_number.trim())) {
      errors.phone_number = "Please enter a valid phone number";
    }

    // validate wilaya:
    if (!values.wilaya || values.wilaya.trim() === "") {
      errors.wilaya = "Wilaya is required";
    }

    return errors;
  };
  const StudentvalidateStep2 = (values: Partial<RegisterRequest>) => {
    const errors: Partial<Record<keyof RegisterRequest, string>> = {};

    // Validate email
    if (!values.email || values.email.trim() === "") {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    // Validate password
    if (!values.password || values.password === "") {
      errors.password = "Password is required";
    } else if (values.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
      errors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Validate confirm password
    if (!values.confirmPassword || values.confirmPassword === "") {
      errors.confirmPassword = "Please confirm your password";
    } else if (values.confirmPassword !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // validate academic stream
    if (!values.academic_stream || values.academic_stream.trim() === "") {
      errors.academic_stream = "Academic stream is required";
    }

    return errors;
  };
  // List of validators for each step for student
  const StudentstepValidators = [
    null, // Step 0: Choose role - no validation needed
    StudentvalidateStep1, // Step 1: First name, last name, phone
    StudentvalidateStep2, // Step 2: Email, password, confirm password
    null, // Step 3: Application submitted - no validation needed
  ];

  // Teacher validation functions
  const TeachervalidateStep1 = (values: Partial<RegisterRequest>) => {
    const errors: Partial<Record<keyof RegisterRequest, string>> = {};

    // Validate first_name
    if (!values.first_name || values.first_name.trim() === "") {
      errors.first_name = "First name is required";
    } else if (values.first_name.trim().length < 2) {
      errors.first_name = "First name must be at least 2 characters";
    }

    // Validate last_name
    if (!values.last_name || values.last_name.trim() === "") {
      errors.last_name = "Last name is required";
    } else if (values.last_name.trim().length < 2) {
      errors.last_name = "Last name must be at least 2 characters";
    }

    // Validate phone number
    if (!values.phone_number || values.phone_number.trim() === "") {
      errors.phone_number = "Phone number is required";
    } else if (!/^[\+]?[0-9\-\(\)\s]{10,15}$/.test(values.phone_number.trim())) {
      errors.phone_number = "Please enter a valid phone number";
    }

    // validate wilaya:
    if (!values.wilaya || values.wilaya.trim() === "") {
      errors.wilaya = "Wilaya is required";
    }

    // validate date:
    if (!values.date_of_birth) {
      errors.date_of_birth = "Date of birth is required";
    }

    // validate gender:
    if (!values.gender) {
      errors.gender = "Gender is required";
    }

    return errors;
  };

  const TeachervalidateStep2 = (values: Partial<RegisterRequest>) => {
    const errors: Partial<Record<keyof RegisterRequest, string>> = {};

    // validate high school experience:
    if (!values.highSchool_experience) {
      errors.highSchool_experience = "This field is required";
    }

    if (!values.offSchool_experience) {
      errors.offSchool_experience = "This field is required";
    }

    if (!values.onlineSchool_experience) {
      errors.onlineSchool_experience = "This field is required";
    }

    // Validate years of experience (highSchool_experience_num)
    if (
      values.highSchool_experience &&
      (!values.highSchool_experience_num ||
        values.highSchool_experience_num < 0)
    ) {
      errors.highSchool_experience_num =
        "Years of experience is required and must be a positive number";
    } else if (
      values.highSchool_experience &&
      values.highSchool_experience_num &&
      values.highSchool_experience_num > 50
    ) {
      errors.highSchool_experience_num =
        "Years of experience cannot exceed 50 years";
    }


    // validate cv file:
    if (!values.cv) {
      errors.cv = "Please upload your CV";
    }

    return errors;
  };

  const TeachervalidateStep3 = (values: Partial<RegisterRequest>) => {
    const errors: Partial<Record<keyof RegisterRequest, string>> = {};

    // Validate email
    if (!values.email || values.email.trim() === "") {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    // Validate password
    if (!values.password || values.password === "") {
      errors.password = "Password is required";
    } else if (values.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
      errors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Validate confirm password
    if (!values.confirmPassword || values.confirmPassword === "") {
      errors.confirmPassword = "Please confirm your password";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  // List of validators for each step for teacher
  const TeacherstepValidators = [
    null, // Step 0: Choose role - no validation needed
    TeachervalidateStep1, // Step 1: First name, last name, phone
    TeachervalidateStep2, // Step 2: Years of experience, gender, date of birth
    TeachervalidateStep3, // Step 3: Email, password, confirm password
    null, // Step 4: Application submitted - no validation needed
  ];

  // Map role to corresponding submission handler
  const validatorMap = {
    student: StudentstepValidators,
    teacher: TeacherstepValidators,
  };

  const handlerMap = {
    student: handleStudentRegister,
    teacher: handleTeacherRegister,
  };

  const [submissionHandler, setSubmissionHandler] = useState<
    (values: RegisterRequest) => Promise<any>
  >(() => handleStudentRegister); // Default handler

  // Add form data ref to persist across steps without triggering re-renders
  const formDataRef = useRef<Partial<RegisterRequest>>({});

  // Initialize useForm hook with external form data management
  const {
    register,
    registerFile,
    handleSubmit,
    errors,
    setErrors,
    isSubmitting,
    getValues,
    validate,
  } = useForm<RegisterRequest>({
    initialValues: {},
    onSubmit: submissionHandler,
    externalFormData: formDataRef, // Pass the external form data ref
  });

  const [selectedRole, setSelectedRole] = useState<
    "student" | "teacher" | null
  >(null);

  const BeginRegister = (role: string) => {
    const roleKey = role as keyof typeof handlerMap;
    setSelectedRole(roleKey);
    setSubmissionHandler(() => handlerMap[roleKey]);
    setStep(1);
    stepRef.current = 1;
  };

  const NextStep = () => {
    // Get current step validator based on selected role
    const currentValidators =
      selectedRole === "teacher"
        ? TeacherstepValidators
        : StudentstepValidators;
    const currentValidator = currentValidators[stepRef.current];

    if (currentValidator) {
      // Get current form values (this automatically updates formDataRef)
      const formValues = getValues();
      console.log("persistent form data: ", formDataRef.current);

      // Validate current step
      const validationErrors = currentValidator(formValues);

      // If there are validation errors, don't proceed
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        console.log("Validation errors: ", validationErrors);
        return; // Don't go to next step
      }
    }

    // If validation passes or no validator needed, go to next step
    setStep((prevStep) => prevStep + 1);
    stepRef.current += 1;
  };

  const PreviousStep = () => {
    stepRef.current -= 1;
    setStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  // Get current component based on role and step - using conditional rendering instead of arrays
  const getCurrentComponent = () => {
    // Step 0: Choose role (always the same regardless of selected role)
    if (step === 0 || !selectedRole) {
      return (
        <ChooseRole
          t={t}
          isRTL={isRTL}
          language={language}
          NextStep={BeginRegister}
          PreviousStep={PreviousStep}
          register={register}
          errors={errors}
        />
      );
    }

    // Student registration steps
    if (selectedRole === "student") {
      switch (step) {
        case 1:
          return (
            <RegisterPart1
              t={t}
              isRTL={isRTL}
              language={language}
              NextStep={NextStep}
              PreviousStep={PreviousStep}
              register={register}
              errors={errors}
            />
          );
        case 2:
          return (
            <RegisterPart2
              t={t}
              isRTL={isRTL}
              language={language}
              NextStep={NextStep}
              PreviousStep={PreviousStep}
              register={register}
              errors={errors}
            />
          );
        case 3:
          return (
            <OTP
              t={t}
              isRTL={isRTL}
              language={language}
              NextStep={NextStep}
              PreviousStep={PreviousStep}
              register={register}
              errors={errors}
              completeRegistration={handleSubmit}
            />

          );

        case 4:
          return (
            <ApplicationSubmitted
              t={t}
              isRTL={isRTL}
              language={language}
              NextStep={NextStep}
              PreviousStep={PreviousStep}
              register={register}
              errors={errors}
            />
          );

        default:
          return null;
      }
    }

    // Teacher registration steps
    if (selectedRole === "teacher") {
      switch (step) {
        case 1:
          return (
            <TeacherPart1
              t={t}
              isRTL={isRTL}
              language={language}
              NextStep={NextStep}
              PreviousStep={PreviousStep}
              register={register}
              errors={errors}
            />
          );
        case 2:
          return (
            <TeacherPart2
              t={t}
              isRTL={isRTL}
              language={language}
              NextStep={NextStep}
              PreviousStep={PreviousStep}
              register={register}
              registerFile={registerFile}
              errors={errors}
            />
          );
        case 3:
          return (
            <TeacherPart3
              t={t}
              isRTL={isRTL}
              language={language}
              NextStep={NextStep}
              PreviousStep={PreviousStep}
              register={register}
              errors={errors}
            />
          );
        case 4:
          return (
            <ApplicationSubmitted
              t={t}
              isRTL={isRTL}
              language={language}
              NextStep={NextStep}
              PreviousStep={PreviousStep}
              register={register}
              errors={errors}
            />
          );
        default:
          return null;
      }
    }

    return null;
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
      {getCurrentComponent()}
    </motion.div>
  );
}

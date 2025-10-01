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
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const {registerStudent, registerProfessor} = useAuth()

  // Define submission handlers first
  const handleTeacherRegister = async (values: RegisterRequest) => {
    console.log("🚀 handleTeacherRegister called with values:", values);
    
    try {
      // Handle date_of_birth - it might be a Date object or a string from the form
      let dateOfBirthISO: string;
      if (values.date_of_birth instanceof Date) {
        dateOfBirthISO = values.date_of_birth.toISOString();
      } else if (typeof values.date_of_birth === 'string') {
        // If it's already a string (from form input), convert to ISO format
        dateOfBirthISO = new Date(values.date_of_birth).toISOString();
      } else {
        throw new Error("Invalid date_of_birth format");
      }
      
      // Convert string values to booleans for experience fields
      // The form stores "Yes"/"No" or true/false, but API expects boolean
      const convertToBoolean = (value: any): boolean => {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
          return value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
        }
        return Boolean(value);
      };
      
      // Prepare professor data for API
      const professorData = {
        first_name: values.first_name,
        last_name: values.last_name,
        wilaya: values.wilaya,
        phone_number: values.phone_number,
        email: values.email,
        gender: values.gender.toLowerCase(), // Backend expects lowercase 'male' or 'female'
        date_of_birth: dateOfBirthISO,
        exp_school: convertToBoolean(values.highSchool_experience),
        exp_school_years: Number(values.highSchool_experience_num) || 0,
        exp_off_school: convertToBoolean(values.offSchool_experience),
        exp_online: convertToBoolean(values.onlineSchool_experience),
        password: values.password,
      };
      
      console.log("📝 Prepared professor data for API:", professorData);
      
      // Validate that CV file exists
      if (!values.cv || !(values.cv instanceof File)) {
        throw new Error("CV file is required for professor registration");
      }
      
      // Register the professor with CV file
      const result = await registerProfessor(professorData, values.cv as File);
      console.log("✅ Professor registration completed successfully:", result);
      
      return result;
    } catch (error) {
      console.error("❌ Professor registration failed:", error);
      // Display error to user
      if (error instanceof Error) {
        setErrors({ email: error.message || "Registration failed. Please try again." });
      }
      throw error; // Re-throw to let the form handle it
    }
  };
  const handleStudentRegister = async (values: RegisterRequest) => {
    console.log("🚀 handleStudentRegister called with values:", values);
    
    const studentData = {
      first_name: values.first_name,
      last_name: values.last_name,
      phone_number: values.phone_number,
      email: values.email,
      password: values.password,
      academic_stream: values.academic_stream,
      wilaya: values.wilaya,
    };
    
    console.log("📝 Prepared student data for API:", studentData);
    
    try {
      // Step 1: Register the student (without sending email)
      const result = await registerStudent(studentData);
      console.log("✅ Student registration completed successfully:", result);
      
      // Step 2: Store email for OTP component to send verification
      setRegisteredEmail(values.email);
      console.log("📧 Email stored for verification:", values.email);
      
      // Registration successful - NextStep will handle navigation
      return result;
    } catch (error) {
      console.error("❌ Student registration failed:", error);
      // Display error to user
      if (error instanceof Error) {
        setErrors({ email: error.message || "Registration failed. Please try again." });
      }
      throw error; // Re-throw to let the form handle it
    }
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
    } else if (values.confirmPassword !== values.password) {
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

  const NextStep = async () => {
    // Get current step validator based on selected role
    const currentValidators =
      selectedRole === "teacher"
        ? TeacherstepValidators
        : StudentstepValidators;
    const currentValidator = currentValidators[stepRef.current];

    if (currentValidator) {
      // Get current form values (this automatically updates formDataRef)
      const formValues = getValues();
      console.log("📝 NextStep - Current form values:", formValues);
      console.log("📝 NextStep - Persistent form data:", formDataRef.current);

      // Validate current step
      const validationErrors = currentValidator(formValues);

      // If there are validation errors, don't proceed
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        console.log("❌ Validation errors:", validationErrors);
        return; // Don't go to next step
      }
    }

    // If on step 2 for student (about to go to step 3 - OTP), submit the registration
    if (selectedRole === "student" && stepRef.current === 2) {
      try {
        console.log("🎓 Student registration - Step 2 -> Step 3 (OTP)");
        // Ensure we have the latest form data before submission
        getValues();
        await handleSubmit(); // This will call handleStudentRegister
        // If successful, the email will be stored and we can proceed
      } catch (error) {
        console.error("❌ Student registration failed:", error);
        return; // Don't proceed if registration failed
      }
    }
    
    // If on step 3 for teacher (about to go to step 4 - Application Submitted), submit the registration
    if (selectedRole === "teacher" && stepRef.current === 3) {
      try {
        console.log("👨‍🏫 Professor registration - Step 3 -> Step 4 (Success)");
        // CRITICAL: Ensure we get fresh values from Step 3 (email, password) before submission
        const allFormData = getValues();
        console.log("📋 All form data before professor submission:", allFormData);
        console.log("📋 FormDataRef before submission:", formDataRef.current);
        
        await handleSubmit(); // This will call handleTeacherRegister
        console.log("✅ Professor registration submitted successfully");
        // If successful, proceed to the success page
      } catch (error) {
        console.error("❌ Professor registration failed:", error);
        return; // Don't proceed if registration failed
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
              userEmail={registeredEmail}
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

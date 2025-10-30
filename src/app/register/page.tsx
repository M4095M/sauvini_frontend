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
import { useAuth } from "@/hooks/useAuth";

type ElementMap = Record<string, JSX.Element[]>;

export type RegisterRequest = {
  // !important: fields of student registration and teacher registration are grouped together to simply the logic only
  // student fields
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  password_confirm: string;
  // student_email: string;
  // student_password: string;
  // student_confirmPassword: string;
  academic_stream: string;
  wilaya: string;

  // teacher fields
  gender: "male" | "female";
  date_of_birth: Date | string;
  highSchool_experience: boolean | string;
  highSchool_experience_num: number;
  offSchool_experience: boolean | string;
  onlineSchool_experience: boolean | string;
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
  const { registerStudent, registerProfessor } = useAuth();

  // Define submission handlers first
  const handleTeacherRegister = async (values: RegisterRequest) => {
    // Add your teacher registration logic here
    try {
      // Convert date_of_birth to ISO string, handling both Date objects and strings
      const dateOfBirth =
        values.date_of_birth instanceof Date
          ? values.date_of_birth.toISOString()
          : new Date(values.date_of_birth).toISOString();

      // Convert string values to proper types
      const expSchool =
        values.highSchool_experience === "Yes" ||
        values.highSchool_experience === true ||
        values.highSchool_experience === "yes";
      const expOffSchool =
        values.offSchool_experience === "Yes" ||
        values.offSchool_experience === true ||
        values.offSchool_experience === "yes";
      const expOnline =
        values.onlineSchool_experience === "Yes" ||
        values.onlineSchool_experience === true ||
        values.onlineSchool_experience === "yes";
      const expSchoolYears =
        parseInt(String(values.highSchool_experience_num)) || 0;

      console.log("Converted values:", {
        exp_school: expSchool,
        exp_school_years: expSchoolYears,
        exp_off_school: expOffSchool,
        exp_online: expOnline,
      });

      // Validate password strength
      if (values.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      if (!/[A-Z]/.test(values.password)) {
        throw new Error("Password must contain at least one uppercase letter");
      }
      if (!/[a-z]/.test(values.password)) {
        throw new Error("Password must contain at least one lowercase letter");
      }
      if (!/\d/.test(values.password)) {
        throw new Error("Password must contain at least one number");
      }
      if (
        values.password === "Password1" ||
        values.password === "password" ||
        values.password === "12345678"
      ) {
        throw new Error(
          "Password is too common. Please choose a more secure password"
        );
      }

      await registerProfessor(
        {
          first_name: values.first_name,
          last_name: values.last_name,
          wilaya: values.wilaya,
          phone_number: values.phone_number,
          email: values.email,
          gender: values.gender.toLowerCase(),
          date_of_birth: dateOfBirth,
          exp_school: expSchool,
          exp_school_years: expSchoolYears,
          exp_off_school: expOffSchool,
          exp_online: expOnline,
          password: values.password,
          password_confirm: values.password_confirm,
        },
        values.cv as File
      );
      console.log("Teacher registered with values: ", values);
    } catch (error) {
      console.error("Error in handleTeacherRegister:", error);
      throw error; // Re-throw to let the caller handle it
    }
  };
  const handleStudentRegister = async (values: RegisterRequest) => {
    // Add your student registration logic here
    const registrationData = {
      first_name: values.first_name,
      last_name: values.last_name,
      phone_number: values.phone_number,
      email: values.email,
      password: values.password,
      password_confirm: values.password_confirm,
      academic_stream: values.academic_stream,
      wilaya: values.wilaya,
    };

    console.log("Student registration data being sent:", registrationData);
    console.log(
      "password_confirm in registrationData:",
      registrationData.password_confirm
    );
    console.log("Form data ref current:", formDataRef.current);

    await registerStudent(registrationData);
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
    } else if (values.first_name.trim().length > 50) {
      errors.first_name = "First name must be less than 50 characters";
    } else if (
      !/^[a-zA-Z\u0600-\u06FF\s\'-]+$/.test(values.first_name.trim())
    ) {
      errors.first_name =
        "First name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Validate last_name
    if (!values.last_name || values.last_name.trim() === "") {
      errors.last_name = "Last name is required";
    } else if (values.last_name.trim().length < 2) {
      errors.last_name = "Last name must be at least 2 characters";
    } else if (values.last_name.trim().length > 50) {
      errors.last_name = "Last name must be less than 50 characters";
    } else if (!/^[a-zA-Z\u0600-\u06FF\s\'-]+$/.test(values.last_name.trim())) {
      errors.last_name =
        "Last name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Validate phone number
    if (!values.phone_number || values.phone_number.trim() === "") {
      errors.phone_number = "Phone number is required";
    } else if (
      !/^[\+]?[0-9\-\(\)\s]{10,15}$/.test(values.phone_number.trim())
    ) {
      errors.phone_number = "Please enter a valid phone number (10-15 digits)";
    }

    // validate wilaya:
    if (!values.wilaya || values.wilaya.trim() === "") {
      errors.wilaya = "Please select your wilaya";
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
    } else {
      // Check for common passwords
      const commonPasswords = [
        "password",
        "123456",
        "123456789",
        "12345678",
        "12345",
        "1234567",
        "1234567890",
        "qwerty",
        "abc123",
        "password123",
        "admin",
        "letmein",
        "welcome",
        "monkey",
        "1234",
        "dragon",
        "master",
        "hello",
        "login",
        "princess",
        "qwertyuiop",
        "solo",
        "passw0rd",
        "starwars",
        "freedom",
        "whatever",
        "trustno1",
        "jordan",
        "jennifer",
        "hunter",
        "buster",
        "soccer",
        "harley",
        "ranger",
        "daniel",
        "hannah",
        "michael",
        "jessica",
        "charlie",
        "michelle",
        "andrew",
        "joshua",
        "superman",
        "batman",
        "tigger",
        "sunshine",
        "iloveyou",
        "2000",
        "charlie",
        "robert",
        "thomas",
        "hockey",
        "ranger",
        "daniel",
        "hannah",
        "michael",
        "jessica",
        "charlie",
        "michelle",
        "andrew",
        "joshua",
        "superman",
        "batman",
        "tigger",
        "sunshine",
        "iloveyou",
        "2000",
        "charlie",
      ];

      const passwordLower = values.password.toLowerCase();
      const isCommonPassword = commonPasswords.some(
        (common) =>
          passwordLower.includes(common) || common.includes(passwordLower)
      );

      if (isCommonPassword) {
        errors.password =
          "Password is too common. Please choose a more secure password";
      } else if (!/(?=.*[a-z])/.test(values.password)) {
        errors.password = "Password must contain at least one lowercase letter";
      } else if (!/(?=.*[A-Z])/.test(values.password)) {
        errors.password = "Password must contain at least one uppercase letter";
      } else if (!/(?=.*\d)/.test(values.password)) {
        errors.password = "Password must contain at least one number";
      }
    }

    // Validate confirm password
    if (!values.password_confirm || values.password_confirm === "") {
      errors.password_confirm = "Please confirm your password";
    } else if (values.password_confirm !== values.password) {
      errors.password_confirm = "Passwords do not match";
    }

    // validate academic stream
    if (!values.academic_stream || values.academic_stream.trim() === "") {
      errors.academic_stream = "Please select your academic stream";
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
    } else if (values.first_name.trim().length > 50) {
      errors.first_name = "First name must be less than 50 characters";
    } else if (!/^[a-zA-Z\u0600-\u06FF\s'-]+$/.test(values.first_name.trim())) {
      errors.first_name =
        "First name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Validate last_name
    if (!values.last_name || values.last_name.trim() === "") {
      errors.last_name = "Last name is required";
    } else if (values.last_name.trim().length < 2) {
      errors.last_name = "Last name must be at least 2 characters";
    } else if (values.last_name.trim().length > 50) {
      errors.last_name = "Last name must be less than 50 characters";
    } else if (!/^[a-zA-Z\u0600-\u06FF\s'-]+$/.test(values.last_name.trim())) {
      errors.last_name =
        "Last name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Validate phone number
    if (!values.phone_number || values.phone_number.trim() === "") {
      errors.phone_number = "Phone number is required";
    } else if (
      !/^[\+]?[0-9\-\(\)\s]{10,15}$/.test(values.phone_number.trim())
    ) {
      errors.phone_number = "Please enter a valid phone number (10-15 digits)";
    }

    // validate wilaya:
    if (!values.wilaya || values.wilaya.trim() === "") {
      errors.wilaya = "Please select your wilaya";
    }

    // validate date of birth:
    if (!values.date_of_birth) {
      errors.date_of_birth = "Date of birth is required";
    } else {
      const birthDate = new Date(values.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        // Adjust age if birthday hasn't occurred this year
        const adjustedAge = age - 1;
        if (adjustedAge < 18) {
          errors.date_of_birth =
            "You must be at least 18 years old to register as a professor";
        } else if (adjustedAge > 80) {
          errors.date_of_birth = "Please enter a valid date of birth";
        }
      } else {
        if (age < 18) {
          errors.date_of_birth =
            "You must be at least 18 years old to register as a professor";
        } else if (age > 80) {
          errors.date_of_birth = "Please enter a valid date of birth";
        }
      }
    }

    // validate gender:
    if (!values.gender) {
      errors.gender = "Please select your gender";
    }

    return errors;
  };

  const TeachervalidateStep2 = (values: Partial<RegisterRequest>) => {
    const errors: Partial<Record<keyof RegisterRequest, string>> = {};

    // validate high school experience:
    if (!values.highSchool_experience) {
      errors.highSchool_experience =
        "Please select whether you have high school teaching experience";
    }

    if (!values.offSchool_experience) {
      errors.offSchool_experience =
        "Please select whether you have off-school teaching experience";
    }

    if (!values.onlineSchool_experience) {
      errors.onlineSchool_experience =
        "Please select whether you have online teaching experience";
    }

    // Validate years of experience (highSchool_experience_num)
    if (
      values.highSchool_experience === "Yes" ||
      values.highSchool_experience === true ||
      values.highSchool_experience === "yes"
    ) {
      if (
        !values.highSchool_experience_num ||
        values.highSchool_experience_num < 0
      ) {
        errors.highSchool_experience_num =
          "Please enter the number of years of high school teaching experience";
      } else if (values.highSchool_experience_num > 50) {
        errors.highSchool_experience_num =
          "Years of experience cannot exceed 50 years";
      }
    }

    // validate cv file:
    if (!values.cv) {
      errors.cv = "Please upload your CV document";
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
    } else {
      // Check for common passwords
      const commonPasswords = [
        "password",
        "123456",
        "123456789",
        "12345678",
        "12345",
        "1234567",
        "1234567890",
        "qwerty",
        "abc123",
        "password123",
        "admin",
        "letmein",
        "welcome",
        "monkey",
        "1234",
        "dragon",
        "master",
        "hello",
        "login",
        "princess",
        "qwertyuiop",
        "solo",
        "passw0rd",
        "starwars",
        "freedom",
        "whatever",
        "trustno1",
        "jordan",
        "jennifer",
        "hunter",
        "buster",
        "soccer",
        "harley",
        "ranger",
        "daniel",
        "hannah",
        "michael",
        "jessica",
        "charlie",
        "michelle",
        "andrew",
        "joshua",
        "superman",
        "batman",
        "tigger",
        "sunshine",
        "iloveyou",
        "2000",
        "charlie",
        "robert",
        "thomas",
        "hockey",
        "ranger",
        "daniel",
        "hannah",
        "michael",
        "jessica",
        "charlie",
        "michelle",
        "andrew",
        "joshua",
        "superman",
        "batman",
        "tigger",
        "sunshine",
        "iloveyou",
        "2000",
        "charlie",
      ];

      const passwordLower = values.password.toLowerCase();
      const isCommonPassword = commonPasswords.some(
        (common) =>
          passwordLower.includes(common) || common.includes(passwordLower)
      );

      if (isCommonPassword) {
        errors.password =
          "Password is too common. Please choose a more secure password";
      } else if (!/(?=.*[a-z])/.test(values.password)) {
        errors.password = "Password must contain at least one lowercase letter";
      } else if (!/(?=.*[A-Z])/.test(values.password)) {
        errors.password = "Password must contain at least one uppercase letter";
      } else if (!/(?=.*\d)/.test(values.password)) {
        errors.password = "Password must contain at least one number";
      }
    }

    // Validate confirm password
    if (!values.password_confirm || values.password_confirm === "") {
      errors.password_confirm = "Please confirm your password";
    } else if (values.password_confirm !== values.password) {
      errors.password_confirm = "Passwords do not match";
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
      console.log("persistent form data: ", formDataRef.current);
      console.log("getValues() result: ", formValues);

      // Validate current step
      const validationErrors = currentValidator(formValues);

      // If there are validation errors, don't proceed
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        console.log("Validation errors: ", validationErrors);
        return; // Don't go to next step
      }
    }

    // If we're moving from step 2 to step 3 (OTP step), submit student registration first
    if (stepRef.current === 2 && selectedRole === "student") {
      console.log("Submitting student registration before OTP step");
      console.log("Form data ref current:", formDataRef.current);
      console.log("Form values from getValues():", getValues());

      // Merge form data from both sources
      const mergedFormData = {
        ...formDataRef.current,
        ...getValues(),
      } as RegisterRequest;

      console.log("Merged form data for student registration:", mergedFormData);

      try {
        await handleStudentRegister(mergedFormData);
        console.log("Student registration completed successfully");
      } catch (error) {
        console.error("Student registration failed:", error);
        setErrors({ email: "Registration failed. Please try again." });
        return;
      }
    }
    // If we're moving from step 3 to step 4 (ApplicationSubmitted), submit teacher registration
    else if (stepRef.current === 3 && selectedRole === "teacher") {
      console.log(
        "Submitting teacher registration before ApplicationSubmitted step"
      );
      console.log("Form data ref current:", formDataRef.current);
      console.log("Form values from getValues():", getValues());

      // Merge form data from both sources
      const mergedFormData = {
        ...formDataRef.current,
        ...getValues(),
      } as RegisterRequest;

      console.log("Merged form data for teacher registration:", mergedFormData);
      console.log("All fields in merged data:", Object.keys(mergedFormData));
      console.log(
        "exp_school_years value:",
        mergedFormData.highSchool_experience_num
      );
      console.log("exp_school value:", mergedFormData.highSchool_experience);
      console.log("exp_off_school value:", mergedFormData.offSchool_experience);
      console.log("exp_online value:", mergedFormData.onlineSchool_experience);
      console.log("CV file:", mergedFormData.cv);
      console.log(
        "Complete merged data JSON:",
        JSON.stringify(mergedFormData, null, 2)
      );

      try {
        await handleTeacherRegister(mergedFormData);
        console.log("Teacher registration completed successfully");
      } catch (error) {
        console.error("Teacher registration failed:", error);

        // Handle different types of errors
        if (error instanceof Error) {
          const errorMessage = error.message;

          // Check if it's a field-specific error from the backend
          if (errorMessage.includes("first_name")) {
            setErrors({ first_name: errorMessage });
          } else if (errorMessage.includes("last_name")) {
            setErrors({ last_name: errorMessage });
          } else if (errorMessage.includes("phone_number")) {
            setErrors({ phone_number: errorMessage });
          } else if (errorMessage.includes("wilaya")) {
            setErrors({ wilaya: errorMessage });
          } else if (errorMessage.includes("gender")) {
            setErrors({ gender: errorMessage });
          } else if (errorMessage.includes("date_of_birth")) {
            setErrors({ date_of_birth: errorMessage });
          } else if (errorMessage.includes("email")) {
            setErrors({ email: errorMessage });
          } else if (errorMessage.includes("password")) {
            setErrors({ password: errorMessage });
          } else {
            // General error
            setErrors({ ...errors, general: errorMessage } as any);
          }
        } else {
          setErrors({
            ...errors,
            general: "Registration failed. Please try again.",
          } as any);
        }
        return;
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
              userEmail={getValues().email || formDataRef.current.email}
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

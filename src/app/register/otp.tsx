"use client";

import { RegisterCommonProps } from "@/types/registerCommonProps";
import Button from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { AuthApi } from "@/api/auth";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Mail,
  RefreshCw,
} from "lucide-react";

export default function OTP({
  t,
  isRTL,
  language,
  NextStep,
  PreviousStep,
  register,
  errors,
  userEmail,
}: RegisterCommonProps) {
  const [otpResent, setOtpResent] = useState(false);
  const [emailSendLoading, setEmailSendLoading] = useState(false);
  const [emailSendError, setEmailSendError] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [inputError, setInputError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const hasEmailSentRef = useRef(false); // Prevent double email send
  const isSendingEmailRef = useRef(false); // Prevent concurrent email sends
  const router = useRouter();

  // Send verification email (initial send on mount)
  const sendVerificationEmail = async (isResend = false) => {
    if (!userEmail) {
      console.error("❌ No email provided for verification");
      setGeneralError(
        "Email address is missing. Please try registering again."
      );
      return;
    }

    // Prevent concurrent email sends
    if (isSendingEmailRef.current) {
      return;
    }

    // Clear previous errors and messages
    setEmailSendError("");
    setGeneralError("");
    setSuccessMessage("");
    setInputError("");

    if (isResend) {
      setIsResending(true);
    } else {
      setEmailSendLoading(true);
    }

    // Set the sending flag to prevent concurrent sends
    isSendingEmailRef.current = true;

    try {
      const response = await AuthApi.sendStudentVerificationEmail(userEmail);

      if (response.success) {
        setSuccessMessage(
          isResend
            ? "Verification email sent successfully!"
            : "Verification email sent! Please check your inbox."
        );
        setEmailSendError(""); // Clear any previous errors
        setGeneralError(""); // Clear any previous errors
      } else {
        console.error("❌ API returned success=false:", response.message);
        const errorMsg =
          response.message || "Failed to send verification email";
        setEmailSendError(errorMsg);
      }
    } catch (error: any) {
      console.error("❌ Failed to send verification email:", error);
      console.error("❌ Error details:", {
        message: error?.message,
        response: error?.response,
        status: error?.response?.status,
        data: error?.response?.data,
      });

      let errorMessage = "Failed to send verification email. Please try again.";

      // Handle specific error cases based on the actual error structure
      if (error?.status === 429) {
        errorMessage =
          "Too many requests. Please wait a moment before trying again.";
      } else if (error?.status === 400) {
        errorMessage = "Invalid email address. Please check and try again.";
      } else if (error?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error?.message) {
        // Check if it's a user-friendly message or needs to be extracted
        if (error.message.includes("HTTP 429")) {
          errorMessage =
            "Too many requests. Please wait a moment before trying again.";
        } else if (error.message.includes("HTTP 400")) {
          errorMessage = "Invalid email address. Please check and try again.";
        } else if (error.message.includes("HTTP 5")) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      setEmailSendError(errorMessage);
    } finally {
      // Reset the sending flag
      isSendingEmailRef.current = false;

      if (isResend) {
        setIsResending(false);
      } else {
        setEmailSendLoading(false);
      }
    }
  };

  // Send email on mount
  useEffect(() => {
    // Only send email if we have an email and haven't sent it yet
    if (!userEmail || hasEmailSentRef.current || isSendingEmailRef.current) {
      return;
    }

    // Add a small delay to ensure registration has completed
    const timer = setTimeout(() => {
      // Double-check conditions before sending
      if (!hasEmailSentRef.current && !isSendingEmailRef.current && userEmail) {
        hasEmailSentRef.current = true;
        sendVerificationEmail();
      }
    }, 500); // 500ms delay to ensure registration is complete

    return () => {
      clearTimeout(timer);
      // Reset refs on cleanup to prevent issues if component remounts
      hasEmailSentRef.current = false;
      isSendingEmailRef.current = false;
    };
  }, [userEmail]);

  const handleResendOTP = async () => {
    // Clear previous errors and messages
    setVerificationError("");
    setEmailSendError("");
    setGeneralError("");
    setInputError("");
    setSuccessMessage("");

    await sendVerificationEmail(true);
    setOtpResent(true);
  };

  const handleVerifyEmail = async () => {
    const trimmedToken = verificationToken.trim();

    // Clear previous errors and messages
    setVerificationError("");
    setGeneralError("");
    setInputError("");
    setSuccessMessage("");

    // Input validation
    if (!trimmedToken) {
      setInputError("Please enter the verification code");
      return;
    }

    if (trimmedToken.length < 4) {
      setInputError("Verification code must be at least 4 characters");
      return;
    }

    if (!/^[0-9]+$/.test(trimmedToken)) {
      setInputError("Verification code must contain only numbers");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await AuthApi.verifyStudentEmail(trimmedToken);

      if (response.success) {
        setSuccessMessage(
          "Email verified successfully! Redirecting to login..."
        );

        // Small delay to show success message before redirect
        setTimeout(() => {
          router.push("/auth/login/student");
        }, 1500);
      } else {
        // Display error message from backend
        const errorMsg =
          response.message || "Verification failed. Please try again.";
        setVerificationError(errorMsg);
      }
    } catch (error: any) {
      console.error("❌ Email verification failed:", error);
      console.error("❌ Error structure:", {
        message: error?.message,
        status: error?.status,
        code: error?.code,
        details: error?.details,
        data: error?.data,
      });

      let errorMessage =
        "Verification failed. Please check your token and try again.";

      // Handle specific error cases based on the actual error structure
      if (error?.status === 400) {
        errorMessage = "Invalid verification code. Please check and try again.";
      } else if (error?.status === 404) {
        errorMessage = "Verification code not found. Please request a new one.";
      } else if (error?.status === 410) {
        errorMessage =
          "Verification code has expired. Please request a new one.";
      } else if (error?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error?.message) {
        // Check if it's a user-friendly message or needs to be extracted
        if (error.message.includes("HTTP 400")) {
          errorMessage =
            "Invalid verification code. Please check and try again.";
        } else if (error.message.includes("HTTP 404")) {
          errorMessage =
            "Verification code not found. Please request a new one.";
        } else if (error.message.includes("HTTP 410")) {
          errorMessage =
            "Verification code has expired. Please request a new one.";
        } else if (error.message.includes("HTTP 5")) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      setVerificationError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  if (emailSendLoading && !hasEmailSentRef.current) {
    return (
      <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-10 mt-15">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          <div className="text-neutral-600 font-medium text-lg">
            Sending verification email...
          </div>
          <div className="text-neutral-400 text-sm text-center">
            Please wait while we send the verification code to your email
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-10 mt-15">
      {/* header */}
      <div className="flex flex-col justify-center items-center gap-2">
        <span className="font-semibold lg:text-4xl text-neutral-600 text-center text-2xl">
          {t("register.verify-email.title")}
        </span>
        <span className="font-medium lg:text-xl text-neutral-500 text-center text-base">
          {t("register.verify-email.description")}
        </span>
        <span className="font-normal text-neutral-400 text-center text-sm">
          {t("register.verify-email.not_received")}
        </span>
        <div className="flex items-center gap-2 mt-2">
          <Mail className="w-4 h-4 text-neutral-500" />
          <span className="font-semibold text-neutral-600 text-base">
            {userEmail || "your-email@example.com"}
          </span>
        </div>
      </div>

      {/* General error display */}
      {generalError && (
        <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 animate-in fade-in-0 slide-in-from-top-1 duration-200">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div className="text-red-700 text-sm font-medium">{generalError}</div>
        </div>
      )}

      {/* Success message display */}
      {successMessage && (
        <div className="w-full max-w-md bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-in fade-in-0 slide-in-from-top-1 duration-200">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <div className="text-green-700 text-sm font-medium">
            {successMessage}
          </div>
        </div>
      )}

      {/* Email send error display */}
      {emailSendError && (
        <div className="w-full max-w-md bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3 animate-in fade-in-0 slide-in-from-top-1 duration-200">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <div className="text-yellow-700 text-sm font-medium">
            {emailSendError}
          </div>
        </div>
      )}

      {/* Verification Token Input */}
      <div className="flex flex-col gap-4 items-center w-full max-w-md">
        <div className="w-full">
          <input
            type="text"
            value={verificationToken}
            onChange={(e) => {
              setVerificationToken(e.target.value);
              // Clear input error when user starts typing
              if (inputError) {
                setInputError("");
              }
            }}
            placeholder="Enter verification code (e.g., 012345)"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center font-mono text-lg ${
              inputError || verificationError
                ? "border-red-300 bg-red-50"
                : "border-neutral-300"
            }`}
            disabled={isVerifying}
            maxLength={10}
          />

          {/* Input validation error */}
          {inputError && (
            <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 mt-2 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <div className="text-red-700 text-sm font-medium">
                {inputError}
              </div>
            </div>
          )}

          {/* Verification error */}
          {verificationError && (
            <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 mt-2 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <div className="text-red-700 text-sm font-medium">
                {verificationError}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 w-full">
          <Button
            state="outlined"
            size="M"
            icon_position="none"
            text={
              isResending
                ? "Sending..."
                : t("register.verify-email.resend") || "Resend Email"
            }
            onClick={handleResendOTP}
            disabled={isResending || isVerifying}
            icon={
              isResending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )
            }
          />
          <Button
            state="filled"
            size="M"
            icon_position="none"
            text={
              isVerifying
                ? "Verifying..."
                : t("register.verify-email.button") || "Verify Code"
            }
            onClick={handleVerifyEmail}
            disabled={isVerifying || isResending || !verificationToken.trim()}
            icon={
              isVerifying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}

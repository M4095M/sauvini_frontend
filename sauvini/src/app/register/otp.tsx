"use client";

import { RegisterCommonProps } from "@/types/registerCommonProps";
import Button from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { AuthApi } from "@/api/auth";
import { useRouter } from "next/navigation";

export default function OTP({
  t,
  isRTL,
  language,
  NextStep,
  PreviousStep,
  register,
  errors,
  userEmail
}: RegisterCommonProps) {
  const [otpResent, setOtpResent] = useState(false);
  const [emailSendLoading, setEmailSendLoading] = useState(false);
  const [emailSendError, setEmailSendError] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const hasEmailSentRef = useRef(false); // Prevent double email send
  const router = useRouter();

  // Send verification email (initial send on mount)
  const sendVerificationEmail = async () => {
    if (!userEmail) {
      console.error("❌ No email provided for verification");
      setEmailSendError("Email address is missing. Please try registering again.");
      return;
    }

    setEmailSendLoading(true);
    setEmailSendError("");

    try {
      console.log("📧 Sending verification email to:", userEmail);
      const response = await AuthApi.sendStudentVerificationEmail(userEmail);
      
      if (response.success) {
        console.log("✅ Verification email sent successfully");
      } else {
        setEmailSendError(response.message || "Failed to send verification email");
      }
    } catch (error: any) {
      console.error("❌ Failed to send verification email:", error);
      const errorMessage = error?.message || "Failed to send verification email. Please try again.";
      setEmailSendError(errorMessage);
    } finally {
      setEmailSendLoading(false);
    }
  };

  // Send email on mount
  useEffect(() => {
    // Only send email if we have an email and haven't sent it yet
    if (!userEmail || hasEmailSentRef.current) {
      if (!userEmail) {
        console.log("⚠️ No email provided for verification");
      } else {
        console.log("⏭️ Email already sent, skipping...");
      }
      return;
    }
    
    // Add a small delay to ensure registration has completed
    const timer = setTimeout(() => {
      console.log("🔄 OTP component mounted, sending verification email");
      hasEmailSentRef.current = true;
      sendVerificationEmail();
    }, 500); // 500ms delay to ensure registration is complete
    
    return () => clearTimeout(timer);
  }, [userEmail])

  const handleResendOTP = async () => {
    console.log("🔄 Resend verification email clicked");
    setVerificationError("");
    await sendVerificationEmail();
    setOtpResent(true);
  }

  const handleVerifyEmail = async () => {
    const trimmedToken = verificationToken.trim();
    
    // Clear previous error
    setVerificationError("");
    setIsVerifying(true);

    try {
      console.log("🔐 Verifying email with token");
      const response = await AuthApi.verifyStudentEmail(trimmedToken);
      
      if (response.success) {
        console.log("✅ Email verified successfully");
        // Route to login page after successful verification
        router.push("/auth/login/student");
      } else {
        // Display error message from backend
        setVerificationError(response.message || "Verification failed. Please try again.");
      }
    } catch (error: any) {
      console.error("❌ Email verification failed:", error);
      // Display error from backend or network error
      const errorMessage = error?.message || 
                          error?.response?.data?.message || 
                          "Verification failed. Please check your token and try again.";
      setVerificationError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  }

  if (emailSendLoading && !hasEmailSentRef.current) {
    return (
      <div className="w-full justify-center items-center text-neutral-600 font-medium">Sending verification email...</div>
    )
  }

  return (
    <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-10 mt-15">
      {/* header */}
      <div className="flex flex-col justify-center items-center gap-2">
        {otpResent && <div className="text-green-600 font-medium text-base">Verification email sent again!</div>}
        {emailSendError && <div className="text-red-600 font-medium text-base">{emailSendError}</div>}
        <span className="font-semibold lg:text-4xl text-neutral-600 text-center text-2xl">
          {t("register.verify-email.title")}
        </span>
        <span className="font-medium lg:text-xl text-neutral-500 text-center text-base">
          {t("register.verify-email.description")}
        </span>
        <span className="font-normal text-neutral-400 text-center text-sm">
          {t("register.verify-email.not_received")}
        </span>
        <span className="font-semibold text-neutral-600 text-base">
          {userEmail || "your-email@example.com"}
        </span>
      </div>
      
      {/* Verification Token Input */}
      <div className="flex flex-col gap-4 items-center w-full max-w-md">
        <div className="w-full">
          <input
            type="text"
            value={verificationToken}
            onChange={(e) => setVerificationToken(e.target.value)}
            placeholder="e.g., 98595fe6-e349-4153-ae4f-b1653cc90661"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center font-mono text-sm"
            disabled={isVerifying}
          />
          {verificationError && (
            <p className="text-red-500 text-sm mt-2 text-center">{verificationError}</p>
          )}
        </div>
        
        <div className="flex gap-4">
          <Button
            state="outlined"
            size="M"
            icon_position="none"
            text={t("register.verify-email.resend") || "Resend Email"}
            onClick={handleResendOTP}
          />
          <Button
            state="filled"
            size="M"
            icon_position="none"
            text={isVerifying ? "Verifying..." : (t("register.verify-email.button") || "Verify Code")}
            onClick={handleVerifyEmail}
          />
        </div>
      </div>
    </div>
  );
}

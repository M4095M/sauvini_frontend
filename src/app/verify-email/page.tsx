"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthApi } from "@/api/auth";
import Button from "@/components/ui/button";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Get user data from localStorage if available
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("pending_verification_user");
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    }
  }, []);

  const handleVerifyEmail = async () => {
    if (!verificationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }

    if (verificationCode.trim().length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const response = await AuthApi.verifyStudentEmail(
        verificationCode.trim()
      );

      if (response.success) {
        setSuccess(true);
        // Clear pending verification user data
        if (typeof window !== "undefined") {
          localStorage.removeItem("pending_verification_user");
        }
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/auth/login/student");
        }, 2000);
      } else {
        setError(response.message || "Verification failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Email verification failed:", error);
      setError(
        error?.message ||
          "Verification failed. Please check your token and try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setError("Email address not found. Please try logging in again.");
      return;
    }

    setIsResending(true);
    setError("");

    try {
      const response = await AuthApi.sendStudentVerificationEmail(email);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.message || "Failed to resend verification email");
      }
    } catch (error: any) {
      console.error("Failed to resend verification email:", error);
      setError(
        error?.message ||
          "Failed to resend verification email. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  if (success && !isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-green-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Email Verified!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your email has been successfully verified. Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please check your email and enter the 6-digit verification code
            below
          </p>
          {email && (
            <p className="mt-1 text-center text-sm font-medium text-gray-900">
              {email}
            </p>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              Verification Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div className="space-y-4">
            <Button
              state="filled"
              size="M"
              text={isVerifying ? "Verifying..." : "Verify Email"}
              onClick={handleVerifyEmail}
              disabled={isVerifying}
            />

            <Button
              state="outlined"
              size="M"
              text={isResending ? "Sending..." : "Resend Verification Email"}
              onClick={handleResendEmail}
              disabled={isResending || !email}
            />
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push("/auth/login/student")}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

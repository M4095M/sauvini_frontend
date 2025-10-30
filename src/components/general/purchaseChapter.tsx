import { useState, useEffect } from "react";
import AttachementField from "../input/attachementField";
import SimpleInput from "../input/simpleInput";
import FileAttachement from "../lesson/fileAttachment";
import Button from "../ui/button";
import { PurchasesApi, type CreatePurchaseRequest } from "@/api/purchases";
import { useAuth } from "@/context/AuthContextEnhanced";
import { useLanguage } from "@/hooks/useLanguage";

interface PurchaseChapterProps {
  chapterId?: string;
  moduleId?: string;
  price?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PurchaseChapter({
  chapterId,
  moduleId,
  price = 0,
  onSuccess,
  onCancel,
}: PurchaseChapterProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [rib, setRib] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Debug logging
  console.log("PurchaseChapter props:", {
    chapterId,
    moduleId,
    price,
    user: user?.id,
  });

  const handleFileChange = (file: File | null) => {
    setReceiptFile(file);
    setUploadProgress(0);

    // Create image preview if it's an image file
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        handleFileChange(file);
      }
    }
  };

  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (file.size > maxSize) {
      setError(
        `File size must be less than 5MB. Current size: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      setError(
        `File type not supported. Please upload: JPG, PNG, GIF, PDF, DOC, or DOCX`
      );
      return false;
    }

    setError(null);
    return true;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return (
        <svg
          className="w-8 h-8 text-blue-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (file.type === "application/pdf") {
      return (
        <svg
          className="w-8 h-8 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-8 h-8 text-gray-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
  };

  const getFileTypeLabel = (file: File) => {
    if (file.type.startsWith("image/")) {
      return "Image";
    } else if (file.type === "application/pdf") {
      return "PDF";
    } else if (file.type.includes("word")) {
      return "Word Document";
    } else {
      return "Document";
    }
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async () => {
    // Clear previous errors
    setError(null);

    // Validation
    if (!rib.trim()) {
      setError("RIB (Bank Account) is required");
      return;
    }
    if (rib.trim().length < 10) {
      setError("RIB must be at least 10 characters long");
      return;
    }
    if (!receiptFile) {
      setError("Receipt file is required");
      return;
    }
    if (receiptFile.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError("Receipt file size must be less than 5MB");
      return;
    }
    if (!user?.id) {
      setError("User not authenticated. Please log in again.");
      return;
    }
    if (!chapterId || !moduleId) {
      setError("Chapter or module information missing");
      return;
    }
    if (price <= 0) {
      setError("Invalid price amount");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      // In a real implementation, you would upload the file first
      // For now, we'll create a placeholder URL
      const receiptUrl = `receipts/${user.id}/${Date.now()}_${
        receiptFile.name
      }`;

      const purchaseRequest: CreatePurchaseRequest = {
        student_id: user.id,
        chapter_id: chapterId,
        module_id: moduleId,
        price: price,
        phone: user.phone || "", // You might want to add phone to user profile
        receipt_url: receiptUrl,
      };

      console.log("Submitting purchase request:", purchaseRequest);
      const response = await PurchasesApi.createPurchase(purchaseRequest);

      // Complete the progress bar
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success) {
        console.log("Purchase created successfully:", response.data);
        setSuccess(true);
        setTimeout(() => {
          onSuccess?.();
        }, 3000); // Give user more time to see success message
      } else {
        setError(response.message || "Failed to create purchase");
      }
    } catch (err: any) {
      console.error("Purchase error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to process purchase. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="px-8 py-8 bg-green-50 rounded-xl w-full flex flex-col gap-6 items-center text-center">
        <div className="text-green-600 text-6xl animate-bounce">✓</div>
        <div className="font-semibold text-green-800 text-2xl">
          Purchase Request Submitted!
        </div>
        <div className="font-medium text-green-600 text-lg">
          Your purchase request has been submitted and is pending admin
          approval. You will be notified once it's approved.
        </div>
        <div className="text-sm text-green-500 mt-2">
          This window will close automatically in a few seconds...
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-8 bg-gray-50 rounded-xl w-full flex flex-col gap-8">
      {/* title */}
      <div className="flex flex-col gap-3">
        <div className="font-semibold text-neutral-700 text-2xl">
          Payment Instructions
        </div>
        <div className="font-medium text-neutral-500 text-base">
          To purchase this chapter, please pay the required amount ({price} DA)
          to the CCP account mentioned below, then upload the payment receipt.
          Your request will be validated by the admin before you can access the
          content.
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg
            className="w-5 h-5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {/* RIB */}
      <div className="flex flex-col gap-2">
        <div className="text-neutral-600 font-medium text-sm">
          RIB (Bank Account) <span className="text-red-500">*</span>
        </div>
        <SimpleInput
          label={""}
          value={rib}
          type={"text"}
          onChange={(e) => setRib(e.target.value)}
          placeholder="Enter your bank account number (minimum 10 characters)"
        />
        {rib && rib.length < 10 && (
          <div className="text-sm text-amber-600">
            RIB must be at least 10 characters long
          </div>
        )}
      </div>

      {/* Enhanced File Upload */}
      <div className="flex flex-col gap-3">
        <div className="text-neutral-600 font-medium text-sm">
          Upload Receipt <span className="text-red-500">*</span>
        </div>

        {/* Drag and Drop Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
            isDragOver
              ? "border-blue-400 bg-blue-50"
              : receiptFile
              ? "border-green-400 bg-green-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {receiptFile ? (
            <div className="space-y-3">
              {/* Image Preview or File Icon */}
              <div className="flex items-center justify-center">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Receipt preview"
                      className="max-w-full max-h-32 rounded-lg shadow-sm border"
                    />
                    <div className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm">
                      {getFileIcon(receiptFile)}
                    </div>
                  </div>
                ) : (
                  getFileIcon(receiptFile)
                )}
              </div>

              {/* File Info */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {receiptFile.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                    {getFileTypeLabel(receiptFile)}
                  </span>
                  <span>{formatFileSize(receiptFile.size)}</span>
                </div>

                {/* Progress Bar */}
                {isSubmitting && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => {
                  setReceiptFile(null);
                  setImagePreview(null);
                }}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Remove file
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">
                  {isDragOver
                    ? "Drop your file here"
                    : "Drag and drop your receipt here"}
                </p>
                <p className="text-xs text-gray-500">or click to browse</p>
              </div>
              <div className="text-xs text-gray-400">
                JPG, PNG, GIF, PDF, DOC, DOCX up to 5MB
              </div>
            </div>
          )}

          {/* Hidden file input */}
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*,.pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              if (file && validateFile(file)) {
                handleFileChange(file);
              }
            }}
          />
        </div>

        {/* File validation feedback */}
        {receiptFile && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            File ready for upload
          </div>
        )}

        {/* Debug info - remove this after fixing */}
        <div className="text-xs text-gray-400 bg-gray-100 p-2 rounded space-y-1">
          <div>Debug Info:</div>
          <div>
            • RIB: "{rib}" (length: {rib.length}) - {rib.trim() ? "✓" : "✗"}
          </div>
          <div>• RIB Length: {rib.length >= 10 ? "✓" : "✗"} (need 10+)</div>
          <div>• File: {receiptFile ? "✓" : "✗"}</div>
          <div>• Chapter: {chapterId || "Missing"}</div>
          <div>• Module: {moduleId || "Missing"}</div>
          <div>
            • Price: {price} - {price > 0 ? "✓" : "✗"}
          </div>
          <div>• User: {user?.id || "Missing"}</div>
          <div className="font-semibold text-red-600">
            Button disabled:{" "}
            {isSubmitting || !rib.trim() || !receiptFile || rib.length < 10
              ? "YES"
              : "NO"}
          </div>
        </div>
      </div>

      {/* actions */}
      <div className="flex flex-row gap-4 justify-end pt-4">
        <Button
          state={"tonal"}
          size={"M"}
          icon_position={"none"}
          text="Cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        />
        <Button
          state={"filled"}
          size={"M"}
          icon_position={"left"}
          icon={
            isSubmitting ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
              >
                <path
                  d="M9.20156 12.4996L11.0682 14.3663L14.8016 10.6329M20.4016 12.4996C20.4016 17.1388 16.6408 20.8996 12.0016 20.8996C7.36237 20.8996 3.60156 17.1388 3.60156 12.4996C3.60156 7.86042 7.36237 4.09961 12.0016 4.09961C16.6408 4.09961 20.4016 7.86042 20.4016 12.4996Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )
          }
          text={isSubmitting ? "Processing Purchase..." : "Submit Purchase"}
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            !rib.trim() ||
            !receiptFile ||
            rib.length < 10 ||
            !chapterId ||
            !moduleId ||
            price <= 0
          }
        />
      </div>
    </div>
  );
}

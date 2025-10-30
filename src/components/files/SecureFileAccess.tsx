"use client";

import React, { useState, useEffect } from "react";
import { FilesApi, FileInfo, FileAccessResponse } from "@/api/files";
import Button from "../ui/button";
import Loader from "../ui/Loader";

interface SecureFileAccessProps {
  fileId: string;
  fileType: "video" | "pdf" | "document" | "image" | "audio";
  onAccessGranted?: (url: string, fileInfo: FileInfo) => void;
  onAccessDenied?: (error: string) => void;
  accessType?: "read" | "download" | "stream";
  expiresIn?: number; // seconds
  className?: string;
  children?: React.ReactNode;
}

export const SecureFileAccess: React.FC<SecureFileAccessProps> = ({
  fileId,
  fileType,
  onAccessGranted,
  onAccessDenied,
  accessType = "read",
  expiresIn = 3600,
  className = "",
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [accessResponse, setAccessResponse] =
    useState<FileAccessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const requestFileAccess = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await FilesApi.getFileAccess(fileId, {
        access_type: accessType,
        expires_in: expiresIn,
      });

      if (response.success && response.data) {
        setAccessResponse(response.data);
        setFileInfo(response.data as any); // Type assertion for compatibility
        onAccessGranted?.(response.data.signed_url, response.data as any);
      } else {
        throw new Error(response.message || "Access denied");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to access file";
      setError(errorMessage);
      onAccessDenied?.(errorMessage);

      // Don't auto-retry for rate limiting or suspicious activity
      // Only retry for actual network issues
      if (
        retryCount < 2 &&
        !errorMessage.includes("restricted") &&
        !errorMessage.includes("429") &&
        (errorMessage.includes("timeout") || errorMessage.includes("network"))
      ) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          requestFileAccess();
        }, 2000 * (retryCount + 1)); // Exponential backoff
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(0);
    requestFileAccess();
  };

  // Auto-request access on mount for certain file types
  useEffect(() => {
    if (fileType === "video" || fileType === "pdf") {
      requestFileAccess();
    }
  }, [fileId, fileType]);

  const getFileIcon = () => {
    switch (fileType) {
      case "video":
        return (
          <svg
            className="w-8 h-8 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        );
      case "pdf":
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
      case "image":
        return (
          <svg
            className="w-8 h-8 text-green-500"
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
      case "audio":
        return (
          <svg
            className="w-8 h-8 text-purple-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.814a1 1 0 011-.11zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
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

  const getAccessButtonText = () => {
    if (isLoading) return "Requesting Access...";
    if (error) return "Retry Access";
    if (accessResponse) return "Access Granted";
    return `Access ${fileType.toUpperCase()}`;
  };

  const getStatusColor = () => {
    if (isLoading) return "text-blue-600";
    if (error) return "text-red-600";
    if (accessResponse) return "text-green-600";
    return "text-gray-600";
  };

  return (
    <div className={`secure-file-access ${className}`}>
      {children ? (
        <div onClick={!accessResponse ? requestFileAccess : undefined}>
          {children}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-300 rounded-lg">
          {/* File Icon */}
          <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
            {getFileIcon()}
          </div>

          {/* File Info */}
          {fileInfo && (
            <div className="text-center">
              <h3 className="font-medium text-gray-900">
                {fileInfo.file_name}
              </h3>
              <p className="text-sm text-gray-500">
                {(fileInfo.file_size / (1024 * 1024)).toFixed(2)} MB •{" "}
                {fileInfo.file_type.toUpperCase()}
              </p>
            </div>
          )}

          {/* Status */}
          <div className={`text-sm font-medium ${getStatusColor()}`}>
            {isLoading && <Loader size="sm" />}
            {error && (
              <div className="text-center">
                <p className="text-red-600 mb-2">{error}</p>
                {retryCount < 2 && (
                  <Button
                    onClick={handleRetry}
                    state="tonal"
                    size="S"
                    text="Retry"
                  />
                )}
              </div>
            )}
            {accessResponse && (
              <div className="text-center">
                <p className="text-green-600 mb-2">✓ Access granted</p>
                <p className="text-xs text-gray-500">
                  Expires in {Math.floor(accessResponse.expires_in / 60)}{" "}
                  minutes
                </p>
              </div>
            )}
          </div>

          {/* Action Button */}
          {!accessResponse && !isLoading && (
            <Button
              onClick={requestFileAccess}
              state="filled"
              size="M"
              text={getAccessButtonText()}
              disabled={isLoading}
            />
          )}

          {/* Access Granted Actions */}
          {accessResponse && (
            <div className="flex gap-2">
              <Button
                onClick={() => window.open(accessResponse.signed_url, "_blank")}
                state="filled"
                size="M"
                text="Open File"
              />
              {accessType === "download" && (
                <Button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = accessResponse.signed_url;
                    link.download = fileInfo?.file_name || "file";
                    link.click();
                  }}
                  state="tonal"
                  size="M"
                  text="Download"
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SecureFileAccess;

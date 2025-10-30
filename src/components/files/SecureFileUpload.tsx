"use client";

import React, { useState, useRef, useCallback } from "react";
import { FilesApi, CreateUploadSessionRequest, FileInfo } from "@/api/files";
import Button from "../ui/button";
import Loader from "../ui/Loader";

interface SecureFileUploadProps {
  onUploadComplete?: (fileInfo: FileInfo) => void;
  onUploadError?: (error: string) => void;
  onUploadProgress?: (progress: number) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  accessLevel?: "public" | "student" | "professor" | "admin";
  courseId?: string;
  chapterId?: string;
  lessonId?: string;
  className?: string;
  disabled?: boolean;
}

export const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  onUploadComplete,
  onUploadError,
  onUploadProgress,
  acceptedTypes = ["video/*", "application/pdf", "image/*", "audio/*"],
  maxSizeMB = 100,
  accessLevel = "student",
  courseId,
  chapterId,
  lessonId,
  className = "",
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSession, setUploadSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    // Check file type
    const isValidType = acceptedTypes.some((type) => {
      if (type.endsWith("/*")) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `File type not supported. Allowed types: ${acceptedTypes.join(
        ", "
      )}`;
    }

    return null;
  };

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null);
      setSelectedFile(file);

      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        onUploadError?.(validationError);
        return;
      }

      // Create upload session
      try {
        setIsUploading(true);
        setUploadProgress(0);

        const sessionRequest: CreateUploadSessionRequest = {
          file_name: file.name,
          file_size: file.size,
          file_type: getFileType(file.type),
          mime_type: file.type,
          access_level: accessLevel,
          course_id: courseId,
          chapter_id: chapterId,
          lesson_id: lessonId,
        };

        const sessionResponse = await FilesApi.createUploadSession(
          sessionRequest
        );

        if (sessionResponse.success && sessionResponse.data) {
          setUploadSession(sessionResponse.data);

          // Upload file
          const uploadResponse = await FilesApi.uploadFile(
            sessionResponse.data.upload_token,
            file,
            (progress) => {
              setUploadProgress(progress);
              onUploadProgress?.(progress);
            }
          );

          if (uploadResponse.success && uploadResponse.data) {
            onUploadComplete?.(uploadResponse.data);
            setSelectedFile(null);
            setUploadSession(null);
          } else {
            throw new Error(uploadResponse.message || "Upload failed");
          }
        } else {
          throw new Error(
            sessionResponse.message || "Failed to create upload session"
          );
        }
      } catch (error: any) {
        const errorMessage = error.message || "Upload failed";
        setError(errorMessage);
        onUploadError?.(errorMessage);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [
      acceptedTypes,
      maxSizeMB,
      accessLevel,
      courseId,
      chapterId,
      lessonId,
      onUploadComplete,
      onUploadError,
      onUploadProgress,
    ]
  );

  const getFileType = (
    mimeType: string
  ): "video" | "pdf" | "document" | "image" | "audio" => {
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType === "application/pdf") return "pdf";
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("audio/")) return "audio";
    return "document";
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadSession(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (file: File) => {
    const fileType = getFileType(file.type);
    switch (fileType) {
      case "video":
        return "🎥";
      case "pdf":
        return "📄";
      case "image":
        return "🖼️";
      case "audio":
        return "🎵";
      default:
        return "📁";
    }
  };

  return (
    <div className={`secure-file-upload ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"}
          ${
            disabled || isUploading
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:border-gray-400"
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {/* Upload Area */}
        {!selectedFile && !isUploading && (
          <div className="space-y-4">
            <div className="text-4xl">📁</div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {dragActive
                  ? "Drop file here"
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-sm text-gray-500">
                Max {maxSizeMB}MB • {acceptedTypes.join(", ")}
              </p>
            </div>
          </div>
        )}

        {/* Selected File */}
        {selectedFile && !isUploading && (
          <div className="space-y-4">
            <div className="text-4xl">{getFileIcon(selectedFile)}</div>
            <div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                resetUpload();
              }}
              state="tonal"
              size="S"
              text="Remove"
            />
          </div>
        )}

        {/* Uploading */}
        {isUploading && (
          <div className="space-y-4">
            <Loader size="lg" />
            <div>
              <p className="font-medium text-gray-900">Uploading...</p>
              <p className="text-sm text-gray-500">
                {uploadProgress}% complete
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="space-y-4">
            <div className="text-4xl text-red-500">❌</div>
            <div>
              <p className="font-medium text-red-900">Upload failed</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                resetUpload();
              }}
              state="tonal"
              size="S"
              text="Try Again"
            />
          </div>
        )}
      </div>

      {/* Upload Button */}
      {selectedFile && !isUploading && !error && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleFileSelect(selectedFile);
            }}
            state="filled"
            size="M"
            text="Upload File"
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
};

export default SecureFileUpload;

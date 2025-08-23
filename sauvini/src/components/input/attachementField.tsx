"use client";

import { IconProps } from "@/types/icon";
import { useRef, useState } from "react";

const FileIcon = ({ width, height, className }: IconProps) => {
  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <path
          d="M36.5996 28.7999V24.0749C36.5996 20.7198 33.8797 18 30.5246 18H27.8246C26.7062 18 25.7996 17.0933 25.7996 15.975V13.275C25.7996 9.91982 23.0797 7.19995 19.7246 7.19995H16.3496M28.4996 28.8L23.0996 23.4M23.0996 23.4L17.6996 28.7999M23.0996 23.4L23.0996 34.1999M20.3996 7.19995H11.6246C10.5062 7.19995 9.59961 8.10657 9.59961 9.22495V40.2749C9.59961 41.3933 10.5062 42.2999 11.6246 42.2999H34.5746C35.693 42.2999 36.5996 41.3933 36.5996 40.2749V23.4C36.5996 14.4529 29.3466 7.19995 20.3996 7.19995Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

type AttachementFieldProps = {
  max_size: number;
  name: string;
  acceptedTypes: "image/*,.pdf,.doc,.docx"; // commas seperated accepted type
  mandatory: boolean;
  onFileChange?: (file: File | null) => void;
};

export default function AttachementField({
  max_size,
  name,
  acceptedTypes,
  mandatory,
  onFileChange,
}: AttachementFieldProps) {
  const [fileUploaded, setFileUploaded] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // handlers:

  // handler drag:
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

    const file = e.dataTransfer.files?.[0] || null;
    handleFileSelect(file);
  };

  // file handling:
  const handleFileSelect = (file: File | null) => {
    if (!file) return;

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > max_size) {
      alert(`حجم الملف كبير جداً. الحد الأقصى ${max_size} ميجابايت`);
      return;
    }

    setFileUploaded(file);
    onFileChange?.(file);
    console.log("file uploaded");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`flex flex-col justify-center items-center gap-4 py-10 px-6 w-full rounded-[20px]  border-primary-300 bg-white 
        ${dragActive ? " border-2" : "border border-dashed"}
        
    `}
      onDrop={handleDrop}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
    >
      {/* icon */}
      <FileIcon className={"text-primary-300"} width={"48"} height={"48"} />
      {/* info section */}
      <div className="flex flex-col justify-center items-center gap-1">
        <div className="flex gap-1">
          <span className="font-normal text-neutral-600">
            Drag your video or
          </span>
          <span
            className="font-medium text-primary-300 cursor-pointer"
            onClick={handleClick}
          >
            Browse
          </span>
        </div>
        <div className="font-normal text-neutral-400 text-sm">
          Max {max_size} MB files are allowed
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
        required={mandatory}
      />
    </div>
  );
}

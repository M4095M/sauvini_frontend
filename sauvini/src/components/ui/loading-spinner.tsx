"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ===========================================
// TYPES
// ===========================================

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
  variant?: "default" | "primary" | "secondary" | "muted";
}

// ===========================================
// COMPONENT
// ===========================================

export function LoadingSpinner({
  size = "md",
  className,
  text,
  variant = "default",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const variantClasses = {
    default: "text-gray-600",
    primary: "text-blue-600",
    secondary: "text-gray-400",
    muted: "text-muted-foreground",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-2",
        className
      )}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-current border-t-transparent",
          sizeClasses[size],
          variantClasses[variant]
        )}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && <p className={cn("text-sm", variantClasses[variant])}>{text}</p>}
    </div>
  );
}

// ===========================================
// CONVENIENCE COMPONENTS
// ===========================================

export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

export function InlineLoader({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center p-4">
      <LoadingSpinner size="md" text={text} />
    </div>
  );
}

export function ButtonLoader({ size = "sm" }: { size?: "sm" | "md" }) {
  return <LoadingSpinner size={size} variant="muted" className="mr-2" />;
}

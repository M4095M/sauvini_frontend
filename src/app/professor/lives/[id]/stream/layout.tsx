"use client";

import type React from "react";

export default function LiveStreamingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Full-page layout without professor sidebar/header/footer
  // Similar to lesson page layout
  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900">
      {children}
    </div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function TestChapterPage() {
  const searchParams = useSearchParams();
  const chapterId = searchParams?.get("chapterId") || null;
  const moduleId = searchParams?.get("moduleId") || null;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Test page - chapterId:", chapterId, "moduleId:", moduleId);

    // Simulate some loading
    setTimeout(() => {
      console.log("Setting loading to false");
      setLoading(false);
    }, 1000);
  }, [chapterId, moduleId]);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Loading test page...</h1>
        <p>Chapter ID: {chapterId}</p>
        <p>Module ID: {moduleId}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Test Chapter Page</h1>
      <p>Chapter ID: {chapterId}</p>
      <p>Module ID: {moduleId}</p>
      <p>This page loaded successfully!</p>
    </div>
  );
}

"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export default function DebugAuthPage() {
  const { user, isLoading, isAuthenticated, isInitialized } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Debug</h1>

      <div className="space-y-4">
        <div>
          <strong>isInitialized:</strong>{" "}
          {isInitialized ? "✅ true" : "❌ false"}
        </div>

        <div>
          <strong>isLoading:</strong> {isLoading ? "⏳ true" : "✅ false"}
        </div>

        <div>
          <strong>isAuthenticated:</strong>{" "}
          {isAuthenticated ? "✅ true" : "❌ false"}
        </div>

        <div>
          <strong>User:</strong>
          <pre className="bg-gray-100 p-2 mt-2 rounded">
            {user ? JSON.stringify(user, null, 2) : "null"}
          </pre>
        </div>

        <div>
          <strong>User Role:</strong> {user?.role || "none"}
        </div>

        <div>
          <strong>Token in localStorage:</strong>
          <pre className="bg-gray-100 p-2 mt-2 rounded">
            {typeof window !== "undefined"
              ? localStorage.getItem("access_token")
                ? "Token exists"
                : "No token"
              : "Server side"}
          </pre>
        </div>
      </div>
    </div>
  );
}

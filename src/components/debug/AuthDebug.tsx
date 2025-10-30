"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { BaseApi } from "@/api/base";

export default function AuthDebug() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const tokens = BaseApi.getTokens();
  const isBaseApiAuthenticated = BaseApi.isAuthenticated();

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm text-xs">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <div>
          <strong>isAuthenticated:</strong>{" "}
          {isAuthenticated ? "✅ Yes" : "❌ No"}
        </div>
        <div>
          <strong>isLoading:</strong> {isLoading ? "⏳ Yes" : "✅ No"}
        </div>
        <div>
          <strong>BaseApi Auth:</strong>{" "}
          {isBaseApiAuthenticated ? "✅ Yes" : "❌ No"}
        </div>
        <div>
          <strong>User:</strong>{" "}
          {user ? `✅ ${user.email || "Unknown"}` : "❌ None"}
        </div>
        <div>
          <strong>Tokens:</strong> {tokens ? "✅ Present" : "❌ Missing"}
        </div>
        {tokens && (
          <div>
            <strong>Token Type:</strong> {tokens.token_type || "Unknown"}
          </div>
        )}
        <div>
          <strong>Role:</strong> {BaseApi.getCurrentUserRole() || "None"}
        </div>
      </div>
    </div>
  );
}

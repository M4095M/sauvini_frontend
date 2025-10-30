"use client";

import React, { useState } from "react";
import { BaseApi } from "@/api/base";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, CheckCircle, XCircle, Info } from "lucide-react";

export function TokenRefreshDebug() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testTokenRefresh = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      console.log("=== Token Refresh Debug Test ===");

      // Check current authentication status
      const isAuth = BaseApi.isAuthenticated();
      console.log("Current auth status:", isAuth);

      const tokens = BaseApi.getTokens();
      console.log("Current tokens:", tokens);

      const userRole = BaseApi.getCurrentUserRole();
      console.log("Current user role:", userRole);

      if (!isAuth || !tokens) {
        setError("No valid tokens found. Please log in first.");
        return;
      }

      // Check if tokens are expired
      const isExpired = BaseApi.isTokenExpired(tokens);
      console.log("Tokens expired:", isExpired);

      if (!isExpired) {
        setResult("Tokens are still valid. No refresh needed.");
        return;
      }

      // Force token refresh
      console.log("Attempting token refresh...");

      // We'll use the private method through a workaround
      const refreshPromise = (BaseApi as any).refreshTokens?.();
      if (refreshPromise) {
        const newTokens = await refreshPromise;
        console.log("New tokens received:", newTokens);
        setResult("Token refresh successful! New tokens stored.");
      } else {
        setError("Token refresh method not accessible");
      }
    } catch (err) {
      console.error("Token refresh test failed:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const checkTokenStatus = () => {
    const tokens = BaseApi.getTokens();
    const isAuth = BaseApi.isAuthenticated();
    const userRole = BaseApi.getCurrentUserRole();
    const isExpired = tokens ? BaseApi.isTokenExpired(tokens) : true;

    const status = {
      hasTokens: !!tokens,
      isAuthenticated: isAuth,
      userRole: userRole,
      isExpired: isExpired,
      accessToken: tokens?.access_token?.substring(0, 20) + "...",
      refreshToken: tokens?.refresh_token?.substring(0, 20) + "...",
    };

    setResult(JSON.stringify(status, null, 2));
  };

  const clearTokens = () => {
    BaseApi.clearTokens();
    setResult("Tokens cleared");
    setError(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Token Refresh Debug
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This component helps debug token refresh issues. Make sure you're
            logged in first.
          </AlertDescription>
        </Alert>

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={testTokenRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading ? "Testing..." : "Test Token Refresh"}
          </Button>

          <Button
            onClick={checkTokenStatus}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Info className="w-4 h-4" />
            Check Token Status
          </Button>

          <Button
            onClick={clearTokens}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Clear Tokens
          </Button>
        </div>

        {result && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <pre className="whitespace-pre-wrap text-sm">{result}</pre>
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <pre className="whitespace-pre-wrap text-sm">{error}</pre>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-gray-600">
          <p>
            <strong>Instructions:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>First, log in to get tokens</li>
            <li>Click "Check Token Status" to see current state</li>
            <li>
              Click "Test Token Refresh" to test the refresh functionality
            </li>
            <li>Check the browser console for detailed logs</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Shield,
  GraduationCap,
  BookOpen,
  Settings,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// ===========================================
// EXAMPLE COMPONENT SHOWCASING AUTH SYSTEM
// ===========================================

export function AuthExample() {
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    login,
    logout,
    hasRole,
    isStudent,
    isProfessor,
    isAdmin,
    getUserFullName,
    getUserRole,
    getUserEmail,
    requireAuth,
    requireRole,
  } = useAuth();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // ===========================================
  // HANDLERS
  // ===========================================

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      // Example login with test credentials
      const success = await login("student@test.com", "password123");
      if (!success) {
        setLoginError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSensitiveAction = () => {
    if (!requireAuth()) return;
    alert("Sensitive action performed!");
  };

  const handleAdminAction = () => {
    if (!requireRole("admin")) return;
    alert("Admin action performed!");
  };

  // ===========================================
  // RENDER LOGIC
  // ===========================================

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Initializing authentication..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Authentication System Example
          </h1>
          <p className="text-lg text-gray-600">
            This component demonstrates all the authentication features
          </p>
        </div>

        {/* Authentication Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Status</p>
                <Badge variant={isAuthenticated ? "default" : "secondary"}>
                  {isAuthenticated ? "Authenticated" : "Not Authenticated"}
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Loading</p>
                <Badge variant={isLoading ? "default" : "outline"}>
                  {isLoading ? "Loading" : "Ready"}
                </Badge>
              </div>
            </div>

            {isAuthenticated && user && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  User Information
                </p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p>
                    <strong>Email:</strong> {getUserEmail()}
                  </p>
                  <p>
                    <strong>Full Name:</strong>{" "}
                    {getUserFullName() || "Not available"}
                  </p>
                  <p>
                    <strong>Role:</strong> {getUserRole()}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role-Based Access Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Role-Based Access Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <GraduationCap className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="font-medium">Student</p>
                <Badge variant={isStudent() ? "default" : "outline"}>
                  {isStudent() ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="font-medium">Professor</p>
                <Badge variant={isProfessor() ? "default" : "outline"}>
                  {isProfessor() ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <Shield className="w-8 h-8 mx-auto mb-2 text-red-600" />
                <p className="font-medium">Admin</p>
                <Badge variant={isAdmin() ? "default" : "outline"}>
                  {isAdmin() ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Role Checks</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <p>
                  hasRole(&apos;student&apos;):{" "}
                  {hasRole("student") ? "✅" : "❌"}
                </p>
                <p>
                  hasRole(&apos;professor&apos;):{" "}
                  {hasRole("professor") ? "✅" : "❌"}
                </p>
                <p>
                  hasRole(&apos;admin&apos;): {hasRole("admin") ? "✅" : "❌"}
                </p>
                <p>isStudent(): {isStudent() ? "✅" : "❌"}</p>
                <p>isProfessor(): {isProfessor() ? "✅" : "❌"}</p>
                <p>isAdmin(): {isAdmin() ? "✅" : "❌"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isAuthenticated ? (
              <div className="space-y-4">
                <p className="text-gray-600">
                  You are not logged in. Try logging in with test credentials:
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Test Credentials:</strong>
                    <br />
                    Email: student@test.com
                    <br />
                    Password: password123
                  </p>
                </div>

                {loginError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full"
                >
                  {isLoggingIn ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Logging in...
                    </>
                  ) : (
                    "Login with Test Credentials"
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={handleSensitiveAction}
                    variant="outline"
                    className="w-full"
                  >
                    Sensitive Action (Requires Auth)
                  </Button>

                  <Button
                    onClick={handleAdminAction}
                    variant="outline"
                    className="w-full"
                  >
                    Admin Action (Requires Admin Role)
                  </Button>
                </div>

                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Protected Content Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Guard */}
          <Card>
            <CardHeader>
              <CardTitle>Student Guard</CardTitle>
            </CardHeader>
            <CardContent>
              <AuthGuard requiredRole="student">
                <div className="text-green-600">
                  ✅ This content is only visible to students
                </div>
              </AuthGuard>
            </CardContent>
          </Card>

          {/* Professor Guard */}
          <Card>
            <CardHeader>
              <CardTitle>Professor Guard</CardTitle>
            </CardHeader>
            <CardContent>
              <AuthGuard requiredRole="professor">
                <div className="text-green-600">
                  ✅ This content is only visible to professors
                </div>
              </AuthGuard>
            </CardContent>
          </Card>

          {/* Admin Guard */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Guard</CardTitle>
            </CardHeader>
            <CardContent>
              <AuthGuard requiredRole="admin">
                <div className="text-green-600">
                  ✅ This content is only visible to admins
                </div>
              </AuthGuard>
            </CardContent>
          </Card>

          {/* Public Guard */}
          <Card>
            <CardHeader>
              <CardTitle>Public Guard</CardTitle>
            </CardHeader>
            <CardContent>
              <AuthGuard requireAuth={false}>
                <div className="text-blue-600">
                  ✅ This content is visible to everyone
                </div>
              </AuthGuard>
            </CardContent>
          </Card>
        </div>

        {/* Code Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Code Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Basic Usage</h4>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  {`const { user, isAuthenticated, login, logout } = useAuth();

if (isAuthenticated) {
  return <div>Welcome {user?.email}!</div>;
}

return <LoginForm onLogin={login} />;`}
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">Role Checking</h4>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  {`const { isStudent, isProfessor, isAdmin, hasRole } = useAuth();

if (isAdmin()) {
  return <AdminPanel />;
}

if (hasRole('professor')) {
  return <ProfessorDashboard />;
}

return <StudentDashboard />;`}
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">Route Protection</h4>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  {`<AuthGuard requiredRole="admin">
  <AdminContent />
</AuthGuard>

<AuthGuard requireAuth={false}>
  <PublicContent />
</AuthGuard>`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

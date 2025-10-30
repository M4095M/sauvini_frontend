"use client";

import { useAuth } from "@/context/AuthContextEnhanced";
import { useState } from "react";

export default function DebugAdminPage() {
  const { user, isAuthenticated, isLoading, loginAdmin, getUserRole, logout } =
    useAuth();
  const [email, setEmail] = useState("admin@sauvini.com");
  const [password, setPassword] = useState("Admin123!");
  const [loginStatus, setLoginStatus] = useState<string>("");

  const handleLogin = async () => {
    try {
      setLoginStatus("Logging in as admin...");
      const user = await loginAdmin(email, password);
      if (user) {
        setLoginStatus("Admin login successful!");
      } else {
        setLoginStatus("Admin login failed!");
      }
    } catch (error) {
      setLoginStatus(
        `Admin login error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLoginStatus("Logged out successfully!");
    } catch (error) {
      setLoginStatus(
        `Logout error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Debug Page</h1>

      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Current State:</h2>
        <p>
          <strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
        </p>
        <p>
          <strong>User Role:</strong> {getUserRole() || "None"}
        </p>
        <p>
          <strong>User:</strong> {user ? JSON.stringify(user, null, 2) : "None"}
        </p>
        <p>
          <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
        </p>
      </div>

      {!isAuthenticated ? (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Admin Login Test:</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Login
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Logout Test:</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}

      {loginStatus && (
        <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p>
            <strong>Status:</strong> {loginStatus}
          </p>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Navigation Test:</h2>
        <p className="text-sm text-gray-600 mb-2">
          Try navigating to admin pages to test role detection:
        </p>
        <div className="space-x-4">
          <a href="/professor" className="text-blue-500 hover:underline">
            Professor Dashboard
          </a>
          <a
            href="/professor/professor-management"
            className="text-blue-500 hover:underline"
          >
            Admin: Manage Professors
          </a>
          <a
            href="/professor/manage-students"
            className="text-blue-500 hover:underline"
          >
            Admin: Manage Students
          </a>
        </div>
      </div>
    </div>
  );
}

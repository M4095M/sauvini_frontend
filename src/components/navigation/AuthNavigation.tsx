"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  LogOut,
  Settings,
  BookOpen,
  GraduationCap,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// ===========================================
// TYPES
// ===========================================

interface AuthNavigationProps {
  className?: string;
  showMobileMenu?: boolean;
  onMobileMenuToggle?: () => void;
}

// ===========================================
// COMPONENT
// ===========================================

export function AuthNavigation({
  className = "",
  showMobileMenu = false,
  onMobileMenuToggle,
}: AuthNavigationProps) {
  const {
    user,
    isAuthenticated,
    isLoading,
    logout,
    getUserRole,
    getUserFullName,
  } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ===========================================
  // HANDLERS
  // ===========================================

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleProfileClick = () => {
    const role = getUserRole();
    switch (role) {
      case "student":
        router.push("/profile");
        break;
      case "professor":
        router.push("/professor/profile");
        break;
      case "admin":
        router.push("/admin/profile");
        break;
      default:
        router.push("/profile");
    }
  };

  // ===========================================
  // RENDER LOGIC
  // ===========================================

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <LoadingSpinner size="sm" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/login")}
          className="text-sm"
        >
          Sign In
        </Button>
        <Button onClick={() => router.push("/register")} className="text-sm">
          Sign Up
        </Button>
      </div>
    );
  }

  const userRole = getUserRole();
  const userFullName = getUserFullName();

  // ===========================================
  // ROLE-BASED NAVIGATION
  // ===========================================

  const getRoleBasedLinks = () => {
    switch (userRole) {
      case "student":
        return [
          { href: "/", label: "Dashboard", icon: BookOpen },
          { href: "/learning", label: "Learning", icon: GraduationCap },
          { href: "/lessons", label: "Lessons", icon: BookOpen },
          { href: "/quizes", label: "Quizzes", icon: BookOpen },
        ];
      case "professor":
        return [
          { href: "/professor", label: "Dashboard", icon: GraduationCap },
          { href: "/professor/courses", label: "Courses", icon: BookOpen },
          { href: "/professor/students", label: "Students", icon: User },
          { href: "/professor/analytics", label: "Analytics", icon: Settings },
        ];
      case "admin":
        return [
          { href: "/admin", label: "Dashboard", icon: Shield },
          { href: "/admin/users", label: "Users", icon: User },
          { href: "/admin/analytics", label: "Analytics", icon: Settings },
          { href: "/admin/settings", label: "Settings", icon: Settings },
        ];
      default:
        return [];
    }
  };

  const roleLinks = getRoleBasedLinks();

  // ===========================================
  // RENDER
  // ===========================================

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        {roleLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {userFullName && <p className="font-medium">{userFullName}</p>}
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user?.email}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {userRole}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleProfileClick}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-red-600 focus:text-red-600"
          >
            {isLoggingOut ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        onClick={onMobileMenuToggle}
      >
        {showMobileMenu ? (
          <X className="h-4 w-4" />
        ) : (
          <Menu className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

// ===========================================
// MOBILE NAVIGATION
// ===========================================

export function MobileAuthNavigation({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user, isAuthenticated, logout, getUserRole, getUserFullName } =
    useAuth();
  const router = useRouter();

  if (!isOpen || !isAuthenticated) return null;

  const userRole = getUserRole();
  const userFullName = getUserFullName();

  const getRoleBasedLinks = () => {
    switch (userRole) {
      case "student":
        return [
          { href: "/", label: "Dashboard", icon: BookOpen },
          { href: "/learning", label: "Learning", icon: GraduationCap },
          { href: "/lessons", label: "Lessons", icon: BookOpen },
          { href: "/quizes", label: "Quizzes", icon: BookOpen },
        ];
      case "professor":
        return [
          { href: "/professor", label: "Dashboard", icon: GraduationCap },
          { href: "/professor/courses", label: "Courses", icon: BookOpen },
          { href: "/professor/students", label: "Students", icon: User },
          { href: "/professor/analytics", label: "Analytics", icon: Settings },
        ];
      case "admin":
        return [
          { href: "/admin", label: "Dashboard", icon: Shield },
          { href: "/admin/users", label: "Users", icon: User },
          { href: "/admin/analytics", label: "Analytics", icon: Settings },
          { href: "/admin/settings", label: "Settings", icon: Settings },
        ];
      default:
        return [];
    }
  };

  const roleLinks = getRoleBasedLinks();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
        {/* User Info */}
        <div className="px-3 py-2 border-b">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">
                {userFullName || "User"}
              </div>
              <div className="text-sm text-gray-500">{user?.email}</div>
              <div className="text-xs text-gray-400 capitalize">{userRole}</div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        {roleLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              <Icon className="mr-3 h-5 w-5" />
              {link.label}
            </Link>
          );
        })}

        {/* Profile & Settings */}
        <Link
          href="/profile"
          onClick={onClose}
          className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
        >
          <User className="mr-3 h-5 w-5" />
          Profile
        </Link>
        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Log out
        </button>
      </div>
    </div>
  );
}

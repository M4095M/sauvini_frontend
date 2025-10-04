# Authentication System Documentation

This document provides a comprehensive guide to the authentication system implemented in the Sauvini frontend application.

## 🏗️ Architecture Overview

The authentication system is built with a layered architecture that provides:

- **Context-based state management** with React Context API
- **Route protection** with automatic redirects
- **Role-based access control** (RBAC)
- **Token management** with automatic refresh
- **Error boundaries** for graceful error handling
- **Loading states** and user feedback
- **TypeScript support** with full type safety

## 📁 File Structure

```
src/
├── components/
│   └── auth/
│       ├── AuthGuard.tsx              # Route protection components
│       ├── AuthErrorBoundary.tsx      # Error boundary for auth errors
│       └── README.md                  # This documentation
├── context/
│   ├── AuthContext.tsx                # Enhanced auth context (unused)
│   ├── AuthContextSimple.tsx          # Current auth context
│   └── AuthContextEnhanced.tsx        # Enhanced auth context (alternative)
├── hooks/
│   └── useAuth.ts                     # Enhanced auth hooks
├── middleware/
│   └── auth.ts                        # Authentication middleware
├── components/
│   └── navigation/
│       └── AuthNavigation.tsx         # Navigation with auth state
└── app/
    └── auth/
        └── login/
            ├── page.tsx               # Original login page
            └── page-enhanced.tsx      # Enhanced login page
```

## 🔧 Core Components

### 1. AuthGuard

Protects routes based on authentication status and user roles.

```tsx
import { AuthGuard, StudentGuard, ProfessorGuard, AdminGuard } from '@/components/auth/AuthGuard';

// Basic authentication guard
<AuthGuard>
  <ProtectedContent />
</AuthGuard>

// Role-based guards
<StudentGuard>
  <StudentContent />
</StudentGuard>

<ProfessorGuard>
  <ProfessorContent />
</ProfessorGuard>

<AdminGuard>
  <AdminContent />
</AdminGuard>

// Public routes (no auth required)
<PublicGuard>
  <PublicContent />
</PublicGuard>
```

### 2. AuthErrorBoundary

Catches and handles authentication-related errors gracefully.

```tsx
import { AuthErrorBoundary } from "@/components/auth/AuthErrorBoundary";

<AuthErrorBoundary>
  <YourAppContent />
</AuthErrorBoundary>;
```

### 3. RouteProtection

Provides comprehensive route protection with automatic redirects.

```tsx
import { RouteProtection } from "@/components/auth/RouteProtection";

<RouteProtection>
  <YourAppContent />
</RouteProtection>;
```

## 🎣 Hooks

### useAuth

The main authentication hook that provides all auth functionality.

```tsx
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const {
    // Basic state
    user,
    isAuthenticated,
    isLoading,
    isInitialized,

    // Auth methods
    login,
    logout,

    // Role checking
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isStudent,
    isProfessor,
    isAdmin,

    // Route protection
    requireAuth,
    requireRole,
    requireAnyRole,

    // User info
    getUserFullName,
    getUserRole,
    getUserEmail,
  } = useAuth();

  // Use the hook...
}
```

### Convenience Hooks

```tsx
import {
  useRequireAuth,
  useRequireRole,
  useRequireAnyRole,
} from "@/hooks/useAuth";

// Automatically redirects if not authenticated
function ProtectedComponent() {
  const { isAuthenticated, isLoading } = useRequireAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return null; // Will redirect

  return <div>Protected content</div>;
}

// Automatically redirects if user doesn't have required role
function AdminComponent() {
  const { isAuthenticated, isLoading, hasRole } = useRequireRole("admin");

  if (isLoading) return <LoadingSpinner />;
  if (!hasRole) return null; // Will redirect

  return <div>Admin content</div>;
}
```

## 🛡️ Route Protection

### Automatic Route Protection

The `RouteProtection` component automatically protects routes based on configuration:

```tsx
// In layout.tsx
<RouteProtection>
  <YourAppContent />
</RouteProtection>
```

### Manual Route Protection

```tsx
import { AuthGuard } from "@/components/auth/AuthGuard";

// Protect a specific route
<AuthGuard requiredRole="student" redirectTo="/auth/login">
  <StudentDashboard />
</AuthGuard>;
```

### Programmatic Route Protection

```tsx
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { requireAuth, requireRole } = useAuth();

  const handleSensitiveAction = () => {
    if (!requireAuth()) return; // Redirects if not authenticated

    if (!requireRole("admin")) return; // Redirects if not admin

    // Perform sensitive action
  };
}
```

## 🔐 Authentication Flow

### 1. Login Process

```tsx
import { useAuth } from "@/hooks/useAuth";

function LoginForm() {
  const { login, isLoading } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    try {
      const success = await login(email, password);
      if (success) {
        // User is now authenticated
        // Redirect will happen automatically
      }
    } catch (error) {
      // Handle login error
    }
  };
}
```

### 2. Logout Process

```tsx
import { useAuth } from "@/hooks/useAuth";

function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout(); // Clears tokens and redirects to login
  };
}
```

### 3. Token Management

Tokens are automatically managed by the system:

- **Storage**: Tokens are stored in localStorage
- **Refresh**: Expired tokens are automatically refreshed
- **Cleanup**: Tokens are cleared on logout or error

## 👥 Role-Based Access Control

### User Roles

- **student**: Basic user access
- **professor**: Teaching staff access
- **admin**: Administrative access

### Role Hierarchy

```
admin > professor > student
```

### Role Checking

```tsx
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { hasRole, hasAnyRole, hasAllRoles, isStudent, isProfessor, isAdmin } =
    useAuth();

  // Check specific role
  if (hasRole("admin")) {
    // Admin-only content
  }

  // Check multiple roles (any)
  if (hasAnyRole(["professor", "admin"])) {
    // Professor or admin content
  }

  // Check multiple roles (all)
  if (hasAllRoles(["professor", "admin"])) {
    // User must be both professor and admin (impossible in current system)
  }

  // Convenience methods
  if (isStudent()) {
    // Student content
  }

  if (isProfessor()) {
    // Professor content
  }

  if (isAdmin()) {
    // Admin content
  }
}
```

## 🚨 Error Handling

### Error Boundaries

```tsx
import { AuthErrorBoundary } from "@/components/auth/AuthErrorBoundary";

<AuthErrorBoundary>
  <YourAppContent />
</AuthErrorBoundary>;
```

### Error States

The system handles various error states:

- **Network errors**: Connection issues
- **Authentication errors**: Invalid credentials
- **Authorization errors**: Insufficient permissions
- **Token errors**: Expired or invalid tokens

### Error Recovery

- **Automatic retry**: Failed requests are retried with token refresh
- **Graceful degradation**: Errors are caught and displayed to users
- **Fallback UI**: Error boundaries provide fallback interfaces

## 🔄 Loading States

### Loading Indicators

```tsx
import { LoadingSpinner, PageLoader, InlineLoader } from '@/components/ui/loading-spinner';

// Page-level loading
<PageLoader text="Loading application..." />

// Inline loading
<InlineLoader text="Saving..." />

// Button loading
<Button disabled={isLoading}>
  {isLoading && <ButtonLoader />}
  Save
</Button>
```

### Loading States in Hooks

```tsx
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { isLoading, isInitialized } = useAuth();

  if (!isInitialized) {
    return <PageLoader text="Initializing..." />;
  }

  if (isLoading) {
    return <InlineLoader text="Loading..." />;
  }

  return <div>Content</div>;
}
```

## 🎨 UI Components

### Navigation

```tsx
import { AuthNavigation, MobileAuthNavigation } from '@/components/navigation/AuthNavigation';

// Desktop navigation
<AuthNavigation className="flex items-center space-x-4" />

// Mobile navigation
<MobileAuthNavigation
  isOpen={isMobileMenuOpen}
  onClose={() => setIsMobileMenuOpen(false)}
/>
```

### Loading Spinners

```tsx
import { LoadingSpinner } from "@/components/ui/loading-spinner";

<LoadingSpinner size="lg" text="Loading..." variant="primary" />;
```

## 🔧 Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### Route Configuration

Routes are configured in `RouteProtection.tsx`:

```tsx
const DEFAULT_ROUTES: RouteConfig[] = [
  // Public routes
  { path: "/", requireAuth: false },
  { path: "/auth/login", requireAuth: false },

  // Student routes
  { path: "/student", requireAuth: true, allowedRoles: ["student"] },

  // Professor routes
  { path: "/professor", requireAuth: true, allowedRoles: ["professor"] },

  // Admin routes
  { path: "/admin", requireAuth: true, allowedRoles: ["admin"] },
];
```

## 🧪 Testing

### Testing Authentication

```tsx
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "@/context/AuthContextSimple";
import { useAuth } from "@/hooks/useAuth";

function TestComponent() {
  const { isAuthenticated, user } = useAuth();
  return (
    <div>{isAuthenticated ? `Welcome ${user?.email}` : "Not logged in"}</div>
  );
}

test("shows login state", () => {
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );

  expect(screen.getByText("Not logged in")).toBeInTheDocument();
});
```

## 🚀 Best Practices

### 1. Always Use Hooks

```tsx
// ✅ Good
const { isAuthenticated, user } = useAuth();

// ❌ Bad
const user = localStorage.getItem("user_data");
```

### 2. Handle Loading States

```tsx
// ✅ Good
if (isLoading) return <LoadingSpinner />;

// ❌ Bad
// No loading state handling
```

### 3. Use Error Boundaries

```tsx
// ✅ Good
<AuthErrorBoundary>
  <YourAppContent />
</AuthErrorBoundary>

// ❌ Bad
// No error handling
```

### 4. Check Authentication Before Actions

```tsx
// ✅ Good
const handleSensitiveAction = () => {
  if (!requireAuth()) return;
  // Perform action
};

// ❌ Bad
const handleSensitiveAction = () => {
  // Perform action without checking auth
};
```

## 🔍 Troubleshooting

### Common Issues

1. **"useAuth must be used within an AuthProvider"**

   - Ensure your component is wrapped in `<AuthProvider>`

2. **Infinite redirects**

   - Check your route configuration
   - Ensure return URLs are valid

3. **Tokens not persisting**

   - Check localStorage is available
   - Verify token storage key

4. **Role checks failing**
   - Verify user object has role property
   - Check role values match expected strings

### Debug Mode

Enable debug logging:

```tsx
// In your component
const { user, isAuthenticated, getUserRole } = useAuth();

console.log("Auth Debug:", {
  user,
  isAuthenticated,
  role: getUserRole(),
  tokens: localStorage.getItem("auth_tokens"),
});
```

## 📚 Additional Resources

- [React Context API](https://reactjs.org/docs/context.html)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [TypeScript with React](https://react-typescript-cheatsheet.netlify.app/)
- [JWT Tokens](https://jwt.io/)

## 🤝 Contributing

When contributing to the authentication system:

1. **Maintain backward compatibility**
2. **Add TypeScript types for new features**
3. **Update this documentation**
4. **Add tests for new functionality**
5. **Follow the existing code patterns**

## 📝 Changelog

### v1.0.0

- Initial authentication system implementation
- Basic route protection
- Role-based access control
- Token management
- Error boundaries
- Loading states

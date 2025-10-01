# Frontend Authentication Architecture

## Table of Contents
- [Overview](#overview)
- [Architecture Components](#architecture-components)
- [Authentication Flow](#authentication-flow)
- [Token Management](#token-management)
- [Protected Routes](#protected-routes)
- [Role-Based Access Control](#role-based-access-control-rbac)
- [Security Considerations](#security-considerations)
- [Integration Guide](#integration-guide)
- [Adding New Routes](#adding-new-routes)
- [Testing Guide](#testing-guide)

---

## Overview

The Sauvini frontend implements a **robust, secure, and scalable authentication system** that integrates with a custom Rust backend.

### Key Features
- ✅ Automatic Token Management
- ✅ Automatic Token Refresh with request retry
- ✅ Role-Based Access Control (student, professor, admin)
- ✅ Protected Routes with declarative components
- ✅ SSR-Safe (Next.js compatible)
- ✅ Full TypeScript support
- ✅ Comprehensive error handling

### Technology Stack
- **Framework**: Next.js 15.4.5
- **Backend**: Custom Rust API
- **Authentication**: JWT
- **State Management**: React Context
- **Storage**: Memory + localStorage

---

## Architecture Components

```
src/
├── api/
│   ├── base.ts          # BaseApi: Token management & HTTP
│   ├── auth.ts          # AuthApi: Auth endpoints
│   └── index.ts
├── context/
│   └── AuthContext.tsx  # React Context for auth state
├── components/
│   └── auth/
│       └── ProtectedRoute.tsx
└── types/
    └── api.ts           # TypeScript types
```

### 1. BaseApi (`src/api/base.ts`)

**Core HTTP layer with automatic authentication**

**Key Methods**:
```typescript
// Token Management
static setTokens(tokens: TokenPair): void
static getTokens(): TokenPair | null
static clearTokens(): void
static isAuthenticated(): boolean

// HTTP Methods
protected static get<T>(url, config?): Promise<ApiResponse<T>>
protected static post<T>(url, data?, config?): Promise<ApiResponse<T>>
protected static put<T>(url, data?, config?): Promise<ApiResponse<T>>
protected static delete<T>(url, config?): Promise<ApiResponse<T>>

// Utility
static getCurrentUserRole(): UserRole | null
static hasRole(role: UserRole): boolean
```

**Token Refresh with Deduplication**:
```typescript
private static async refreshTokens(): Promise<TokenPair> {
  // Prevent multiple simultaneous refreshes
  if (this.refreshPromise) {
    return this.refreshPromise;
  }

  this.refreshPromise = this.performTokenRefresh(refreshToken)
    .finally(() => this.refreshPromise = null);

  return this.refreshPromise;
}
```

### 2. AuthApi (`src/api/auth.ts`)

**Authentication-specific endpoints**

```typescript
// Login (one per role)
static async loginStudent(credentials): Promise<ApiResponse<LoginResponse<Student>>>
static async loginProfessor(credentials): Promise<ApiResponse<LoginResponse<Professor>>>
static async loginAdmin(credentials): Promise<ApiResponse<LoginResponse<Admin>>>

// Registration
static async registerStudent(data, profilePicture?): Promise<ApiResponse<Student>>
static async registerProfessor(data, cvFile, profilePicture?): Promise<ApiResponse<Professor>>

// Token Management
static async refreshAuthTokens(refreshToken): Promise<ApiResponse<TokenPair>>
static async logout(): Promise<ApiResponse<null>>

// Email Verification
static async verifyStudentEmail(token): Promise<ApiResponse<null>>

// Admin Methods (Protected)
static async getAllProfessors(pagination?): Promise<ApiResponse<Professor[]>>
static async approveProfessor(data): Promise<ApiResponse<null>>
static async rejectProfessor(data): Promise<ApiResponse<null>>
```

### 3. AuthContext (`src/context/AuthContext.tsx`)

**React Context for auth state**

```typescript
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  loginStudent(email, password): Promise<Student>;
  loginProfessor(email, password): Promise<Professor>;
  loginAdmin(email, password): Promise<Admin>;
  logout(): Promise<void>;
  
  registerStudent(data, profilePicture?): Promise<Student>;
  registerProfessor(data, cvFile, profilePicture?): Promise<Professor>;
  
  getUserRole(): UserRole | null;
  hasRole(role): boolean;
  getUserFullName(): string | null;
  clearError(): void;
}
```

### 4. ProtectedRoute (`src/components/auth/ProtectedRoute.tsx`)

**Declarative route protection**

```typescript
// Basic
<ProtectedRoute><Dashboard /></ProtectedRoute>

// Role-specific
<ProtectedRoute requiredRole="admin"><AdminPanel /></ProtectedRoute>

// Convenience components
<StudentOnlyRoute><StudentDashboard /></StudentOnlyRoute>
<ProfessorOnlyRoute><ProfessorPanel /></ProfessorOnlyRoute>
<AdminOnlyRoute><AdminPanel /></AdminOnlyRoute>

// HOC
const Protected = withAuth(Component, { requiredRole: 'student' });
```

---

## Authentication Flow

### Complete Lifecycle

```
1. LOGIN
   └─> loginStudent(email, password)
       └─> POST /auth/student/login
           └─> Returns: { token: {access_token, refresh_token}, user: {...} }

2. STORE TOKENS
   └─> BaseApi.setTokens(tokens)
       ├─> Memory: this.authTokens = tokens
       └─> localStorage: 'sauvini_auth_tokens'

3. UPDATE STATE
   └─> AuthContext.setUser(user)

4. PROTECTED REQUEST
   └─> BaseApi.makeRequest()
       ├─> Check expiration
       ├─> Auto-refresh if needed
       └─> Add: Authorization: Bearer <token>

5. TOKEN EXPIRED (401)
   └─> handleUnauthorizedResponse()
       ├─> refreshTokens()
       │   └─> POST /auth/refresh
       └─> Retry original request

6. REFRESH FAILS
   └─> clearTokens() + redirectToLogin()

7. LOGOUT
   └─> POST /auth/logout
       └─> clearTokens()
       └─> setUser(null)
```

### Request Flow with Auto-Refresh

```
Request → Check Auth Required? → YES
    ↓
Get Tokens → Expired? → YES → refreshTokens()
    ↓                            ↓
   NO                      Get New Tokens
    ↓                            ↓
Add Authorization Header ←───────┘
    ↓
Make HTTP Request
    ↓
Response: 401? → YES → Retry with Refresh
    ↓
   NO → Return Data
```

---

## Token Management

### Storage Strategy

**Dual Storage**:
1. **Memory** (primary): Fast, cleared on reload
2. **localStorage** (backup): Persistent

```typescript
// Storage structure
{
  "sauvini_auth_tokens": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "expires_in": 3600,
    "token_type": "Bearer"
  }
}
```

### Expiration Handling

**30-Second Buffer**:
```typescript
static isTokenExpired(tokens: TokenPair): boolean {
  const payload = JSON.parse(atob(tokens.access_token.split('.')[1]));
  const buffer = 30; // seconds
  return Date.now() / 1000 >= (payload.exp - buffer);
}
```

**Why?** Prevents mid-request expiration and clock skew.

### Refresh Deduplication

**Problem**: Multiple concurrent 401s trigger multiple refreshes.

**Solution**: Single promise shared across all requests.

```typescript
private static refreshPromise: Promise<TokenPair> | null = null;

private static async refreshTokens(): Promise<TokenPair> {
  if (this.refreshPromise) return this.refreshPromise;
  
  this.refreshPromise = this.performTokenRefresh(token)
    .finally(() => this.refreshPromise = null);
  
  return this.refreshPromise;
}
```

---

## Protected Routes

### Basic Usage

```typescript
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Any authenticated user
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Specific role
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>

// Custom states
<ProtectedRoute
  fallback={<LoadingSpinner />}
  accessDenied={<CustomDenied />}
  loginRedirect="/auth/login"
>
  <Content />
</ProtectedRoute>
```

### Convenience Components

```typescript
<StudentOnlyRoute><StudentDashboard /></StudentOnlyRoute>
<ProfessorOnlyRoute><ProfessorPanel /></ProfessorOnlyRoute>
<AdminOnlyRoute><AdminPanel /></AdminOnlyRoute>
```

### HOC Pattern

```typescript
import { withAuth } from '@/components/auth/ProtectedRoute';

const ProtectedDashboard = withAuth(Dashboard, { requiredRole: 'student' });
```

### Conditional Rendering

```typescript
import { ConditionalAuthContent } from '@/components/auth/ProtectedRoute';

<ConditionalAuthContent requireAuth={true}>
  <LogoutButton />
</ConditionalAuthContent>

<ConditionalAuthContent requireAuth={false}>
  <LoginLink />
</ConditionalAuthContent>
```

---

## Role-Based Access Control (RBAC)

### Roles

| Role        | Description     | Capabilities                          |
|-------------|-----------------|---------------------------------------|
| `student`   | Students        | Access courses, submit work           |
| `professor` | Instructors     | Create courses, grade work            |
| `admin`     | Administrators  | Manage professors, system config      |

### Checking Roles

**In Components**:
```typescript
import { useAuth, useRole } from '@/context/AuthContext';

function MyComponent() {
  const { hasRole } = useAuth();
  const { role, isStudent, isProfessor, isAdmin } = useRole();
  
  return (
    <>
      {isAdmin && <AdminControls />}
      {isProfessor && <ProfessorTools />}
      {isStudent && <StudentContent />}
    </>
  );
}
```

**In API (static)**:
```typescript
import { BaseApi } from '@/api';

if (BaseApi.hasRole('admin')) {
  const data = await AuthApi.getAllProfessors();
}

const role = BaseApi.getCurrentUserRole();
```

### JWT Role Extraction

```typescript
// JWT payload
{
  "sub": "student:123",
  "email": "user@example.com",
  "role": "student",    // <-- Role here
  "exp": 1706749200
}

// Extracted via
BaseApi.getCurrentUserRole(); // Decodes JWT
```

---

## Security Considerations

### ✅ Best Practices

1. **Short-Lived Access Tokens** (15-60 min)
2. **Automatic Refresh** (seamless UX)
3. **30-Second Expiration Buffer**
4. **Single Refresh Promise** (no stampede)
5. **Secure Redirects** (stores intended destination)
6. **Client-Side Only** (SSR-safe)
7. **Automatic Cleanup**

### ⚠️ Risks & Mitigations

**localStorage XSS**:
- Risk: Vulnerable to XSS
- Mitigation: CSP, input sanitization, short-lived tokens

**HTTPS Required**:
- Always use HTTPS in production

**Refresh Token Security**:
- Current: localStorage
- Better: HTTP-only cookies
- Best: Token rotation

### 🔒 Production Enhancements

1. **HTTP-Only Cookies for Refresh Tokens**
2. **Content Security Policy**
3. **Token Rotation**
4. **Rate Limiting**

---

## Integration Guide

### 1. Wrap App

```typescript
// app/layout.tsx
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Create Login

```typescript
// app/auth/login/page.tsx
'use client';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { loginStudent, error } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginStudent(email, password);
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 3. Protect Routes

```typescript
// app/dashboard/page.tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
```

---

## Adding New Routes

### Example: Professor Email Verification

**Step 1: Add API Method**

```typescript
// src/api/auth.ts
export class AuthApi extends BaseApi {
  static async verifyProfessorEmail(token: string): Promise<ApiResponse<null>> {
    return this.get<null>(
      `/auth/professor/verify-email?token=${encodeURIComponent(token)}`,
      { requiresAuth: false }
    );
  }
}
```

**That's it!** BaseApi handles:
- ✅ Token attachment
- ✅ Token refresh
- ✅ Error handling
- ✅ Request retry

**Step 2: Use in Component**

```typescript
// app/auth/professor/verify/page.tsx
'use client';
import { AuthApi } from '@/api';

export default function VerifyPage() {
  useEffect(() => {
    const token = searchParams.get('token');
    AuthApi.verifyProfessorEmail(token)
      .then(response => {
        if (response.success) {
          setStatus('success');
        }
      });
  }, []);
  
  return <div>{status}</div>;
}
```

### Quick Reference

**Public Route**:
```typescript
static async myRoute(data): Promise<ApiResponse<Result>> {
  return this.post<Result>('/endpoint', data, { requiresAuth: false });
}
```

**Protected Route** (default):
```typescript
static async myRoute(data): Promise<ApiResponse<Result>> {
  return this.post<Result>('/endpoint', data);
}
```

**File Upload**:
```typescript
static async uploadFile(file, data): Promise<ApiResponse<Result>> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('data', JSON.stringify(data));
  return this.post<Result>('/endpoint', formData);
}
```

---

## Testing Guide

### Manual Testing

```typescript
import { BaseApi } from '@/api';

// Check auth
console.log(BaseApi.isAuthenticated());

// Get tokens
console.log(BaseApi.getTokens());

// Get role
console.log(BaseApi.getCurrentUserRole());

// Check role
console.log(BaseApi.hasRole('admin'));
```

### Logging

BaseApi includes comprehensive logs:
- 🌐 Request made
- 📡 Response received
- ✅ Success
- ❌ Error
- 🔐 Token refresh

---

## Troubleshooting

### Common Issues

**1. Infinite Redirect Loop**
```typescript
// Problem: Protected route redirects to login, which redirects back
// Solution: Exclude auth pages from redirect storage
if (!pathname.startsWith('/auth')) {
  sessionStorage.setItem('redirect_after_login', pathname);
}
```

**2. 401 After Token Refresh**
```typescript
// Problem: Refresh token expired
// Solution: Check token validity in backend, implement token rotation
```

**3. localStorage Not Available**
```typescript
// Problem: SSR tries to access localStorage
// Solution: All storage access wrapped in `typeof window !== 'undefined'`
```

**4. Multiple Refresh Calls**
```typescript
// Problem: Concurrent requests trigger multiple refreshes
// Solution: Already handled via refreshPromise deduplication
```

---

## Summary

The Sauvini authentication system provides:

✅ **Zero-configuration authentication** - Works out of the box
✅ **Automatic token management** - No manual intervention
✅ **Role-based access** - Declarative protection
✅ **Production-ready** - Secure defaults with enhancement paths
✅ **Developer-friendly** - Easy to extend and debug

For questions or issues, refer to the codebase or backend API documentation.

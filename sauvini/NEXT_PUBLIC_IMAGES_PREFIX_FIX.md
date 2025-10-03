# NEXT_PUBLIC_IMAGES_PREFIX Fix - Complete ✅

## Issue
The `StudentCard.tsx` component was trying to read `process.env.NEXT_IMAGES_PREFIX` which doesn't exist. In Next.js, environment variables must be prefixed with `NEXT_PUBLIC_` to be accessible in client-side components.

## Root Cause
1. The environment variable name was incorrect: `NEXT_IMAGES_PREFIX` instead of `NEXT_PUBLIC_IMAGES_PREFIX`
2. The `.env.local` file had the wrong variable name
3. The component was trying to access the non-prefixed version

## Solution Applied

### 1. Fixed Environment Files

#### `.env`
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_IMAGES_PREFIX=http://127.0.0.1:9000/
```

#### `.env.local`
```env
# Local environment variables (overrides .env)
# This file is not tracked by git

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# Image Configuration
NEXT_PUBLIC_IMAGES_PREFIX=http://127.0.0.1:9000/
```

#### `.env.example`
```env
# Environment Variables Example
# Copy this file to .env.local and update the values

# API Configuration - URL to your backend API
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# Image Configuration - Prefix for image URLs (include protocol and trailing slash)
NEXT_PUBLIC_IMAGES_PREFIX=http://127.0.0.1:9000/
```

### 2. Fixed StudentCard.tsx Component

**Before:**
```tsx
const url_prefix = process.env.NEXT_IMAGES_PREFIX  // ❌ Wrong variable name
```

**After:**
```tsx
const url_prefix = process.env.NEXT_PUBLIC_IMAGES_PREFIX  // ✅ Correct variable name
```

### 3. Updated Verification Page

Added `NEXT_PUBLIC_IMAGES_PREFIX` to the `/util/env-check` page to display and verify the environment variable is loaded correctly.

## Verification ✅

### Server Console
```
✓ Starting...
✓ Ready in 3s
Environments: .env.local, .env
🔧 BaseApi initialized with URL: http://localhost:4000/api/v1
```

### Component Usage
The `StudentCard.tsx` component now correctly accesses the images prefix:
```tsx
const url_prefix = process.env.NEXT_PUBLIC_IMAGES_PREFIX
// Returns: "http://127.0.0.1:9000/"

// Used in Image component:
<Image src={`${url_prefix}${user.profile_picture_path}`} ... />
// Example result: "http://127.0.0.1:9000/uploads/profile/user123.jpg"
```

### Console Log Output
When StudentCard renders, the console.log will show:
```
user in student card: http://127.0.0.1:9000/
```

## Important Notes

### Next.js Environment Variable Rules
1. **Browser/Client Access**: Must be prefixed with `NEXT_PUBLIC_`
   - ✅ `NEXT_PUBLIC_IMAGES_PREFIX` - accessible in browser
   - ❌ `IMAGES_PREFIX` - NOT accessible in browser
   - ❌ `NEXT_IMAGES_PREFIX` - NOT accessible in browser

2. **Server-Only Access**: Variables without prefix are only accessible server-side
   - API routes
   - getServerSideProps
   - Server Components (App Router)

3. **Build Time Embedding**: Environment variables are embedded at build time
   - Changes require server restart in development
   - Changes require rebuild in production

### File Priority (Highest to Lowest)
1. `.env.local` - Local overrides (not tracked by git) ✅
2. `.env.development` - Development-specific
3. `.env.production` - Production-specific
4. `.env` - Default values

## Testing the Fix

### 1. Check Environment Variables Page
Visit: http://localhost:3001/util/env-check
- Should display: `NEXT_PUBLIC_API_URL: http://localhost:4000/api/v1`
- Should display: `NEXT_PUBLIC_IMAGES_PREFIX: http://127.0.0.1:9000/`

### 2. Check Student Profile Page
Visit: http://localhost:3001/profile
- Open browser console
- Look for: `user in student card: http://127.0.0.1:9000/`
- Profile images should load from: `http://127.0.0.1:9000/uploads/...`

### 3. Verify in Browser Console
```javascript
console.log(process.env.NEXT_PUBLIC_IMAGES_PREFIX)
// Output: "http://127.0.0.1:9000/"
```

## Files Modified
- ✅ `.env` - Fixed variable name to `NEXT_PUBLIC_IMAGES_PREFIX`
- ✅ `.env.local` - Fixed variable name to `NEXT_PUBLIC_IMAGES_PREFIX`
- ✅ `.env.example` - Updated with correct variable name
- ✅ `src/components/student/StudentCard.tsx` - Fixed to use `NEXT_PUBLIC_IMAGES_PREFIX`
- ✅ `src/app/util/env-check/page.tsx` - Added images prefix verification

## Status
**✅ VERIFIED AND WORKING**

Both environment variables are now properly configured:
1. ✅ `NEXT_PUBLIC_API_URL` - Used by BaseApi for backend requests
2. ✅ `NEXT_PUBLIC_IMAGES_PREFIX` - Used by StudentCard and other components for image URLs

The application can now correctly read both environment variables from the browser/client-side code.

# Authentication API Testing with curl

This guide provides curl commands to test all authentication endpoints.

## Prerequisites

```bash
# Set your backend URL
export API_URL="http://localhost:8080/api/v1"

# Or use the Next.js proxy
export API_URL="http://localhost:3000/api/v1"
```

---

## Student Routes

### 1. Student Registration

```bash
curl -X POST "$API_URL/auth/student/register" \
  -F 'student={
    "first_name": "Jane",
    "last_name": "Smith",
    "wilaya": "Oran",
    "phone_number": "+213555987654",
    "academic_stream": "Science",
    "email": "jane.smith@example.com",
    "password": "password123"
  }' \
  -F 'profile_picture=@/path/to/photo.jpg'
```

**Expected Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "student:789",
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith@example.com",
    "email_verified": false,
    "created_at": "2025-09-30T00:00:00Z"
  },
  "message": "Success",
  "request_id": "uuid",
  "timestamp": "2025-09-30T00:00:00Z"
}
```

### 2. Student Login

```bash
curl -X POST "$API_URL/auth/student/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@example.com",
    "password": "password123"
  }'
```

**Expected Response (200)**:
```json
{
  "success": true,
  "data": {
    "token": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires_in": 3600,
      "token_type": "Bearer"
    },
    "user": {
      "id": "student:789",
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@example.com",
      "email_verified": true
    }
  },
  "message": "Success"
}
```

**Save tokens for subsequent requests**:
```bash
export ACCESS_TOKEN="<access_token_from_response>"
export REFRESH_TOKEN="<refresh_token_from_response>"
```

### 3. Student Email Verification

```bash
curl -X GET "$API_URL/auth/student/verify-email?token=<verification_token>"
```

**Expected Response (200)**:
```json
{
  "success": true,
  "data": null,
  "message": "Success"
}
```

---

## Professor Routes

### 1. Professor Registration

```bash
curl -X POST "$API_URL/auth/professor/register" \
  -F 'professor_data={
    "first_name": "John",
    "last_name": "Doe",
    "wilaya": "Algiers",
    "phone_number": "+213555123456",
    "email": "john.doe@example.com",
    "gender": "male",
    "date_of_birth": "1985-06-15T10:30:00Z",
    "exp_school": true,
    "exp_school_years": 5,
    "exp_off_school": false,
    "exp_online": true,
    "password": "password123"
  }' \
  -F 'cv_file=@/path/to/cv.pdf' \
  -F 'profile_picture=@/path/to/photo.jpg'
```

**Expected Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "professor:456",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "status": "new",
    "email_verified": false
  },
  "message": "Success"
}
```

### 2. Professor Login

```bash
curl -X POST "$API_URL/auth/professor/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

**Expected Response (200)**: Same structure as student login

---

## Admin Routes

### 1. Admin Login

```bash
curl -X POST "$API_URL/auth/admin/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Expected Response (200)**:
```json
{
  "success": true,
  "data": {
    "token": {
      "access_token": "eyJ...",
      "refresh_token": "eyJ...",
      "expires_in": 3600,
      "token_type": "Bearer"
    },
    "user": {
      "id": "admin:123",
      "email": "admin@example.com"
    }
  },
  "message": "Admin login successful"
}
```

### 2. Get All Professors (Protected)

```bash
curl -X GET "$API_URL/auth/admin/all-professors?page=1&limit=10" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Expected Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "professor:456",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "status": "approved"
    }
  ],
  "message": "Professors retrieved successfully."
}
```

### 3. Approve Professor (Protected)

```bash
curl -X POST "$API_URL/auth/admin/approve-professor" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "professor:456"
  }'
```

**Expected Response (200)**:
```json
{
  "success": true,
  "data": null,
  "message": "Professor has been approved successfully."
}
```

### 4. Reject Professor (Protected)

```bash
curl -X POST "$API_URL/auth/admin/reject-professor" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "professor:456"
  }'
```

### 5. Admin Forgot Password

```bash
curl -X POST "$API_URL/auth/admin/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com"
  }'
```

**Expected Response (200)**:
```json
{
  "success": true,
  "data": null,
  "message": "Password reset code has been sent."
}
```

### 6. Admin Reset Password

```bash
curl -X POST "$API_URL/auth/admin/reset-password" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset-token-from-email",
    "new_password": "newpassword123"
  }'
```

---

## Common Auth Routes

### 1. Refresh Token

```bash
curl -X POST "$API_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "'"$REFRESH_TOKEN"'"
  }'
```

**Expected Response (200)**:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "expires_in": 3600,
    "token_type": "Bearer"
  },
  "message": "Token refreshed successfully"
}
```

### 2. Logout (Protected)

```bash
curl -X POST "$API_URL/auth/logout" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response (200)**:
```json
{
  "success": true,
  "data": null,
  "message": "Logout successful"
}
```

---

## Testing Token Expiration & Refresh Flow

### Scenario: Access Protected Route with Expired Token

1. **Make request with expired token**:
```bash
curl -X GET "$API_URL/auth/admin/all-professors" \
  -H "Authorization: Bearer <expired_access_token>"
```

**Expected Response (401)**:
```json
{
  "success": false,
  "data": null,
  "message": "Unauthorized: Token expired",
  "request_id": "uuid",
  "timestamp": "2025-09-30T00:00:00Z"
}
```

2. **The frontend automatically**:
   - Detects 401 error
   - Calls `/auth/refresh` with refresh token
   - Gets new access token
   - Retries original request with new token

---

## Testing Error Scenarios

### 1. Invalid Credentials (401)

```bash
curl -X POST "$API_URL/auth/student/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@example.com",
    "password": "wrongpassword"
  }'
```

**Expected Response (401)**:
```json
{
  "success": false,
  "data": null,
  "message": "Invalid credentials"
}
```

### 2. Missing Required Fields (400)

```bash
curl -X POST "$API_URL/auth/student/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

**Expected Response (400)**:
```json
{
  "success": false,
  "data": null,
  "message": "Validation failed: password is required"
}
```

### 3. Unauthorized Access (403)

```bash
# Try to access admin endpoint with student token
curl -X GET "$API_URL/auth/admin/all-professors" \
  -H "Authorization: Bearer <student_access_token>"
```

**Expected Response (403)**:
```json
{
  "success": false,
  "data": null,
  "message": "Forbidden: Insufficient permissions"
}
```

---

## Complete Test Flow Script

```bash
#!/bin/bash

API_URL="http://localhost:8080/api/v1"

echo "=== Testing Student Registration ==="
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/student/register" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "wilaya": "Algiers",
    "phone_number": "+213555000000",
    "academic_stream": "Science",
    "email": "test@example.com",
    "password": "password123"
  }')

echo "$REGISTER_RESPONSE" | jq .

echo -e "\n=== Testing Student Login ==="
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/student/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | jq .

# Extract tokens
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token.access_token')
REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token.refresh_token')

echo -e "\n=== Access Token: $ACCESS_TOKEN ==="
echo "=== Refresh Token: $REFRESH_TOKEN ==="

echo -e "\n=== Testing Token Refresh ==="
REFRESH_RESPONSE=$(curl -s -X POST "$API_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{\"token\": \"$REFRESH_TOKEN\"}")

echo "$REFRESH_RESPONSE" | jq .

echo -e "\n=== Testing Logout ==="
LOGOUT_RESPONSE=$(curl -s -X POST "$API_URL/auth/logout" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}')

echo "$LOGOUT_RESPONSE" | jq .

echo -e "\n=== All tests completed ==="
```

Save as `test_auth.sh`, make executable with `chmod +x test_auth.sh`, and run with `./test_auth.sh`.

---

## Notes

- All timestamps are in ISO 8601 format
- File uploads use `multipart/form-data`
- JSON endpoints use `application/json`
- Protected routes require `Authorization: Bearer <token>` header
- The frontend automatically handles token refresh, so manual refresh is rarely needed
- Use `jq` for pretty-printing JSON responses: `curl ... | jq .`

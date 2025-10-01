# Student API Documentation

This document provides comprehensive documentation for all student-related API endpoints in the Sauviny Backend system. All endpoints use JSON for request and response data unless otherwise specified.

## Base URL

```
Development: http://localhost:4000
Production: https://sauvinibackend-production.up.railway.app
```

All student endpoints are prefixed with `/api/v1/auth/student/`

## Common Response Format

All API responses follow a standardized format:

```json
{
  "success": boolean,
  "data": object | null,
  "message": string,
  "request_id": string,
  "timestamp": string (ISO 8601 format),
  "duration_ms": number (optional)
}
```

### Response Status Codes

- `200 OK` - Request successful
- `400 Bad Request` - Invalid request data or validation errors
- `401 Unauthorized` - Authentication required or invalid credentials
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists (e.g., email already registered)
- `500 Internal Server Error` - Server error

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. After successful login, you'll receive an access token and refresh token.

### Token Structure

```json
{
  "access_token": "string",
  "refresh_token": "string",
  "expires_in": number,
  "token_type": "Bearer"
}
```

For protected endpoints, include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Student Data Model

The Student entity contains the following fields:

```json
{
  "id": "string (optional - RecordId)",
  "first_name": "string",
  "last_name": "string",
  "wilaya": "string",
  "phone_number": "string",
  "academic_stream": "string",
  "email": "string",
  "profile_picture_path": "string (optional)",
  "email_verified": "boolean",
  "created_at": "string (ISO 8601 format, optional)",
  "updated_at": "string (ISO 8601 format, optional)"
}
```

**Note:** The password field is never returned in API responses for security reasons.

## API Endpoints

### 1. Student Registration

Register a new student account with optional profile picture upload.

**Endpoint:** `POST /api/v1/auth/student/register`

**Content-Type:** `multipart/form-data`

**Request Parameters:**

This endpoint uses multipart form data to support file uploads:

1. **student** (required) - JSON string containing student data
2. **profile_picture** (optional) - Image file for profile picture

**Student JSON Structure:**
```json
{
  "first_name": "string (required)",
  "last_name": "string (required)", 
  "wilaya": "string (required)",
  "phone_number": "string (required)",
  "academic_stream": "string (required)",
  "email": "string (required, valid email format)",
  "password": "string (required, minimum 8 characters)"
}
```

**Validation Rules:**
- `email`: Must be a valid email format
- `password`: Minimum 8 characters long
- All string fields are required and cannot be empty
- `profile_picture`: Must be a valid image file (if provided)

**Example Request:**
```http
POST /api/v1/auth/student/register
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="student"
Content-Type: application/json

{
    "first_name": "Yasmine",
    "last_name": "Zitouni",
    "wilaya": "Constantine",
    "phone_number": "+213777890123",
    "email": "yasmine.zitouni@example.com",
    "academic_stream": "Computer Science",
    "password": "securePassword123"
}
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="profile_picture"; filename="profile.jpg"
Content-Type: image/jpeg

[Binary image data]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "student:ulid_generated_id",
    "first_name": "Yasmine",
    "last_name": "Zitouni",
    "wilaya": "Constantine", 
    "phone_number": "+213777890123",
    "academic_stream": "Computer Science",
    "email": "yasmine.zitouni@example.com",
    "profile_picture_path": "profile-pictures/profile-picture/uuid.jpg",
    "email_verified": false,
    "created_at": "2025-09-30T10:30:00Z",
    "updated_at": "2025-09-30T10:30:00Z"
  },
  "message": "Success",
  "request_id": "uuid-request-id",
  "timestamp": "2025-09-30T10:30:00Z"
}
```

**Error Responses:**

- **400 Bad Request** - Validation errors:
```json
{
  "success": false,
  "data": null,
  "message": "Invalid email format",
  "request_id": "uuid-request-id",
  "timestamp": "2025-09-30T10:30:00Z"
}
```

- **409 Conflict** - Email already exists:
```json
{
  "success": false,
  "data": null,
  "message": "Email already registered",
  "request_id": "uuid-request-id", 
  "timestamp": "2025-09-30T10:30:00Z"
}
```

---

### 2. Student Login

Authenticate a student and receive access tokens.

**Endpoint:** `POST /api/v1/auth/student/login`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "email": "string (required, valid email format)",
  "password": "string (required, minimum 8 characters)"
}
```

**Validation Rules:**
- `email`: Must be a valid email format
- `password`: Minimum 8 characters long

**Example Request:**
```http
POST /api/v1/auth/student/login
Content-Type: application/json

{
    "email": "yasmine.zitouni@example.com",
    "password": "securePassword123"
}
```

**Success Response (200 OK):**
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
      "id": "student:ulid_generated_id",
      "first_name": "Yasmine",
      "last_name": "Zitouni",
      "wilaya": "Constantine",
      "phone_number": "+213777890123", 
      "academic_stream": "Computer Science",
      "email": "yasmine.zitouni@example.com",
      "profile_picture_path": "profile-pictures/profile-picture/uuid.jpg",
      "email_verified": false,
      "created_at": "2025-09-30T10:30:00Z",
      "updated_at": "2025-09-30T10:30:00Z"
    }
  },
  "message": "Success",
  "request_id": "uuid-request-id",
  "timestamp": "2025-09-30T10:30:00Z"
}
```

**Error Responses:**

- **400 Bad Request** - Invalid credentials:
```json
{
  "success": false,
  "data": null,
  "message": "Invalid email or password",
  "request_id": "uuid-request-id",
  "timestamp": "2025-09-30T10:30:00Z"
}
```

- **400 Bad Request** - Validation error:
```json
{
  "success": false,
  "data": null,
  "message": "Password must be at least 8 characters long",
  "request_id": "uuid-request-id",
  "timestamp": "2025-09-30T10:30:00Z"
}
```

---

### 3. Send Verification Email

Send an email verification link to the student's email address.

**Endpoint:** `POST /api/v1/auth/student/send-verification-email`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "email": "string (required, valid email format)"
}
```

**Validation Rules:**
- `email`: Must be a valid email format

**Example Request:**
```http
POST /api/v1/auth/student/send-verification-email
Content-Type: application/json

{
    "email": "yasmine.zitouni@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Success",
  "request_id": "uuid-request-id",
  "timestamp": "2025-09-30T10:30:00Z"
}
```

**Error Responses:**

- **400 Bad Request** - Invalid email:
```json
{
  "success": false,
  "data": null,
  "message": "Invalid email format",
  "request_id": "uuid-request-id",
  "timestamp": "2025-09-30T10:30:00Z"
}
```

- **404 Not Found** - Email not registered:
```json
{
  "success": false,
  "data": null,
  "message": "Email not found",
  "request_id": "uuid-request-id",
  "timestamp": "2025-09-30T10:30:00Z"
}
```

---

### 4. Verify Email

Confirm email verification using the token sent via email.

**Endpoint:** `GET /api/v1/auth/student/verify-email`

**Query Parameters:**
- `token` (required): The verification token received via email

**Example Request:**
```http
GET /api/v1/auth/student/verify-email?token=1b6f1672-e542-406f-a6dc-57d620c53644
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Success",
  "request_id": "uuid-request-id",
  "timestamp": "2025-09-30T10:30:00Z"
}
```

**Error Responses:**

- **400 Bad Request** - Missing token:
```json
{
  "success": false,
  "data": null,
  "message": "Missing token",
  "request_id": "uuid-request-id",  
  "timestamp": "2025-09-30T10:30:00Z"
}
```

- **400 Bad Request** - Invalid or expired token:
```json
{
  "success": false,
  "data": null,
  "message": "Invalid or expired verification token",
  "request_id": "uuid-request-id",
  "timestamp": "2025-09-30T10:30:00Z"
}
```

---

### 5. Send Forgot Password Email

Send a password reset link to the student's email address.

**Endpoint:** `POST /api/v1/auth/student/forgot-password`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "email": "string (required, valid email format)"
}
```

**Validation Rules:**
- `email`: Must be a valid email format

**Example Request:**
```http
POST /api/v1/auth/student/forgot-password
Content-Type: application/json

{
    "email": "yasmine.zitouni@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Success",
  "request_id": "uuid-request-id",
  "timestamp": "2025-09-30T10:30:00Z" 
}
```

**Error Responses:**

- **400 Bad Request** - Invalid email:
```json
{
  "success": false,
  "data": null,
  "message": "Invalid email format",
  "request_id": "uuid-request-id",
  "timestamp": "2025-09-30T10:30:00Z"
}
```

- **404 Not Found** - Email not registered:
```json
{
  "success": false,
  "data": null,
  "message": "Email not found",
  "request_id": "uuid-request-id",
  "timestamp": "2025-09-30T10:30:00Z"
}
```

---

### 6. Reset Password

Reset the student's password using the token sent via email.

**Endpoint:** `POST /api/v1/auth/student/reset-password`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "token": "string (required, cannot be empty)",
  "new_password": "string (required, minimum 8 characters)"
}
```

**Validation Rules:**
- `token`: Cannot be empty
- `new_password`: Minimum 8 characters long

**Example Request:**
```http
POST /api/v1/auth/student/reset-password
Content-Type: application/json

{
    "token": "33ac8943-fd28-4459-97c0-52abbd81bf97",
    "new_password": "newSecurePassword123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Success",
  "request_id": "uuid-request-id",
  "timestamp": "2025-09-30T10:30:00Z"
}
```

**Error Responses:**

- **400 Bad Request** - Validation error:
```json
{
  "success": false,
  "data": null,
  "message": "Password must be at least 8 characters long",
  "request_id": "uuid-request-id",
  "timestamp": "2025-09-30T10:30:00Z"
}
```

- **400 Bad Request** - Invalid or expired token:
```json
{
  "success": false,
  "data": null,
  "message": "Invalid or expired reset token",
  "request_id": "uuid-request-id",
  "timestamp": "2025-09-30T10:30:00Z"
}
```

## JWT Token Details

### Access Token Claims

The JWT access token contains the following claims:

```json
{
  "sub": "student:user_id",
  "email": "user@example.com",
  "role": "student",
  "iat": 1727691000,
  "exp": 1727694600,
  "token_type": "access",
  "jti": "unique-token-id"
}
```

### Token Expiration

- **Access Token**: 60 minutes (configurable)
- **Refresh Token**: 7 days (configurable)

## Error Handling

### Common Error Types

1. **Validation Errors**: Occur when request data doesn't meet validation requirements
2. **Authentication Errors**: Invalid credentials or missing authentication
3. **Authorization Errors**: Insufficient permissions for the requested resource
4. **Not Found Errors**: Requested resource doesn't exist
5. **Conflict Errors**: Resource already exists (e.g., duplicate email)
6. **Server Errors**: Internal server issues

### Error Response Format

All error responses follow the standard format:

```json
{
  "success": false,
  "data": null,
  "message": "Detailed error message",
  "request_id": "uuid-request-id",
  "timestamp": "2025-09-30T10:30:00Z"
}
```

## Security Considerations

1. **Password Security**: Passwords are hashed using secure algorithms before storage
2. **JWT Security**: Tokens are signed and validated to prevent tampering
3. **Email Verification**: Email verification is required for account activation
4. **Rate Limiting**: Consider implementing rate limiting for authentication endpoints
5. **HTTPS**: Always use HTTPS in production environments
6. **Token Storage**: Store tokens securely on the client side

## File Upload Guidelines

### Profile Picture Upload

- **Supported Formats**: JPEG, PNG, GIF
- **Maximum Size**: 5MB (configurable)
- **Storage**: MinIO object storage
- **Path Format**: `profile-pictures/profile-picture/{uuid}.{extension}`
- **Access**: Files are accessible via the configured MinIO endpoint

### Upload Process

1. Client sends multipart form data with student JSON and optional profile picture
2. Server validates the student data
3. If profile picture is provided, it's uploaded to MinIO storage
4. Student record is created with profile picture path (if applicable)
5. Success response includes the student data with profile picture path

## Integration Examples

### JavaScript/TypeScript Example

```typescript
// Student Registration
const registerStudent = async (studentData: any, profilePicture?: File) => {
  const formData = new FormData();
  formData.append('student', JSON.stringify(studentData));
  
  if (profilePicture) {
    formData.append('profile_picture', profilePicture);
  }
  
  const response = await fetch('/api/v1/auth/student/register', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};

// Student Login
const loginStudent = async (email: string, password: string) => {
  const response = await fetch('/api/v1/auth/student/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  return response.json();
};
```

### cURL Examples

```bash
# Registration with profile picture
curl -X POST http://localhost:4000/api/v1/auth/student/register \
  -F 'student={"first_name":"John","last_name":"Doe","wilaya":"Algiers","phone_number":"+213777123456","academic_stream":"Computer Science","email":"john.doe@example.com","password":"securepass123"}' \
  -F 'profile_picture=@/path/to/profile.jpg'

# Login
curl -X POST http://localhost:4000/api/v1/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"securepass123"}'

# Send verification email
curl -X POST http://localhost:4000/api/v1/auth/student/send-verification-email \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com"}'
```

## Changelog

### Version 1.0.0
- Initial release of student authentication API
- Support for registration, login, email verification, and password reset
- JWT-based authentication system
- Profile picture upload functionality
- Comprehensive error handling and validation

---

*This documentation is automatically generated and kept up-to-date with the latest API changes. For questions or issues, please contact the development team.*
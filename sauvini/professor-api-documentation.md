# Professor API Documentation

This document provides comprehensive documentation for all professor-related API endpoints in the Sauviny Backend system. All endpoints use JSON for request and response data unless otherwise specified.

## Base URL

```
Development: http://localhost:4000
Production: https://sauvinibackend-production.up.railway.app
```

All professor endpoints are prefixed with `/api/v1/auth/professor/`

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

## Professor Data Model

The Professor entity contains the following fields:

```json
{
  "id": "string (optional - RecordId)",
  "first_name": "string",
  "last_name": "string",
  "wilaya": "string",
  "phone_number": "string",
  "email": "string",
  "gender": "string",
  "date_of_birth": "string (ISO 8601 format)",
  "exp_school": "boolean",
  "exp_school_years": "number (optional)",
  "exp_off_school": "boolean",
  "exp_online": "boolean",
  "cv_path": "string",
  "profile_picture_path": "string (optional)", 
  "email_verified": "boolean",
  "status": "string",
  "created_at": "string (ISO 8601 format, optional)",
  "updated_at": "string (ISO 8601 format, optional)"
}
```

**Note:** The password field is never returned in API responses for security reasons.

### Professor Status Values

- `new` - Newly registered professor (default)
- `approved` - Professor approved by admin
- `rejected` - Professor rejected by admin
- `suspended` - Professor account suspended

## API Endpoints

### 1. Professor Registration

Register a new professor account with required CV upload and optional profile picture.

**Endpoint:** `POST /api/v1/auth/professor/register`

**Content-Type:** `multipart/form-data`

**Request Parameters:**

This endpoint uses multipart form data to support file uploads:

1. **professor_data** (required) - JSON string containing professor data
2. **cv_file** (required) - PDF file containing the professor's CV
3. **profile_picture** (optional) - Image file for profile picture

**Professor Data JSON Structure:**
```json
{
  "first_name": "string (required)",
  "last_name": "string (required)",
  "wilaya": "string (required)",
  "phone_number": "string (required)",
  "email": "string (required, valid email format)",
  "gender": "string (required)",
  "date_of_birth": "string (required, ISO 8601 format)",
  "exp_school": "boolean (required)",
  "exp_school_years": "number (optional - required if exp_school is true)",
  "exp_off_school": "boolean (required)",
  "exp_online": "boolean (required)",
  "password": "string (required, minimum 8 characters)"
}
```

**Validation Rules:**
- `email`: Must be a valid email format
- `password`: Minimum 8 characters long
- `date_of_birth`: Must be a valid ISO 8601 date format
- `exp_school_years`: Required if `exp_school` is true
- `cv_file`: Must be a valid PDF file
- `profile_picture`: Must be a valid image file (if provided)
- All required string fields cannot be empty

**Example Request:**
```http
POST /api/v1/auth/professor/register
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="professor_data"
Content-Type: application/json

{
    "first_name": "Ahmed",
    "last_name": "Benali",
    "wilaya": "Algiers",
    "phone_number": "+213555123456",
    "email": "ahmed.benali@example.com",
    "gender": "male",
    "date_of_birth": "1985-05-15T00:00:00Z",
    "exp_school": true,
    "exp_school_years": 8,
    "exp_off_school": false,
    "exp_online": true,
    "password": "securePassword123"
}
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="cv_file"; filename="ahmed_benali_cv.pdf"
Content-Type: application/pdf

[Binary PDF data]
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="profile_picture"; filename="ahmed_benali.jpg"
Content-Type: image/jpeg

[Binary image data]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "professor:ulid_generated_id",
    "first_name": "Ahmed",
    "last_name": "Benali",
    "wilaya": "Algiers",
    "phone_number": "+213555123456",
    "email": "ahmed.benali@example.com",
    "gender": "male",
    "date_of_birth": "1985-05-15T00:00:00Z",
    "exp_school": true,
    "exp_school_years": 8,
    "exp_off_school": false,
    "exp_online": true,
    "cv_path": "professors/cv/uuid_ahmed.benali_at_example.com.pdf",
    "profile_picture_path": "professors/profile-pictures/uuid_ahmed.benali_at_example.com.jpg",
    "email_verified": false,
    "status": "new",
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

- **400 Bad Request** - Missing required files:
```json
{
  "success": false,
  "data": null,
  "message": "Professor data is required",
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

- **500 Internal Server Error** - File upload failure:
```json
{
  "success": false,
  "data": null,
  "message": "Failed to upload CV file",
  "request_id": "uuid-request-id",
  "timestamp": "2025-09-30T10:30:00Z"
}
```

---

### 2. Professor Login

Authenticate a professor and receive access tokens.

**Endpoint:** `POST /api/v1/auth/professor/login`

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
POST /api/v1/auth/professor/login
Content-Type: application/json

{
    "email": "ahmed.benali@example.com",
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
      "id": "professor:ulid_generated_id",
      "first_name": "Ahmed",
      "last_name": "Benali",
      "wilaya": "Algiers",
      "phone_number": "+213555123456",
      "email": "ahmed.benali@example.com",
      "gender": "male",
      "date_of_birth": "1985-05-15T00:00:00Z",
      "exp_school": true,
      "exp_school_years": 8,
      "exp_off_school": false,
      "exp_online": true,
      "cv_path": "professors/cv/uuid_ahmed.benali_at_example.com.pdf",
      "profile_picture_path": "professors/profile-pictures/uuid_ahmed.benali_at_example.com.jpg",
      "email_verified": false,
      "status": "new",
      "created_at": "2025-09-30T10:30:00Z",
      "updated_at": "2025-09-30T10:30:00Z"
    }
  },
  "message": "Professor login successful",
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

Send an email verification link to the professor's email address.

**Endpoint:** `POST /api/v1/auth/professor/send-verification-email`

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
POST /api/v1/auth/professor/send-verification-email
Content-Type: application/json

{
    "email": "ahmed.benali@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Verification email sent successfully",
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

**Endpoint:** `GET /api/v1/auth/professor/verify-email`

**Query Parameters:**
- `token` (required): The verification token received via email

**Example Request:**
```http
GET /api/v1/auth/professor/verify-email?token=6a97874c-ca02-4ff0-9bfb-732a13ec1af5
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Email verified successfully",
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
  "message": "Token query parameter is required",
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

Send a password reset link to the professor's email address.

**Endpoint:** `POST /api/v1/auth/professor/forgot-password`

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
POST /api/v1/auth/professor/forgot-password
Content-Type: application/json

{
    "email": "ahmed.benali@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Forget password email sent successfully",
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

Reset the professor's password using the token sent via email.

**Endpoint:** `POST /api/v1/auth/professor/reset-password`

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
POST /api/v1/auth/professor/reset-password
Content-Type: application/json

{
    "token": "852132ce-484f-4e87-a684-17f25abcafb8",
    "new_password": "newSecurePassword123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Password reset successfully",
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
  "sub": "professor:user_id",
  "email": "user@example.com",
  "role": "professor",
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
7. **File Upload Errors**: Issues with CV or profile picture uploads

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
4. **Admin Approval**: Professor accounts require admin approval before activation
5. **File Security**: CV and profile picture files are stored securely in MinIO
6. **Rate Limiting**: Consider implementing rate limiting for authentication endpoints
7. **HTTPS**: Always use HTTPS in production environments
8. **Token Storage**: Store tokens securely on the client side

## File Upload Guidelines

### CV Upload (Required)

- **Supported Formats**: PDF only
- **Maximum Size**: 10MB (configurable)
- **Storage**: MinIO object storage in "professors" bucket
- **Path Format**: `professors/cv/{uuid}_{email_safe}.pdf`
- **Access**: Files are accessible via the configured MinIO endpoint

### Profile Picture Upload (Optional)

- **Supported Formats**: JPEG, PNG, GIF, WebP
- **Maximum Size**: 5MB (configurable)
- **Storage**: MinIO object storage in "profile-pictures" bucket
- **Path Format**: `professors/profile-pictures/{uuid}_{email_safe}.{extension}`
- **Access**: Files are accessible via the configured MinIO endpoint

### Upload Process

1. Client sends multipart form data with professor JSON, CV file, and optional profile picture
2. Server validates the professor data
3. CV file is uploaded to MinIO storage (required)
4. Profile picture is uploaded to MinIO storage (if provided)
5. Professor record is created with file paths
6. Success response includes the professor data with file paths

## Professor Account Lifecycle

### Registration Flow

1. **Initial Registration**: Professor submits registration form with CV
2. **Email Verification**: Professor verifies their email address
3. **Admin Review**: Admin reviews the professor's application and CV
4. **Approval/Rejection**: Admin approves or rejects the professor
5. **Account Activation**: Approved professors can access the platform

### Status Transitions

- `new` → `approved` (Admin approves)
- `new` → `rejected` (Admin rejects)
- `approved` → `suspended` (Admin suspends)
- `suspended` → `approved` (Admin reactivates)

## Integration Examples

### JavaScript/TypeScript Example

```typescript
// Professor Registration
const registerProfessor = async (professorData: any, cvFile: File, profilePicture?: File) => {
  const formData = new FormData();
  formData.append('professor_data', JSON.stringify(professorData));
  formData.append('cv_file', cvFile);
  
  if (profilePicture) {
    formData.append('profile_picture', profilePicture);
  }
  
  const response = await fetch('/api/v1/auth/professor/register', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};

// Professor Login
const loginProfessor = async (email: string, password: string) => {
  const response = await fetch('/api/v1/auth/professor/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  return response.json();
};

// Send Verification Email
const sendVerificationEmail = async (email: string) => {
  const response = await fetch('/api/v1/auth/professor/send-verification-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });
  
  return response.json();
};
```

### cURL Examples

```bash
# Registration with CV and profile picture
curl -X POST http://localhost:4000/api/v1/auth/professor/register \
  -F 'professor_data={"first_name":"Ahmed","last_name":"Benali","wilaya":"Algiers","phone_number":"+213555123456","email":"ahmed.benali@example.com","gender":"male","date_of_birth":"1985-05-15T00:00:00Z","exp_school":true,"exp_school_years":8,"exp_off_school":false,"exp_online":true,"password":"securePassword123"}' \
  -F 'cv_file=@/path/to/cv.pdf' \
  -F 'profile_picture=@/path/to/profile.jpg'

# Login
curl -X POST http://localhost:4000/api/v1/auth/professor/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ahmed.benali@example.com","password":"securePassword123"}'

# Send verification email
curl -X POST http://localhost:4000/api/v1/auth/professor/send-verification-email \
  -H "Content-Type: application/json" \
  -d '{"email":"ahmed.benali@example.com"}'

# Verify email
curl -X GET "http://localhost:4000/api/v1/auth/professor/verify-email?token=6a97874c-ca02-4ff0-9bfb-732a13ec1af5"

# Forgot password
curl -X POST http://localhost:4000/api/v1/auth/professor/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"ahmed.benali@example.com"}'

# Reset password
curl -X POST http://localhost:4000/api/v1/auth/professor/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"852132ce-484f-4e87-a684-17f25abcafb8","new_password":"newSecurePassword123"}'
```

## Differences from Student API

### Key Differences

1. **CV Upload**: Professors must upload a CV (PDF) during registration
2. **Additional Fields**: Professors have more profile fields (gender, date_of_birth, experience fields)
3. **Admin Approval**: Professor accounts require admin approval after registration
4. **Status Management**: Professors have status fields for approval workflow
5. **Experience Tracking**: Fields to track school, off-school, and online teaching experience

### Additional Validation

- CV file upload is mandatory for professor registration
- Date of birth must be a valid ISO 8601 date
- Experience years validation based on school experience boolean
- Gender field validation
- Status field management through admin approval process

## Changelog

### Version 1.0.0
- Initial release of professor authentication API
- Support for registration with CV and profile picture upload
- Email verification and password reset functionality
- JWT-based authentication system
- Admin approval workflow integration
- Comprehensive error handling and validation
- Experience tracking and status management

---

*This documentation is automatically generated and kept up-to-date with the latest API changes. For questions or issues, please contact the development team.*
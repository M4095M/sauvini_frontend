# API Documentation

This document provides comprehensive documentation for all API endpoints in the Sauviny Backend application.

## Table of Contents

- [Authentication](#authentication)
  - [Admin Authentication](#admin-authentication)
  - [Professor Authentication](#professor-authentication)
  - [Student Authentication](#student-authentication)
- [Module Management](#module-management)
  - [Public Module Endpoints](#public-module-endpoints)
  - [Protected Module Endpoints](#protected-module-endpoints)

---

## Base URL

All endpoints are relative to your server's base URL (e.g., `http://localhost:8000`).

---

## Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

---

## Authentication

Authentication is handled using JWT tokens. Protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Admin Authentication

### 1. Admin Login

**Endpoint:** `POST /auth/admin/login`

**Authentication Required:** No

**Description:** Authenticates an admin user and returns JWT tokens.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Must be a valid email address
- `password`: Minimum 8 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "token": {
      "access_token": "eyJhbGciOiJIUzI1NiIs...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
    },
    "user": {
      "id": "admin:12345",
      "email": "admin@example.com",
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "data": null
}
```

---

### 2. Admin Forgot Password

**Endpoint:** `POST /auth/admin/forgot-password`

**Authentication Required:** No

**Description:** Sends a password reset token to the admin's email.

**Request Body:**
```json
{
  "email": "admin@example.com"
}
```

**Validation Rules:**
- `email`: Must be a valid email address

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset code has been sent.",
  "data": null
}
```

---

### 3. Admin Reset Password

**Endpoint:** `POST /auth/admin/reset-password`

**Authentication Required:** No

**Description:** Resets admin password using the token received via email.

**Request Body:**
```json
{
  "token": "reset-token-123",
  "new_password": "newpassword123"
}
```

**Validation Rules:**
- `token`: Cannot be empty
- `new_password`: Minimum 8 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password has been reset successfully.",
  "data": null
}
```

---

### 4. Approve Professor

**Endpoint:** `POST /auth/admin/approve-professor`

**Authentication Required:** Yes (Admin only)

**Description:** Approves a professor's registration request.

**Request Body:**
```json
{
  "id": "professor:12345"
}
```

**Validation Rules:**
- `id`: Cannot be empty

**Success Response (200):**
```json
{
  "success": true,
  "message": "Professor has been approved successfully.",
  "data": null
}
```

---

### 5. Reject Professor

**Endpoint:** `POST /auth/admin/reject-professor`

**Authentication Required:** Yes (Admin only)

**Description:** Rejects a professor's registration request.

**Request Body:**
```json
{
  "id": "professor:12345"
}
```

**Validation Rules:**
- `id`: Cannot be empty

**Success Response (200):**
```json
{
  "success": true,
  "message": "Professor has been rejected successfully.",
  "data": null
}
```

---

### 6. Get All Professors

**Endpoint:** `GET /auth/admin/all-professors`

**Authentication Required:** Yes (Admin only)

**Description:** Retrieves a paginated list of all professors.

**Query Parameters:**
- `page` (optional): Page number (minimum 1, default: 1)
- `limit` (optional): Items per page (minimum 1, maximum 100, default: 10)

**Example:** `/auth/admin/all-professors?page=1&limit=10`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "professor:12345",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "status": "pending",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

## Professor Authentication

### 1. Professor Registration

**Endpoint:** `POST /auth/professor/register`

**Authentication Required:** No

**Description:** Registers a new professor with profile picture and CV uploads.

**Content-Type:** `multipart/form-data`

**Request Body:**
- `professor_data` (JSON string):
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "wilaya": "Algiers",
  "phone_number": "+213555123456",
  "email": "john.doe@example.com",
  "gender": "Male",
  "date_of_birth": "1985-05-15T00:00:00Z",
  "exp_school": true,
  "exp_school_years": 5,
  "exp_off_school": true,
  "exp_online": true,
  "password": "password123"
}
```
- `cv_file` (file, optional): PDF file of the CV
- `profile_picture` (file, optional): Image file for profile picture (JPG, PNG, GIF, WEBP)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "professor:12345",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "cv_path": "professors/cv/uuid_john_doe.pdf",
    "profile_picture_path": "professors/profile-pictures/uuid_john_doe.jpg",
    "status": "pending",
    "email_verified": false,
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

---

### 2. Professor Login

**Endpoint:** `POST /auth/professor/login`

**Authentication Required:** No

**Description:** Authenticates a professor and returns JWT tokens.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Must be a valid email address
- `password`: Minimum 8 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Professor login successful",
  "data": {
    "token": {
      "access_token": "eyJhbGciOiJIUzI1NiIs...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
    },
    "user": {
      "id": "professor:12345",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "status": "approved",
      "email_verified": true
    }
  }
}
```

---

### 3. Professor Send Verification Email

**Endpoint:** `POST /auth/professor/send-verification-email`

**Authentication Required:** No

**Description:** Sends a verification email to the professor.

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Validation Rules:**
- `email`: Must be a valid email address

**Success Response (200):**
```json
{
  "success": true,
  "message": "Verification email sent successfully",
  "data": null
}
```

---

### 4. Professor Verify Email

**Endpoint:** `GET /auth/professor/verify-email`

**Authentication Required:** No

**Description:** Confirms professor email verification using the token from email.

**Query Parameters:**
- `token` (required): Verification token from email

**Example:** `/auth/professor/verify-email?token=verification-token-123`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": null
}
```

---

### 5. Professor Forgot Password

**Endpoint:** `POST /auth/professor/forgot-password`

**Authentication Required:** No

**Description:** Sends a password reset token to the professor's email.

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Validation Rules:**
- `email`: Must be a valid email address

**Success Response (200):**
```json
{
  "success": true,
  "message": "Forget password email sent successfully",
  "data": null
}
```

---

### 6. Professor Reset Password

**Endpoint:** `POST /auth/professor/reset-password`

**Authentication Required:** No

**Description:** Resets professor password using the token received via email.

**Request Body:**
```json
{
  "token": "reset-token-123",
  "new_password": "newpassword123"
}
```

**Validation Rules:**
- `token`: Cannot be empty
- `new_password`: Minimum 8 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": null
}
```

---

## Student Authentication

### 1. Student Registration

**Endpoint:** `POST /auth/student/register`

**Authentication Required:** No

**Description:** Registers a new student with optional profile picture.

**Content-Type:** `multipart/form-data`

**Request Body:**
- `student` (JSON string):
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "wilaya": "Oran",
  "phone_number": "+213555789012",
  "academic_stream": "Sciences",
  "email": "jane.smith@example.com",
  "password": "password123"
}
```
- `profile_picture` (file, optional): Image file for profile picture

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "student:12345",
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith@example.com",
    "academic_stream": "Sciences",
    "profile_picture_path": "profile-pictures/profile-picture/uuid.jpg",
    "email_verified": false,
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

---

### 2. Student Login

**Endpoint:** `POST /auth/student/login`

**Authentication Required:** No

**Description:** Authenticates a student and returns JWT tokens.

**Request Body:**
```json
{
  "email": "jane.smith@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Must be a valid email address
- `password`: Minimum 8 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "token": {
      "access_token": "eyJhbGciOiJIUzI1NiIs...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
    },
    "user": {
      "id": "student:12345",
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@example.com",
      "academic_stream": "Sciences",
      "email_verified": true
    }
  }
}
```

---

### 3. Student Send Verification Email

**Endpoint:** `POST /auth/student/send-verification-email`

**Authentication Required:** No

**Description:** Sends a verification email to the student.

**Request Body:**
```json
{
  "email": "jane.smith@example.com"
}
```

**Validation Rules:**
- `email`: Must be a valid email address

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": null
}
```

---

### 4. Student Verify Email

**Endpoint:** `GET /auth/student/verify-email`

**Authentication Required:** No

**Description:** Confirms student email verification using the token from email.

**Query Parameters:**
- `token` (required): Verification token from email

**Example:** `/auth/student/verify-email?token=verification-token-123`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": null
}
```

---

### 5. Student Forgot Password

**Endpoint:** `POST /auth/student/forgot-password`

**Authentication Required:** No

**Description:** Sends a password reset token to the student's email.

**Request Body:**
```json
{
  "email": "jane.smith@example.com"
}
```

**Validation Rules:**
- `email`: Must be a valid email address

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": null
}
```

---

### 6. Student Reset Password

**Endpoint:** `POST /auth/student/reset-password`

**Authentication Required:** No

**Description:** Resets student password using the token received via email.

**Request Body:**
```json
{
  "token": "reset-token-123",
  "new_password": "newpassword123"
}
```

**Validation Rules:**
- `token`: Cannot be empty
- `new_password`: Minimum 8 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": null
}
```

---

## Module Management

### Public Module Endpoints

These endpoints are accessible without authentication.

---

### 1. Get Module by ID

**Endpoint:** `GET /module/{id}`

**Authentication Required:** No

**Description:** Retrieves a specific module by its ID.

**Path Parameters:**
- `id`: The module ID (e.g., `module:12345`)

**Example:** `/module/module:12345`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "module:12345",
    "name": "Mathematics",
    "description": "Advanced mathematics course",
    "image_path": "modules/uuid_math.jpg",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
```

---

### 2. Get All Modules

**Endpoint:** `GET /module`

**Authentication Required:** No

**Description:** Retrieves all modules.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "module:12345",
      "name": "Mathematics",
      "description": "Advanced mathematics course",
      "image_path": "modules/uuid_math.jpg",
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z"
    },
    {
      "id": "module:12346",
      "name": "Physics",
      "description": "General physics course",
      "image_path": "modules/uuid_physics.jpg",
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

### 3. Get Academic Stream by Name

**Endpoint:** `GET /module/academic-stream/{name}`

**Authentication Required:** No

**Description:** Retrieves an academic stream by its name.

**Path Parameters:**
- `name`: The academic stream name (e.g., `Sciences`)

**Example:** `/module/academic-stream/Sciences`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "academic_stream:12345",
    "name": "Sciences",
    "name_ar": "علوم"
  }
}
```

---

### 4. Get Module by ID with Academic Streams

**Endpoint:** `GET /module/{id}/with-academic-streams`

**Authentication Required:** No

**Description:** Retrieves a specific module with all its associated academic streams.

**Path Parameters:**
- `id`: The module ID (e.g., `module:12345`)

**Example:** `/module/module:12345/with-academic-streams`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "module": {
      "id": "module:12345",
      "name": "Mathematics",
      "description": "Advanced mathematics course",
      "image_path": "modules/uuid_math.jpg",
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z"
    },
    "academic_streams": [
      {
        "id": "academic_stream:1",
        "name": "Sciences",
        "name_ar": "علوم"
      },
      {
        "id": "academic_stream:2",
        "name": "Technology",
        "name_ar": "تقنية"
      }
    ]
  }
}
```

---

### 5. Get All Modules with Academic Streams

**Endpoint:** `GET /module/with-academic-streams`

**Authentication Required:** No

**Description:** Retrieves all modules with their associated academic streams.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "module": {
        "id": "module:12345",
        "name": "Mathematics",
        "description": "Advanced mathematics course",
        "image_path": "modules/uuid_math.jpg"
      },
      "academic_streams": [
        {
          "id": "academic_stream:1",
          "name": "Sciences",
          "name_ar": "علوم"
        }
      ]
    }
  ]
}
```

---

### Protected Module Endpoints

These endpoints require authentication with appropriate permissions.

---

### 6. Create Module

**Endpoint:** `POST /module`

**Authentication Required:** Yes

**Description:** Creates a new module with optional image upload.

**Content-Type:** `multipart/form-data`

**Request Body:**
- `module` (JSON string):
```json
{
  "name": "Chemistry",
  "description": "General chemistry course"
}
```
- `module_image` (file, optional): Image file for the module

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "module:12347",
    "name": "Chemistry",
    "description": "General chemistry course",
    "image_path": "modules/uuid_chemistry.jpg",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
```

---

### 7. Update Module

**Endpoint:** `PUT /module`

**Authentication Required:** Yes

**Description:** Updates an existing module with optional image upload.

**Content-Type:** `multipart/form-data`

**Request Body:**
- `module` (JSON string):
```json
{
  "id": "module:12345",
  "name": "Advanced Mathematics",
  "description": "Updated description"
}
```
- `module_image` (file, optional): New image file for the module

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": null
}
```

---

### 8. Add Academic Stream

**Endpoint:** `POST /module/academic-stream`

**Authentication Required:** Yes

**Description:** Creates a new academic stream.

**Request Body:**
```json
{
  "name": "Engineering",
  "name_ar": "هندسة"
}
```

**Validation Rules:**
- `name`: 2-100 characters
- `name_ar`: 2-100 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "academic_stream:12348",
    "name": "Engineering",
    "name_ar": "هندسة"
  }
}
```

---

### 9. Add Academic Stream to Module by Name

**Endpoint:** `POST /module/academic-stream/add-to-module-by-name`

**Authentication Required:** Yes

**Description:** Associates an academic stream with a module using the stream's name.

**Request Body:**
```json
{
  "module_id": "module:12345",
  "academic_stream_name": "Sciences"
}
```

**Validation Rules:**
- `module_id`: 2-100 characters
- `academic_stream_name`: 2-100 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": null
}
```

---

### 10. Add Academic Stream to Module

**Endpoint:** `POST /module/academic-stream/add-to-module`

**Authentication Required:** Yes

**Description:** Associates an academic stream with a module using their IDs.

**Request Body:**
```json
{
  "module_id": "module:12345",
  "academic_stream_id": "academic_stream:12348"
}
```

**Validation Rules:**
- `module_id`: 2-100 characters
- `academic_stream_id`: 2-100 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": null
}
```

---

### 11. Remove Academic Stream from Module

**Endpoint:** `POST /module/academic-stream/remove-from-module`

**Authentication Required:** Yes

**Description:** Removes the association between an academic stream and a module.

**Request Body:**
```json
{
  "module_id": "module:12345",
  "academic_stream_id": "academic_stream:12348"
}
```

**Validation Rules:**
- `module_id`: 2-100 characters
- `academic_stream_id`: 2-100 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": null
}
```

---

## Common HTTP Status Codes

- **200 OK**: Request successful
- **400 Bad Request**: Invalid request data or validation error
- **401 Unauthorized**: Authentication required or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side error

---

## Error Handling

All error responses include:
- `success`: false
- `message`: Human-readable error message
- `data`: null

### Common Validation Errors

**Invalid Email Format:**
```json
{
  "success": false,
  "message": "Invalid email format",
  "data": null
}
```

**Password Too Short:**
```json
{
  "success": false,
  "message": "Password must be at least 8 characters long",
  "data": null
}
```

**Missing Required Field:**
```json
{
  "success": false,
  "message": "Module data is required",
  "data": null
}
```

---

## Notes

1. **File Uploads**: For endpoints that accept file uploads, use `multipart/form-data` content type.
2. **Authentication**: Protected endpoints require a valid JWT token in the Authorization header.
3. **Date Formats**: All dates use ISO 8601 format (e.g., `2025-01-15T10:30:00Z`).
4. **IDs**: Resource IDs follow the pattern `{resource_type}:{identifier}` (e.g., `module:12345`).
5. **Pagination**: Default page size is 10 items, maximum is 100 items per page.

---

## Support

For issues or questions about the API, please contact the development team or refer to the project repository.

# Sauviny Backend API Documentation

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Base Response Format](#base-response-format)
- [Error Handling](#error-handling)
- [Admin Endpoints](#admin-endpoints)
- [Professor Endpoints](#professor-endpoints)
- [Common Authentication Endpoints](#common-authentication-endpoints)
- [Student Endpoints](#student-endpoints)
- [Request Examples](#request-examples)

## Overview

**Base URL:** `http://your-domain.com/api/v1`
**Content-Type:** `application/json` (except for file uploads which use `multipart/form-data`)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Tokens are returned upon successful login and should be included in the `Authorization` header for protected routes.

### Token Format
```
Authorization: Bearer <your-jwt-token>
```

### Token Types
- **Access Token**: Used for API requests (expires in minutes)
- **Refresh Token**: Used to refresh access tokens (expires in days)

## Base Response Format

All API responses follow this standard format:

```json
{
  "success": boolean,
  "data": any | null,
  "message": string,
  "request_id": string,
  "timestamp": string (ISO 8601),
  "duration_ms": number (optional)
}
```

## Error Handling

### HTTP Status Codes
- `200` - OK
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

### Error Response Example
```json
{
  "success": false,
  "data": null,
  "message": "Validation failed: email is required",
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-09-29T10:30:00Z"
}
```

---

## Admin Endpoints

### 1. Admin Login
**POST** `/auth/admin/login`

Authenticate an admin user and receive JWT tokens.

#### Request Body
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Validation Rules
- `email`: Must be a valid email format
- `password`: Minimum 8 characters

#### Success Response (200)
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
      "id": "admin:123",
      "email": "admin@example.com",
      "created_at": "2025-09-29T10:30:00Z",
      "updated_at": "2025-09-29T10:30:00Z"
    }
  },
  "message": "Admin login successful"
}
```

---

### 2. Forgot Password (Send Email)
**POST** `/auth/admin/forgot-password`

Send a password reset email to the admin.

#### Request Body
```json
{
  "email": "admin@example.com"
}
```

#### Validation Rules
- `email`: Must be a valid email format

#### Success Response (200)
```json
{
  "success": true,
  "data": null,
  "message": "Password reset code has been sent."
}
```

---

### 3. Reset Password Confirmation
**POST** `/auth/admin/reset-password`

Confirm password reset using the token received via email.

#### Request Body
```json
{
  "token": "reset-token-from-email",
  "new_password": "newpassword123"
}
```

#### Validation Rules
- `token`: Cannot be empty
- `new_password`: Minimum 8 characters

#### Success Response (200)
```json
{
  "success": true,
  "data": null,
  "message": "Password has been reset successfully."
}
```

---

### 4. Approve Professor
**POST** `/auth/admin/approve-professor` 🔒

**Authentication Required:** Admin role

Approve a professor registration.

#### Request Body
```json
{
  "id": "professor:123"
}
```

#### Validation Rules
- `id`: Cannot be empty

#### Success Response (200)
```json
{
  "success": true,
  "data": null,
  "message": "Professor has been approved successfully."
}
```

---

### 5. Reject Professor
**POST** `/auth/admin/reject-professor` 🔒

**Authentication Required:** Admin role

Reject a professor registration.

#### Request Body
```json
{
  "id": "professor:123"
}
```

#### Validation Rules
- `id`: Cannot be empty

#### Success Response (200)
```json
{
  "success": true,
  "data": null,
  "message": "Professor has been rejected successfully."
}
```

---

### 6. Get All Professors
**GET** `/auth/admin/all-professors` 🔒

**Authentication Required:** Admin role

Retrieve all professors with pagination.

#### Query Parameters
- `page` (optional): Page number (minimum 1, default: 1)
- `limit` (optional): Items per page (1-100, default: 10)

#### Example Request
```
GET /api/v1/auth/admin/all-professors?page=1&limit=20
```

#### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "id": "professor:123",
      "first_name": "John",
      "last_name": "Doe",
      "wilaya": "Algiers",
      "phone_number": "+213555123456",
      "email": "john.doe@example.com",
      "gender": "male",
      "date_of_birth": "1985-06-15T00:00:00Z",
      "exp_school": true,
      "exp_school_years": 5,
      "exp_off_school": false,
      "exp_online": true,
      "cv_path": "professors/cv_123_john_at_example.pdf",
      "profile_picture_path": "professors/profile-pictures/pic_123.jpg",
      "email_verified": true,
      "status": "approved",
      "created_at": "2025-09-29T10:30:00Z",
      "updated_at": "2025-09-29T10:30:00Z"
    }
  ],
  "message": "Professors retrieved successfully."
}
```

---

## Professor Endpoints

### 1. Professor Registration
**POST** `/auth/professor/register`

**Content-Type:** `multipart/form-data`

Register a new professor with file uploads.

#### Form Fields

**professor_data** (JSON string):
```json
{
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
}
```

**cv_file** (File): PDF file containing the professor's CV
**profile_picture** (File, optional): Image file (JPG, PNG, GIF, WebP)

#### Validation Rules
- All text fields are required
- `email`: Must be valid email format
- `password`: Minimum 8 characters
- `cv_file`: PDF format recommended

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "professor:456",
    "first_name": "John",
    "last_name": "Doe",
    "wilaya": "Algiers",
    "phone_number": "+213555123456",
    "email": "john.doe@example.com",
    "gender": "male",
    "date_of_birth": "1985-06-15T00:00:00Z",
    "exp_school": true,
    "exp_school_years": 5,
    "exp_off_school": false,
    "exp_online": true,
    "cv_path": "professors/cv_uuid_john_at_example.pdf",
    "profile_picture_path": "professors/profile-pictures/uuid_john_at_example.jpg",
    "email_verified": false,
    "status": "new",
    "created_at": "2025-09-29T10:30:00Z",
    "updated_at": "2025-09-29T10:30:00Z"
  },
  "message": "Success"
}
```

---

### 2. Professor Login
**POST** `/auth/professor/login`

Authenticate a professor and receive JWT tokens.

#### Request Body
```json
{
  "email": "professor@example.com",
  "password": "password123"
}
```

#### Validation Rules
- `email`: Must be a valid email format
- `password`: Minimum 8 characters

#### Success Response (200)
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
      "id": "professor:456",
      "first_name": "John",
      "last_name": "Doe",
      "wilaya": "Algiers",
      "phone_number": "+213555123456",
      "email": "professor@example.com",
      "gender": "male",
      "date_of_birth": "1985-06-15T00:00:00Z",
      "exp_school": true,
      "exp_school_years": 5,
      "exp_off_school": false,
      "exp_online": true,
      "cv_path": "professors/cv_uuid.pdf",
      "profile_picture_path": "professors/profile-pictures/uuid.jpg",
      "email_verified": true,
      "status": "approved",
      "created_at": "2025-09-29T10:30:00Z",
      "updated_at": "2025-09-29T10:30:00Z"
    }
  },
  "message": "Professor login successful"
}
```

---

## Common Authentication Endpoints

### 1. Refresh Token
**POST** `/auth/refresh`

Refresh an expired access token using a valid refresh token.

#### Request Body
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Validation Rules
- `token`: Must be a valid refresh token

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600,
    "token_type": "Bearer"
  },
  "message": "Token refreshed successfully"
}
```

---

### 2. Logout
**POST** `/auth/logout` 🔒

**Authentication Required:** Any authenticated user

Logout and invalidate the current session tokens.

#### Request Body
```json
{}
```

#### Success Response (200)
```json
{
  "success": true,
  "data": null,
  "message": "Logout successful"
}
```

---

## Student Endpoints

### 1. Student Registration
**POST** `/auth/student/register`

**Content-Type:** `multipart/form-data`

Register a new student with optional profile picture.

#### Form Fields

**student** (JSON string):
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "wilaya": "Oran",
  "phone_number": "+213555987654",
  "academic_stream": "Science",
  "email": "jane.smith@example.com",
  "password": "password123"
}
```

**profile_picture** (File, optional): Image file (JPG, PNG, GIF, WebP)

#### Validation Rules
- All fields in student JSON are required
- `email`: Must be valid email format
- `password`: Minimum 8 characters

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "student:789",
    "first_name": "Jane",
    "last_name": "Smith",
    "wilaya": "Oran",
    "phone_number": "+213555987654",
    "academic_stream": "Science",
    "email": "jane.smith@example.com",
    "profile_picture_path": "profile-pictures/profile-picture/uuid.jpg",
    "email_verified": false,
    "created_at": "2025-09-29T10:30:00Z",
    "updated_at": "2025-09-29T10:30:00Z"
  },
  "message": "Success"
}
```

**Note:** A verification email is automatically sent upon successful registration.

---

### 2. Student Login
**POST** `/auth/student/login`

Authenticate a student and receive JWT tokens.

#### Request Body
```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

#### Validation Rules
- `email`: Must be a valid email format
- `password`: Minimum 8 characters

#### Success Response (200)
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
      "wilaya": "Oran",
      "phone_number": "+213555987654",
      "academic_stream": "Science",
      "email": "student@example.com",
      "profile_picture_path": "profile-pictures/profile-picture/uuid.jpg",
      "email_verified": true,
      "created_at": "2025-09-29T10:30:00Z",
      "updated_at": "2025-09-29T10:30:00Z"
    }
  },
  "message": "Success"
}
```

---

### 3. Email Verification
**GET** `/auth/student/verify-email`

Verify student email using token sent via email.

#### Query Parameters
- `token` (required): Verification token from email

#### Example Request
```
GET /api/v1/auth/student/verify-email?token=verification-token-from-email
```

#### Success Response (200)
```json
{
  "success": true,
  "data": null,
  "message": "Success"
}
```

---

## Request Examples

### Using cURL

#### Admin Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

#### Professor Registration with Files
```bash
curl -X POST http://localhost:3000/api/v1/auth/professor/register \
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

#### Protected Admin Route
```bash
curl -X GET http://localhost:3000/api/v1/auth/admin/all-professors?page=1&limit=10 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using JavaScript/Fetch

#### Student Login
```javascript
const response = await fetch('/api/v1/auth/student/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'student@example.com',
    password: 'password123'
  })
});

const data = await response.json();
if (data.success) {
  // Store tokens
  localStorage.setItem('access_token', data.data.token.access_token);
  localStorage.setItem('refresh_token', data.data.token.refresh_token);
}
```

#### Student Registration with File
```javascript
const formData = new FormData();
formData.append('student', JSON.stringify({
  first_name: 'Jane',
  last_name: 'Smith',
  wilaya: 'Oran',
  phone_number: '+213555987654',
  academic_stream: 'Science',
  email: 'jane.smith@example.com',
  password: 'password123'
}));

// Optional profile picture
const fileInput = document.getElementById('profile-picture');
if (fileInput.files[0]) {
  formData.append('profile_picture', fileInput.files[0]);
}

const response = await fetch('/api/v1/auth/student/register', {
  method: 'POST',
  body: formData
});
```

---

## Notes

1. **File Uploads**: Use `multipart/form-data` for endpoints that accept files
2. **Authentication**: Protected routes (marked with 🔒) require a valid JWT token
3. **Validation**: All requests are validated server-side. Validation errors return 400 status
4. **Rate Limiting**: Consider implementing rate limiting for production use
5. **CORS**: The API includes CORS middleware for cross-origin requests
6. **File Storage**: Files are stored using MinIO object storage
7. **Email Service**: Email verification and password reset use SMTP service

## Support

For questions or issues with the API, please contact the development team or refer to the project repository.
# API Documentation

## Base URL

```
Development: http://localhost:5000/api
Production: https://lms.techfieldsolution.com/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User

```http
POST /auth/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "intern"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "intern",
    "avatar": "default-avatar.png"
  }
}
```

### Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User

```http
GET /auth/me
```

**Headers:** `Authorization: Bearer <token>`

---

## Internship Endpoints

### Get All Internships

```http
GET /internships?domain=web-development&skillLevel=intermediate&page=1&limit=10
```

**Query Parameters:**
- `domain` - Filter by domain
- `skillLevel` - beginner, intermediate, advanced
- `status` - open, closed, draft
- `featured` - true/false
- `search` - Search in title/description
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "internship_id",
      "title": "Full Stack Web Development",
      "slug": "full-stack-web-development",
      "description": "Learn full stack development...",
      "domain": "web-development",
      "skillLevel": "intermediate",
      "duration": {
        "weeks": 12,
        "hours": 20
      },
      "startDate": "2024-01-15",
      "endDate": "2024-04-15",
      "status": "open",
      "mentor": {
        "_id": "mentor_id",
        "firstName": "Jane",
        "lastName": "Smith",
        "avatar": "avatar.jpg"
      },
      "currentEnrollments": 25,
      "maxInterns": 50
    }
  ]
}
```

### Get Single Internship

```http
GET /internships/:id
```

### Create Internship (Admin/Mentor)

```http
POST /internships
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Full Stack Web Development",
  "description": "Comprehensive full stack development program...",
  "domain": "web-development",
  "skillLevel": "intermediate",
  "duration": {
    "weeks": 12,
    "hours": 20
  },
  "startDate": "2024-01-15",
  "endDate": "2024-04-15",
  "applicationDeadline": "2024-01-10",
  "prerequisites": ["HTML", "CSS", "JavaScript basics"],
  "learningOutcomes": ["Build full stack apps", "Deploy to cloud"],
  "maxInterns": 50,
  "isRemote": true
}
```

---

## Enrollment Endpoints

### Enroll in Internship

```http
POST /enrollments
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "internship": "internship_id",
  "notes": "I'm interested in this program because..."
}
```

### Get User Enrollments

```http
GET /enrollments/user/:userId
```

### Update Enrollment Status (Mentor/Admin)

```http
PUT /enrollments/:id/status
```

**Request Body:**
```json
{
  "status": "approved"
}
```

---

## Module Endpoints

### Get Internship Modules

```http
GET /modules/internship/:internshipId
```

### Create Module (Mentor/Admin)

```http
POST /modules
```

**Request Body:**
```json
{
  "title": "Introduction to React",
  "description": "Learn React fundamentals...",
  "internship": "internship_id",
  "order": 1,
  "duration": {
    "hours": 10,
    "minutes": 30
  },
  "lessons": [
    {
      "title": "React Components",
      "order": 1,
      "type": "video",
      "content": "https://video-url.com",
      "duration": {
        "minutes": 45
      },
      "isRequired": true
    }
  ]
}
```

---

## Assignment Endpoints

### Get Module Assignments

```http
GET /assignments/module/:moduleId
```

### Submit Assignment

```http
POST /submissions
```

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
```
assignment: assignment_id
content: "Assignment description or notes"
files: [file1, file2]
repositoryLink: "https://github.com/user/repo"
```

### Grade Submission (Mentor)

```http
PUT /submissions/:id/grade
```

**Request Body:**
```json
{
  "score": 85,
  "feedback": "Great work! Consider improving...",
  "rubricScores": [
    {
      "criterion": "Code Quality",
      "points": 20,
      "comment": "Clean and well-structured"
    }
  ]
}
```

---

## Communication Endpoints

### Get Conversations

```http
GET /conversations
```

### Send Message

```http
POST /conversations/:id/messages
```

**Request Body:**
```json
{
  "content": "Hello, I have a question about..."
}
```

### Get Announcements

```http
GET /announcements
```

---

## Certificate Endpoints

### Generate Certificate (Admin/Mentor)

```http
POST /certificates/generate
```

**Request Body:**
```json
{
  "enrollmentId": "enrollment_id"
}
```

### Verify Certificate

```http
GET /certificates/verify/:certificateId
```

---

## Analytics Endpoints

### Get Intern Dashboard

```http
GET /analytics/dashboard/intern
```

**Response:**
```json
{
  "success": true,
  "data": {
    "enrollments": {
      "total": 3,
      "active": 2,
      "completed": 1
    },
    "progress": {
      "overall": 65,
      "modulesCompleted": 8,
      "totalModules": 12
    },
    "assignments": {
      "total": 15,
      "submitted": 12,
      "graded": 10,
      "pending": 3,
      "averageScore": 87
    },
    "certificates": 1,
    "upcomingDeadlines": []
  }
}
```

### Get Mentor Dashboard

```http
GET /analytics/dashboard/mentor
```

### Get Admin Dashboard

```http
GET /analytics/dashboard/admin
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting

API requests are limited to 100 requests per 15 minutes per IP address.

---

## Pagination

List endpoints support pagination with these query parameters:
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)

---

## File Uploads

Maximum file size: 10MB (configurable)

Allowed file types:
- Documents: pdf, doc, docx, txt
- Images: jpg, jpeg, png
- Archives: zip
- Code: Any text-based files

Files are uploaded to Cloudinary with automatic optimization and URLs are returned in the response.

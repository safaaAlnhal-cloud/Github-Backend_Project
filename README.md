# Users Backend API

This project is built using NestJS and provides user management with GitHub integration, including search history tracking.

---

## Base URL
http://localhost:3000

---

## Available Endpoints

### 1. Get all users
GET /users

Query Parameters (optional):
- limit: number (default: 10)
- offset: number (default: 0)

Example:
GET /users?limit=10&offset=0

---

### 2. Get user by ID
GET /users/:id

Example:
GET /users/1

---

### 3. Delete user
DELETE /users/:id

Example:
DELETE /users/1

---

### 4. Search GitHub user
POST /users/search

Description:
- Fetch user from GitHub API
- Save user to database
- Store search history

Request Body:
{
  "username": "Ali"
}

Example:
POST /users/search
Body:
{
  "username": "Ali"
}

---

### 5. Get search history
GET /users/history

Query Parameters (optional):
- limit: number (default: 10)
- offset: number (default: 0)

Example:
GET /users/history?limit=10&offset=0

---

## Tech Stack
- NestJS
- TypeORM
- GitHub API
- Jest Testing
- Winston Logger

---

## Notes
- All routes return JSON responses
- Validation is handled using DTOs

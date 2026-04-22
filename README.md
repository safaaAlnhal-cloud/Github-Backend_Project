# Users Backend API

## Project Overview
This project is built using NestJS and provides user management with GitHub integration, including search history tracking.

---

## Features
- Fetch GitHub users
- Save users to database
- Search history tracking
- Pagination support
- Input validation using DTOs
- Logging with Winston
- Swagger API documentation

---

## Base URL
http://localhost:3000

---

## API Endpoints

### 1. Get all users
GET /users

Query Parameters:
- limit (default: 10)
- offset (default: 0)

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

Request Body:
{
  "username": "Ali"
}

---

### 5. Get search history
GET /users/history

Query Parameters:
- limit (default: 10)
- offset (default: 0)

---

## API Documentation
Swagger UI available at:
http://localhost:3000/api

---

## Environment Variables

This project requires a `.env` file to run.

Create a `.env` file in the root directory and copy values from `.env.example`.

### Required Variables

- PORT → Server port
- DB_HOST → Database host
- DB_PORT → Database port
- DB_USER → Database username
- DB_PASSWORD → Database password
- DB_NAME → Database name

---

### Example `.env.example`

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=1234
DB_NAME=github_backend
```
---

### Setup Instructions

1. Copy the example file:
cp .env.example .env

2. Edit `.env` and put your real database credentials.

3. Run the project:
npm run start


## Project Structure

src/
│
├── app.controller.ts
├── app.controller.spec.ts
├── app.module.ts
├── app.service.ts
├── main.ts
├── data-source.ts
│
├── migrations/
│   └── 1776826808387-Init.ts
│
├── users/
│   ├── users.controller.ts
│   ├── users.controller.spec.ts
│   ├── users.module.ts
│   ├── users.service.ts
│   ├── users.service.spec.ts
│   ├── logger.module.ts
│   ├── github.service.ts
│   ├── search-history.service.ts
│   │
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   ├── get-user.dto.ts
│   │   ├── get-users.dto.ts
│   │
│   └── entities/
│       ├── user.entity.ts
│       └── search-history.entity.ts



## Running the Project with Docker

This project includes Docker and Docker Compose for easy setup and deployment.

Docker allows you to run both the backend and database with a single command.

---

### Requirements
- Docker
- Docker Compose

---

### Start the project

Run the following command to build and start all services:

```bash
docker-compose up --build
```
Stop the project
To stop all running containers:
```bash
docker-compose down
```
What gets started?
NestJS Backend API
PostgreSQL Database

Application URL
The backend will run on: http://localhost:3000








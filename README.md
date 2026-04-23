# Users Backend API

## 📌 Project Overview
This project is built using NestJS and provides a user management system integrated with the GitHub API.
It includes search history tracking, pagination, structured logging, database persistence, and full API documentation using Swagger.
---
## ✨ Features
- Fetch GitHub users via GitHub API  
- Save users in PostgreSQL database  
- Prevent duplicate users  
- Track search history  
- Pagination support  
- Input validation using DTOs  
- Structured logging (Winston)  
- Error handling (GitHub + DB errors)  
- API documentation using Swagger  
- Dockerized setup (backend + database)
---

## 🌐 Base URL
http://localhost:3000

---

## 📚 API Documentation (Swagger)
Swagger UI available at:
http://localhost:3000/api

### Swagger allows you to:
- View all endpoints
- Test APIs directly
- See request/response formats
- Understand DTOs easily
---

## 👤 Users API

### 1. Get all users
GET /users
Query Parameters:
- limit (default: 10)
- offset (default: 0)
---

### 2. Get user by ID
GET /users/:id
---
### 3. Delete user
DELETE /users/:id
---
### 4. Search GitHub user
POST /users/search
```json
Request Body:
{
  "username": "Ali"
}
```
---

### 5. Get search history
GET /users/history
Query Parameters:
- limit (default: 10)
- offset (default: 0)

---

## ⚙️ Environment Variables

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
DB_PASSWORD=8569
DB_NAME=github_backend
```
---

### 🚀 Setup Instructions

1. Copy the example file:
cp .env.example .env

2. Edit `.env` and put your real database credentials.

3. Run the project:
npm run start


## Project Structure
```txt
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
├── seed/
│   ├── seed.service.ts
│   └── run-seed.ts
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
│   ├── search-history.service.spec.ts
│   ├── github.service.spec.ts
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   ├── get-user.dto.ts
│   │   ├── get-users.dto.ts
│   │
│   └── entities/
│       ├── user.entity.ts
│       └── search-history.entity.ts


```

## Database Seed
To run the seed script:

```bash
npx ts-node src/seed/run-seed.ts
```

This project includes a seed strategy to populate the database with initial data.

Seeder is used to insert sample users into the database for development and testing purposes.

---

## 🐳 Docker Usage
This project uses Docker and Docker Compose to run the backend and PostgreSQL database in isolated containers.

This ensures consistent setup across all environments without manual configuration.

---
### 📦 Services Included
- Backend (NestJS API)
- PostgreSQL Database

### Requirements
- Docker
- Docker Compose
Check installation:
```bash
docker --version
docker-compose --version
```
---

### 📁 Project Setup

Before running Docker:

Create environment file:
```bash
cp .env.example .env
```
Update .env with your database credentials if needed.

### 🚀 Start the Application

Run the following command to build and start all services:

```bash
docker-compose up --build
```
This will:
- Build backend image
- Start database container
- Connect backend to database automatically

🛑 Stop the Application
To stop all running containers:
```bash
docker-compose down
```

🔄 Rebuild After Changes

If you modify code or dependencies:
```bash
docker-compose up --build
```
💡 Why Docker?
No need to install PostgreSQL locally
Same environment for all developers
Easy deployment
Clean and isolated setup

Application URL
The backend will run on: http://localhost:3000


### 🧱 Database Migrations
```bash
npm run migration:run
```

```md
## 📦 Tech Stack

- NestJS
- TypeORM
- PostgreSQL
- Swagger
- Winston Logger
- Docker


## 🧪 Testing

Run all tests:
```bash
npm run test
```

Run test coverage:
```bash
npm run test:cov
```
## 🚀 Production Notes

- Database synchronization is disabled (synchronize: false)
- Migrations are used for schema changes
- Environment variables are validated using @nestjs/config
- Logging is handled using Winston
- Rate limiting is applied using Throttler
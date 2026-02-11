# EasyGenerator Full Stack Test Task

A production-ready authentication application built with NestJS (backend) and React with TypeScript (frontend).

## Features

### Backend
- ✅ NestJS framework with TypeScript
- ✅ MongoDB database integration
- ✅ JWT-based authentication
- ✅ User sign up and sign in endpoints
- ✅ Protected endpoint with JWT guard
- ✅ Password hashing with bcrypt
- ✅ Input validation with class-validator
- ✅ API documentation with Swagger
- ✅ Winston logging
- ✅ CORS enabled for frontend
- ✅ Security best practices

### Frontend
- ✅ React with TypeScript
- ✅ Sign up page with validation:
  - Email format validation
  - Name (minimum 3 characters)
  - Password requirements (min 8 chars, letter, number, special character)
- ✅ Sign in page
- ✅ Welcome/Application page with logout functionality
- ✅ Protected routes
- ✅ Modern, responsive UI design
- ✅ Context API for authentication state management

## Prerequisites

- Docker (v20 or higher)
- Docker Compose (v2 or higher)

## Getting Started

This application runs entirely using Docker Compose. It will set up all services (MongoDB, Backend, Frontend) automatically.

### Steps

1. **Clone the repository** (if you haven't already):
```bash
git clone <repository-url>
cd Easygenerator
```

2. **Create and configure environment file** (REQUIRED):
```bash
cp .env.example .env
# Edit .env and fill in ALL required values (no defaults - will fail if missing)
nano .env  # or use your preferred editor
```

**Note:** The `.env` file is REQUIRED. Docker Compose will fail if:
- `.env` file doesn't exist
- Any required variable is missing or empty

3. **Start all services**:
```bash
docker-compose up -d
```

This will:
- Build and start MongoDB container
- Build and start Backend container (NestJS API)
- Build and start Frontend container (React app with Nginx)

4. **Access the application**:
- Frontend: http://localhost
- Backend API: http://localhost:3000
- Swagger Documentation: http://localhost:3000/api
- MongoDB: localhost:27017

### Docker Commands

**Start services:**
```bash
docker-compose up -d
```

**Stop services:**
```bash
docker-compose down
```

**View logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

**Rebuild containers (after code changes):**
```bash
docker-compose up -d --build
```

**Stop and remove volumes (clean slate):**
```bash
docker-compose down -v
```

**Check service status:**
```bash
docker-compose ps
```

### Docker Services

The `docker-compose.yml` includes:
- **mongodb**: MongoDB 7 database
- **backend**: NestJS API server (port 3000)
- **frontend**: React app served by Nginx (port 80)

All services are connected via a Docker network and have health checks configured.

## API Endpoints

### Authentication

- `POST /auth/signup` - Register a new user
  - Body: `{ email: string, name: string, password: string }`
  - Returns: `{ access_token: string }`

- `POST /auth/signin` - Sign in existing user
  - Body: `{ email: string, password: string }`
  - Returns: `{ access_token: string }`

### Protected Endpoints

- `GET /protected` - Protected endpoint (requires JWT token)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ message: string, user: object }`

## API Documentation

Once the Docker containers are running, visit `http://localhost:3000/api` to access the Swagger API documentation. You can test all endpoints directly from the Swagger UI.

## Project Structure

```
Easygenerator/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   │   ├── signup.dto.ts
│   │   │   │   └── signin.dto.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   └── jwt-auth.guard.ts
│   │   ├── schemas/
│   │   │   └── user.schema.ts
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── authApi.ts
│   │   ├── components/
│   │   │   ├── SignUp.tsx
│   │   │   ├── SignIn.tsx
│   │   │   ├── Welcome.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── Auth.css
│   │   │   └── Welcome.css
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.tsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .dockerignore
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## Security Features

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens for authentication
- Input validation and sanitization
- CORS configuration
- Protected routes on frontend
- Environment variables for sensitive data

## Logging

The backend uses Winston for logging:
- Console logging with colors and timestamps
- File logging to `logs/error.log` (errors only)
- File logging to `logs/combined.log` (all logs)

## Docker Configuration

### Environment Variables

You can customize the Docker setup by creating a `.env` file in the root directory:

1. **Copy the example file:**
```bash
cp .env.example .env
```

2. **Edit `.env` file** with your preferred settings:

```env
# External Access Configuration (accessible from your computer)
MONGODB_PORT=27017          # Access MongoDB: localhost:27017
BACKEND_PORT=3000           # Access API: http://localhost:3000
FRONTEND_PORT=80            # Access website: http://localhost
REACT_APP_API_URL=http://localhost:3000  # Frontend API endpoint

# MongoDB Configuration (for local Docker MongoDB)
MONGO_INITDB_DATABASE=easygenerator
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your-secure-password-here

# Backend Configuration
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=production
FRONTEND_URL=http://localhost

# Optional: MongoDB Atlas (external cloud database)
# If set, this will be used instead of local Docker MongoDB
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/easygenerator
```

**Key Points:**
- ⚠️ `.env` file is **REQUIRED** - Docker Compose will fail without it
- ⚠️ All variables must be set
- ✅ **Local MongoDB**: Connection is built from `MONGO_ROOT_USERNAME`, `MONGO_ROOT_PASSWORD`, `MONGO_INITDB_DATABASE`
- ✅ Modify ports without editing docker-compose.yml
- ✅ All changes in one place (`.env` file)

**Note:** The backend automatically builds the MongoDB connection string from the credentials. If you need to use MongoDB Atlas or an external database, you would need to modify the backend code to support `MONGODB_URI` environment variable.

**Example: Change MongoDB port:**
```env
MONGODB_PORT=27018  # Access via localhost:27018
```

### Ports

- **Frontend**: Port 80 (http://localhost)
- **Backend**: Port 3000 (http://localhost:3000)
- **MongoDB**: Port 27017 (localhost:27017)

### Volumes

- MongoDB data is persisted in a Docker volume (`mongodb_data`)
- Backend logs are mounted to `./backend/logs` directory

### Health Checks

All services include health checks:
- **MongoDB**: Checks database connectivity using `mongosh ping`
- **Backend**: Checks HTTP endpoint availability on internal port 3000
- **Frontend**: Checks Nginx `/health` endpoint on internal port 80

### Building Individual Services

**Build only backend:**
```bash
docker-compose build backend
```

**Build only frontend:**
```bash
docker-compose build frontend
```

**Run specific service:**
```bash
docker-compose up backend
```

## Notes

- ⚠️ **`.env` file is REQUIRED** - Docker Compose will fail if it doesn't exist or if any required variable is missing
- ⚠️ **No default values** - All environment variables must be explicitly set in `.env` file
- MongoDB connection string is automatically built from credentials in the backend code
- MongoDB data is persisted in a Docker volume (`mongodb_data`), so data will survive container restarts
- Backend logs are available in `./backend/logs` directory (mounted as volume)
- To reset everything, use `docker-compose down -v` (this will remove all data including MongoDB)
- Health checks ensure services are ready before dependent services start

## Technologies Used

### Backend
- NestJS
- MongoDB with Mongoose
- Passport.js with JWT strategy
- Bcrypt for password hashing
- class-validator for validation
- Swagger/OpenAPI for documentation
- Winston for logging

### Frontend
- React
- TypeScript
- React Router
- Axios for HTTP requests
- Context API for state management
- Nginx (for production Docker build)

### DevOps
- Docker
- Docker Compose
- Multi-stage Docker builds

## License

This project is part of a test task for EasyGenerator.


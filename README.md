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
  - Validation:
    - Email: Must be a valid email format
    - Name: Minimum 3 characters
    - Password: Minimum 8 characters, must contain at least one letter, one number, and one special character (@$!%*#?&)
  - Returns: `{ access_token: string }`
  - Status Codes: `201` (Created), `400` (Validation Error), `409` (User Already Exists)

- `POST /auth/signin` - Sign in existing user
  - Body: `{ email: string, password: string }`
  - Validation:
    - Email: Must be a valid email format
    - Password: Required
  - Returns: `{ access_token: string }`
  - Status Codes: `200` (OK), `400` (Validation Error), `401` (Invalid Credentials)

### Protected Endpoints

- `GET /protected` - Protected endpoint (requires JWT token)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ message: string, user: { userId: string, email: string } }`
  - Status Codes: `200` (OK), `401` (Unauthorized)

### Other Endpoints

- `GET /` - Health check endpoint
  - Returns: `"Hello World!"`

## API Documentation

Once the Docker containers are running, visit `http://localhost:3000/api` to access the Swagger API documentation. You can test all endpoints directly from the Swagger UI.

The Swagger documentation includes:
- Interactive API testing interface
- Request/response schemas
- Authentication support (JWT Bearer token)
- Example requests and responses
- Status code documentation

## Frontend Routes

The React application includes the following routes:

- `/signup` - User registration page
- `/signin` - User login page (default route)
- `/app` - Protected welcome page (requires authentication)
- `/` - Redirects to `/signin`

All routes are handled by React Router, and the `/app` route is protected by the `ProtectedRoute` component, which redirects unauthenticated users to `/signin`.

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
│   │   ├── app.controller.spec.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   ├── main.ts
│   │   └── test/
│   │       ├── app.e2e-spec.ts
│   │       └── jest-e2e.json
│   ├── Dockerfile
│   ├── eslint.config.mjs
│   ├── package.json
│   ├── tsconfig.json
│   └── logs/ (created at runtime)
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
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── eslint.config.mjs
│   ├── package.json
│   └── tsconfig.json
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

**Note:** The backend automatically uses `MONGODB_URI` if provided (for MongoDB Atlas or external databases), otherwise it builds the connection string from the local Docker MongoDB credentials (`MONGO_ROOT_USERNAME`, `MONGO_ROOT_PASSWORD`, `MONGO_INITDB_DATABASE`). The connection string format is: `mongodb://username:password@mongodb:27017/database?authSource=admin`

**Example: Change MongoDB port:**
```env
MONGODB_PORT=27018  # Access via localhost:27018
```

### Ports

The default ports can be customized via environment variables in `.env`:

- **Frontend**: Port 80 (http://localhost) - Configured via `FRONTEND_PORT`
- **Backend**: Port 3000 (http://localhost:3000) - Configured via `BACKEND_PORT`
- **MongoDB**: Port 27017 (localhost:27017) - Configured via `MONGODB_PORT`

**Note:** The internal container ports (3000 for backend, 80 for frontend, 27017 for MongoDB) remain fixed. Only the external host ports can be changed via environment variables.

### Volumes

- MongoDB data is persisted in a Docker volume (`mongodb_data`)
- Backend logs are mounted to `./backend/logs` directory

### Health Checks

All services include health checks to ensure they're running properly:

- **MongoDB**: 
  - Command: `mongosh --quiet --eval "quit(db.adminCommand('ping').ok ? 0 : 1)"`
  - Checks database connectivity
  - Interval: 10s, Timeout: 5s, Retries: 5, Start period: 40s

- **Backend**: 
  - Command: `wget --no-verbose --tries=1 --spider http://localhost:$PORT || exit 1`
  - Checks HTTP endpoint availability on internal port 3000
  - Interval: 30s, Timeout: 10s, Retries: 3, Start period: 40s

- **Frontend**: 
  - Command: `wget --no-verbose --tries=1 --spider http://localhost/health || exit 1`
  - Checks Nginx `/health` endpoint on internal port 80
  - Interval: 30s, Timeout: 10s, Retries: 3, Start period: 10s

Health checks ensure that dependent services wait for upstream services to be ready before starting.

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
- ✅ **MongoDB Connection**: The backend automatically uses `MONGODB_URI` if provided (for MongoDB Atlas), otherwise builds the connection string from Docker MongoDB credentials
- ✅ **Data Persistence**: MongoDB data is persisted in a Docker volume (`mongodb_data`), so data will survive container restarts
- ✅ **Logging**: Backend logs are available in `./backend/logs` directory (mounted as volume):
  - `error.log`: Error-level logs only
  - `combined.log`: All logs (info, warn, error)
- ⚠️ **Reset Everything**: Use `docker-compose down -v` to remove all containers and volumes (this will delete all MongoDB data)
- ✅ **Health Checks**: Services wait for upstream dependencies to be healthy before starting
- ✅ **CORS**: Backend CORS is configured to allow requests from `FRONTEND_URL` (defaults to `http://localhost:3001` if not set)
- ✅ **JWT Tokens**: Tokens expire after 24 hours (configurable in `auth.module.ts`)

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


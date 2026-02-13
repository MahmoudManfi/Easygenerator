# EasyGenerator Full Stack Test Task

A production-ready authentication application built with NestJS (backend) and React (frontend) with TypeScript.

## Features

### Backend
- ✅ NestJS framework with TypeScript
- ✅ MongoDB database integration
- ✅ JWT-based authentication with httpOnly cookies
- ✅ User sign up, sign in, and logout endpoints
- ✅ Authentication status check endpoint
- ✅ Protected endpoint with JWT guard
- ✅ Health check endpoint
- ✅ Password hashing with bcrypt
- ✅ Input validation with class-validator
- ✅ API documentation with Swagger
- ✅ Winston logging
- ✅ CORS enabled for frontend

### Frontend
- ✅ React with TypeScript
- ✅ Sign up page with validation:
  - Email format validation
  - Name (minimum 3 characters)
  - Password requirements (min 8 chars, letter, number, special character)
  - Confirm password field (must match password)
- ✅ Sign in page
- ✅ Welcome/Application page with logout functionality
- ✅ 404 Not Found page for invalid routes
- ✅ Protected routes
- ✅ Auto-redirect: Authenticated users are automatically redirected from sign-in/sign-up pages to the welcome page
- ✅ Modern, responsive UI design
- ✅ Context API for authentication state management
- ✅ React Hook Form + Zod for form validation

## Prerequisites

- Docker (v20 or higher)
- Docker Compose (v2 or higher)

## Getting Started

This application runs entirely using Docker Compose. It will set up all services (MongoDB, Backend, Frontend) automatically.

### Steps

1. **Clone the repository** (if you haven't already):
```bash
git clone <repository-url>
cd EasyGenerator
```

2. **Create and configure environment file** (REQUIRED):
```bash
cp .env.example .env
# Edit .env and fill in ALL required values (no defaults - will fail if missing)
nano .env  # or use your preferred editor
```

**Note:** The `.env` file is REQUIRED. Here's what happens if variables are missing:

- **Docker Compose**: Will show warnings for missing variables and may start containers with empty values, but this will cause failures downstream
- **Backend**: Will **fail to start** if any required variable is missing (throws error during module initialization or application bootstrap)
- **Frontend**: Will **fail to build** if `REACT_APP_API_URL` is missing (throws error when the API module is loaded)

**Required variables that cause failures:**
- Backend: `MONGO_ROOT_USERNAME`, `MONGO_ROOT_PASSWORD`, `MONGO_INITDB_DATABASE`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`, `NODE_ENV`
- Frontend: `REACT_APP_API_URL` (checked at build time)
- Docker Compose: All variables used in `docker-compose.yml` (will show warnings if missing)

3. **Start all services**:
```bash
docker-compose up --build
```

This will:
- **Rebuild** images if there are code changes (using `--build` flag)
- Build and start MongoDB container
- Build and start Backend container (NestJS API)
- Build and start Frontend container (React development server)

**Note:** The `--build` flag ensures containers are rebuilt when code changes. If you want to start without rebuilding (faster, uses cached images), use `docker-compose up` without `--build`.

4. **Access the application**:
- Frontend: http://localhost (or the port set in `FRONTEND_PORT`, default is 80)
- Backend API: http://localhost:3000 (or the port set in `BACKEND_PORT`, default is 3000)
- Swagger Documentation: http://localhost:3000/api (or the port set in `BACKEND_PORT`)
- MongoDB: localhost:27017 (or the port set in `MONGODB_PORT`)

### Docker Commands

**Start services (with rebuild - recommended after code changes):**
```bash
docker-compose up --build
```

**Start services (without rebuild - faster, uses cached images):**
```bash
docker-compose up
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

**Rebuild specific service:**
```bash
# Rebuild only backend
docker-compose up --build backend

# Rebuild only frontend
docker-compose up --build frontend
```

**Force rebuild (ignore cache):**
```bash
docker-compose build --no-cache
docker-compose up
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
- **frontend**: React development server (port 3000 internally, exposed via FRONTEND_PORT)

All services are connected via a Docker network and have health checks configured.

## API Endpoints

### Authentication

- `POST /auth/signup` - Register a new user
  - Body: `{ email: string, name: string, password: string }` (confirmPassword validated on frontend only)
  - Validation:
    - Email: Must be a valid email format
    - Name: Minimum 3 characters
    - Password: Minimum 8 characters, must contain at least one letter, one number, and one special character (@$!%*#?&)
    - Confirm Password: Must match password (frontend validation only)
  - Returns: `{ user: { email: string, name: string } }`
  - Sets httpOnly cookie with JWT token
  - Status Codes: `201` (Created), `400` (Validation Error), `409` (Email Already In Use)

- `POST /auth/signin` - Sign in existing user
  - Body: `{ email: string, password: string }`
  - Validation:
    - Email: Must be a valid email format
    - Password: Required
  - Returns: `{ user: { email: string, name: string } }`
  - Sets httpOnly cookie with JWT token
  - Status Codes: `200` (OK), `400` (Validation Error), `401` (Invalid Credentials)

- `POST /auth/logout` - Sign out user
  - Clears authentication cookie
  - Returns: `{ message: string }`
  - Status Codes: `200` (OK)

- `GET /auth/check` - Check authentication status
  - Requires authentication (httpOnly cookie)
  - Returns: `{ user: { email: string, name: string } }`
  - Status Codes: `200` (Authenticated), `401` (Unauthorized)

**Note:** All authentication endpoints (`/auth/signup`, `/auth/signin`, `/auth/check`) return user information in the response body. JWT tokens are stored in httpOnly cookies and are not included in the response body for security reasons.

### Protected Endpoints

- `GET /protected` - Protected endpoint (requires authentication)
  - Authentication: httpOnly cookie (set automatically on signup/signin)
  - Returns: `{ message: string, user: { email: string, name: string } }`
  - Status Codes: `200` (OK), `401` (Unauthorized)

### Other Endpoints

- `GET /health` - Health check endpoint
  - Returns: `{}` (empty object)
  - Status Codes: `200` (OK)

## API Documentation

Once the Docker containers are running, visit `http://localhost:3000/api` to access the Swagger API documentation. You can test all endpoints directly from the Swagger UI.

The Swagger documentation includes:
- Interactive API testing interface
- Request/response schemas
- Authentication support (httpOnly cookies)
- Example requests and responses
- Status code documentation

## Frontend Routes

The React application includes the following routes:

- `/signup` - User registration page (redirects to `/` if already authenticated)
- `/signin` - User login page (redirects to `/` if already authenticated)
- `/` - Protected welcome page (default route, requires authentication)
- `*` - 404 Not Found page (catch-all route for invalid paths)

**Route Protection:**
- The `/` route is protected by the `ProtectedRoute` component, which redirects unauthenticated users to `/signin`
- The `/signup` and `/signin` routes automatically redirect authenticated users to `/` to prevent accessing login pages while logged in
- All routes are handled by React Router

## Project Structure

```
EasyGenerator/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   │   ├── signup.dto.ts
│   │   │   │   └── signin.dto.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.controller.spec.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   ├── schemas/
│   │   │   └── user.schema.ts
│   │   ├── app.controller.ts
│   │   ├── app.controller.spec.ts
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── constants/
│   │   │   ├── auth.constants.ts
│   │   │   └── env.constants.ts
│   │   └── utils/
│   │       └── env.util.ts
│   ├── Dockerfile
│   ├── eslint.config.mjs
│   ├── package.json
│   ├── tsconfig.json
│   └── logs/ (created at runtime)
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── authApi.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   ├── schemas/
│   │   │   └── auth.schemas.ts
│   │   ├── pages/
│   │   │   ├── SignUpPage.tsx
│   │   │   ├── SignInPage.tsx
│   │   │   ├── WelcomePage.tsx
│   │   │   ├── NotFoundPage.tsx
│   │   │   ├── Auth.css
│   │   │   ├── WelcomePage.css
│   │   │   └── NotFoundPage.css
│   │   ├── components/
│   │   │   ├── FormInput.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── useAuth.ts
│   │   ├── hooks/
│   │   │   └── useRedirectIfAuthenticated.ts
│   │   ├── constants/
│   │   │   ├── routes.ts
│   │   │   └── env.constants.ts
│   │   ├── utils/
│   │   │   ├── env.util.ts
│   │   │   └── error.util.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.tsx
│   │   └── index.css
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.svg
│   ├── Dockerfile
│   ├── eslint.config.mjs
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## Security Features

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens stored in httpOnly cookies (more secure than localStorage)
- Input validation and sanitization
- CORS configuration
- Protected routes on frontend
- Environment variables for sensitive data
- Centralized environment variable management with enums and individual getter functions
- Secure cookie flags:
  - `httpOnly`: Prevents JavaScript access to cookies
  - `sameSite: 'lax'` in development (allows cookies across different ports on localhost)
  - `sameSite: 'strict'` in production (strongest CSRF protection)
  - `secure: true` in production (HTTPS only)

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
FRONTEND_PORT=80            # Access website: http://localhost (React development server uses 3000 internally)
REACT_APP_API_URL=http://localhost:3000  # Frontend API endpoint

# MongoDB Configuration (for local Docker MongoDB)
MONGO_INITDB_DATABASE=easygenerator
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your-secure-password-here

# Backend Configuration
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost

```

**Key Points:**
- ⚠️ `.env` file is **REQUIRED** - Docker Compose will show warnings for missing variables and may start containers with empty values, causing service failures
- ⚠️ All variables must be set
- ✅ **MongoDB Connection**: Built from `MONGO_ROOT_USERNAME`, `MONGO_ROOT_PASSWORD`, `MONGO_INITDB_DATABASE`
- ✅ Connection string format: `mongodb://username:password@mongodb:27017/database?authSource=admin`
- ✅ Modify ports without editing docker-compose.yml
- ✅ All changes in one place (`.env` file)

**Example: Change MongoDB port:**
```env
MONGODB_PORT=27018  # Access via localhost:27018
```

### Ports

The default ports can be customized via environment variables in `.env`:

- **Frontend**: Port 3000 internally, exposed via `FRONTEND_PORT` (default: http://localhost on port 80) - Configured via `FRONTEND_PORT`
- **Backend**: Port 3000 internally, exposed via `BACKEND_PORT` (default: http://localhost:3000) - Configured via `BACKEND_PORT`
- **MongoDB**: Port 27017 internally, exposed via `MONGODB_PORT` (default: localhost:27017) - Configured via `MONGODB_PORT`

**Note:** The internal container ports (3000 for backend, 3000 for frontend, 27017 for MongoDB) remain fixed. Only the external host ports can be changed via environment variables. **Important:** Frontend and backend both use port 3000 internally, but they're in separate containers, so there's no conflict.

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
  - Command: `wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1`
  - Checks `/health` endpoint availability on internal port 3000
  - Interval: 30s, Timeout: 10s, Retries: 3, Start period: 40s

- **Frontend**: 
  - Command: `wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1`
  - Checks React development server on internal port 3000
  - Interval: 30s, Timeout: 10s, Retries: 3, Start period: 40s

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

## Important Notes

- ⚠️ **`.env` file is REQUIRED** - All environment variables must be explicitly set (no defaults). See [Environment Variables](#environment-variables) section for details.
- ⚠️ **Reset Everything**: Use `docker-compose down -v` to remove all containers and volumes (this will **delete all MongoDB data**).
- ✅ **JWT Tokens**: Tokens expire after 24 hours (configurable in `auth.module.ts`).

## Technologies Used

### Backend
- NestJS
- MongoDB with Mongoose
- Passport.js with JWT strategy
- Bcrypt for password hashing
- class-validator for validation
- Swagger/OpenAPI for documentation
- Winston for logging
- Centralized environment variable management (enums + getter functions)

### Frontend
- React
- TypeScript
- React Router
- React Hook Form for form management and validation
- Zod for schema validation
- Axios for HTTP requests
- Context API for state management
- React development server (for Docker deployment)

### DevOps
- Docker
- Docker Compose
- Multi-stage Docker builds (backend only)

## License

This project is part of a test task for EasyGenerator.

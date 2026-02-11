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

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/easygenerator
JWT_SECRET=your-secret-key-change-in-production
PORT=3000
FRONTEND_URL=http://localhost:3001
```

4. Make sure MongoDB is running on your system or update `MONGODB_URI` to point to your MongoDB instance.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional, defaults are set):
```env
REACT_APP_API_URL=http://localhost:3000
```

## Running the Application

### Start Backend

From the backend directory:
```bash
npm run start:dev
```

The backend will run on `http://localhost:3000`
- API endpoints: `http://localhost:3000`
- Swagger documentation: `http://localhost:3000/api`

### Start Frontend

From the frontend directory:
```bash
npm start
```

The frontend will run on `http://localhost:3001` (or the next available port)

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

Once the backend is running, visit `http://localhost:3000/api` to access the Swagger API documentation. You can test all endpoints directly from the Swagger UI.

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
│   └── package.json
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

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Production Build

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm run build
```

The production build will be in the `frontend/build` directory.

## Notes

- Make sure to change the `JWT_SECRET` in production
- Update `MONGODB_URI` to point to your production database
- Configure CORS properly for production
- The frontend expects the backend to be running on port 3000 by default

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

## License

This project is part of a test task for EasyGenerator.


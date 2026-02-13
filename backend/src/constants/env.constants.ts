/**
 * Environment variable names used in the backend
 * Centralized location for easy maintenance and refactoring
 */
export enum EnvVariables {
  /** MongoDB root username */
  MONGO_ROOT_USERNAME = 'MONGO_ROOT_USERNAME',
  /** MongoDB root password */
  MONGO_ROOT_PASSWORD = 'MONGO_ROOT_PASSWORD',
  /** MongoDB database name */
  MONGO_INITDB_DATABASE = 'MONGO_INITDB_DATABASE',
  /** JWT secret key for token signing */
  JWT_SECRET = 'JWT_SECRET',
  /** Backend server port */
  PORT = 'PORT',
  /** Frontend URL for CORS configuration */
  FRONTEND_URL = 'FRONTEND_URL',
  /** Node environment (development, production, etc.) */
  NODE_ENV = 'NODE_ENV',
}

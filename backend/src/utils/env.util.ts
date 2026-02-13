import { EnvVariables } from '../constants/env.constants';

/**
 * Validates that a required environment variable is set.
 * Throws an error if the variable is missing or empty.
 * @param varName - The name of the environment variable (from EnvVariables enum)
 * @returns The value of the environment variable
 * @throws Error if the variable is missing or empty
 */
function getRequiredEnv(varName: EnvVariables): string {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing required environment variable: ${varName}. Please check your .env file.`,
    );
  }
  return value;
}

/**
 * Environment variable getters
 * Individual functions for each environment variable for better readability and maintainability
 */

/**
 * Gets the MongoDB root username
 * @returns MongoDB root username
 */
export function getMongoRootUsername(): string {
  return getRequiredEnv(EnvVariables.MONGO_ROOT_USERNAME);
}

/**
 * Gets the MongoDB root password
 * @returns MongoDB root password
 */
export function getMongoRootPassword(): string {
  return getRequiredEnv(EnvVariables.MONGO_ROOT_PASSWORD);
}

/**
 * Gets the MongoDB database name
 * @returns MongoDB database name
 */
export function getMongoInitDbDatabase(): string {
  return getRequiredEnv(EnvVariables.MONGO_INITDB_DATABASE);
}

/**
 * Gets the JWT secret key for token signing
 * @returns JWT secret key
 */
export function getJwtSecret(): string {
  return getRequiredEnv(EnvVariables.JWT_SECRET);
}

/**
 * Gets the backend server port
 * @returns Backend server port as string
 */
export function getPort(): string {
  return getRequiredEnv(EnvVariables.PORT);
}

/**
 * Gets the frontend URL for CORS configuration
 * @returns Frontend URL
 */
export function getFrontendUrl(): string {
  return getRequiredEnv(EnvVariables.FRONTEND_URL);
}

/**
 * Gets the Node environment (development, production, etc.)
 * @returns Node environment
 */
export function getNodeEnv(): string {
  return getRequiredEnv(EnvVariables.NODE_ENV);
}

/**
 * Checks if the application is running in production mode
 * @returns true if NODE_ENV is 'production', false otherwise
 */
export function isProduction(): boolean {
  return getNodeEnv() === 'production';
}

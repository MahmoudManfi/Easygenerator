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
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${varName}. Please check your .env file or build configuration.`,
    );
  }
  return value;
}

/**
 * Environment variable getters
 * Individual functions for each environment variable for better readability and maintainability
 */

/**
 * Gets the backend API URL
 * @returns Backend API URL
 */
export function getApiUrl(): string {
  return getRequiredEnv(EnvVariables.REACT_APP_API_URL);
}

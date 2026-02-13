/**
 * Extracts error message from axios error response
 * @param error - Error object from catch block
 * @param defaultMessage - Default message if error cannot be parsed
 * @returns Error message string
 */
export const extractErrorMessage = (
  error: unknown,
  defaultMessage: string,
): string => {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response
  ) {
    const errorData = error.response.data as { message?: string };
    return errorData.message || defaultMessage;
  }
  return defaultMessage;
};

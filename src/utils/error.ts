import { Toast, showToast } from "@raycast/api";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

/**
 * Custom error class for API-related errors
 * Extends the base Error class with additional status code information
 */
export class APIError extends Error {
  /**
   * Creates a new APIError instance
   * @param statusCode - HTTP status code from the API response
   * @param message - Error message describing the issue
   */
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Custom error class for validation-related errors
 * Used when user input fails validation checks
 */
export class ValidationError extends Error {
  /**
   * Creates a new ValidationError instance
   * @param message - Error message describing the validation issue
   */
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Global error handler that displays appropriate toast notifications based on error type
 * @param error - The error object to handle
 */
export function handleError(error: Error): void {
  if (error instanceof APIError) {
    showToast({
      style: Toast.Style.Failure,
      title: getErrorTitle(error.statusCode),
      message: error.message,
    });
  } else if (error instanceof ValidationError) {
    showToast({
      style: Toast.Style.Failure,
      title: ERROR_MESSAGES.UI.INVALID_INPUT,
      message: error.message,
    });
  } else {
    showToast({
      style: Toast.Style.Failure,
      title: ERROR_MESSAGES.UI.UNEXPECTED_ERROR,
      message: ERROR_MESSAGES.API.UNKNOWN,
    });
  }
}

/**
 * Maps HTTP status codes to human-readable error titles
 * @param statusCode - HTTP status code from the API response
 * @returns A user-friendly error title based on the status code
 */
function getErrorTitle(statusCode: number): string {
  switch (statusCode) {
    case 401:
      return "Authentication Error";
    case 429:
      return "Too many requests";
    case 403:
      return "Access denied";
    case 422:
      return "Invalid search";
    default:
      return "API Error";
  }
}
